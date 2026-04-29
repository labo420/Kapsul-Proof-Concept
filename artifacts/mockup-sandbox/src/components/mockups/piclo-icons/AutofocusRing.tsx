import React from "react";

export default function AutofocusRing() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "400px",
        height: "400px",
        backgroundColor: "#1a1a2e",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          width: "320px",
          height: "320px",
          backgroundColor: "#08060F",
          borderRadius: "72px",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
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
            <filter
              id="pink-glow"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            
            <linearGradient id="gradient-accent" x1="0" y1="0" x2="320" y2="320">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>

          {/* Faint outer circle for atmosphere */}
          <circle
            cx="160"
            cy="160"
            r="110"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Main Autofocus Ring */}
          <circle
            cx="160"
            cy="160"
            r="90"
            stroke="#6366F1"
            strokeWidth="3"
          />

          {/* Tick marks at 12, 3, 6, 9 (crossing the ring) */}
          {/* 12 o'clock */}
          <line x1="160" y1="64" x2="160" y2="76" stroke="#6366F1" strokeWidth="3" strokeLinecap="round" />
          {/* 3 o'clock */}
          <line x1="244" y1="160" x2="256" y2="160" stroke="#6366F1" strokeWidth="3" strokeLinecap="round" />
          {/* 6 o'clock */}
          <line x1="160" y1="244" x2="160" y2="256" stroke="#6366F1" strokeWidth="3" strokeLinecap="round" />
          {/* 9 o'clock */}
          <line x1="64" y1="160" x2="76" y2="160" stroke="#6366F1" strokeWidth="3" strokeLinecap="round" />

          {/* Center Crosshair */}
          <line x1="140" y1="160" x2="180" y2="160" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="1.5" />
          <line x1="160" y1="140" x2="160" y2="180" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="1.5" />

          {/* Center Dot */}
          <circle
            cx="160"
            cy="160"
            r="2.5"
            fill="#EC4899"
            filter="url(#pink-glow)"
          />

          {/* 4 L-shaped corner brackets framing the ring */}
          {/* Top-Left */}
          <path
            d="M 50 70 L 50 50 L 70 50"
            stroke="#EC4899"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Top-Right */}
          <path
            d="M 250 50 L 270 50 L 270 70"
            stroke="#EC4899"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Bottom-Right */}
          <path
            d="M 270 250 L 270 270 L 250 270"
            stroke="#EC4899"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Bottom-Left */}
          <path
            d="M 70 270 L 50 270 L 50 250"
            stroke="#EC4899"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

        </svg>
      </div>
    </div>
  );
}
