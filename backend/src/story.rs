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
    pub input: StoryInput,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum StoryInput {
    None,
    Waiting,
    Choice,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum StoryInstruction {
    Node,
    Choice(i32),
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(tag = "type", content = "body")]
pub enum StoryNode {
    Dialogue {
        lines: Vec<DialogueLine>,
    },
    Question {
        question: DialogueLine,
        response: Response,
    },
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Response {
    pub answerer: Player,
    pub choices: Vec<StoryChoice>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct StoryChoice {
    pub index: u32,
    pub text: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct DialogueLine {
    pub speaker: Player,
    pub line: String,
}

impl StoryState {
    pub fn get_node(self) -> StoryInstruction {
        // Have to rehydrate the story each time
        let mut story = Story::new(&self.json).unwrap();

        for node in self.instructions.iter() {
            progress_story(&mut story, node);
        }
        return StoryInstruction::Node;
    }
}

fn progress_story(story: &mut Story, node: &StoryInstruction) {
    while story.can_continue() {
        let line = story.cont().unwrap();
        // If we are looking for a node and have reached the end, then stop
        if *node == StoryInstruction::Node && line == NODE_END {}
    }
}

fn get_next_node(mut story: Story) -> StoryNode {
    let line = story.cont().unwrap();
    if line == NODE_START {
        process_dialogue(story)
    } else if line == QUESTION_START {
        process_question(story)
    } else {
        panic!("Story is unprocessable at {:?}", line);
    }
}

fn process_dialogue(mut story: Story) -> StoryNode {
    let mut lines: Vec<DialogueLine> = Vec::new();
    while story.can_continue() {
        let line = story.cont().unwrap();
        if line == NODE_END {
            break;
        } else {
            let dialogue_line = process_line(&line);
            lines.push(dialogue_line);
        }
    }
    StoryNode::Dialogue { lines: lines }
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

fn process_question(mut story: Story) -> StoryNode {
    let question_line = story.cont().unwrap();
    let question = process_line(&question_line);

    // Get the tag from the current question to get the answerer
    let Ok(tags) = story.get_current_tags() else {
        panic!("Failed at get_current_tags, {:?}", question_line);
    };

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
                index: *choice.index.borrow() as u32,
                text: choice.text.clone(),
            }
        })
        .collect();

    StoryNode::Question {
        question: question,
        response: Response {
            answerer: answerer,
            choices: story_choices,
        },
    }
}
