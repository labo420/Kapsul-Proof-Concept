const BG = "#000000";
const CARD = "#0D0D0D";
const BORDER = "#222222";
const FG = "#FFFFFF";
const MUTED = "#9CA3AF";
const G1 = "#6366F1";
const G_MID = "#8B5CF6";
const G2 = "#EC4899";

function Row({ icon, label }: { icon: string; label: string }) {
  return (
    <div style={{ background: CARD, borderBottom: `1px solid ${BORDER}`, padding: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
      <div style={{ width: 32, height: 32, borderRadius: "8px", background: `${G1}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>{icon}</div>
      <span style={{ color: FG, flex: 1, fontSize: "15px" }}>{label}</span>
      <span style={{ color: MUTED, fontSize: "18px" }}>›</span>
    </div>
  );
}

export function Profile() {
  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "Inter, sans-serif", paddingTop: "56px" }}>
      <div style={{ padding: "24px 20px 0" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: `linear-gradient(135deg, ${G1}, ${G_MID}, ${G2})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px" }}>👤</div>
            <div>
              <div style={{ color: FG, fontSize: "18px", fontWeight: 800 }}>Marco Rossi</div>
              <div style={{ color: MUTED, fontSize: "13px" }}>@marco.r</div>
              <div style={{ color: MUTED, fontSize: "13px", marginTop: "4px" }}>🔗 marcor.me</div>
            </div>
          </div>
          <button style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "12px", padding: "8px 14px", color: FG, fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>✏️ Modifica</button>
        </div>

        <div style={{ display: "flex", gap: "24px", marginBottom: "24px", padding: "16px 0", borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
          {[["127", "Foto"], ["8", "Seguendo"], ["43", "Follower"]].map(([n, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ color: FG, fontSize: "20px", fontWeight: 800 }}>{n}</div>
              <div style={{ color: MUTED, fontSize: "12px" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ margin: "0 0 20px" }}>
        <div style={{ padding: "0 20px 10px", color: MUTED, fontSize: "11px", fontWeight: 600, letterSpacing: "1px" }}>ACCOUNT</div>
        <Row icon="🔔" label="Notifiche" />
        <Row icon="🔒" label="Privacy" />
        <Row icon="👥" label="Follower e seguiti" />
      </div>

      <div style={{ margin: "0 0 20px" }}>
        <div style={{ padding: "0 20px 10px", color: MUTED, fontSize: "11px", fontWeight: 600, letterSpacing: "1px" }}>SUPPORTO</div>
        <Row icon="📄" label="Termini di servizio" />
        <Row icon="ℹ️" label="Informazioni sull'app" />
      </div>

      <div style={{ padding: "0 20px" }}>
        <button style={{ width: "100%", padding: "14px", background: "#1a0a0a", border: "1px solid #EF444440", borderRadius: "14px", color: "#EF4444", fontSize: "15px", fontWeight: 600, cursor: "pointer" }}>
          Disconnetti
        </button>
      </div>
    </div>
  );
}
