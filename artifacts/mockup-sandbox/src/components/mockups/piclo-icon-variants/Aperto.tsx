export function Aperto() {
  const cx = 200, cy = 200;
  const blade = "M334.5,145.7 A145,145 0 0,1 334.5,254.3 L274.3,234.6 L281.9,198.6 Z";
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
