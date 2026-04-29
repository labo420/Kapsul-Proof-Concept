import React, { useEffect } from "react";

export function PCircle() {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Lilita+One&display=swap";
    document.head.appendChild(link);
  }, []);

  return (
    <div
      style={{
        width: "400px",
        height: "400px",
        backgroundColor: "#1a1a2e",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "320px",
          height: "320px",
          backgroundColor: "#08060F",
          borderRadius: "72px",
          boxShadow: "0 24px 48px rgba(0, 0, 0, 0.4)",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <svg
          width="320"
          height="320"
          viewBox="0 0 320 320"
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          <defs>
            <radialGradient id="pcircle-gradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#EC4899" />
            </radialGradient>
          </defs>
          <circle
            cx="160"
            cy="160"
            r="108"
            fill="url(#pcircle-gradient)"
          />
        </svg>
        <div
          style={{
            position: "absolute",
            width: "216px",
            height: "216px",
            borderRadius: "50%",
            boxShadow: "inset 0 4px 12px rgba(0,0,0,0.3)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            fontFamily: "'Lilita One', cursive",
            fontSize: "130px",
            color: "#ffffff",
            lineHeight: 1,
            zIndex: 10,
            transform: "translateY(5px)", // Visual center adjustment for the font
          }}
        >
          P
        </div>
      </div>
    </div>
  );
}
