import React from 'react';

export default function TargetCross() {
  return (
    <div style={{
      width: '400px',
      height: '400px',
      backgroundColor: '#1a1a2e',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'sans-serif'
    }}>
      <div style={{
        width: '320px',
        height: '320px',
        backgroundColor: '#08060F',
        borderRadius: '72px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <svg width="320" height="320" viewBox="0 0 320 320" style={{ position: 'absolute', top: 0, left: 0 }}>
          <defs>
            <linearGradient id="gradientAccent" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
            <radialGradient id="faintRadial" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="100%" stopColor="rgba(236,72,153,0.15)" />
            </radialGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Arms and Ticks */}
          <g stroke="rgba(255, 255, 255, 0.5)" strokeWidth="2" strokeLinecap="butt">
            {/* Top */}
            <line x1="160" y1="30" x2="160" y2="132" />
            <line x1="155" y1="30" x2="165" y2="30" />
            
            {/* Bottom */}
            <line x1="160" y1="188" x2="160" y2="290" />
            <line x1="155" y1="290" x2="165" y2="290" />
            
            {/* Left */}
            <line x1="30" y1="160" x2="132" y2="160" />
            <line x1="30" y1="155" x2="30" y2="165" />
            
            {/* Right */}
            <line x1="188" y1="160" x2="290" y2="160" />
            <line x1="290" y1="155" x2="290" y2="165" />
          </g>

          {/* Center Circle */}
          <circle 
            cx="160" cy="160" r="26"
            fill="url(#faintRadial)"
            stroke="url(#gradientAccent)"
            strokeWidth="3"
            filter="url(#glow)"
          />

          {/* 4 small dots for polish */}
          <g fill="rgba(255, 255, 255, 0.6)">
            <circle cx="160" cy="30" r="1.5" />
            <circle cx="160" cy="290" r="1.5" />
            <circle cx="30" cy="160" r="1.5" />
            <circle cx="290" cy="160" r="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}
