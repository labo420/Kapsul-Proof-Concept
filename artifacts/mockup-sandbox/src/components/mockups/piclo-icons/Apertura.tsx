import React from 'react';

export default function Apertura() {
  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100vw',
    height: '100vh',
    backgroundColor: '#1a1a2e',
    margin: 0,
    padding: 0,
    boxSizing: 'border-box' as const,
  };

  const iconStyle = {
    width: '320px',
    height: '320px',
    backgroundColor: '#08060F',
    borderRadius: '72px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), inset 0 1px 3px rgba(255, 255, 255, 0.1)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative' as const,
    overflow: 'hidden',
  };

  const blades = Array.from({ length: 8 }).map((_, i) => {
    const angle = i * 45;
    return (
      <g key={i} transform={`rotate(${angle})`}>
        {/* Main blade shape */}
        <path
          d="M 28,-28 L 150,-28 L 60,110 Z"
          fill="url(#bladeGradient)"
          style={{ mixBlendMode: 'screen', opacity: 0.85 }}
        />
        {/* Inner shadow/highlight for depth */}
        <path
          d="M 28,-28 L 140,-28 L 90,60 Z"
          fill="#EC4899"
          style={{ mixBlendMode: 'overlay', opacity: 0.6 }}
        />
        {/* Edge accent */}
        <path
          d="M 28,-28 L 150,-28"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinecap="round"
          style={{ opacity: 0.3 }}
        />
      </g>
    );
  });

  return (
    <div style={containerStyle}>
      <div style={iconStyle}>
        {/* Subtle background glow */}
        <div 
          style={{
            position: 'absolute',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, rgba(8, 6, 15, 0) 70%)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          }}
        />
        
        <svg width="320" height="320" viewBox="-160 -160 320 320" style={{ overflow: 'visible' }}>
          <defs>
            <radialGradient id="bladeGradient" cx="20%" cy="20%" r="100%">
              <stop offset="0%" stopColor="#EC4899" />
              <stop offset="100%" stopColor="#6366F1" />
            </radialGradient>
          </defs>
          
          <g transform="scale(0.95)">
            {blades}
          </g>
          
          {/* Center aperture opening */}
          <circle cx="0" cy="0" r="28" fill="#ffffff" opacity="0.95" style={{ filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.5))' }} />
          <circle cx="0" cy="0" r="18" fill="#08060F" />
        </svg>
      </div>
    </div>
  );
}
