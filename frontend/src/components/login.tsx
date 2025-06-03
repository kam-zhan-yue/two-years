import { useGameStore } from "@/store"
import { useCallback } from "react"

const Login = () => {
  const playerId = useGameStore((state) => state.playerId)
  const setPlayerId = useGameStore((state) => state.setPlayerId)

  const handlePlayClicked = useCallback(() => {
    setPlayerId('1')
  }, [setPlayerId])

  return (
    <>
      {playerId === '0' &&
        <div className="fixed inset-y-40" onClick={handlePlayClicked}>
          Play
        </div>
      }
    </>
  )
}

export default Login
