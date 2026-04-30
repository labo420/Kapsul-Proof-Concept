export function Scatto() {
  const cx = 200, cy = 200;
  const blade = "M305.2,123.6 A130,130 0 0,1 305.2,276.4 L227.8,228.8 Q215.7,203.3 236.0,182.5 Z";
  const angles = [0, 72, 144, 216, 288];

  return (
    <div style={{ width: "100%", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f0f1a" }}>
      <svg viewBox="0 0 400 400" style={{ width: "90%", maxWidth: 340 }}>
        {angles.map((a) => (
          <path key={a} d={blade} fill="white" stroke="#0f0f1a" strokeWidth={2} transform={`rotate(${a} ${cx} ${cy})`} />
        ))}
        <circle cx={cx} cy={cy} r={5} fill="white" opacity={0.9} />
      </svg>
    </div>
  );
}
