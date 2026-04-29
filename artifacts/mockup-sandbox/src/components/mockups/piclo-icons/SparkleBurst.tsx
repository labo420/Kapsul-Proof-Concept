import React from 'react';

export default function SparkleBurst() {
  return (
    <div
      style={{
        width: '400px',
        height: '400px',
        backgroundColor: '#1a1a2e',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '320px',
          height: '320px',
          backgroundColor: '#08060F',
          borderRadius: '72px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <svg
          width="320"
          height="320"
          viewBox="0 0 320 320"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="mainGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
            
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="30" result="blur" />
            </filter>

            <path
              id="sparkle"
              d="M 0,-70 Q 0,0 70,0 Q 0,0 0,70 Q 0,0 -70,0 Q 0,0 0,-70 Z"
            />
          </defs>

          {/* Soft radial glow */}
          <circle
            cx="160"
            cy="160"
            r="45"
            fill="#EC4899"
            opacity="0.35"
            filter="url(#glow)"
          />

          {/* Main sparkle */}
          <use
            href="#sparkle"
            x="160"
            y="160"
            fill="url(#mainGrad)"
          />

          {/* Smaller sparkles */}
          <use
            href="#sparkle"
            x="0"
            y="0"
            fill="#FBCFE8"
            opacity="0.9"
            transform="translate(230, 100) scale(0.3) rotate(15)"
          />
          <use
            href="#sparkle"
            x="0"
            y="0"
            fill="#FFFFFF"
            opacity="0.8"
            transform="translate(100, 230) scale(0.25) rotate(-20)"
          />
          <use
            href="#sparkle"
            x="0"
            y="0"
            fill="#FBCFE8"
            opacity="0.7"
            transform="translate(110, 80) scale(0.2) rotate(45)"
          />
          <use
            href="#sparkle"
            x="0"
            y="0"
            fill="#FFFFFF"
            opacity="0.6"
            transform="translate(250, 240) scale(0.15) rotate(35)"
          />
        </svg>
      </div>
    </div>
  );
}
