export function Ghiaccio() {
  return (
    <div style={{
      width: 390, minHeight: 844,
      background: "#01040D",
      fontFamily: "'Inter', sans-serif",
      position: "relative", overflow: "hidden",
      color: "#fff",
    }}>
      {/* Deep blue glows */}
      <div style={{ position: "absolute", top: -100, left: -60, width: 360, height: 360, background: "radial-gradient(circle, #1e3a5f33 0%, transparent 65%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 260, right: -80, width: 300, height: 300, background: "radial-gradient(circle, #0369a122 0%, transparent 65%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: 0, left: "10%", width: 280, height: 280, background: "radial-gradient(circle, #164e6322 0%, transparent 65%)", pointerEvents: "none" }} />

      {/* Grain */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.035, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", pointerEvents: "none" }} />

      {/* Status bar */}
      <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 24px 0", fontSize: 11, fontWeight: 600, color: "#7dd3fc", letterSpacing: 0.5 }}>
        <span>9:41</span>
        <span>▲▲▲ 100%</span>
      </div>

      {/* Logo */}
      <div style={{ padding: "36px 0 0", textAlign: "center" }}>
        <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 54, height: 54, borderRadius: 16,
            background: "linear-gradient(135deg, #0c4a6e, #0369a1, #0ea5e9)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 30px #0ea5e955, 0 0 60px #0c4a6e22",
          }}>
            <span style={{ color: "#fff", fontWeight: 300, fontSize: 22, letterSpacing: -1 }}>K</span>
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 300, letterSpacing: 8, textTransform: "uppercase", color: "#e0f2fe" }}>KAPSUL</div>
            <div style={{ fontSize: 10, fontWeight: 400, letterSpacing: 4, color: "#38bdf8", textTransform: "uppercase", marginTop: 3 }}>moments preserved</div>
          </div>
        </div>
      </div>

      {/* Hero strip */}
      <div style={{ margin: "28px 20px 0", borderRadius: 20, height: 160, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(120deg, #082f49, #0c4a6e, #0369a1)", opacity: 0.95 }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 40%, rgba(1,4,13,0.7))" }} />
        {/* Platinum shimmer line */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, #bae6fd44, transparent)" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "16px 20px" }}>
          <div style={{ fontSize: 13, fontWeight: 300, letterSpacing: 3, textTransform: "uppercase", color: "#7dd3fc", marginBottom: 4 }}>Estate 2025</div>
          <div style={{ fontSize: 18, fontWeight: 500, color: "#fff" }}>Capri · 48 foto</div>
        </div>
        <div style={{ position: "absolute", top: 16, right: 20, display: "flex" }}>
          {["#fff2","#fff3","#fff4"].map((c, i) => (
            <div key={i} style={{ width: 28, height: 28, borderRadius: "50%", background: c, border: "1.5px solid rgba(255,255,255,0.25)", marginLeft: i ? -8 : 0 }} />
          ))}
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#0ea5e9", border: "1.5px solid rgba(186,230,253,0.4)", marginLeft: -8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 10, color: "#fff", fontWeight: 700 }}>+5</span>
          </div>
        </div>
      </div>

      {/* Glass card */}
      <div style={{
        margin: "16px 20px 0",
        background: "rgba(14, 165, 233, 0.05)",
        backdropFilter: "blur(40px)",
        WebkitBackdropFilter: "blur(40px)",
        borderRadius: 24,
        border: "1px solid rgba(56, 189, 248, 0.15)",
        padding: "22px 22px 20px",
        boxShadow: "0 8px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(186,230,253,0.06)",
      }}>
        <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: 3, color: "#7dd3fc", textTransform: "uppercase", marginBottom: 18 }}>Accedi</div>

        <div style={{ marginBottom: 12 }}>
          <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: "13px 16px", border: "1px solid rgba(56,189,248,0.12)" }}>
            <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: 2, color: "#38bdf8", textTransform: "uppercase", marginBottom: 4 }}>Email</div>
            <div style={{ fontSize: 14, fontWeight: 300, color: "#6b7280" }}>nome@email.com</div>
          </div>
        </div>

        <div style={{ marginBottom: 18 }}>
          <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: "13px 16px", border: "1px solid rgba(56,189,248,0.12)" }}>
            <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: 2, color: "#38bdf8", textTransform: "uppercase", marginBottom: 4 }}>Password</div>
            <div style={{ fontSize: 14, fontWeight: 300, color: "#6b7280" }}>••••••••••</div>
          </div>
        </div>

        <button style={{
          width: "100%", padding: "15px", borderRadius: 14, border: "none",
          background: "linear-gradient(90deg, #0c4a6e, #0369a1, #0ea5e9)",
          color: "#fff", fontWeight: 400, fontSize: 13, letterSpacing: 3,
          textTransform: "uppercase", cursor: "pointer",
          boxShadow: "0 4px 20px #0ea5e940",
        }}>
          Entra
        </button>

        <div style={{ textAlign: "center", marginTop: 14 }}>
          <div style={{ width: 40, height: 1, background: "rgba(255,255,255,0.08)", display: "inline-block", verticalAlign: "middle", marginRight: 12 }} />
          <span style={{ fontSize: 11, color: "#6b7280", letterSpacing: 1 }}>nuovo?</span>
          <div style={{ width: 40, height: 1, background: "rgba(255,255,255,0.08)", display: "inline-block", verticalAlign: "middle", marginLeft: 12 }} />
        </div>
        <div style={{ textAlign: "center", marginTop: 10 }}>
          <span style={{ fontSize: 12, fontWeight: 500, letterSpacing: 2, color: "#0ea5e9", textTransform: "uppercase" }}>Crea account</span>
        </div>
      </div>

      {/* Palette row */}
      <div style={{ margin: "20px 24px 0", display: "flex", alignItems: "center", gap: 10 }}>
        {["#01040D","#082f49","#0c4a6e","#0369a1","#0ea5e9","#e0f2fe"].map((c, i) => (
          <div key={i} style={{ width: i === 0 ? 20 : 18, height: i === 0 ? 20 : 18, borderRadius: "50%", background: c, border: "1px solid rgba(255,255,255,0.12)", flexShrink: 0 }} />
        ))}
        <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: 2, color: "#38bdf8", textTransform: "uppercase", marginLeft: 4 }}>Ghiaccio · Cobalto</span>
      </div>
    </div>
  );
}
