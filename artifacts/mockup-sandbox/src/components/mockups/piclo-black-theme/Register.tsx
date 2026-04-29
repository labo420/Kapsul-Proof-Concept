const BG = "#000000";
const CARD = "#0D0D0D";
const BORDER = "#222222";
const FG = "#FFFFFF";
const MUTED = "#9CA3AF";
const INPUT = "#111111";
const G1 = "#6366F1";
const G_MID = "#8B5CF6";
const G2 = "#EC4899";

function Field({ label, placeholder, type = "text" }: { label: string; placeholder: string; type?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
      <span style={{ color: MUTED, fontSize: "10px", fontWeight: 600, letterSpacing: "1.2px" }}>{label}</span>
      <div style={{ background: INPUT, border: `1px solid ${BORDER}`, borderRadius: "14px", padding: "13px 14px", display: "flex", alignItems: "center" }}>
        <input type={type} placeholder={placeholder} defaultValue="" style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: FG, fontSize: "15px" }} />
      </div>
    </div>
  );
}

export function Register() {
  return (
    <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "Inter, sans-serif", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", width: 280, height: 280, borderRadius: "50%", background: "rgba(99,102,241,0.28)", top: -60, left: -80, filter: "blur(60px)" }} />
      <div style={{ position: "absolute", width: 320, height: 320, borderRadius: "50%", background: "rgba(236,72,153,0.14)", bottom: -80, right: -100, filter: "blur(60px)" }} />
      <div style={{ width: "100%", maxWidth: 360, position: "relative", zIndex: 1 }}>
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "28px", padding: "24px 28px 28px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
            <img src="/__mockup/images/piclo-logo-white.png" alt="Piclo" style={{ width: 150, height: 44, objectFit: "contain" }} />
            <span style={{ color: MUTED, fontSize: "13px" }}>Crea il tuo account</span>
          </div>
          <Field label="NOME VISUALIZZATO" placeholder="Il tuo nome" />
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <span style={{ color: MUTED, fontSize: "10px", fontWeight: 600, letterSpacing: "1.2px" }}>USERNAME</span>
            <div style={{ background: INPUT, border: `1px solid #22C55E`, borderRadius: "14px", padding: "13px 14px", display: "flex", alignItems: "center" }}>
              <input placeholder="il_tuo_username" defaultValue="" style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: FG, fontSize: "15px" }} />
            </div>
            <span style={{ color: "#22C55E", fontSize: "12px" }}>✓ Username disponibile</span>
          </div>
          <Field label="EMAIL" placeholder="nome@esempio.com" type="email" />
          <Field label="PASSWORD" placeholder="Min. 6 caratteri" type="password" />
          <button style={{ width: "100%", padding: "15px", background: `linear-gradient(90deg, ${G1}, ${G_MID}, ${G2})`, border: "none", borderRadius: "999px", color: "#fff", fontSize: "16px", fontWeight: 700, cursor: "pointer" }}>
            Crea account →
          </button>
        </div>
        <div style={{ textAlign: "center", marginTop: "20px", color: MUTED, fontSize: "14px" }}>
          Hai già un account? <span style={{ color: FG, fontWeight: 600 }}>Accedi</span>
        </div>
      </div>
    </div>
  );
}
