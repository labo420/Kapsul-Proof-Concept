export function Spigolo() {
  const cx = 200, cy = 200;
  const blade = "M299.6,116.4 L299.6,283.6 L215,235 L232,188 Z";
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
