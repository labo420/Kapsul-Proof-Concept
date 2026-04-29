import React from 'react';

export default function InfinityLoop() {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: '#1a1a2e',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: 0,
      padding: 0
    }}>
      <div style={{
        width: 320,
        height: 320,
        backgroundColor: '#08060F',
        borderRadius: 72,
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), inset 0 1px 2px rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <svg width="320" height="320" viewBox="0 0 320 320" style={{ position: 'absolute' }}>
          <defs>
            <linearGradient id="infGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="50%" stopColor="#9333EA" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
            <filter id="glowBlur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="18" result="blur" />
            </filter>
          </defs>
          
          {/* Glow Path */}
          <path 
            d="M 60,160 C 60,90 130,90 160,160 C 190,230 260,230 260,160 C 260,90 190,90 160,160 C 130,230 60,230 60,160 Z" 
            fill="none" 
            stroke="url(#infGrad)" 
            strokeWidth="22" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            filter="url(#glowBlur)"
            opacity="0.3"
          />

          {/* Main Path */}
          <path 
            d="M 60,160 C 60,90 130,90 160,160 C 190,230 260,230 260,160 C 260,90 190,90 160,160 C 130,230 60,230 60,160 Z" 
            fill="none" 
            stroke="url(#infGrad)" 
            strokeWidth="22" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
