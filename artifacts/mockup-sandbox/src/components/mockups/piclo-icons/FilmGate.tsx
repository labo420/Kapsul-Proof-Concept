export default function FilmGate() {
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
          position: "relative",
          boxShadow: "0 0 40px rgba(99, 102, 241, 0.2)",
        }}
      >
        <svg
          width="320"
          height="320"
          viewBox="0 0 320 320"
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          <defs>
            <linearGradient id="gateGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
            <radialGradient id="vignette" cx="50%" cy="50%" r="50%">
              <stop offset="50%" stopColor="transparent" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.4)" />
            </radialGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Vignette filling the gate */}
          <rect
            x="80"
            y="60"
            width="160"
            height="200"
            rx="6"
            fill="url(#vignette)"
          />

          {/* Film Gate Border */}
          <rect
            x="80"
            y="60"
            width="160"
            height="200"
            rx="6"
            stroke="url(#gateGrad)"
            strokeWidth="5"
            fill="none"
            filter="url(#glow)"
          />

          {/* Sprocket Holes - Left */}
          <rect x="50" y="95" width="14" height="10" rx="3" stroke="rgba(255,255,255,0.35)" strokeWidth="2" fill="none" />
          <rect x="50" y="155" width="14" height="10" rx="3" stroke="rgba(255,255,255,0.35)" strokeWidth="2" fill="none" />
          <rect x="50" y="215" width="14" height="10" rx="3" stroke="rgba(255,255,255,0.35)" strokeWidth="2" fill="none" />

          {/* Sprocket Holes - Right */}
          <rect x="256" y="95" width="14" height="10" rx="3" stroke="rgba(255,255,255,0.35)" strokeWidth="2" fill="none" />
          <rect x="256" y="155" width="14" height="10" rx="3" stroke="rgba(255,255,255,0.35)" strokeWidth="2" fill="none" />
          <rect x="256" y="215" width="14" height="10" rx="3" stroke="rgba(255,255,255,0.35)" strokeWidth="2" fill="none" />

          {/* Center L-brackets */}
          <g
            transform="translate(160, 160)"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M -15,-5 L -15,-15 L -5,-15" />
            <path d="M 5,-15 L 15,-15 L 15,-5" />
            <path d="M 15,5 L 15,15 L 5,15" />
            <path d="M -5,15 L -15,15 L -15,5" />
          </g>
        </svg>
      </div>
    </div>
  );
}
