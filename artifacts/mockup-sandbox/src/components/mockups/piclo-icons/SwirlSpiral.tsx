import React from 'react';

export default function SwirlSpiral() {
  const generateSpiral = () => {
    let path = "";
    const turns = 2.5;
    const maxRadius = 110;
    const center = 160;
    const points = 200;
    
    for (let i = 0; i <= points; i++) {
      const t = i / points;
      const theta = t * turns * 2 * Math.PI; // 0 to 5 PI
      const r = t * maxRadius;
      // Start from center, but offset slightly so the center dot covers the start
      const x = center + r * Math.cos(theta);
      const y = center + r * Math.sin(theta);
      
      if (i === 0) {
        path += `M ${x} ${y} `;
      } else {
        path += `L ${x} ${y} `;
      }
    }
    return path;
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '400px',
      height: '400px',
      backgroundColor: '#1a1a2e'
    }}>
      <div style={{
        width: '320px',
        height: '320px',
        backgroundColor: '#08060F',
        borderRadius: '72px',
        boxShadow: '0 24px 48px rgba(0,0,0,0.5)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <svg width="320" height="320" viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="spiralGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#EC4899" />
              <stop offset="100%" stopColor="#6366F1" />
            </radialGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="32" result="blur" />
            </filter>
          </defs>
          
          {/* Faint glowing aura behind spiral */}
          <circle cx="160" cy="160" r="90" fill="#6366F1" opacity="0.12" filter="url(#glow)" />
          
          {/* The spiral */}
          <path 
            d={generateSpiral()} 
            fill="none" 
            stroke="url(#spiralGrad)" 
            strokeWidth="14" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          
          {/* Center dot to anchor the spiral */}
          <circle cx="160" cy="160" r="7" fill="#EC4899" />
        </svg>
      </div>
    </div>
  );
}
