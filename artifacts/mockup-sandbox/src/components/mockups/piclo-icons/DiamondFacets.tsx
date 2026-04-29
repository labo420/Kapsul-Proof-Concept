import React from 'react';

export default function DiamondFacets() {
  return (
    <div style={{
      width: '100%',
      height: '100vh',
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
        boxShadow: '0 24px 48px rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <svg 
          width="200" 
          height="200" 
          viewBox="0 0 100 100" 
          style={{ overflow: 'visible' }}
        >
          <g transform="translate(0, 5)">
            {/* Top row / table and crown */}
            <polygon points="30,20 70,20 50,35" fill="#f0e6ff" /> {/* Central highlight */}
            <polygon points="30,20 10,40 30,40" fill="#EC4899" />
            <polygon points="30,20 30,40 50,35" fill="#C026D3" />
            <polygon points="70,20 50,35 70,40" fill="#DB2777" />
            <polygon points="70,20 70,40 90,40" fill="#9333EA" />
            <polygon points="50,35 30,40 50,40" fill="#DB2777" />
            <polygon points="50,35 50,40 70,40" fill="#7C3AED" />
            
            {/* Bottom / pavilion */}
            <polygon points="10,40 30,40 50,90" fill="#9333EA" />
            <polygon points="30,40 50,40 50,90" fill="#5b21b6" />
            <polygon points="50,40 70,40 50,90" fill="#4338CA" />
            <polygon points="70,40 90,40 50,90" fill="#6366F1" />
          </g>
        </svg>
      </div>
    </div>
  );
}
