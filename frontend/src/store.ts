import { create } from "zustand";
import { Math } from "phaser";
import type { CharacterAnimation } from "./game/classes/animation";
import { defaultGameState, type GameState } from "./game/types/game-state";
import type { Level } from "./game/level";
import { DIALOGUE_URL, ECHO_URL, GAME_URL } from "./api/constants";
import { constants } from "./helpers/constants";

interface PlayerState {
  position: Math.Vector2;
  animation: CharacterAnimation;
}

enum GameFlow {
  Polling,
  Menu,
  Game,
}

interface GameStore {
  playerId: string;
  gameState: GameState;
  game?: Level;
  setGame: (game: Level) => void;
  setPlayerId: (id: string) => void;
  setGameState: (newState: GameState) => void;
  getPlayer: () => PlayerState | null;
  getOtherPlayer: () => PlayerState | null;
  flow: GameFlow;
  gameSocket: string;
  dialogueSocket: string;
  setGameFlow: (flow: GameFlow) => void;
}

const useGameStore = create<GameStore>()((set, get) => ({
  playerId: constants.emptyId,
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
  flow: GameFlow.Polling,
  gameSocket: ECHO_URL,
  dialogueSocket: ECHO_URL,
  setGameFlow: (flow) => {
    set((state) => {
      // Validate the flows here
      if (state.flow === GameFlow.Polling && flow === GameFlow.Menu) {
        return { flow: GameFlow.Menu, gameSocket: GAME_URL };
      } else if (state.flow === GameFlow.Menu && flow === GameFlow.Game) {
        return {
          flow: GameFlow.Game,
          gameSocket: `${GAME_URL}/${state.playerId}`,
          dialogueSocket: `${DIALOGUE_URL}/${state.playerId}`,
        };
      }
      // If the condition isn't met, don't update anything
      return {};
    });
  },
}));

export { useGameStore, GameFlow };
