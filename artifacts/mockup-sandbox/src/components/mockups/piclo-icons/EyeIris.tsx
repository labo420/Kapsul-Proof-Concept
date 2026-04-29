import React from 'react';

export default function EyeIris() {
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
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="irisGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="#1e1b4b" />
              <stop offset="30%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#EC4899" />
            </radialGradient>
          </defs>

          {/* Eyelashes */}
          <path d="M40 100 Q 30 70 20 60" stroke="white" strokeWidth="4" strokeLinecap="round" />
          <path d="M70 85 Q 65 50 50 40" stroke="white" strokeWidth="4" strokeLinecap="round" />
          <path d="M105 75 Q 110 40 100 25" stroke="white" strokeWidth="4" strokeLinecap="round" />
          <path d="M140 75 Q 140 40 150 25" stroke="white" strokeWidth="4" strokeLinecap="round" />
          <path d="M180 85 Q 185 50 200 40" stroke="white" strokeWidth="4" strokeLinecap="round" />
          <path d="M210 100 Q 220 70 230 60" stroke="white" strokeWidth="4" strokeLinecap="round" />

          {/* Sclera (Outer Eye) */}
          <path d="M 20 120 Q 120 40 220 120 Q 120 200 20 120" fill="white" />

          {/* Iris */}
          <circle cx="120" cy="120" r="45" fill="url(#irisGradient)" />

          {/* Pupil */}
          <circle cx="120" cy="120" r="15" fill="#000000" />

          {/* Specular Highlight */}
          <circle cx="135" cy="100" r="8" fill="white" />
          <circle cx="145" cy="112" r="3" fill="white" />
        </svg>
      </div>
    </div>
  );
}
