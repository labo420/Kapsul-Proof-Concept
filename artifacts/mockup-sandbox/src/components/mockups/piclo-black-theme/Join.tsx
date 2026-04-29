const BG = "#000000";
const BORDER = "#222222";
const FG = "#FFFFFF";
const MUTED = "#9CA3AF";
const G1 = "#6366F1";
const G_MID = "#8B5CF6";
const G2 = "#EC4899";

export function Join() {
  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "Inter, sans-serif", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, background: `${G1}0F`, pointerEvents: "none" }} />

      <div style={{ padding: "56px 24px 8px" }}>
        <img src="/__mockup/images/piclo-logo-white.png" alt="Piclo" style={{ width: 100, height: 32, objectFit: "contain" }} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 32px", gap: "24px", position: "relative", zIndex: 1 }}>
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "absolute", width: 120, height: 120, borderRadius: "50%", background: `linear-gradient(135deg, ${G1}, ${G_MID}, ${G2})`, opacity: 0.25, filter: "blur(10px)" }} />
          <div style={{ position: "relative", width: 40, height: 40, borderRadius: "50%", border: `3px solid ${G1}`, borderTop: `3px solid transparent` }} />
        </div>

        <div style={{ textAlign: "center" }}>
          <div style={{ color: FG, fontSize: "22px", fontWeight: 800, marginBottom: "8px" }}>Accesso in corso…</div>
          <div style={{ color: MUTED, fontSize: "14px", lineHeight: 1.5 }}>Stiamo unendoti all'evento, un momento</div>
        </div>

        <div style={{ background: `${G1}22`, border: `1px solid ${G1}44`, borderRadius: "14px", padding: "16px", width: "100%", maxWidth: "320px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg, ${G1}, ${G_MID}, ${G2})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>🎉</div>
            <div>
              <div style={{ color: FG, fontSize: "14px", fontWeight: 600 }}>Matrimonio Luca & Sara</div>
              <div style={{ color: MUTED, fontSize: "12px" }}>14 Giugno 2026</div>
            </div>
          </div>
          <div style={{ marginTop: "12px", height: "4px", background: BORDER, borderRadius: "2px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: "60%", background: `linear-gradient(90deg, ${G1}, ${G_MID}, ${G2})`, borderRadius: "2px" }} />
          </div>
          <div style={{ color: MUTED, fontSize: "11px", marginTop: "6px" }}>127 foto · Piano Party</div>
        </div>
      </div>
    </div>
  );
}
