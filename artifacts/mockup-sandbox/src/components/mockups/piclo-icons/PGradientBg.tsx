export function PGradientBg() {
  return (
    <div style={{
      width: '400px',
      height: '400px',
      backgroundColor: '#1a1a2e',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        width: '320px',
        height: '320px',
        background: 'linear-gradient(135deg, #6366F1 0%, #9333EA 50%, #EC4899 100%)',
        borderRadius: '72px',
        boxShadow: 'inset 0 2px 20px rgba(255,255,255,0.15), 0 20px 40px rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <span
          className="font-['Lilita_One']"
          style={{
            fontSize: '190px',
            color: '#ffffff',
            lineHeight: 1,
            paddingTop: '12px',
          }}
        >
          P
        </span>
      </div>
    </div>
  );
}
