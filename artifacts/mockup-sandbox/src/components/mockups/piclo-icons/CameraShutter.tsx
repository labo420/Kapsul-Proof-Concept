import React, { useEffect } from 'react';

export function CameraShutter() {
  useEffect(() => {
    if (!document.getElementById('lilita-one-font')) {
      const link = document.createElement('link');
      link.id = 'lilita-one-font';
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Lilita+One&display=swap';
      document.head.appendChild(link);
    }
  }, []);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      minHeight: '400px',
      backgroundColor: '#1a1a2e',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: 0,
      padding: 0
    }}>
      <div style={{
        width: '320px',
        height: '320px',
        backgroundColor: '#08060F',
        borderRadius: '72px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5), inset 0 1px 3px rgba(255,255,255,0.1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <svg width="240" height="240" viewBox="0 0 240 240" style={{ marginTop: '-24px' }}>
          <defs>
            <linearGradient id="shutter-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <g transform="translate(120, 120)">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <g key={i} transform={`rotate(${i * 60})`}>
                <polygon 
                  points="28,-18 105,-18 115,12 45,45" 
                  fill="url(#shutter-grad)" 
                  opacity="0.9"
                  stroke="#08060F"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </g>
            ))}
            <circle cx="0" cy="0" r="22" fill="#ffffff" filter="url(#glow)" />
          </g>
        </svg>
        <div style={{
          fontFamily: "'Lilita One', cursive",
          fontSize: '42px',
          color: '#ffffff',
          position: 'absolute',
          bottom: '32px',
          letterSpacing: '0.5px',
          textShadow: '0 4px 12px rgba(236,72,153,0.4)'
        }}>
          piclo
        </div>
      </div>
    </div>
  );
}
