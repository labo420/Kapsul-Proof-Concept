import React from 'react';

export default function StarBurst() {
  const points = [];
  const cx = 160;
  const cy = 160;
  const rOuter = 120;
  const rInner = 60;

  for (let i = 0; i < 16; i++) {
    const radius = i % 2 === 0 ? rOuter : rInner;
    const angle = (i * Math.PI) / 8;
    const x = cx + radius * Math.sin(angle);
    const y = cy - radius * Math.cos(angle);
    points.push(`${x},${y}`);
  }
  const polygonStr = points.join(' ');

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
          position: 'relative',
        }}
      >
        <svg
          width="320"
          height="320"
          viewBox="0 0 320 320"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: 'absolute' }}
        >
          <defs>
            <linearGradient id="starBurstGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="30%" stopColor="#8B5CF6" />
              <stop offset="60%" stopColor="#EC4899" />
              <stop offset="100%" stopColor="#F97316" />
            </linearGradient>
          </defs>
          <polygon
            points={polygonStr}
            fill="url(#starBurstGrad)"
          />
          <circle cx="160" cy="160" r="14" fill="#08060F" />
        </svg>
      </div>
    </div>
  );
}
