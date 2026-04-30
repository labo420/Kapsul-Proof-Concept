export function Esposizione() {
  const cx = 200, cy = 200;
  const blade = "M291.9,108.1 A130,130 0 0,1 291.9,291.9 L216.1,259.9 A62,62 0 0,1 259.9,183.9 Z";
  const angles = [0, 60, 120, 180, 240, 300];
  const rayAngles = [0, 45, 90, 135, 180, 225, 270, 315];

  return (
    <div style={{ width: "100%", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f0f1a" }}>
      <svg viewBox="0 0 400 400" style={{ width: "90%", maxWidth: 340 }}>
        {angles.map((a) => (
          <path key={a} d={blade} fill="white" transform={`rotate(${a} ${cx} ${cy})`} />
        ))}
        {rayAngles.map((a) => {
          const toRad = (d: number) => d * Math.PI / 180;
          const x1 = cx + 143 * Math.cos(toRad(a));
          const y1 = cy + 143 * Math.sin(toRad(a));
          const x2 = cx + 162 * Math.cos(toRad(a));
          const y2 = cy + 162 * Math.sin(toRad(a));
          return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth={2} strokeLinecap="round" opacity={0.38} />;
        })}
        <circle cx={cx} cy={cy} r={7} fill="white" opacity={0.95} />
      </svg>
    </div>
  );
}
