mod tests {
    use crate::{
        player::Player,
        story::{
            process_file, DialogueLine, Response, StoryChoice, StoryInput, StoryNode, StoryState,
        },
    };
    use std::fs;

    #[test]
    fn test_dialogue_node() {
        let story = StoryState {
            json: process_file("ink/test_dialogue_node.ink.json"),
            instructions: Vec::new(),
            input: StoryInput::None,
        };

        let node = story.get_node();
        assert_eq!(
            node,
            StoryNode::Dialogue {
                lines: vec![
                    DialogueLine {
                        speaker: Player::One,
                        line: String::from("This is the start of a node. Nice to meet you")
                    },
                    DialogueLine {
                        speaker: Player::Two,
                        line: String::from("Hello! Nice to meet you")
                    }
                ]
            }
        );
    }

    #[test]
    fn test_question_node() {
        let story = StoryState {
            json: process_file("ink/test_question_node.ink.json"),
            instructions: Vec::new(),
            input: StoryInput::None,
        };

        let node = story.get_node();
        assert_eq!(
            node,
            StoryNode::Question {
                question: DialogueLine {
                    speaker: Player::One,
                    line: String::from("What should we do today?")
                },
                response: Response {
                    answerer: Player::Two,
                    choices: vec![
                        StoryChoice {
                            index: 0,
                            text: String::from("Go to the beach")
                        },
                        StoryChoice {
                            index: 1,
                            text: String::from("Go to the restaurant")
                        },
                        StoryChoice {
                            index: 2,
                            text: String::from("Go to the arcade")
                        }
                    ]
                }
            }
        );
    }
}
