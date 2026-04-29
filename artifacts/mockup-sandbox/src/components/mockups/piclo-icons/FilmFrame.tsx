import React, { useEffect } from 'react';

export function FilmFrame() {
  useEffect(() => {
    const linkId = 'font-lilita-one';
    if (!document.getElementById(linkId)) {
      const link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Lilita+One&display=swap';
      document.head.appendChild(link);
    }
  }, []);

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1a1a2e',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: 320,
          height: 320,
          backgroundColor: '#08060F',
          borderRadius: 72,
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <svg
          width="240"
          height="240"
          viewBox="0 0 240 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: 'absolute', top: 20 }}
        >
          <defs>
            <linearGradient id="photoGrad" x1="40" y1="40" x2="200" y2="200" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6366F1" />
              <stop offset="1" stopColor="#EC4899" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Main film strip base */}
          <rect x="20" y="10" width="200" height="200" fill="#1C1826" rx="12" />

          {/* Sprocket holes - left */}
          {Array.from({ length: 7 }).map((_, i) => (
            <rect key={`left-${i}`} x="32" y={24 + i * 26} width="12" height="16" rx="4" fill="#08060F" />
          ))}

          {/* Sprocket holes - right */}
          {Array.from({ length: 7 }).map((_, i) => (
            <rect key={`right-${i}`} x="196" y={24 + i * 26} width="12" height="16" rx="4" fill="#08060F" />
          ))}

          {/* Developed photo inside */}
          <rect x="56" y="24" width="128" height="172" fill="url(#photoGrad)" rx="8" />
        </svg>

        <div
          style={{
            fontFamily: "'Lilita One', cursive",
            fontSize: '56px',
            color: '#FFFFFF',
            position: 'absolute',
            lineHeight: 1,
            top: '124px',
            textShadow: '0 4px 16px rgba(0,0,0,0.6)',
            letterSpacing: '1px',
            zIndex: 10,
          }}
        >
          piclo
        </div>
      </div>
    </div>
  );
}
