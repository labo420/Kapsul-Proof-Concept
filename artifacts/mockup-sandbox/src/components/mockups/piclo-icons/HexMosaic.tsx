import React from "react";

export default function HexMosaic() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100vh",
        backgroundColor: "#1a1a2e",
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
            <radialGradient id="hexCenter" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </radialGradient>
            <linearGradient id="hexTop" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#6366F1" />
            </linearGradient>
            <linearGradient id="hexTopRight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#9333EA" />
            </linearGradient>
            <linearGradient id="hexBottomRight" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#9333EA" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
            <linearGradient id="hexBottom" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#EC4899" />
              <stop offset="100%" stopColor="#F97316" />
            </linearGradient>
            <linearGradient id="hexBottomLeft" x1="100%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
            <linearGradient id="hexTopLeft" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#EC4899" />
              <stop offset="100%" stopColor="#C026D3" />
            </linearGradient>

            <g id="hexPoly">
              <polygon points="-19,-32.91 19,-32.91 38,0 19,32.91 -19,32.91 -38,0" />
            </g>
          </defs>

          {/* Top */}
          <use href="#hexPoly" x="160" y="90.72" fill="url(#hexTop)" />
          {/* Top Right */}
          <use href="#hexPoly" x="220" y="125.36" fill="url(#hexTopRight)" />
          {/* Bottom Right */}
          <use href="#hexPoly" x="220" y="194.64" fill="url(#hexBottomRight)" />
          {/* Bottom */}
          <use href="#hexPoly" x="160" y="229.28" fill="url(#hexBottom)" />
          {/* Bottom Left */}
          <use href="#hexPoly" x="100" y="194.64" fill="url(#hexBottomLeft)" />
          {/* Top Left */}
          <use href="#hexPoly" x="100" y="125.36" fill="url(#hexTopLeft)" />
          {/* Center */}
          <use href="#hexPoly" x="160" y="160" fill="url(#hexCenter)" />
        </svg>
      </div>
    </div>
  );
}
