export function Gradient() {
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
          letterSpacing: "-0.01em",
          background: "linear-gradient(135deg, #6366F1 0%, #A855F7 50%, #EC4899 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          lineHeight: 1.1,
        }}
      >
        piclo
      </span>
    </div>
  );
}
