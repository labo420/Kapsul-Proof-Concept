export function Scatto() {
  const cx = 200, cy = 200;
  const blade = "M299.6,116.4 A130,130 0 0,1 299.6,283.6 L214.8,231.7 Q215.2,207.1 233.8,190.9 Z";
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
