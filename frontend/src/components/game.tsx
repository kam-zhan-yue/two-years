import { ECHO_URL, WS_URL } from "@/api/constants";
import { GameStateSchema, type GameState } from "@/game/types/game-state";
import { useGameStore } from "@/store";
import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";

const Game = () => {
  const [socketUrl, setSocketUrl] = useState(ECHO_URL);
  const setGameState = useGameStore((state) => state.setGameState);
  const playerId = useGameStore((state) => state.playerId);
  const game = useGameStore((state) => state.game);
  const { sendJsonMessage, lastJsonMessage } = useWebSocket(
    socketUrl,
    {},
    true,
  );

  // Handle the main player
  useEffect(() => {
    if (game && playerId !== 0) {
      setSocketUrl(WS_URL + "/" + playerId);
      game.initPlayer(playerId, sendJsonMessage);
    }
  }, [playerId, game, sendJsonMessage]);

  // Handle the game loop
  useEffect(() => {
    // Ignore messages from the echo site, as it is for setup only
    if (socketUrl === "wss://echo.websocket.org") {
      return;
    }

    if (!lastJsonMessage) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // console.log(socketUrl, lastJsonMessage);
    const json = lastJsonMessage as any;
    if (json) {
      const parsed = GameStateSchema.safeParse(json);
      if (!parsed.success) {
        console.error("Invalid game state:", parsed.error);
        return;
      }
      const gameState = parsed.data as GameState;

      setGameState(gameState);
    }
  }, [setGameState, lastJsonMessage, socketUrl]);

  return <div id="game-container" />;
};

export { Game }
