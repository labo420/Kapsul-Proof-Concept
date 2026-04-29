import { useState } from "react";

const BG = "#000000";
const CARD = "#0D0D0D";
const BORDER = "#222222";
const FG = "#FFFFFF";
const MUTED = "#9CA3AF";
const G1 = "#6366F1";
const G_MID = "#8B5CF6";
const G2 = "#EC4899";

function Toggle({ on }: { on: boolean }) {
  return (
    <div style={{
      width: 44, height: 26, borderRadius: "999px",
      background: on ? `linear-gradient(90deg, ${G1}, ${G_MID})` : BORDER,
      position: "relative", cursor: "pointer", transition: "background 0.2s",
    }}>
      <div style={{
        position: "absolute", width: 20, height: 20, borderRadius: "50%",
        background: "#fff", top: 3,
        left: on ? 21 : 3, transition: "left 0.2s",
        boxShadow: "0 1px 4px rgba(0,0,0,0.4)",
      }} />
    </div>
  );
}

function SettingRow({ icon, label, right }: { icon: string; label: string; right?: React.ReactNode }) {
  return (
    <div style={{ background: CARD, borderBottom: `1px solid ${BORDER}`, padding: "15px 16px", display: "flex", alignItems: "center", gap: "13px" }}>
      <div style={{ width: 34, height: 34, borderRadius: "10px", background: `${G1}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", flexShrink: 0 }}>{icon}</div>
      <span style={{ color: FG, flex: 1, fontSize: "15px" }}>{label}</span>
      {right ?? <span style={{ color: MUTED, fontSize: "18px" }}>›</span>}
    </div>
  );
}

export function Settings() {
  const [notif, setNotif] = useState(true);
  const [pub, setPub] = useState(false);
  const [autoSave, setAutoSave] = useState(true);

  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "Inter, sans-serif" }}>
      <div style={{ padding: "54px 20px 0", display: "flex", alignItems: "center", gap: "14px", marginBottom: "28px" }}>
        <button style={{ width: 38, height: 38, borderRadius: "50%", background: CARD, border: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "18px" }}>‹</button>
        <span style={{ color: FG, fontSize: "18px", fontWeight: 800, flex: 1 }}>Impostazioni</span>
        <span style={{ fontSize: "22px" }}>⚙️</span>
      </div>

      <div style={{ marginBottom: "6px" }}>
        <div style={{ padding: "0 20px 8px", color: MUTED, fontSize: "11px", fontWeight: 600, letterSpacing: "1.2px" }}>ACCOUNT</div>
        <div style={{ borderTop: `1px solid ${BORDER}` }}>
          <SettingRow icon="🔔" label="Notifiche push" right={<Toggle on={notif} />} />
          <SettingRow icon="🔒" label="Account pubblico" right={<Toggle on={pub} />} />
          <SettingRow icon="👥" label="Follower e seguiti" />
          <SettingRow icon="✏️" label="Modifica profilo" />
        </div>
      </div>

      <div style={{ marginBottom: "6px" }}>
        <div style={{ padding: "0 20px 8px", color: MUTED, fontSize: "11px", fontWeight: 600, letterSpacing: "1.2px" }}>PREFERENZE</div>
        <div style={{ borderTop: `1px solid ${BORDER}` }}>
          <SettingRow icon="💾" label="Salvataggio automatico foto" right={<Toggle on={autoSave} />} />
          <SettingRow icon="🌐" label="Lingua" right={<span style={{ color: MUTED, fontSize: "14px" }}>Italiano ›</span>} />
        </div>
      </div>

      <div style={{ marginBottom: "6px" }}>
        <div style={{ padding: "0 20px 8px", color: MUTED, fontSize: "11px", fontWeight: 600, letterSpacing: "1.2px" }}>INFORMAZIONI</div>
        <div style={{ borderTop: `1px solid ${BORDER}` }}>
          <SettingRow icon="📄" label="Termini di servizio" />
          <SettingRow icon="🔐" label="Privacy policy" />
          <SettingRow icon="ℹ️" label="Informazioni sull'app" right={<span style={{ color: MUTED, fontSize: "14px" }}>v1.0.0 ›</span>} />
        </div>
      </div>

      <div style={{ padding: "20px 20px 0" }}>
        <button style={{
          width: "100%", padding: "15px",
          background: "#1a0a0a", border: "1px solid #EF444440",
          borderRadius: "16px", color: "#EF4444", fontSize: "15px", fontWeight: 700, cursor: "pointer",
        }}>
          🚪 Disconnetti
        </button>
      </div>

      <div style={{ marginTop: "28px", padding: "0 20px", textAlign: "center" }}>
        <div style={{ color: MUTED, fontSize: "11px" }}>Piclo v1.0.0 · Made with ❤️</div>
      </div>
    </div>
  );
}
