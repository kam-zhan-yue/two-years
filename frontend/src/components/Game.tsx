import { ECHO_URL, WS_URL } from "@/api/constants";
import { Boot } from "@/game/boot";
import { Main } from "@/game/main";
import { GameStateSchema, type GameState } from "@/game/types/game-state";
import { constants } from "@/helpers/constants";
import { useGameStore } from "@/store";
import Phaser from "phaser";
import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";

const Game = () => {
  const [socketUrl, setSocketUrl] = useState(ECHO_URL);
  const setGameState = useGameStore((state) => state.setGameState);
  const playerId = useGameStore((state) => state.playerId);
  const game = useGameStore((state) => state.game);
  const setGame = useGameStore((state) => state.setGame);
  const { sendJsonMessage, lastJsonMessage } = useWebSocket(
    socketUrl,
    {},
    true,
  );

  useEffect(() => {
    const boot = new Boot();
    const main = new Main();
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 300,
      height: 300,
      parent: "game-container",
      backgroundColor: "#65a4f8",
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        zoom: 10,
      },
      physics: {
        default: "arcade",
        arcade: {
          debug: constants.debug,
          gravity: { x: 0, y: 0 },
        },
      },
      scene: [boot, main],
    };

    const phaserGame = new Phaser.Game(config);
    setGame(main);

    return () => {
      phaserGame.destroy(true);
    };
  }, [sendJsonMessage, setGame]);

  useEffect(() => {
    if (game && playerId !== "0") {
      setSocketUrl(WS_URL + "/" + playerId);
      game.initPlayer(playerId, sendJsonMessage);
    }
  }, [playerId, game, sendJsonMessage]);

  useEffect(() => {
    // Ignore messages from the echo site, as it is for setup only
    if (socketUrl === "wss://echo.websocket.org") {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    console.log(lastJsonMessage);
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

export default Game;
