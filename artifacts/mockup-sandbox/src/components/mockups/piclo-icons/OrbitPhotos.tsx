export default function OrbitPhotos() {
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
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <svg 
          width="320" 
          height="320" 
          viewBox="-160 -160 320 320"
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          <defs>
            <linearGradient id="orbit-grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
            <linearGradient id="orbit-grad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EC4899" />
              <stop offset="100%" stopColor="#F97316" />
            </linearGradient>
            <linearGradient id="orbit-grad3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#6366F1" />
            </linearGradient>
          </defs>

          {/* Center circle */}
          <circle cx="0" cy="0" r="30" fill="#6366F1" />

          {/* Rotating group */}
          <g style={{ transformOrigin: '0 0', animation: 'spin 20s linear infinite' }}>
            {/* Orbit ring */}
            <circle cx="0" cy="0" r="100" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeDasharray="4 6" />

            {/* Tile 1 (-90 deg) */}
            <rect x="-26" y="-126" width="52" height="52" rx="10" fill="url(#orbit-grad1)" style={{ animation: 'spin-reverse 20s linear infinite', transformOrigin: '0px -100px' }} />
            
            {/* Tile 2 (30 deg) -> x: 86.6, y: 50 */}
            <rect x="60.6" y="24" width="52" height="52" rx="10" fill="url(#orbit-grad2)" style={{ animation: 'spin-reverse 20s linear infinite', transformOrigin: '86.6px 50px' }} />

            {/* Tile 3 (150 deg) -> x: -86.6, y: 50 */}
            <rect x="-112.6" y="24" width="52" height="52" rx="10" fill="url(#orbit-grad3)" style={{ animation: 'spin-reverse 20s linear infinite', transformOrigin: '-86.6px 50px' }} />
          </g>
        </svg>
        <style>
          {`
            @keyframes spin {
              100% { transform: rotate(360deg); }
            }
            @keyframes spin-reverse {
              100% { transform: rotate(-360deg); }
            }
          `}
        </style>
      </div>
    </div>
  );
}
