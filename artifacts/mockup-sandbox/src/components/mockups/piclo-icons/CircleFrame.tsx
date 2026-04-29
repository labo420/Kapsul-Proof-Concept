export function CircleFrame() {
  return (
    <div style={{ 
      width: 400, 
      height: 400, 
      backgroundColor: '#1a1a2e', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <div style={{ 
        width: 320, 
        height: 320, 
        backgroundColor: '#08060F', 
        borderRadius: 72, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
      }}>
        <svg width="320" height="320" viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="circleFrameGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>
          <rect 
            x="50" 
            y="50" 
            width="220" 
            height="220" 
            rx="28" 
            stroke="url(#circleFrameGradient)" 
            strokeWidth="8" 
            fill="none" 
          />
          <circle 
            cx="160" 
            cy="160" 
            r="62" 
            stroke="url(#circleFrameGradient)" 
            strokeWidth="8" 
            fill="none" 
          />
        </svg>
      </div>
    </div>
  );
}
