export function Fuoco() {
  const bg = "#0C0404";
  const card = "#1A0808";
  const border = "#2E1010";
  const primary = "#EF4444";
  const accent = "#FB923C";
  const muted = "#1F0A0A";

  return (
    <div style={{ width: 390, minHeight: 844, background: bg, fontFamily: "Inter, sans-serif", position: "relative", overflow: "hidden" }}>
      {/* Background glow */}
      <div style={{ position: "absolute", top: -80, left: "50%", transform: "translateX(-50%)", width: 320, height: 320, background: `radial-gradient(circle, ${primary}33 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: 100, right: -60, width: 240, height: 240, background: `radial-gradient(circle, ${accent}22 0%, transparent 70%)`, pointerEvents: "none" }} />

      {/* Status bar */}
      <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 20px 0", color: "#fff", fontSize: 12, fontWeight: 600 }}>
        <span>9:41</span>
        <span style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span>●●●●</span><span>WiFi</span><span>100%</span>
        </span>
      </div>

      {/* Logo */}
      <div style={{ textAlign: "center", padding: "40px 0 10px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${primary}, ${accent})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontWeight: 900, fontSize: 18 }}>K</span>
          </div>
          <span style={{ color: "#fff", fontWeight: 800, fontSize: 26, letterSpacing: -0.5 }}>kapsul</span>
        </div>
        <p style={{ color: "#FCA5A5", fontSize: 13, marginTop: 6 }}>Cattura i tuoi momenti</p>
      </div>

      {/* Gradient banner */}
      <div style={{ margin: "20px 20px 0", borderRadius: 16, overflow: "hidden", height: 180, position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${primary}CC, ${accent}AA)` }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 6 }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(255,255,255,0.2)", border: "2px solid rgba(255,255,255,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 24 }}>📸</span>
          </div>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>Il tuo evento, i tuoi ricordi</span>
        </div>
      </div>

      {/* Login card */}
      <div style={{ margin: "20px 20px 0", background: card, borderRadius: 20, border: `1px solid ${border}`, padding: 20 }}>
        <h3 style={{ color: "#fff", fontWeight: 700, fontSize: 18, margin: "0 0 16px" }}>Accedi</h3>

        <div style={{ marginBottom: 12 }}>
          <label style={{ color: "#FCA5A5", fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>Email</label>
          <div style={{ background: muted, borderRadius: 12, padding: "12px 14px", border: `1px solid ${border}` }}>
            <span style={{ color: "#9CA3AF", fontSize: 14 }}>nome@email.com</span>
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ color: "#FCA5A5", fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>Password</label>
          <div style={{ background: muted, borderRadius: 12, padding: "12px 14px", border: `1px solid ${border}` }}>
            <span style={{ color: "#9CA3AF", fontSize: 14 }}>••••••••</span>
          </div>
        </div>

        <button style={{ width: "100%", padding: "14px", borderRadius: 14, border: "none", background: `linear-gradient(90deg, ${primary}, ${accent})`, color: "#fff", fontWeight: 700, fontSize: 16, cursor: "pointer" }}>
          Entra
        </button>

        <p style={{ textAlign: "center", color: "#FCA5A5", fontSize: 13, marginTop: 14 }}>Non hai un account? <span style={{ color: accent, fontWeight: 700 }}>Registrati</span></p>
      </div>

      {/* Palette chips */}
      <div style={{ margin: "24px 20px 0", display: "flex", gap: 8, alignItems: "center" }}>
        <span style={{ color: "#6B2020", fontSize: 11, fontWeight: 600 }}>PALETTE</span>
        {["#0C0404","#1A0808","#EF4444","#FB923C","#FCA5A5"].map((c, i) => (
          <div key={i} style={{ width: 24, height: 24, borderRadius: "50%", background: c, border: "2px solid rgba(255,255,255,0.15)" }} />
        ))}
        <span style={{ color: "#FB923C", fontSize: 11, fontWeight: 700, marginLeft: 4 }}>Fuoco · Rosso</span>
      </div>
    </div>
  );
}
