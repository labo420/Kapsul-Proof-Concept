export function Ottica() {
  const cx = 200, cy = 200;
  const blade = "M283.4,116.6 A118,118 0 0,1 283.4,283.4 L209.1,233.8 A35,35 0 0,1 233.8,190.9 Z";
  const angles = [0, 60, 120, 180, 240, 300];

  return (
    <div style={{ width: "100%", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f0f1a" }}>
      <svg viewBox="0 0 400 400" style={{ width: "90%", maxWidth: 340 }}>
        <circle cx={cx} cy={cy} r={152} fill="none" stroke="white" strokeWidth={3} opacity={0.65} />
        <circle cx={cx} cy={cy} r={105} fill="none" stroke="white" strokeWidth={1} opacity={0.15} />
        {angles.map((a) => (
          <path key={a} d={blade} fill="white" stroke="#0f0f1a" strokeWidth={2} transform={`rotate(${a} ${cx} ${cy})`} />
        ))}
        <circle cx={cx} cy={cy} r={6} fill="white" opacity={0.95} />
      </svg>
    </div>
  );
}
