export function Acuto() {
  const cx = 200, cy = 200;
  const blade = "M313.0,120.9 A138,138 0 0,1 313.0,279.1 L213.0,207.5 Z";
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
