export function Scatto() {
  const cx = 200, cy = 200;

  // Mask approach: 6 identical triangular slits cut from a white disc.
  // Since every slit is the same shape rotated by 60°, every blade is
  // geometrically equal — no stacking-order artifacts.
  //
  // Slit geometry (centred at 0°):
  //   outer arc  : ±6° at r=130  → 12° wide opening at the rim
  //   inner tip  : +40° lean CW  at r=45  → creates the rotational sweep
  //   central hole: r=28  → the small dark aperture at the centre
  const slit = "M329.3,186.4 A130,130 0 0,1 329.3,213.6 L234.5,228.9 Z";
  const angles = [0, 60, 120, 180, 240, 300];

  return (
    <div style={{ width: "100%", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f0f1a" }}>
      <svg viewBox="0 0 400 400" style={{ width: "90%", maxWidth: 340 }}>
        <defs>
          <mask id="aperture-mask">
            {/* solid white disc */}
            <circle cx={cx} cy={cy} r={130} fill="white" />
            {/* 6 identical slits — same shape rotated */}
            {angles.map((a) => (
              <path key={a} d={slit} fill="black" transform={`rotate(${a} ${cx} ${cy})`} />
            ))}
            {/* central aperture hole */}
            <circle cx={cx} cy={cy} r={28} fill="black" />
          </mask>
        </defs>
        <circle cx={cx} cy={cy} r={130} fill="white" mask="url(#aperture-mask)" />
      </svg>
    </div>
  );
}
