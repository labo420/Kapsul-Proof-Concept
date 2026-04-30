export function Iride() {
  const cx = 200, cy = 200;
  const blade = "M291.9,108.1 A130,130 0 0,1 291.9,291.9 L209.8,236.7 A38,38 0 0,1 236.7,190.2 Z";
  const angles = [0, 60, 120, 180, 240, 300];

  return (
    <div style={{ width: "100%", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f0f1a" }}>
      <svg viewBox="0 0 400 400" style={{ width: "90%", maxWidth: 340 }}>
        {angles.map((a) => (
          <path key={a} d={blade} fill="white" stroke="#0f0f1a" strokeWidth={2} transform={`rotate(${a} ${cx} ${cy})`} />
        ))}
        <circle cx={cx} cy={cy} r={6} fill="white" opacity={0.95} />
      </svg>
    </div>
  );
}
