import { usePoll } from "@/api/hooks/use-poll";
import { constants } from "@/helpers/constants";
import { useGameStore } from "@/store";
import { useCallback } from "react";

const Login = () => {
  const { isPending, isError, error } = usePoll();

  const playerId = useGameStore((state) => state.playerId);
  const setPlayerId = useGameStore((state) => state.setPlayerId);

  const handlePlayerOneClicked = useCallback(() => {
    setPlayerId(constants.playerOne);
  }, [setPlayerId]);

  const handlePlayerTwoClicked = useCallback(() => {
    setPlayerId(constants.playerTwo);
  }, [setPlayerId]);

  return (
    <>
      {playerId === 0 && (
        <div className="fixed inset-y-40">
          {isPending && <div>Waiting for server to spin up...</div>}
          {isError && (
            <div>Server failed to spin up. Error is {error.message}</div>
          )}

          {!isPending && !isError && (
            <>
              <div onClick={handlePlayerOneClicked}>Player One</div>
              <div onClick={handlePlayerTwoClicked}>Player Two</div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Login;
