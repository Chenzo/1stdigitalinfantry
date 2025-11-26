 "use client";

import { useRef } from "react";
import Game, { type GameHandle } from "@/components/Game";

export default function TanksPage() {

  const gameRef = useRef<GameHandle | null>(null);

  const handleResetClick = () => {
    //gameRef.current?.resetObstacles();
    console.log("Reset clicked");
  };


  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <button onClick={handleResetClick}>Reset</button>
      <div style={{ width: "1200px", height: "700px" }}>
        <Game ref={gameRef} />
      </div>
    </div>
  );
}
