import React, { useEffect } from 'react';

export function WordmarkPill() {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Lilita+One&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
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
          width: '320px',
          height: '320px',
          backgroundColor: '#08060F',
          borderRadius: '72px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), inset 0 0 0 1px rgba(255, 255, 255, 0.08)',
          position: 'relative',
        }}
      >
        <span
          style={{
            fontFamily: "'Lilita One', cursive",
            color: '#FFFFFF',
            fontSize: '96px',
            lineHeight: 1,
            letterSpacing: '0.02em',
          }}
        >
          piclo
        </span>
      </div>
    </div>
  );
}
