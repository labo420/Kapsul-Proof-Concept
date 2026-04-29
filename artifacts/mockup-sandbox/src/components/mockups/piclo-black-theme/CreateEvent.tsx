const BG = "#000000";
const CARD = "#0D0D0D";
const BORDER = "#222222";
const FG = "#FFFFFF";
const MUTED = "#9CA3AF";
const INPUT = "#111111";
const G1 = "#6366F1";
const G_MID = "#8B5CF6";
const G2 = "#EC4899";

const STEPS = ["Dettagli", "Tema", "Modalità", "Piano"];

export function CreateEvent() {
  const step = 0;
  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "Inter, sans-serif", paddingTop: "60px" }}>
      <div style={{ padding: "0 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
          <button style={{ background: "transparent", border: "none", color: FG, fontSize: "24px", cursor: "pointer" }}>‹</button>
          <span style={{ color: FG, fontSize: "17px", fontWeight: 700, flex: 1, textAlign: "center" }}>Nuovo evento</span>
          <div style={{ width: 32 }} />
        </div>

        <div style={{ display: "flex", alignItems: "center", marginBottom: "28px" }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center", flex: 1 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: i <= step ? `linear-gradient(135deg, ${G1}, ${G_MID}, ${G2})` : "#111",
                  border: i > step ? `1px solid ${BORDER}` : "none",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: i <= step ? "#fff" : MUTED, fontSize: "12px", fontWeight: 700,
                }}>
                  {i < step ? "✓" : i + 1}
                </div>
                <span style={{ color: i <= step ? FG : MUTED, fontSize: "10px", fontWeight: 600, whiteSpace: "nowrap" }}>{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ flex: 1, height: "2px", background: i < step ? `linear-gradient(90deg, ${G1}, ${G_MID}, ${G2})` : BORDER, margin: "0 4px", marginBottom: "20px" }} />
              )}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div>
            <div style={{ color: FG, fontSize: "28px", fontWeight: 800, lineHeight: 1.2, marginBottom: "8px" }}>Di che evento{"\n"}si tratta?</div>
            <div style={{ color: MUTED, fontSize: "15px" }}>Dai un nome all'evento e scegli la data</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <span style={{ color: MUTED, fontSize: "11px", fontWeight: 600, letterSpacing: "1.2px" }}>NOME EVENTO</span>
            <input
              placeholder="es. Matrimonio Luca & Sara"
              defaultValue="Matrimonio Luca & Sara"
              style={{ background: INPUT, border: `1px solid ${G1}`, borderRadius: "16px", padding: "14px 16px", color: FG, fontSize: "15px", outline: "none" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <span style={{ color: MUTED, fontSize: "11px", fontWeight: 600, letterSpacing: "1.2px" }}>DATA</span>
            <input
              placeholder="es. 28 Aprile 2026"
              defaultValue="14 Giugno 2026"
              style={{ background: INPUT, border: `1px solid ${BORDER}`, borderRadius: "16px", padding: "14px 16px", color: FG, fontSize: "15px", outline: "none" }}
            />
          </div>

          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "16px", padding: "14px 16px", display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "16px" }}>🖼️</span>
            <div>
              <div style={{ color: FG, fontSize: "14px", fontWeight: 600 }}>Aggiungi foto copertina</div>
              <div style={{ color: MUTED, fontSize: "12px" }}>Visibile agli ospiti quando entrano</div>
            </div>
            <span style={{ color: MUTED, marginLeft: "auto" }}>›</span>
          </div>
        </div>
      </div>

      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "16px 20px 40px", borderTop: `1px solid ${BORDER}`, background: BG }}>
        <button style={{ width: "100%", padding: "16px", background: `linear-gradient(90deg, ${G1}, ${G_MID}, ${G2})`, border: "none", borderRadius: "999px", color: "#fff", fontSize: "16px", fontWeight: 700, cursor: "pointer" }}>
          Avanti →
        </button>
      </div>
    </div>
  );
}
