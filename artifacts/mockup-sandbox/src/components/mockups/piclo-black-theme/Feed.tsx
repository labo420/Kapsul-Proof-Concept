const BG = "#000000";
const CARD = "#0D0D0D";
const BORDER = "#222222";
const FG = "#FFFFFF";
const MUTED = "#9CA3AF";
const G1 = "#6366F1";
const G_MID = "#8B5CF6";
const G2 = "#EC4899";

const posts = [
  { user: "Luca Rossi", username: "@luca.r", time: "2m fa", hasPhoto: true, likes: 12, bg: "linear-gradient(135deg, #1a1035, #2d1b4e)" },
  { user: "Sara Bianchi", username: "@sara_b", time: "14m fa", hasPhoto: true, likes: 34, bg: "linear-gradient(135deg, #0d1a2e, #1a2d4e)" },
];

export function Feed() {
  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "Inter, sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "60px 20px 12px" }}>
        <img src="/__mockup/images/piclo-logo-white.png" alt="Piclo" style={{ width: 100, height: 32, objectFit: "contain" }} />
        <span style={{ color: MUTED, fontSize: "20px", cursor: "pointer" }}>↺</span>
      </div>

      <div style={{ paddingBottom: "100px" }}>
        {posts.map((p, i) => (
          <div key={i} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "16px", margin: "6px 16px", overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", padding: "12px", gap: "10px" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg, ${G1}, ${G_MID}, ${G2})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "14px" }}>
                {p.user[0]}
              </div>
              <div>
                <div style={{ color: FG, fontSize: "14px", fontWeight: 700 }}>{p.user}</div>
                <div style={{ color: MUTED, fontSize: "12px" }}>{p.username} · {p.time}</div>
              </div>
            </div>
            <div style={{ width: "100%", aspectRatio: "1", background: p.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ color: "rgba(255,255,255,0.2)", fontSize: "48px" }}>📷</div>
            </div>
            <div style={{ padding: "8px 12px", display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "5px", color: MUTED, cursor: "pointer" }}>
                <span style={{ fontSize: "20px" }}>♡</span>
                <span style={{ fontSize: "13px" }}>{p.likes}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "5px", color: MUTED, cursor: "pointer" }}>
                <span style={{ fontSize: "20px" }}>💬</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
