import React, { useEffect } from 'react';

export function PGradientBg() {
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
        background: 'linear-gradient(135deg, #6366F1 0%, #9333EA 50%, #EC4899 100%)',
        borderRadius: '72px',
        boxShadow: 'inset 0 2px 20px rgba(255,255,255,0.15), 0 20px 40px rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          fontFamily: "'Lilita One', cursive",
          fontSize: '190px',
          color: '#ffffff',
          lineHeight: 1,
          paddingTop: '15px' // Visual optical centering
        }}>
          P
        </div>
      </div>
    </div>
  );
}
