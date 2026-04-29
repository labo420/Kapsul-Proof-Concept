import React, { useEffect } from 'react';

export function GradientOrb() {
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
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: '#1a1a2e',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: 0,
      padding: 0,
      overflow: 'hidden'
    }}>
      <div style={{
        width: 320,
        height: 320,
        backgroundColor: '#08060F',
        borderRadius: 72,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        {/* Soft aura background */}
        <div style={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 240,
          height: 240,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.4) 0%, rgba(99, 102, 241, 0.2) 50%, rgba(8, 6, 15, 0) 70%)',
          filter: 'blur(30px)',
          zIndex: 1,
        }} />
        
        {/* Core orb */}
        <div style={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 140,
          height: 140,
          borderRadius: '50%',
          background: 'radial-gradient(circle, #ffffff 0%, #f472b6 25%, #6366F1 75%, rgba(99, 102, 241, 0) 100%)',
          filter: 'blur(8px)',
          zIndex: 2,
        }} />

        {/* Inner bright core */}
        <div style={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: '#ffffff',
          filter: 'blur(4px)',
          boxShadow: '0 0 20px 10px rgba(255, 255, 255, 0.8)',
          zIndex: 3,
        }} />
        
        {/* Text */}
        <div style={{
          fontFamily: "'Lilita One', cursive",
          color: '#ffffff',
          fontSize: '48px',
          letterSpacing: '1px',
          zIndex: 4,
          position: 'absolute',
          bottom: '35px',
          textShadow: '0 4px 12px rgba(0,0,0,0.5)'
        }}>
          piclo
        </div>
      </div>
    </div>
  );
}
