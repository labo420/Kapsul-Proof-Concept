const BG = "#000000";
const CARD = "#0D0D0D";
const BORDER = "#222222";
const FG = "#FFFFFF";
const MUTED = "#9CA3AF";
const G1 = "#6366F1";
const G_MID = "#8B5CF6";
const G2 = "#EC4899";

export function Guest() {
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
        <div style={{ color: MUTED, fontSize: "15px", fontWeight: 600, marginBottom: "8px" }}>Matrimonio Luca & Sara</div>
        <div style={{ color: FG, fontSize: "64px", fontWeight: 800, letterSpacing: "-2px", fontFamily: "monospace" }}>0084</div>
        <div style={{ height: "3px", background: `linear-gradient(90deg, ${G1}, ${G2})`, borderRadius: "2px", margin: "12px auto", width: "120px" }} />
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px", gap: "16px" }}>
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "absolute", width: 130, height: 130, borderRadius: "50%", background: `linear-gradient(135deg, ${G1}50, ${G2}50)`, filter: "blur(20px)" }} />
          <button style={{ position: "relative", width: 120, height: 120, borderRadius: "50%", background: `linear-gradient(135deg, ${G1}, ${G_MID}, ${G2})`, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "44px" }}>
            📷
          </button>
        </div>
        <div style={{ color: FG, fontSize: "18px", fontWeight: 700 }}>Scatta una foto</div>
        <div style={{ color: MUTED, fontSize: "14px" }}>Tocca per aprire la fotocamera</div>
      </div>

      <div style={{ padding: "0 24px 40px", display: "flex", flexDirection: "column", gap: "12px" }}>
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "16px", padding: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ color: G1, fontSize: "20px" }}>🖼️</span>
          <span style={{ color: FG, fontSize: "15px", flex: 1 }}>Carica dal rullino</span>
          <span style={{ color: MUTED }}>›</span>
        </div>
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "16px", padding: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ color: G2, fontSize: "20px" }}>🎞️</span>
          <span style={{ color: FG, fontSize: "15px", flex: 1 }}>Vedi foto caricate</span>
          <span style={{ color: MUTED }}>›</span>
        </div>
      </div>
    </div>
  );
}
