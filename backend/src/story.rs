use std::fs;

use bladeink::story::Story;
use serde::{Deserialize, Serialize};

use crate::player::{Player, PLAYER_ONE, PLAYER_TWO};

const INTERACTION: &str = "INTERACTION__";
const NODE_START: &str = "NODE__START";
const NODE_END: &str = "NODE__END";
const QUESTION_START: &str = "QUESTION__START";
const ACTION: &str = "action:";

#[derive(Debug, Clone)]
pub struct StoryState {
    pub json: String,
    pub instructions: Vec<StoryInstruction>,
    pub player_one_ready: bool,
    pub player_two_ready: bool,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum StoryInstruction {
    Dialogue,
    Question,
    Choice(i32),
    Interaction(String),
}

#[derive(Debug, Clone)]
pub struct StoryLine {
    pub line: String,
    pub tags: Option<Vec<String>>,
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
#[serde(tag = "type", content = "body", rename_all = "lowercase")]
pub enum StoryNode {
    Dialogue {
        lines: Vec<DialogueLine>,
    },
    Question {
        question: DialogueLine,
        answerer: Player,
        choices: Vec<StoryChoice>,
    },
    Interaction(String),
    End,
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
pub struct StoryChoice {
    pub index: i32,
    pub text: String,
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
pub struct DialogueLine {
    pub speaker: Player,
    pub line: String,
    pub action: Option<String>,
}

struct StoryHistory {
    story: Story,
    nodes: Vec<StoryNode>,
}

impl StoryState {
    pub fn update_dialogue(&mut self, id: u64) {
        if id == PLAYER_ONE {
            self.player_one_ready = true;
        } else if id == PLAYER_TWO {
            self.player_two_ready = true;
        }
    }

    pub fn can_continue(&self) -> bool {
        self.player_one_ready && self.player_two_ready
    }

    pub fn reset_players(&mut self) {
        self.player_one_ready = false;
        self.player_two_ready = false;
    }

    pub fn disconnect_player(&mut self, id: u64) {
        if id == PLAYER_ONE {
            self.player_one_ready = false;
        } else if id == PLAYER_TWO {
            self.player_two_ready = false;
        }
    }

    pub fn reset(&mut self) {
        self.instructions = Vec::new();
    }

    fn get_history(&mut self) -> StoryHistory {
        // Have to rehydrate the story each time
        let mut story = Story::new(&self.json).unwrap();

        let mut nodes: Vec<StoryNode> = Vec::new();
        for instruction in self.instructions.clone().iter() {
            let node = self.progress_story(&mut story, &nodes, instruction);
            nodes.push(node);
        }
        StoryHistory { story, nodes }
    }

    pub fn get_node(&mut self) -> StoryNode {
        let mut history = self.get_history();
        return self.get_next_node(&mut history.story);
    }

    fn get_next_node(&mut self, story: &mut Story) -> StoryNode {
        let line = get_next_line(story);
        if line.line.is_empty() == true && story.get_current_choices().len() == 0 {
            return StoryNode::End;
        }

        if line.line == NODE_START {
            self.instructions.push(StoryInstruction::Dialogue);
            self.process_dialogue(story)
        } else if line.line == QUESTION_START {
            self.instructions.push(StoryInstruction::Question);
            self.process_question(story)
        } else if line.line.starts_with(INTERACTION) {
            let interaction = line.line.strip_prefix(INTERACTION).unwrap();
            self.instructions
                .push(StoryInstruction::Interaction(interaction.to_owned()));
            self.process_interaction(interaction)
        } else {
            panic!("Story is unprocessable at {:?}", line);
        }
    }

    /// Returns if the latest node is a valid choice node
    pub fn can_choose(&mut self, choice: i32) -> bool {
        let history = self.get_history();
        let last_node = history.nodes.last();
        if let Some(StoryNode::Question { choices, .. }) = last_node {
            return choice < choices.len() as i32;
        }
        return false;
    }

    pub fn choose(&mut self, index: i32) -> StoryNode {
        let mut history = self.get_history();
        self.instructions.push(StoryInstruction::Choice(index));
        return self.process_choice(&mut history.story, &history.nodes, index);
    }

    /// Only returns if the latest node is a valid interact node
    pub fn interact(&mut self, interaction: String) -> Option<StoryNode> {
        let history = self.get_history();
        let last_node = history.nodes.last();
        if let Some(StoryNode::Interaction(interaction_id)) = last_node {
            if *interaction_id == interaction {
                return Some(self.get_node());
            } else {
                None
            }
        } else {
            None
        }
    }

