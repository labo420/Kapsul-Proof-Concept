const BG = "#000000";
const CARD = "#0D0D0D";
const BORDER = "#222222";
const FG = "#FFFFFF";
const MUTED = "#9CA3AF";
const G1 = "#6366F1";
const G_MID = "#8B5CF6";
const G2 = "#EC4899";

const events = [
  { name: "Matrimonio Luca & Sara", date: "14 Giugno 2025", photos: 127, plan: "Pro" },
  { name: "Compleanno Marco 30", date: "2 Maggio 2025", photos: 84, plan: "Party" },
  { name: "Aziendale TechCorp", date: "28 Aprile 2025", photos: 43, plan: "Party" },
];

export function Events() {
  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "Inter, sans-serif", paddingTop: "56px" }}>
      <div style={{ padding: "0 20px 100px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" }}>
          <div>
            <img src="/__mockup/images/piclo-logo-white.png" alt="Piclo" style={{ width: 100, height: 32, objectFit: "contain", display: "block" }} />
            <span style={{ color: MUTED, fontSize: "13px", fontWeight: 500, marginTop: "4px", display: "block" }}>I tuoi eventi</span>
          </div>
          <button style={{ background: `linear-gradient(90deg, ${G1}, ${G_MID}, ${G2})`, border: "none", borderRadius: "999px", padding: "10px 18px", color: "#fff", fontSize: "14px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
            + Nuovo
          </button>
        </div>

        <div style={{ display: "flex", gap: "10px", marginBottom: "18px" }}>
          <button style={{ background: `linear-gradient(90deg, ${G1}, ${G_MID}, ${G2})`, border: "none", borderRadius: "999px", padding: "8px 16px", color: "#fff", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>Data creazione</button>
          <button style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "999px", padding: "8px 16px", color: MUTED, fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>Data evento</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {events.map((ev, i) => (
            <div key={i} style={{ background: CARD, border: `1px solid ${G1}50`, borderRadius: "16px", overflow: "hidden" }}>
              <div style={{ padding: "18px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ color: FG, fontSize: "17px", fontWeight: 700 }}>{ev.name}</div>
                  <div style={{ color: MUTED, fontSize: "13px", marginTop: "4px" }}>{ev.date}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" }}>
                  <span style={{ background: `${G1}22`, color: G1, borderRadius: "8px", padding: "2px 8px", fontSize: "11px", fontWeight: 600 }}>Party</span>
                  <span style={{ background: `${G2}22`, color: G2, borderRadius: "8px", padding: "2px 8px", fontSize: "11px", fontWeight: 600 }}>{ev.plan}</span>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: `linear-gradient(135deg, ${G1}, ${G2})` }} />
                </div>
              </div>
              <div style={{ borderTop: `1px solid ${BORDER}`, padding: "12px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                  <span style={{ color: G1, fontSize: "22px", fontWeight: 800 }}>{ev.photos}</span>
                  <span style={{ color: MUTED, fontSize: "13px" }}>foto</span>
                </div>
                <button style={{ background: `linear-gradient(90deg, ${G1}, ${G_MID}, ${G2})`, border: "none", borderRadius: "999px", padding: "8px 14px", color: "#fff", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>⊞ QR</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
