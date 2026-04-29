export function SquareDot() {
  return (
    <div
      style={{
        width: 400,
        height: 400,
        backgroundColor: "#1a1a2e",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: 320,
          height: 320,
          backgroundColor: "#08060F",
          borderRadius: 72,
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="320" height="320" viewBox="0 0 320 320">
          <defs>
            <linearGradient id="g" x1="55" y1="55" x2="265" y2="265" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>
          <rect
            x="55"
            y="55"
            width="210"
            height="210"
            rx="24"
            fill="none"
            stroke="url(#g)"
            strokeWidth="7"
          />
          <circle cx="160" cy="160" r="48" fill="url(#g)" />
        </svg>
      </div>
    </div>
  );
}
