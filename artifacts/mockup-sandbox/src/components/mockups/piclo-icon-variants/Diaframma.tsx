export function Diaframma() {
  const cx = 200, cy = 200;
  const blade = "M283.6,100.4 A130,130 0 0,1 283.6,299.6 L201.0,211.9 A12,12 0 0,1 211.6,196.9 Z";
  const angles = [0, 45, 90, 135, 180, 225, 270, 315];

  return (
    <div style={{ width: "100%", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f0f1a" }}>
      <svg viewBox="0 0 400 400" style={{ width: "90%", maxWidth: 340 }}>
        {angles.map((a) => (
          <path
            key={a}
            d={blade}
            fill="white"
            opacity={0.85}
            stroke="rgba(255,255,255,0.2)"
            strokeWidth={0.6}
            transform={`rotate(${a} ${cx} ${cy})`}
          />
        ))}
      </svg>
    </div>
  );
}
