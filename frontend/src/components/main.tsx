import { Boot } from "@/game/boot";
import { Level } from "@/game/level";
import { constants } from "@/helpers/constants";
import { useGameStore } from "@/store";
import Phaser from "phaser";
import { useEffect } from "react";
import Game from "./game";

const Main = () => {
  const setGame = useGameStore((state) => state.setGame);

  useEffect(() => {
    const boot = new Boot();
    const level = new Level();
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
      scene: [boot, level],
    };

    const phaserGame = new Phaser.Game(config);
    setGame(level);

    return () => {
      phaserGame.destroy(true);
    };
  }, [setGame]);
  return <Game />;
};

export default Main;
