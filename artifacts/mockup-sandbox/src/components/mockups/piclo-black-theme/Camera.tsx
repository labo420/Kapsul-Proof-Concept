const BG = "#000000";
const CARD = "#0D0D0D";
const BORDER = "#222222";
const FG = "#FFFFFF";
const MUTED = "#9CA3AF";
const G1 = "#6366F1";
const G_MID = "#8B5CF6";
const G2 = "#EC4899";
const GRADIENT = `linear-gradient(135deg, ${G1}, ${G_MID}, ${G2})`;
const GRADIENT_H = `linear-gradient(90deg, ${G1}, ${G_MID}, ${G2})`;

export function Camera() {
  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "Inter, sans-serif", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "56px 24px 0" }}>
        <div>
          <img src="/__mockup/images/piclo-logo-white.png" alt="Piclo" style={{ width: 100, height: 32, objectFit: "contain", display: "block" }} />
          <span style={{ color: MUTED, fontSize: "12px", marginTop: "2px", display: "block" }}>guest_a7f3k</span>
        </div>
        <button style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "999px", padding: "8px 14px", color: FG, fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
          ⊞ Partecipa
        </button>
      </div>

      <div style={{ padding: "32px 24px 0", textAlign: "center" }}>
        <div style={{ color: MUTED, fontSize: "14px", fontWeight: 600, marginBottom: "6px" }}>Matrimonio Luca & Sara</div>
        <div style={{ color: FG, fontSize: "60px", fontWeight: 800, letterSpacing: "-2px", fontFamily: "monospace", lineHeight: 1 }}>0084</div>
        <div style={{ height: "3px", background: GRADIENT_H, borderRadius: "2px", margin: "10px auto", width: "100px" }} />
        <div style={{ color: MUTED, fontSize: "12px" }}>foto caricate</div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px", gap: "14px" }}>
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "absolute", width: 150, height: 150, borderRadius: "50%", background: GRADIENT, opacity: 0.18, filter: "blur(24px)" }} />
          <button style={{
            position: "relative", width: 120, height: 120, borderRadius: "50%",
            background: GRADIENT, border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "48px",
            boxShadow: `0 0 40px ${G_MID}55`,
          }}>
            📷
          </button>
        </div>
        <div style={{ color: FG, fontSize: "18px", fontWeight: 700 }}>Scatta una foto</div>
        <div style={{ color: MUTED, fontSize: "14px", textAlign: "center", maxWidth: 200 }}>Tocca il pulsante per aprire la fotocamera</div>
      </div>

      <div style={{ padding: "0 24px 40px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "16px", padding: "14px", display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: 36, height: 36, borderRadius: "10px", background: `${G1}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>🖼️</div>
          <span style={{ color: FG, fontSize: "15px", flex: 1 }}>Carica dal rullino</span>
          <span style={{ color: MUTED }}>›</span>
        </div>
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "16px", padding: "14px", display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: 36, height: 36, borderRadius: "10px", background: `${G2}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>🎞️</div>
          <span style={{ color: FG, fontSize: "15px", flex: 1 }}>Vedi foto caricate</span>
          <span style={{ color: MUTED }}>›</span>
        </div>
      </div>

      <div style={{ borderTop: `1px solid ${BORDER}`, padding: "0 16px 16px", display: "flex", justifyContent: "space-around", paddingTop: "12px", background: "#050505" }}>
        {[["🏠","Home"], ["📅","Crea"], ["📷","Camera"], ["👤","Profilo"]].map(([icon, label], i) => (
          <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}>
            <div style={{ fontSize: "22px", filter: i === 2 ? `drop-shadow(0 0 8px ${G_MID})` : "none" }}>{icon}</div>
            <span style={{ fontSize: "10px", color: i === 2 ? G_MID : MUTED, fontWeight: i === 2 ? 700 : 500 }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
