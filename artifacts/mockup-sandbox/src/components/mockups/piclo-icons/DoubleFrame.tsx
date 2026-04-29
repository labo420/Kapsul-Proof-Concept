import React from 'react';

export function DoubleFrame() {
  return (
    <div
      style={{
        width: '400px',
        height: '400px',
        backgroundColor: '#1a1a2e',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0',
        padding: '0',
      }}
    >
      <div
        style={{
          width: '320px',
          height: '320px',
          backgroundColor: '#08060F',
          borderRadius: '72px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'inset 0 0 40px rgba(0,0,0,0.5)',
          overflow: 'hidden',
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
            <filter id="glowCenter" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Outer Frame */}
          <g stroke="#6366F1" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
            {/* Top Left */}
            <path d="M 50 86 L 50 50 L 86 50" />
            {/* Top Right */}
            <path d="M 234 50 L 270 50 L 270 86" />
            {/* Bottom Right */}
            <path d="M 270 234 L 270 270 L 234 270" />
            {/* Bottom Left */}
            <path d="M 86 270 L 50 270 L 50 234" />
          </g>

          {/* Inner Frame */}
          <g stroke="#EC4899" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
            {/* Top Left */}
            <path d="M 100 124 L 100 100 L 124 100" />
            {/* Top Right */}
            <path d="M 196 100 L 220 100 L 220 124" />
            {/* Bottom Right */}
            <path d="M 220 196 L 220 220 L 196 220" />
            {/* Bottom Left */}
            <path d="M 124 220 L 100 220 L 100 196" />
          </g>

          {/* Diamonds */}
          <g fill="#9333EA" opacity="0.7">
            {/* Top */}
            <polygon points="160,71 164,75 160,79 156,75" />
            {/* Right */}
            <polygon points="245,156 249,160 245,164 241,160" />
            {/* Bottom */}
            <polygon points="160,241 164,245 160,249 156,245" />
            {/* Left */}
            <polygon points="75,156 79,160 75,164 71,160" />
          </g>

          {/* Center Dot */}
          <circle cx="160" cy="160" r="2" fill="#FFFFFF" filter="url(#glowCenter)" />
        </svg>
      </div>
    </div>
  );
}
