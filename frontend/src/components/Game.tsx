import { Boot } from "@/game/boot"
import { Main } from "@/game/main"
import { constants } from "@/helpers/constants"
import Phaser from "phaser"
import { useEffect, useRef } from "react"

const Game = () => {
  const phaserGameRef = useRef<Phaser.Game>(null)

  useEffect(() => {
    const boot = new Boot()
    const main = new Main()
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
    }

    const game = new Phaser.Game(config)
    phaserGameRef.current = game

    return () => {
      game.destroy(true)
    }
  }, [])

  return (
    <div id="game-container" />
  )
}

export default Game
