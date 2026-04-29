const BG = "#000000";
const CARD = "#0D0D0D";
const BORDER = "#222222";
const FG = "#FFFFFF";
const MUTED = "#9CA3AF";
const INPUT = "#111111";
const G1 = "#6366F1";
const G_MID = "#8B5CF6";
const G2 = "#EC4899";

function GradientBtn({ label }: { label: string }) {
  return (
    <button
      style={{
        width: "100%",
        padding: "15px",
        background: `linear-gradient(90deg, ${G1}, ${G_MID}, ${G2})`,
        border: "none",
        borderRadius: "999px",
        color: "#fff",
        fontSize: "16px",
        fontWeight: 700,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
      }}
    >
      {label} →
    </button>
  );
}

function Field({ label, placeholder, type = "text" }: { label: string; placeholder: string; type?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <span style={{ color: MUTED, fontSize: "11px", fontWeight: 600, letterSpacing: "1.2px" }}>{label}</span>
      <div style={{
        background: INPUT, border: `1px solid ${BORDER}`, borderRadius: "14px",
        padding: "14px", display: "flex", alignItems: "center", gap: "10px",
      }}>
        <input
          type={type}
          placeholder={placeholder}
          defaultValue=""
          style={{
            flex: 1, background: "transparent", border: "none", outline: "none",
            color: FG, fontSize: "15px",
          }}
        />
      </div>
    </div>
  );
}

export function Login() {
  return (
    <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "Inter, sans-serif", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", width: 280, height: 280, borderRadius: "50%", background: "rgba(99,102,241,0.28)", top: -60, left: -80, filter: "blur(60px)" }} />
      <div style={{ position: "absolute", width: 320, height: 320, borderRadius: "50%", background: "rgba(236,72,153,0.14)", bottom: -80, right: -100, filter: "blur(60px)" }} />
      <div style={{ width: "100%", maxWidth: 360, position: "relative", zIndex: 1 }}>
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "28px", padding: "28px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <img src="/__mockup/images/piclo-logo-white.png" alt="Piclo" style={{ width: 150, height: 44, objectFit: "contain" }} />
            <span style={{ color: MUTED, fontSize: "13px", letterSpacing: "0.4px" }}>Capture the moment</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <Field label="EMAIL" placeholder="nome@esempio.com" type="email" />
            <Field label="PASSWORD" placeholder="••••••••" type="password" />
            <GradientBtn label="Accedi" />
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: "24px", color: MUTED, fontSize: "14px" }}>
          Non hai un account? <span style={{ color: FG, fontWeight: 600 }}>Creane uno</span>
        </div>
      </div>
    </div>
  );
}
