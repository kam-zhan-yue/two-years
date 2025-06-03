import { create } from "zustand";
import { Math } from 'phaser'
import type { TopDownAnimation } from "./game/classes/animation";
import { defaultGameState, type GameState } from "./game/types/game-state";
import type { Main } from "./game/main";

interface PlayerState {
  position: Math.Vector2
  animation: TopDownAnimation
}

interface GameStore {
  playerId: string,
  gameState: GameState,
  game?: Main,
  setGame: (game: Main) => void,
  setPlayerId: (id: string) => void,
  setGameState: (newState: GameState) => void,
  getPlayer: () => PlayerState | null
}

export const useGameStore = create<GameStore>()((set, get) => ({
  playerId: '0',
  gameState: defaultGameState,
  setGame: (game) => set({ game: game }),
  setPlayerId: (id) => set({ playerId: id }),
  setGameState: (newState) => set({ gameState: newState}),
  getPlayer: () => {
    const { gameState, playerId } = get()
    if (gameState.playerOne?.id === playerId) return gameState.playerOne
    if (gameState.playerTwo?.id === playerId) return gameState.playerTwo
    return null
  }
}))
