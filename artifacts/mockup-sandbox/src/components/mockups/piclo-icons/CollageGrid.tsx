export default function CollageGrid() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#1a1a2e",
        margin: 0,
        padding: 0,
      }}
    >
      <div
        style={{
          width: 320,
          height: 320,
          backgroundColor: "#08060F",
          borderRadius: 72,
          boxShadow: "0 24px 48px rgba(0,0,0,0.4)",
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
            <linearGradient id="tl" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
            <linearGradient id="tr" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#EC4899" />
              <stop offset="100%" stopColor="#F97316" />
            </linearGradient>
            <linearGradient id="bl" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#6366F1" />
            </linearGradient>
            <linearGradient id="br" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>

          {/* Top Left */}
          <rect
            x="40"
            y="40"
            width="117"
            height="117"
            rx="24"
            fill="url(#tl)"
          />
          
          {/* Top Right */}
          <rect
            x="163"
            y="40"
            width="117"
            height="117"
            rx="24"
            fill="url(#tr)"
          />

          {/* Bottom Left */}
          <rect
            x="40"
            y="163"
            width="117"
            height="117"
            rx="24"
            fill="url(#bl)"
          />

          {/* Bottom Right */}
          <rect
            x="163"
            y="163"
            width="117"
            height="117"
            rx="24"
            fill="url(#br)"
          />
        </svg>
      </div>
    </div>
  );
}
