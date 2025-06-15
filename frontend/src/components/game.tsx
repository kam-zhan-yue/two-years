import { DIALOGUE_URL, ECHO_URL, GAME_URL } from "@/api/constants";
import { GameStateSchema, type GameState } from "@/game/types/game-state";
import { useGameStore } from "@/store";
import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";

const Game = () => {
  const [gameUrl, setGameUrl] = useState(ECHO_URL);
  const [dialogueUrl, setDialogueUrl] = useState(ECHO_URL);
  const setGameState = useGameStore((state) => state.setGameState);
  const playerId = useGameStore((state) => state.playerId);
  const game = useGameStore((state) => state.game);
  const { sendJsonMessage, lastJsonMessage: gameMessage } = useWebSocket(
    gameUrl,
    {},
    true,
  );

  const { sendJsonMessage: dialogueSend, lastJsonMessage: dialogueMessage } =
    useWebSocket(dialogueUrl, {}, true);

  // Handle the main player
  useEffect(() => {
    if (game && playerId !== 0) {
      setGameUrl(GAME_URL + "/" + playerId);
      setDialogueUrl(DIALOGUE_URL + "/" + playerId);
      game.initPlayer(playerId, sendJsonMessage);
    }
  }, [playerId, setGameUrl, setDialogueUrl, game, sendJsonMessage]);

  // Handle the game loop
  useEffect(() => {
    // Ignore messages from the echo site, as it is for setup only
    if (gameUrl === ECHO_URL) {
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
  }, [setGameState, gameMessage, gameUrl]);

  // Handle the dialogue loop
  useEffect(() => {
    // Ignore messages from the echo site, as it is for setup only
    if (dialogueUrl === ECHO_URL) {
      return;
    }

    if (!dialogueMessage) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const json = dialogueMessage as any;
    if (json) {
      console.log(`Dialogue Message is ${JSON.stringify(json, null, 2)}`);
    }
  }, [dialogueMessage, dialogueUrl]);

  return <div id="game-container" />;
};

export { Game };
