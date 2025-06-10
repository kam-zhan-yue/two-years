import { create } from "zustand";
import { Math } from "phaser";
import type { CharacterAnimation } from "./game/classes/animation";
import { defaultGameState, type GameState } from "./game/types/game-state";
import type { Level } from "./game/level";

interface PlayerState {
  position: Math.Vector2;
  animation: CharacterAnimation;
}

interface GameStore {
  playerId: number;
  gameState: GameState;
  game?: Level;
  setGame: (game: Level) => void;
  setPlayerId: (id: number) => void;
  setGameState: (newState: GameState) => void;
  getPlayer: () => PlayerState | null;
  getOtherPlayer: () => PlayerState | null;
}

export const useGameStore = create<GameStore>()((set, get) => ({
  playerId: 0,
  gameState: defaultGameState,
  setGame: (game) => set({ game: game }),
  setPlayerId: (id) => set({ playerId: id }),
  setGameState: (newState) => set({ gameState: newState }),
  getPlayer: () => {
    const { gameState, playerId } = get();
    if (gameState.playerOne?.id === playerId) return gameState.playerOne;
    if (gameState.playerTwo?.id === playerId) return gameState.playerTwo;
    return null;
  },
  getOtherPlayer: () => {
    const { gameState, playerId } = get();
    if (gameState.playerOne?.id === playerId) return gameState.playerTwo;
    if (gameState.playerTwo?.id === playerId) return gameState.playerOne;
    return null;
  },
}));
