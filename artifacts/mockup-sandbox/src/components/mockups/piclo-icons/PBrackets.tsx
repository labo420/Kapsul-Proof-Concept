import React, { useEffect } from "react";

export function PBrackets() {
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
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontFamily: "'Lilita One', cursive",
            fontSize: "140px",
            color: "white",
            lineHeight: 1,
            zIndex: 2,
            marginTop: "10px" // Minor adjustment to visually center the P
          }}
        >
          P
        </span>
        <svg
          width="320"
          height="320"
          style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}
        >
          <defs>
            <linearGradient id="bracketGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>
          <path
            d="M 65 103 L 65 65 L 103 65
               M 217 65 L 255 65 L 255 103
               M 255 217 L 255 255 L 217 255
               M 103 255 L 65 255 L 65 217"
            fill="none"
            stroke="url(#bracketGrad)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
