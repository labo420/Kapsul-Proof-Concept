export function Neon() {
  return (
    <div
      style={{ background: "#08060F" }}
      className="min-h-screen flex items-center justify-center"
    >
      <span
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "72px",
          fontWeight: 700,
          letterSpacing: "0.04em",
          color: "#C4B5FD",
          textTransform: "lowercase",
          lineHeight: 1,
          textShadow: [
            "0 0 6px #C4B5FD",
            "0 0 20px #8B5CF6",
            "0 0 40px #6366F1",
            "0 0 80px rgba(99,102,241,0.5)",
          ].join(", "),
        }}
      >
        piclo
      </span>
    </div>
  );
}
