import React from 'react';

export default function FlashBolt() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100vw',
      height: '100vh',
      backgroundColor: '#1a1a2e',
      margin: 0,
      padding: 0,
    }}>
      <div style={{
        width: 320,
        height: 320,
        backgroundColor: '#08060F',
        borderRadius: 72,
        boxShadow: '0 24px 48px rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <svg width="320" height="320" viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="boltGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="16" result="blur" />
            </filter>
          </defs>
          
          {/* Glow */}
          <path 
            d="M 185 70 L 105 170 H 155 L 135 250 L 215 150 H 165 L 185 70 Z" 
            fill="url(#boltGradient)" 
            filter="url(#glow)"
            opacity="0.6"
          />
          
          {/* Bolt */}
          <path 
            d="M 185 70 L 105 170 H 155 L 135 250 L 215 150 H 165 L 185 70 Z" 
            fill="url(#boltGradient)" 
          />
        </svg>
      </div>
    </div>
  );
}
