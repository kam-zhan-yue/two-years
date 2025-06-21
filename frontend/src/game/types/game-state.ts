import { z } from "zod";
import {
  defaultPlayerState,
  PlayerSchema,
  RawPlayerSchema,
  type PlayerState,
} from "./player-state";

export interface GameState {
  playerOne: PlayerState;
  playerTwo: PlayerState;
}

export const GameStateSchema = z
  .object({
    player_one: RawPlayerSchema.required(),
    player_two: RawPlayerSchema.required(),
  })
  .transform((raw) => ({
    playerOne: PlayerSchema.parse(raw.player_one),
    playerTwo: PlayerSchema.parse(raw.player_two),
  }));

export const defaultGameState: GameState = {
  playerOne: defaultPlayerState,
  playerTwo: defaultPlayerState,
};
