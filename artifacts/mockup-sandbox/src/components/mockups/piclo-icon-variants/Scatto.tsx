export function Scatto() {
  const cx = 200, cy = 200;
  // 6-blade rotating aperture (Aperture-style)
  // Outer CW arc: ±42° at r=130 (84° span, 24° overlap between blades)
  // Inner CCW arc: offset +45° forward, at r=40 — creates the concave scallop
  const blade = "M296.6,113.0 A130,130 0 0,1 296.6,287.0 L202.1,239.9 A40,40 0 0,0 239.9,202.1 Z";
  const angles = [0, 60, 120, 180, 240, 300];

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
