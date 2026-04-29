import React from "react";

export function BoldCorners() {
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
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
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
            <linearGradient id="boldCornersGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>

          {/* Top Left Bracket */}
          <path
            d="M 60 115 L 60 60 L 115 60"
            stroke="url(#boldCornersGradient)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Top Right Bracket */}
          <path
            d="M 205 60 L 260 60 L 260 115"
            stroke="url(#boldCornersGradient)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Bottom Right Bracket */}
          <path
            d="M 260 205 L 260 260 L 205 260"
            stroke="url(#boldCornersGradient)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Bottom Left Bracket */}
          <path
            d="M 60 205 L 60 260 L 115 260"
            stroke="url(#boldCornersGradient)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
