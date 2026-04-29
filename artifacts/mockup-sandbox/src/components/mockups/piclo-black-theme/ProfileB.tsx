const BG = "#000000";
const CARD = "#0D0D0D";
const BORDER = "#222222";
const FG = "#FFFFFF";
const MUTED = "#9CA3AF";
const G1 = "#6366F1";
const G_MID = "#8B5CF6";
const G2 = "#EC4899";

const evCards = [
  { name: "Matrimonio Luca & Sara", date: "14 Giu 2025", photos: 127, c1: "#6366F1", c2: "#8B5CF6" },
  { name: "Compleanno Marco 30", date: "2 Mag 2025", photos: 84, c1: "#EC4899", c2: "#F97316" },
  { name: "Aziendale TechCorp", date: "28 Apr 2025", photos: 43, c1: "#10B981", c2: "#059669" },
];

export function ProfileB() {
  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "Inter, sans-serif", position: "relative" }}>
      <div style={{ position: "relative", height: 210, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${G1}, ${G_MID}, ${G2})`, opacity: 0.9 }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 50%, #000000 100%)" }} />

        <button
          title="Impostazioni"
          style={{ position: "absolute", top: 54, right: 18, width: 40, height: 40, borderRadius: "50%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "18px", backdropFilter: "blur(8px)" }}
        >⚙️</button>

        <div style={{ position: "absolute", bottom: -28, left: 20, display: "flex", alignItems: "flex-end", gap: "14px" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", border: "3px solid #000", background: `linear-gradient(135deg, ${G1}80, ${G2}80)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", flexShrink: 0 }}>MR</div>
        </div>
      </div>

      <div style={{ padding: "38px 20px 0", marginBottom: "4px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "12px" }}>
          <div>
            <div style={{ color: FG, fontSize: "22px", fontWeight: 900, lineHeight: 1.1 }}>Marco Rossi</div>
            <div style={{ color: MUTED, fontSize: "13px", marginTop: "2px" }}>@marco.r</div>
            <div style={{ color: MUTED, fontSize: "12px", marginTop: "4px" }}>📸 Fotografo amatoriale · 🔗 marcor.me</div>
          </div>
          <button style={{ padding: "8px 16px", background: "transparent", border: `1px solid ${BORDER}`, borderRadius: "999px", color: FG, fontSize: "13px", fontWeight: 600, cursor: "pointer", flexShrink: 0, marginTop: "2px" }}>✏️ Modifica</button>
        </div>

        <div style={{ display: "flex", gap: "20px", padding: "12px 0", borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, marginBottom: "24px" }}>
          {[["127","foto"],["12","eventi"],["43","follower"],["8","seguiti"]].map(([n,l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ color: FG, fontSize: "17px", fontWeight: 800 }}>{n}</div>
              <div style={{ color: MUTED, fontSize: "11px" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: "12px" }}>
        <div style={{ color: MUTED, fontSize: "11px", fontWeight: 600, letterSpacing: "1px", marginBottom: "4px" }}>I MIEI EVENTI</div>
        {evCards.map((ev) => (
          <div key={ev.name} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "16px", overflow: "hidden", display: "flex" }}>
            <div style={{ width: 70, background: `linear-gradient(135deg, ${ev.c1}, ${ev.c2})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px" }}>📅</div>
            <div style={{ padding: "14px", flex: 1 }}>
              <div style={{ color: FG, fontSize: "14px", fontWeight: 700, marginBottom: "4px" }}>{ev.name}</div>
              <div style={{ color: MUTED, fontSize: "12px" }}>{ev.date}</div>
              <div style={{ marginTop: "6px", display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ color: G1, fontSize: "12px", fontWeight: 700 }}>{ev.photos}</span>
                <span style={{ color: MUTED, fontSize: "12px" }}>foto caricate</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ borderTop: `1px solid ${BORDER}`, padding: "10px 20px 20px", display: "flex", justifyContent: "space-around", background: "#050505", marginTop: "24px" }}>
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
