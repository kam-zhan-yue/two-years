use std::fs;

use bladeink::story::Story;
use serde::{Deserialize, Serialize};

use crate::player::{Player, PLAYER_ONE, PLAYER_TWO};

const NODE_START: &str = "NODE__START";
const NODE_END: &str = "NODE__END";
const QUESTION_START: &str = "QUESTION__START";

#[derive(Debug, Clone)]
pub struct StoryState {
    pub json: String,
    pub instructions: Vec<StoryInstruction>,
    pub player_one_ready: bool,
    pub player_two_ready: bool,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum StoryInput {
    None,
    Waiting,
    Choice,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum StoryInstruction {
    Dialogue,
    Question,
    Choice(i32),
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
    Response {
        line: DialogueLine,
    },
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
        if line.is_empty() == true && story.get_current_choices().len() == 0 {
            return StoryNode::End;
        }

        if line == NODE_START {
            self.instructions.push(StoryInstruction::Dialogue);
            self.process_dialogue(story)
        } else if line == QUESTION_START {
            self.instructions.push(StoryInstruction::Question);
            self.process_question(story)
        } else {
            panic!("Story is unprocessable at {:?}", line);
        }
    }

    pub fn choose(&mut self, index: i32) -> StoryNode {
        let mut history = self.get_history();
        self.instructions.push(StoryInstruction::Choice(index));
        return self.process_choice(&mut history.story, &history.nodes, index);
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
                assert_eq!(line, NODE_START);
                self.process_dialogue(story)
            }
            StoryInstruction::Question => {
                let line = get_next_line(story);
                assert_eq!(line, QUESTION_START);
                self.process_question(story)
            }
            StoryInstruction::Choice(choice) => {
                let choices = story.get_current_choices();
                assert!(!choices.is_empty());
                self.process_choice(story, nodes, choice)
            }
        }
    }

    fn process_dialogue(&mut self, story: &mut Story) -> StoryNode {
        let mut lines: Vec<DialogueLine> = Vec::new();
        while story.can_continue() {
            let line = get_next_line(story);
            if line == NODE_END {
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

        let answerer = Player::from_str(tags[0].as_str());

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
            let line = get_next_line(story);
            StoryNode::Response {
                line: DialogueLine {
                    speaker: *answerer,
                    line,
                },
            }
        } else {
            panic!("The last node is not a question! {:?}", nodes.last());
        }
    }
}

pub fn process_file(file_path: &str) -> String {
    fs::read_to_string(file_path).expect("Should have been able to read the file")
}

fn get_next_line(story: &mut Story) -> String {
    if !story.can_continue() {
        return String::new();
    }
    let mut line = story.cont().unwrap();
    if line.ends_with('\n') {
        line.truncate(line.len() - 1);
        line
    } else {
        line
    }
}

fn process_line(line: &str) -> DialogueLine {
    let mut split = line.splitn(2, ':');
    let speaker_str = split.next().unwrap_or("").trim();
    let line_str = split.next().unwrap_or("").trim();

    let speaker: Player = Player::from_str(speaker_str);
    DialogueLine {
        speaker: speaker,
        line: line_str.to_owned(),
    }
}
