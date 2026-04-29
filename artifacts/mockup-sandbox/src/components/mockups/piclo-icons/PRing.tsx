import React, { useEffect } from 'react';

export default function PRing() {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Lilita+One&display=swap";
    document.head.appendChild(link);
  }, []);

  return (
    <div style={{
      width: '400px',
      height: '400px',
      backgroundColor: '#1a1a2e',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        width: '320px',
        height: '320px',
        backgroundColor: '#08060F',
        borderRadius: '72px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        <svg 
          width="320" 
          height="320" 
          viewBox="0 0 320 320" 
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          <defs>
            <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>

          <circle 
            cx="160" 
            cy="160" 
            r="96" 
            fill="none" 
            stroke="url(#ringGrad)" 
            strokeWidth="5" 
          />

          <line x1="160" y1="50" x2="160" y2="64" stroke="#6366F1" strokeWidth="5" strokeLinecap="round" />
          <line x1="160" y1="256" x2="160" y2="270" stroke="#EC4899" strokeWidth="5" strokeLinecap="round" />
          <line x1="50" y1="160" x2="64" y2="160" stroke="#9333EA" strokeWidth="5" strokeLinecap="round" />
          <line x1="256" y1="160" x2="270" y2="160" stroke="#9333EA" strokeWidth="5" strokeLinecap="round" />
        </svg>

        <div style={{
          position: 'absolute',
          color: 'white',
          fontFamily: "'Lilita One', cursive",
          fontSize: '120px',
          lineHeight: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '10px'
        }}>
          P
        </div>
      </div>
    </div>
  );
}
