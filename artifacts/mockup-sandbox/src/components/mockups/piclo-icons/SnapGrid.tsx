import React from 'react';

export default function SnapGrid() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '400px',
      height: '400px',
      backgroundColor: '#1a1a2e',
      margin: '0',
      padding: '0'
    }}>
      <div style={{
        width: '320px',
        height: '320px',
        backgroundColor: '#08060F',
        borderRadius: '72px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.05)'
      }}>
        <svg
          width="320"
          height="320"
          viewBox="0 0 320 320"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="snapgrid-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
            
            <filter id="snapgrid-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Outer Border Rectangle (210x210) */}
          <rect
            x="55"
            y="55"
            width="210"
            height="210"
            fill="none"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="2"
          />

          {/* Grid Lines (Stop 2px inside border, so from 57 to 263) */}
          {/* Vertical 1 */}
          <line x1="125" y1="57" x2="125" y2="263" stroke="rgba(255, 255, 255, 0.18)" strokeWidth="1.5" />
          {/* Vertical 2 */}
          <line x1="195" y1="57" x2="195" y2="263" stroke="rgba(255, 255, 255, 0.18)" strokeWidth="1.5" />
          {/* Horizontal 1 */}
          <line x1="57" y1="125" x2="263" y2="125" stroke="rgba(255, 255, 255, 0.18)" strokeWidth="1.5" />
          {/* Horizontal 2 */}
          <line x1="57" y1="195" x2="263" y2="195" stroke="rgba(255, 255, 255, 0.18)" strokeWidth="1.5" />

          {/* L-Bracket Corners */}
          {/* Top-Left */}
          <path d="M 55 65 L 55 55 L 65 55" fill="none" stroke="#6366F1" strokeWidth="3" filter="url(#snapgrid-glow)" />
          {/* Top-Right */}
          <path d="M 255 55 L 265 55 L 265 65" fill="none" stroke="#6366F1" strokeWidth="3" filter="url(#snapgrid-glow)" />
          {/* Bottom-Left */}
          <path d="M 55 255 L 55 265 L 65 265" fill="none" stroke="#EC4899" strokeWidth="3" filter="url(#snapgrid-glow)" />
          {/* Bottom-Right */}
          <path d="M 265 255 L 265 265 L 255 265" fill="none" stroke="#EC4899" strokeWidth="3" filter="url(#snapgrid-glow)" />

          {/* Intersection Power Points */}
          {/* Top-Left */}
          <circle cx="125" cy="125" r="5" fill="#6366F1" filter="url(#snapgrid-glow)" />
          {/* Bottom-Right */}
          <circle cx="195" cy="195" r="5" fill="#6366F1" filter="url(#snapgrid-glow)" />
          {/* Top-Right */}
          <circle cx="195" cy="125" r="5" fill="#EC4899" filter="url(#snapgrid-glow)" />
          {/* Bottom-Left */}
          <circle cx="125" cy="195" r="5" fill="#EC4899" filter="url(#snapgrid-glow)" />

          {/* Center Dot */}
          <circle cx="160" cy="160" r="2" fill="#FFFFFF" filter="url(#snapgrid-glow)" />
        </svg>
      </div>
    </div>
  );
}
