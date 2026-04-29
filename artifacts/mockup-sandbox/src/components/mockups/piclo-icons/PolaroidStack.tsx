import React from 'react';

export function PolaroidStack() {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '400px',
    height: '400px',
    backgroundColor: '#1a1a2e',
    fontFamily: 'sans-serif',
  };

  const iconStyle: React.CSSProperties = {
    position: 'relative',
    width: '320px',
    height: '320px',
    backgroundColor: '#08060F',
    borderRadius: '72px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.1)',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const polaroidBaseStyle: React.CSSProperties = {
    position: 'absolute',
    width: '150px',
    height: '180px',
    backgroundColor: '#ffffff',
    borderRadius: '6px',
    padding: '10px 10px 36px 10px',
    boxSizing: 'border-box',
    boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
    transformOrigin: 'center center',
  };

  const photoStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    borderRadius: '2px',
  };

  return (
    <div style={containerStyle}>
      <div style={iconStyle}>
        {/* Back Frame */}
        <div
          style={{
            ...polaroidBaseStyle,
            transform: 'translate(-30px, 10px) rotate(-12deg)',
            zIndex: 1,
          }}
        >
          <div
            style={{
              ...photoStyle,
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
            }}
          />
        </div>

        {/* Middle Frame */}
        <div
          style={{
            ...polaroidBaseStyle,
            transform: 'translate(30px, -20px) rotate(8deg)',
            zIndex: 2,
          }}
        >
          <div
            style={{
              ...photoStyle,
              background: 'linear-gradient(135deg, #EC4899, #F97316)',
            }}
          />
        </div>

        {/* Front Frame */}
        <div
          style={{
            ...polaroidBaseStyle,
            transform: 'translate(0px, 15px) rotate(-2deg)',
            zIndex: 3,
            boxShadow: '0 12px 32px rgba(0,0,0,0.6)',
          }}
        >
          <div
            style={{
              ...photoStyle,
              background: 'linear-gradient(135deg, #06B6D4, #6366F1)',
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default PolaroidStack;