export function Lamella() {
  const cx = 200, cy = 200;
  const blade = "M268.9,89.8 A130,130 0 0,1 268.9,310.2 L202.2,261.9 A62,62 0 0,1 254.7,170.9 Z";
  const angles = [0, 90, 180, 270];

  return (
    <div style={{ width: "100%", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f0f1a" }}>
      <svg viewBox="0 0 400 400" style={{ width: "90%", maxWidth: 340 }}>
        {angles.map((a) => (
          <path key={a} d={blade} fill="white" transform={`rotate(${a} ${cx} ${cy})`} />
        ))}
        <circle cx={cx} cy={cy} r={62} fill="none" stroke="white" strokeWidth={1.5} opacity={0.2} />
      </svg>
    </div>
  );
}
