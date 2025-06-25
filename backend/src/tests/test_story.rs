#[cfg(test)]
mod tests {
    use crate::{
        player::Player,
        story::{process_file, DialogueLine, StoryChoice, StoryNode, StoryState},
    };

    #[test]
    fn test_dialogue_node() {
        let mut story = StoryState {
            json: process_file("src/tests/fixtures/test_dialogue_node.ink.json"),
            instructions: Vec::new(),
            player_one_ready: false,
            player_two_ready: false,
            current_interaction: String::new(),
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

        let node = story.get_node();
        assert_eq!(node, StoryNode::End);
    }

    #[test]
    fn test_question_node() {
        let mut story = StoryState {
            json: process_file("src/tests/fixtures/test_question_node.ink.json"),
            instructions: Vec::new(),
            player_one_ready: false,
            player_two_ready: false,
            current_interaction: String::new(),
        };

        let node = story.get_node();
        assert_eq!(
            node,
            StoryNode::Question {
                question: DialogueLine {
                    speaker: Player::One,
                    line: String::from("What should we do today?")
                },
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
        );

        let response = story.choose(0);
        assert_eq!(
            response,
            StoryNode::Dialogue {
                lines: vec![DialogueLine {
                    speaker: Player::Two,
                    line: String::from("Go to the beach")
                }]
            }
        );

        let node = story.get_node();
        assert_eq!(node, StoryNode::End);
    }

    #[test]
    fn test_interaction() {
        let mut story = StoryState {
            json: process_file("src/tests/fixtures/test_interaction.ink.json"),
            instructions: Vec::new(),
            player_one_ready: false,
            player_two_ready: false,
            current_interaction: String::new(),
        };
        let node = story.get_node();

        assert_eq!(node, StoryNode::Interaction("GAME_START".to_owned()));

        let node = story.interact("GAME_START".to_owned());

        assert_eq!(
            node,
            StoryNode::Dialogue {
                lines: vec![
                    DialogueLine {
                        speaker: Player::One,
                        line: String::from("Do me a favour and fetch me a coffee.")
                    },
                    DialogueLine {
                        speaker: Player::Two,
                        line: String::from("Sure thing, love.")
                    }
                ]
            }
        );

        let node = story.get_node();

        assert_eq!(node, StoryNode::Interaction("COFFEE".to_owned()));

        let node = story.interact("COFFEE".to_owned());

        assert_eq!(
            node,
            StoryNode::Dialogue {
                lines: vec![DialogueLine {
                    speaker: Player::One,
                    line: String::from("Thank you very much.")
                }]
            }
        );

        let node = story.get_node();

        assert_eq!(node, StoryNode::End);
    }

    #[test]
    fn test_chain() {
        let mut story = StoryState {
            json: process_file("src/tests/fixtures/test_chain.ink.json"),
            instructions: Vec::new(),
            player_one_ready: false,
            player_two_ready: false,
            current_interaction: String::new(),
        };

        let node = story.get_node();
        assert_eq!(
            node,
            StoryNode::Dialogue {
                lines: vec![
                    DialogueLine {
                        speaker: Player::One,
                        line: String::from("There is no where to be but the present.")
                    },
                    DialogueLine {
                        speaker: Player::Two,
                        line: String::from("Indeed you are correct.")
                    }
                ]
            }
        );
        let node = story.get_node();
        assert_eq!(
            node,
            StoryNode::Dialogue {
                lines: vec![
                    DialogueLine {
                        speaker: Player::One,
                        line: String::from("I'm quenching for a coffee right now.")
                    },
                    DialogueLine {
                        speaker: Player::Two,
                        line: String::from("As am I.")
                    }
                ]
            }
        );

        let node = story.get_node();
        assert_eq!(
            node,
            StoryNode::Question {
                question: DialogueLine {
                    speaker: Player::Two,
                    line: String::from("Shall we go down to the cafe at the end of the road?")
                },
                answerer: Player::One,
                choices: vec![
                    StoryChoice {
                        index: 0,
                        text: String::from("Why that is a mighty fine idea.")
                    },
                    StoryChoice {
                        index: 1,
                        text: String::from("How dreadful.")
                    },
                ],
            }
        );

        let response = story.choose(0);
        assert_eq!(
            response,
            StoryNode::Dialogue {
                lines: vec![
                    DialogueLine {
                        speaker: Player::One,
                        line: String::from("Why that is a mighty fine idea.")
                    },
                    DialogueLine {
                        speaker: Player::One,
                        line: String::from("Why this is a fine evening")
                    }
                ]
            }
        );

        let node = story.get_node();
        assert_eq!(node, StoryNode::End);
    }
}