    /// Takes a node instruction and progresses the story, returning the last node
    fn progress_story(
        &mut self,
        story: &mut Story,
        nodes: &Vec<StoryNode>,
        instruction: &StoryInstruction,
    ) -> StoryNode {
        // If we are progressing a node, loop from the start to the end
        match *instruction {
            StoryInstruction::Dialogue => {
                let line = get_next_line(story);
                assert_eq!(line.line, NODE_START);
                self.process_dialogue(story)
            }
            StoryInstruction::Question => {
                let line = get_next_line(story);
                assert_eq!(line.line, QUESTION_START);
                self.process_question(story)
            }
            StoryInstruction::Choice(choice) => {
                let choices = story.get_current_choices();
                assert!(!choices.is_empty());
                self.process_choice(story, nodes, choice)
            }
            StoryInstruction::Interaction(ref interaction) => {
                let line = get_next_line(story);
                assert!(line.line.starts_with(INTERACTION));
                let interaction_id = line.line.strip_prefix(INTERACTION).unwrap();
                assert!(interaction_id == interaction);
                self.process_interaction(&interaction_id)
            }
        }
    }

    fn process_dialogue(&mut self, story: &mut Story) -> StoryNode {
        let mut lines: Vec<DialogueLine> = Vec::new();
        while story.can_continue() {
            let line = get_next_line(story);
            if line.line == NODE_END {
                break;
            } else {
                let dialogue_line = process_line(&line);
                lines.push(dialogue_line);
            }
        }
        StoryNode::Dialogue { lines: lines }
    }

    fn process_question(&mut self, story: &mut Story) -> StoryNode {
        // Get the tag from the current question to get the answerer
        // Need to get the tag before we get the next line
        let Ok(tags) = story.get_current_tags() else {
            panic!("Failed at get_current_tags");
        };
        let question_line = get_next_line(story);
        let question = process_line(&question_line);

        let answerer = Player::from_ink(tags[0].as_str());

        // Populate the choices
        let choices = story.get_current_choices();
        if choices.is_empty() {
            panic!("There are 0 choices at {:?}", question_line);
        }

        let story_choices: Vec<StoryChoice> = choices
            .iter()
            .map(|choice_rc| {
                let choice = choice_rc.as_ref();
                StoryChoice {
                    index: *choice.index.borrow() as i32,
                    text: choice.text.clone(),
                }
            })
            .collect();

        StoryNode::Question {
            question: question,
            answerer: answerer,
            choices: story_choices,
        }
    }

    fn process_choice(
        &mut self,
        story: &mut Story,
        nodes: &Vec<StoryNode>,
        index: i32,
    ) -> StoryNode {
        if let Some(StoryNode::Question { answerer, .. }) = nodes.last() {
            story.choose_choice_index(index as usize).unwrap();
            // Get the response from the question, if it cannot be split by the delimiter
            let mut line = get_next_line(story);
            // Make a response if it can be split
            let mut split = line.line.splitn(2, ':');
            let response = if let (Some(_), Some(_)) = (split.next(), split.next()) {
                process_line(&line)
            } else {
                line.line
                    .insert_str(0, &format!("{}: ", &answerer.to_ink()));
                process_line(&line)
            };
            // Continue with the story and return the dialogue
            let mut node = self.process_dialogue(story);
            if let StoryNode::Dialogue { ref mut lines } = node {
                lines.insert(0, response);
            }
            return node;
        } else {
            panic!("The last node is not a question! {:?}", nodes.last());
        }
    }

    fn process_interaction(&mut self, interaction: &str) -> StoryNode {
        return StoryNode::Interaction(interaction.to_owned());
    }
}

pub fn process_file(file_path: &str) -> String {
    fs::read_to_string(file_path).expect("Should have been able to read the file")
}

fn get_next_line(story: &mut Story) -> StoryLine {
    if !story.can_continue() {
        return StoryLine {
            line: String::new(),
            tags: None,
        };
    }

    let mut line = story.cont().unwrap();
    if line.ends_with('\n') {
        line.pop();
    }

    StoryLine {
        line,
        tags: story.get_current_tags().ok(),
    }
}

fn process_line(line: &StoryLine) -> DialogueLine {
    let mut split = line.line.splitn(2, ':');
    let speaker_str = split.next().unwrap_or("").trim();
    let line_str = split.next().unwrap_or("").trim();

    let speaker: Player = Player::from_ink(speaker_str);

    let action = line.tags.as_ref().and_then(|tags| {
        tags.iter()
            .find_map(|tag| tag.strip_prefix(ACTION))
            .map(|s| s.to_string())
    });

    DialogueLine {
        speaker: speaker,
        line: line_str.to_owned(),
        action,
    }
}
