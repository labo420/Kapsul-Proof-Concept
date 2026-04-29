export default function ViewfinderBox() {
  return (
    <div
      style={{
        width: "400px",
        height: "400px",
        backgroundColor: "#1a1a2e",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          width: "320px",
          height: "320px",
          backgroundColor: "#08060F",
          borderRadius: "72px",
          boxShadow: "0 24px 48px rgba(0, 0, 0, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.1)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <svg
          width="320"
          height="320"
          viewBox="0 0 320 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="bracket-gradient" x1="0" y1="0" x2="0" y2="320" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
            
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Crosshair lines */}
          <line x1="160" y1="130" x2="160" y2="190" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" />
          <line x1="130" y1="160" x2="190" y2="160" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" />

          {/* Aiming dot */}
          <circle cx="160" cy="160" r="4" fill="#EC4899" filter="url(#glow)" />

          {/* Brackets framing 180x180 area. Center is 160,160. Corners: 70, 250 */}
          <g stroke="url(#bracket-gradient)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow)">
            {/* Top-Left */}
            <path d="M 70 110 L 70 70 L 110 70" />
            {/* Top-Right */}
            <path d="M 210 70 L 250 70 L 250 110" />
            {/* Bottom-Right */}
            <path d="M 250 210 L 250 250 L 210 250" />
            {/* Bottom-Left */}
            <path d="M 110 250 L 70 250 L 70 210" />
          </g>
        </svg>
      </div>
    </div>
  );
}
