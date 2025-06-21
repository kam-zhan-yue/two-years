import { useConnect } from "@/api/hooks/use-connect";
import { usePoll } from "@/api/hooks/use-poll";
import { constants } from "@/helpers/constants";
import { GameFlow, useGameStore } from "@/store";
import { useCallback, useEffect, useState } from "react";

const Login = () => {
  const [id, setId] = useState(constants.emptyId);
  const poll = usePoll();
  const connect = useConnect(id);

  const playerId = useGameStore((state) => state.playerId);
  const setPlayerId = useGameStore((state) => state.setPlayerId);
  const setGameFlow = useGameStore((state) => state.setGameFlow);
  const gameState = useGameStore((state) => state.gameState);
  const [playerOne, setPlayerOne] = useState(false);
  const [playerTwo, setPlayerTwo] = useState(false);

  useEffect(() => {
    // If the poll was a success, we want to start listening to the game websocket
    if (poll.data?.status === 200) {
      setGameFlow(GameFlow.Menu);
    }
  }, [poll.data, setGameFlow]);

  useEffect(() => {
    if (connect.data?.status === 200) {
      console.log(`Connect Success ${connect.data}`);
    }
  }, [connect.data]);

  useEffect(() => {
    setPlayerOne(gameState.playerOne.id !== constants.emptyId);
    setPlayerTwo(gameState.playerTwo.id !== constants.emptyId);
  }, [gameState, setPlayerOne, setPlayerTwo]);

  const handlePlayerOneClicked = useCallback(() => {
    setId(constants.playerOne);
  }, [setPlayerId]);

  const handlePlayerTwoClicked = useCallback(() => {
    setId(constants.playerTwo);
  }, [setPlayerId]);

  if (poll.isPending) {
    return (
      <div className="fixed inset-y-40">Waiting for server to spin up...</div>
    );
  }
  if (poll.isError) {
    return (
      <div className="fixed inset-y-40">
        Server failed to spin up. {poll.error.message}
      </div>
    );
  }

  return (
    <>
      {playerId === constants.emptyId && (
        <div className="fixed inset-y-40">
          <div className="flex gap-2">
            <button
              disabled={playerOne}
              onClick={handlePlayerOneClicked}
              className="px-4 py-2 rounded bg-teal-500 text-white cursor-pointer disabled:bg-teal-200 disabled:text-teal-600 disabled:cursor-not-allowed"
            >
              Player One
            </button>
            <button
              disabled={playerTwo}
              onClick={handlePlayerTwoClicked}
              className="px-4 py-2 rounded bg-red-500 text-white cursor-pointer disabled:bg-red-200 disabled:text-red-600 disabled:cursor-not-allowed"
            >
              Player Two
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
