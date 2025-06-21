import { ECHO_URL } from "@/api/constants";
import { GameStateSchema, type GameState } from "@/game/types/game-state";
import { GameFlow, useGameStore } from "@/store";
import { useEffect } from "react";
import useWebSocket from "react-use-websocket";

const Game = () => {
  const flow = useGameStore((state) => state.flow);
  const gameSocket = useGameStore((state) => state.gameSocket);
  const dialogueSocket = useGameStore((state) => state.dialogueSocket);
  const setGameState = useGameStore((state) => state.setGameState);
  const playerId = useGameStore((state) => state.playerId);
  const game = useGameStore((state) => state.game);
  const { sendJsonMessage, lastJsonMessage: gameMessage } = useWebSocket(
    gameSocket,
    {},
    true,
  );

  const { sendJsonMessage: dialogueSend, lastJsonMessage: dialogueMessage } =
    useWebSocket(dialogueSocket, {}, true);

  // Handle the main player
  useEffect(() => {
    if (game && flow === GameFlow.Game) {
      game.initPlayer(playerId, sendJsonMessage);
    }
  }, [playerId, flow, playerId, game, sendJsonMessage]);

  // Handle the game loop
  useEffect(() => {
    // Ignore messages from the echo site, as it is for setup only
    if (gameSocket === ECHO_URL) {
      return;
    }

    if (!gameMessage) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // console.log(socketUrl, lastJsonMessage);
    const json = gameMessage as any;
    if (json) {
      const parsed = GameStateSchema.safeParse(json);
      if (!parsed.success) {
        console.error("Invalid game state:", parsed.error);
        return;
      }
      const gameState = parsed.data as GameState;

      setGameState(gameState);
    }
  }, [setGameState, gameMessage, gameSocket]);

  // Handle the dialogue loop
  useEffect(() => {
    // Ignore messages from the echo site, as it is for setup only
    if (dialogueSocket === ECHO_URL) {
      return;
    }

    if (!dialogueMessage) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const json = dialogueMessage as any;
    if (json) {
      console.log(`Dialogue Message is ${JSON.stringify(json, null, 2)}`);
    }
  }, [dialogueMessage, dialogueSocket]);

  return <div id="game-container" />;
};

export { Game };
