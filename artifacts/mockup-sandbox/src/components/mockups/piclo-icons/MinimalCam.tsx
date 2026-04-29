import React from "react";

export function MinimalCam() {
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
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="320" height="320" viewBox="0 0 320 320">
          <defs>
            <linearGradient id="g" x1="0" y1="0" x2="320" y2="320" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>
          <rect
            x="70"
            y="95"
            width="180"
            height="130"
            rx="20"
            fill="none"
            stroke="url(#g)"
            strokeWidth="7"
          />
          <circle
            cx="160"
            cy="160"
            r="38"
            fill="none"
            stroke="url(#g)"
            strokeWidth="7"
          />
          <circle
            cx="218"
            cy="103"
            r="10"
            fill="#EC4899"
          />
        </svg>
      </div>
    </div>
  );
}
