import { z } from "zod";
import {
  PlayerSchema,
  RawPlayerSchema,
  type PlayerState,
} from "./player-state";

export interface GameState {
  playerOne: PlayerState | null;
  playerTwo: PlayerState | null;
}

export const GameStateSchema = z
  .object({
    player_one: RawPlayerSchema.nullable().optional(),
    player_two: RawPlayerSchema.nullable().optional(),
  })
  .transform((raw) => ({
    playerOne: raw.player_one ? PlayerSchema.parse(raw.player_one) : undefined,
    playerTwo: raw.player_two ? PlayerSchema.parse(raw.player_two) : undefined,
  }));

export const defaultGameState: GameState = {
  playerOne: null,
  playerTwo: null,
};
