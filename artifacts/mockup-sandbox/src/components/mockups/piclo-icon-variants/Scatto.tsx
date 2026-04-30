export function Scatto() {
  const cx = 200, cy = 200;
  const blade = "M265.0,87.4 A130,130 0 0,1 324.4,238.0 L224.0,241.6 Q202.0,207.0 237.6,186.3 Z";
  const angles = [0, 72, 144, 216, 288];

  return (
    <div style={{ width: "100%", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f0f1a" }}>
      <svg viewBox="0 0 400 400" style={{ width: "90%", maxWidth: 340 }}>
        {angles.map((a) => (
          <path key={a} d={blade} fill="white" stroke="#0f0f1a" strokeWidth={2} transform={`rotate(${a} ${cx} ${cy})`} />
        ))}
      </svg>
    </div>
  );
}
