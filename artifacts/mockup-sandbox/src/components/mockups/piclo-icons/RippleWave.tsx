import React from 'react';

export default function RippleWave() {
  return (
    <div style={{
      width: '100%',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#1a1a2e',
      margin: 0,
      padding: 0
    }}>
      <div style={{
        width: 320,
        height: 320,
        borderRadius: 72,
        backgroundColor: '#08060F',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <svg width="320" height="320" viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="blur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="8" />
            </filter>
          </defs>
          
          {/* Shadow for center dot */}
          <circle cx="160" cy="160" r="14" fill="#EC4899" opacity="0.5" filter="url(#blur)" />

          {/* Ellipses */}
          <ellipse cx="160" cy="160" rx="126" ry="105" fill="none" stroke="#4338CA" strokeWidth="2" opacity="0.3" />
          <ellipse cx="160" cy="160" rx="102" ry="85" fill="none" stroke="#6366F1" strokeWidth="3" />
          <ellipse cx="160" cy="160" rx="78" ry="65" fill="none" stroke="#9333EA" strokeWidth="4" />
          <ellipse cx="160" cy="160" rx="54" ry="45" fill="none" stroke="#C026D3" strokeWidth="5" />
          <ellipse cx="160" cy="160" rx="30" ry="25" fill="none" stroke="#EC4899" strokeWidth="6" />

          {/* Center dot */}
          <circle cx="160" cy="160" r="7" fill="#EC4899" />
        </svg>
      </div>
    </div>
  );
}
