import { useConnect } from "@/api/hooks/use-connect";
import { usePoll } from "@/api/hooks/use-poll";
import { constants } from "@/helpers/constants";
import { GameFlow, useGameStore } from "@/store";
import { useCallback, useEffect, useState } from "react";
import "../styles.css";
import { AnimatedDots } from "./animated-dots";

const Login = () => {
  const [id, setId] = useState(constants.emptyId);
  const poll = usePoll();
  const connect = useConnect(id);

  const flow = useGameStore((state) => state.flow);
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
    // If the connect was a success, we want to set our player id and connect to the player websocket
    if (connect.data?.status === 200) {
      setPlayerId(String(connect.data.data));
      setGameFlow(GameFlow.Game);
    }
  }, [connect.data]);

  useEffect(() => {
    setPlayerOne(gameState.playerOne.id !== constants.emptyId);
    setPlayerTwo(gameState.playerTwo.id !== constants.emptyId);
  }, [gameState, setPlayerOne, setPlayerTwo]);

  const handlePlayerOneClicked = useCallback(() => {
    setId(constants.playerOne);
  }, [setId]);

  const handlePlayerTwoClicked = useCallback(() => {
    setId(constants.playerTwo);
  }, [setId]);

  if (poll.isPending) {
    return (
      <h1 className="fixed inset-y-40 pixel-font text-5xl">
        Waiting for server to spin up <AnimatedDots />
      </h1>
    );
  }
  if (poll.isError) {
    return (
      <h1 className="fixed inset-y-40 pixel-font text-5xl">
        Server failed to spin up. {poll.error.message}
      </h1>
    );
  }

  const playerOneImage = playerOne
    ? "images/alex-profile-inactive.png"
    : "images/alex-profile-active.png";
  const playerTwoImage = playerTwo
    ? "images/wato-profile-inactive.png"
    : "images/wato-profile-active.png";

  return (
    <>
      {flow === GameFlow.Menu && (
        <div className="absolute w-full h-full">
          <div className="flex w-full h-full justify-center items-center gap-10">
            <img
              className={`${!playerOne ? "cursor-pointer" : ""} pixel w-60`}
              onClick={handlePlayerOneClicked}
              src={playerOneImage}
            />
            <img
              className={`${!playerTwo ? "cursor-pointer" : ""} pixel w-60`}
              onClick={handlePlayerTwoClicked}
              src={playerTwoImage}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
