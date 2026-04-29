import React from 'react';

export default function LensRings() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100vh',
      backgroundColor: '#1a1a2e',
      margin: 0,
      padding: 0,
      boxSizing: 'border-box'
    }}>
      <div style={{
        width: '320px',
        height: '320px',
        backgroundColor: '#08060F',
        borderRadius: '72px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 10px 20px rgba(0, 0, 0, 0.2)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <svg width="240" height="240" viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
          {/* Ring 1 - Outermost */}
          <circle cx="120" cy="120" r="110" fill="none" stroke="#6366F1" strokeWidth="8" opacity="0.9" />
          
          {/* Ring 2 */}
          <circle cx="120" cy="120" r="90" fill="none" stroke="#7C3AED" strokeWidth="4" opacity="0.8" />
          
          {/* Ring 3 */}
          <circle cx="120" cy="120" r="72" fill="none" stroke="#9333EA" strokeWidth="6" opacity="0.85" />
          
          {/* Ring 4 */}
          <circle cx="120" cy="120" r="54" fill="none" stroke="#C026D3" strokeWidth="3" opacity="0.75" />
          
          {/* Ring 5 */}
          <circle cx="120" cy="120" r="38" fill="none" stroke="#DB2777" strokeWidth="5" opacity="0.9" />
          
          {/* Ring 6 - Innermost dot */}
          <circle cx="120" cy="120" r="22" fill="#EC4899" />
          
          {/* Reflection arc */}
          <path 
            d="M 60 60 A 85 85 0 0 1 180 60" 
            fill="none" 
            stroke="white" 
            strokeWidth="3" 
            strokeLinecap="round"
            opacity="0.3" 
          />
        </svg>
      </div>
    </div>
  );
}
