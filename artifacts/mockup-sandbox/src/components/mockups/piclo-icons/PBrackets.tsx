export function PBrackets() {
  return (
    <div style={{
      width: '400px',
      height: '400px',
      backgroundColor: '#1a1a2e',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Lilita+One&display=swap');`}</style>
      <div style={{
        width: '320px',
        height: '320px',
        backgroundColor: '#08060F',
        borderRadius: '72px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
        <span
          style={{
            fontFamily: "'Lilita One', cursive",
            fontSize: '148px',
            color: 'white',
            lineHeight: 1,
            position: 'relative',
            zIndex: 2,
            paddingTop: '12px',
            userSelect: 'none',
          }}
        >
          p
        </span>
        <svg
          width="320"
          height="320"
          style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}
          fill="none"
        >
          <defs>
            <linearGradient id="bracketGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>
          <path
            d="M 65 103 L 65 65 L 103 65
               M 217 65 L 255 65 L 255 103
               M 255 217 L 255 255 L 217 255
               M 103 255 L 65 255 L 65 217"
            stroke="url(#bracketGrad)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
