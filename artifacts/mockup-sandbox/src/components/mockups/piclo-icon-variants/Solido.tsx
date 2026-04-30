export function Solido() {
  const cx = 200, cy = 200;
  const blade = "M257.3,92.2 A122,122 0 0,1 257.3,307.8 L219.5,248.2 A52,52 0 0,1 251.9,203.6 Z";
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
