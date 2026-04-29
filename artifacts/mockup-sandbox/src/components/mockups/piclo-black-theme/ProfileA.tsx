const BG = "#000000";
const CARD = "#0D0D0D";
const BORDER = "#222222";
const FG = "#FFFFFF";
const MUTED = "#9CA3AF";
const G1 = "#6366F1";
const G_MID = "#8B5CF6";
const G2 = "#EC4899";
const GRAD = `linear-gradient(135deg, ${G1}, ${G_MID}, ${G2})`;
const GRAD_H = `linear-gradient(90deg, ${G1}, ${G_MID}, ${G2})`;

const events = [
  { name: "Matrimonio L&S", grad: `linear-gradient(135deg, #6366F1, #8B5CF6)`, photos: 127 },
  { name: "Compleanno 30", grad: `linear-gradient(135deg, #EC4899, #F97316)`, photos: 84 },
  { name: "Aziendale", grad: `linear-gradient(135deg, #10B981, #059669)`, photos: 43 },
  { name: "Estate 2025", grad: `linear-gradient(135deg, #F59E0B, #EF4444)`, photos: 62 },
];

const photos = [
  "#1a1035", "#0d1a2e", "#1a0d1e", "#0d2018",
  "#2e1a0d", "#1a1a0d", "#0d1a2e", "#1a0d2e",
];

export function ProfileA() {
  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "Inter, sans-serif", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "54px 20px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: GRAD, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>MR</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: FG, fontSize: "17px", fontWeight: 800, lineHeight: 1.2 }}>Marco Rossi</div>
            <div style={{ color: MUTED, fontSize: "13px" }}>@marco.r · marcor.me</div>
          </div>
          <button
            title="Impostazioni"
            style={{ width: 40, height: 40, borderRadius: "50%", background: CARD, border: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "18px", flexShrink: 0 }}
          >⚙️</button>
        </div>

        <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
          {[["📷", "127", "Foto"], ["📅", "12", "Eventi"], ["👥", "43", "Follower"]].map(([icon, n, l]) => (
            <div key={l} style={{ flex: 1, background: CARD, border: `1px solid ${BORDER}`, borderRadius: "14px", padding: "10px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}>
              <span style={{ fontSize: "16px" }}>{icon}</span>
              <span style={{ color: FG, fontSize: "16px", fontWeight: 800 }}>{n}</span>
              <span style={{ color: MUTED, fontSize: "11px" }}>{l}</span>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
          <button style={{ flex: 1, padding: "10px", background: `${G1}22`, border: `1px solid ${G1}60`, borderRadius: "999px", color: FG, fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>✏️ Modifica profilo</button>
          <button style={{ flex: 1, padding: "10px", background: CARD, border: `1px solid ${BORDER}`, borderRadius: "999px", color: MUTED, fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>👤 Condividi</button>
        </div>
      </div>

      <div style={{ paddingBottom: "4px" }}>
        <div style={{ padding: "0 20px 10px", color: MUTED, fontSize: "11px", fontWeight: 600, letterSpacing: "1px" }}>EVENTI IN EVIDENZA</div>
        <div style={{ display: "flex", gap: "10px", padding: "0 20px", overflowX: "auto", paddingBottom: "16px" }}>
          {events.map((ev) => (
            <div key={ev.name} style={{ flexShrink: 0, width: 110 }}>
              <div style={{ width: 110, height: 80, borderRadius: "14px", background: ev.grad, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginBottom: "6px" }}>
                <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "22px" }}>📅</span>
                <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "10px", marginTop: "2px" }}>{ev.photos} foto</span>
              </div>
              <div style={{ color: FG, fontSize: "12px", fontWeight: 600, textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ev.name}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "0 20px", flex: 1 }}>
        <div style={{ color: MUTED, fontSize: "11px", fontWeight: 600, letterSpacing: "1px", marginBottom: "10px" }}>FOTO RECENTI</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
          {photos.map((bg, i) => (
            <div key={i} style={{ aspectRatio: "1", borderRadius: "12px", background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "rgba(255,255,255,0.15)", fontSize: "24px" }}>📷</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ borderTop: `1px solid ${BORDER}`, padding: "10px 20px 20px", display: "flex", justifyContent: "space-around", background: "#050505", marginTop: "16px" }}>
        {[["🏠","Home"],["📅","Crea"],["📷","Camera"],["👤","Profilo"]].map(([ico, lbl], i) => (
          <div key={lbl} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}>
            <div style={{ fontSize: "22px", filter: i === 3 ? `drop-shadow(0 0 6px ${G_MID})` : "none" }}>{ico}</div>
            <span style={{ fontSize: "10px", color: i === 3 ? G_MID : MUTED, fontWeight: i === 3 ? 700 : 500 }}>{lbl}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
