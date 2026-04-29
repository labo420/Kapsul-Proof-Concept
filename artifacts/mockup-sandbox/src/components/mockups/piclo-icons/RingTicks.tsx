import React from 'react';

export function RingTicks() {
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
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <svg width="320" height="320" viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>
          <circle cx="160" cy="160" r="90" stroke="url(#ringGrad)" strokeWidth="7" fill="none" />
          <line x1="160" y1="58" x2="160" y2="38" stroke="#6366F1" strokeWidth="7" strokeLinecap="round" />
          <line x1="262" y1="160" x2="282" y2="160" stroke="#9333EA" strokeWidth="7" strokeLinecap="round" />
          <line x1="160" y1="262" x2="160" y2="282" stroke="#EC4899" strokeWidth="7" strokeLinecap="round" />
          <line x1="58" y1="160" x2="38" y2="160" stroke="#9333EA" strokeWidth="7" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}
