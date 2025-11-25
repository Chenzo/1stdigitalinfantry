import Game from "@/components/Game";

export default function TanksPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "1200px", height: "700px" }}>
        <Game />
      </div>
    </div>
  );
}
