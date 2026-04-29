import React from 'react';

export function CrystalPrism() {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#1a1a2e',
      margin: 0,
      padding: 0,
    }}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Lilita+One&display=swap');
          body { margin: 0; padding: 0; overflow: hidden; }
        `}
      </style>
      <div style={{
        width: 320,
        height: 320,
        borderRadius: 72,
        backgroundColor: '#08060F',
        boxShadow: '0 24px 48px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Geometric Crystal Made of Polygons */}
        <svg 
          width="160" 
          height="160" 
          viewBox="0 0 100 100" 
          style={{ 
            filter: 'drop-shadow(0px 10px 20px rgba(99,102,241,0.4))',
            marginTop: '-10px'
          }}
        >
          {/* Top Left Facet */}
          <polygon points="50,5 15,35 50,45" fill="#EC4899" />
          {/* Top Right Facet */}
          <polygon points="50,5 85,35 50,45" fill="#D946EF" />
          
          {/* Middle Left Facet */}
          <polygon points="15,35 5,55 50,45" fill="#A855F7" />
          {/* Middle Right Facet */}
          <polygon points="85,35 95,55 50,45" fill="#8B5CF6" />
          
          {/* Bottom Left Facet */}
          <polygon points="5,55 50,95 50,45" fill="#6366F1" />
          {/* Bottom Right Facet */}
          <polygon points="95,55 50,95 50,45" fill="#4F46E5" />
          
          {/* Center/Highlight Facets */}
          <polygon points="50,5 35,35 50,45" fill="#FFFFFF" opacity="0.3" />
          <polygon points="50,5 50,45 65,35" fill="#FFFFFF" opacity="0.1" />
          <polygon points="15,35 35,35 50,45" fill="#FFFFFF" opacity="0.15" />
          
          {/* Bottom highlights */}
          <polygon points="5,55 25,65 50,45" fill="#FFFFFF" opacity="0.1" />
        </svg>

        <div style={{
          fontFamily: "'Lilita One', cursive",
          color: 'white',
          fontSize: '32px',
          marginTop: '12px',
          letterSpacing: '1.5px',
          textShadow: '0 2px 8px rgba(0,0,0,0.5)'
        }}>
          piclo
        </div>
      </div>
    </div>
  );
}
