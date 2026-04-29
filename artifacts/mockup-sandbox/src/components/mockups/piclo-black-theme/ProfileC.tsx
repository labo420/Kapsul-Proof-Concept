const BG = "#000000";
const CARD = "#0D0D0D";
const BORDER = "#222222";
const FG = "#FFFFFF";
const MUTED = "#9CA3AF";
const G1 = "#6366F1";
const G_MID = "#8B5CF6";
const G2 = "#EC4899";

const evFeed = [
  { name: "Matrimonio Luca & Sara", date: "14 Giu 2025", plan: "Pro", photos: 127, bg: "linear-gradient(135deg, #1a1035, #2d1b4e)" },
  { name: "Compleanno Marco 30", date: "2 Mag 2025", plan: "Party", photos: 84, bg: "linear-gradient(135deg, #2e0d1a, #4e1b30)" },
  { name: "Aziendale TechCorp", date: "28 Apr 2025", plan: "Party", photos: 43, bg: "linear-gradient(135deg, #0d2018, #1b4e30)" },
];

export function ProfileC() {
  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "Inter, sans-serif" }}>
      <div style={{ padding: "54px 24px 20px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ width: 44, height: 44, borderRadius: "14px", background: `linear-gradient(135deg, ${G1}, ${G_MID}, ${G2})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: 900, color: "#fff", flexShrink: 0 }}>MR</div>
            <div>
              <div style={{ color: FG, fontSize: "28px", fontWeight: 900, lineHeight: 1, letterSpacing: "-0.5px" }}>Marco Rossi</div>
              <div style={{ color: MUTED, fontSize: "13px", marginTop: "3px" }}>@marco.r</div>
            </div>
          </div>
          <button
            title="Impostazioni"
            style={{ width: 38, height: 38, borderRadius: "12px", background: CARD, border: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "17px", flexShrink: 0, marginTop: "4px" }}
          >⚙️</button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
          <span style={{ background: `${G1}22`, color: G1, borderRadius: "999px", padding: "4px 12px", fontSize: "12px", fontWeight: 700, border: `1px solid ${G1}44` }}>12 eventi</span>
          <span style={{ color: BORDER }}>·</span>
          <span style={{ background: `${G_MID}22`, color: G_MID, borderRadius: "999px", padding: "4px 12px", fontSize: "12px", fontWeight: 700, border: `1px solid ${G_MID}44` }}>127 foto</span>
          <span style={{ color: BORDER }}>·</span>
          <span style={{ background: "#22222222", color: MUTED, borderRadius: "999px", padding: "4px 12px", fontSize: "12px", fontWeight: 700, border: `1px solid ${BORDER}` }}>43 follower</span>
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <button style={{ flex: 1, padding: "10px", background: `${G1}22`, border: `1px solid ${G1}60`, borderRadius: "14px", color: FG, fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>✏️ Modifica profilo</button>
          <button style={{ flex: 1, padding: "10px", background: CARD, border: `1px solid ${BORDER}`, borderRadius: "14px", color: MUTED, fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>+ Nuovo evento</button>
        </div>
      </div>

      <div style={{ borderTop: `1px solid ${BORDER}`, padding: "20px 24px 0" }}>
        <div style={{ color: MUTED, fontSize: "11px", fontWeight: 600, letterSpacing: "1px", marginBottom: "14px" }}>I TUOI EVENTI</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {evFeed.map((ev) => (
            <div key={ev.name} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "18px", overflow: "hidden" }}>
              <div style={{ height: 120, background: ev.bg, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "rgba(255,255,255,0.15)", fontSize: "40px" }}>📷</span>
                <span style={{
                  position: "absolute", top: 10, right: 10,
                  background: ev.plan === "Pro" ? `linear-gradient(90deg, ${G1}, ${G_MID})` : `${G2}33`,
                  color: ev.plan === "Pro" ? "#fff" : G2,
                  borderRadius: "8px", padding: "3px 9px", fontSize: "11px", fontWeight: 700,
                  border: ev.plan === "Pro" ? "none" : `1px solid ${G2}44`,
                }}>{ev.plan}</span>
              </div>
              <div style={{ padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ color: FG, fontSize: "14px", fontWeight: 700 }}>{ev.name}</div>
                  <div style={{ color: MUTED, fontSize: "12px", marginTop: "2px" }}>{ev.date}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: G1, fontSize: "18px", fontWeight: 800 }}>{ev.photos}</div>
                  <div style={{ color: MUTED, fontSize: "11px" }}>foto</div>
                </div>
              </div>
            </div>
          ))}
        </div>
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
