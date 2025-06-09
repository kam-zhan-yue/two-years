import { constants } from "@/helpers/constants";
import { useGameStore } from "@/store";
import { useCallback } from "react";

const Login = () => {
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
          <div onClick={handlePlayerOneClicked}>Player One</div>
          <div onClick={handlePlayerTwoClicked}>Player Two</div>
        </div>
      )}
    </>
  );
};

export default Login;
