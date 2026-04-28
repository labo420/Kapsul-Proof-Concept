// Notte — midnight indigo + ice blue (indigo senza rosa, direzione fredda)
export function Tramonto() {
  const primary = "#4f46e5";
  const primaryDeep = "#312e81";
  const accent = "#38bdf8";
  const labelColor = "#7dd3fc";
  const textMuted = "#e0f2fe";

  return (
    <div style={{
      width: 390, minHeight: 844,
      background: "#01030E",
      fontFamily: "'Inter', sans-serif",
      position: "relative", overflow: "hidden", color: "#fff",
    }}>
      <div style={{ position: "absolute", top: -120, left: -80, width: 400, height: 400, background: "radial-gradient(circle, #312e8133 0%, transparent 65%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 280, right: -80, width: 300, height: 300, background: "radial-gradient(circle, #0369a122 0%, transparent 65%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: 0, left: "15%", width: 260, height: 260, background: "radial-gradient(circle, #1e3a8a22 0%, transparent 65%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, opacity: 0.035, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", pointerEvents: "none" }} />

      <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 24px 0", fontSize: 11, fontWeight: 600, color: labelColor, letterSpacing: 0.5 }}>
        <span>9:41</span><span>▲▲▲ 100%</span>
      </div>

      <div style={{ padding: "36px 0 0", textAlign: "center" }}>
        <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <div style={{ width: 54, height: 54, borderRadius: 16, background: `linear-gradient(135deg, ${primaryDeep}, ${primary}, #6366f1)`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 30px ${primary}55, 0 0 60px ${primaryDeep}22` }}>
            <span style={{ color: "#fff", fontWeight: 300, fontSize: 22, letterSpacing: -1 }}>K</span>
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 300, letterSpacing: 8, textTransform: "uppercase", color: textMuted }}>KAPSUL</div>
            <div style={{ fontSize: 10, fontWeight: 400, letterSpacing: 4, color: accent, textTransform: "uppercase", marginTop: 3 }}>moments preserved</div>
          </div>
        </div>
      </div>

      <div style={{ margin: "28px 20px 0", borderRadius: 20, height: 160, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(120deg, #0f172a, ${primaryDeep}, ${primary})`, opacity: 0.95 }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 40%, rgba(1,3,14,0.7))" }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${accent}55, transparent)` }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "16px 20px" }}>
          <div style={{ fontSize: 13, fontWeight: 300, letterSpacing: 3, textTransform: "uppercase", color: accent, marginBottom: 4 }}>Estate 2025</div>
          <div style={{ fontSize: 18, fontWeight: 500, color: "#fff" }}>Capri · 48 foto</div>
        </div>
        <div style={{ position: "absolute", top: 16, right: 20, display: "flex" }}>
          {["#fff2","#fff3","#fff4"].map((c, i) => (
            <div key={i} style={{ width: 28, height: 28, borderRadius: "50%", background: c, border: "1.5px solid rgba(255,255,255,0.25)", marginLeft: i ? -8 : 0 }} />
          ))}
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: accent, border: `1.5px solid ${accent}88`, marginLeft: -8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 10, color: "#01030E", fontWeight: 700 }}>+5</span>
          </div>
        </div>
      </div>

      <div style={{ margin: "16px 20px 0", background: "rgba(79,70,229,0.05)", backdropFilter: "blur(40px)", WebkitBackdropFilter: "blur(40px)", borderRadius: 24, border: "1px solid rgba(99,102,241,0.18)", padding: "22px 22px 20px", boxShadow: "0 8px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(56,189,248,0.06)" }}>
        <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: 3, color: labelColor, textTransform: "uppercase", marginBottom: 18 }}>Accedi</div>
        {["Email","Password"].map((label, i) => (
          <div key={label} style={{ marginBottom: i === 0 ? 12 : 18 }}>
            <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: "13px 16px", border: "1px solid rgba(99,102,241,0.14)" }}>
              <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: 2, color: accent, textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 14, fontWeight: 300, color: "#6b7280" }}>{i === 0 ? "nome@email.com" : "••••••••••"}</div>
            </div>
          </div>
        ))}
        <button style={{ width: "100%", padding: "15px", borderRadius: 14, border: "none", background: `linear-gradient(90deg, ${primaryDeep}, ${primary}, #6366f1)`, color: "#fff", fontWeight: 400, fontSize: 13, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer", boxShadow: `0 4px 20px ${primary}40` }}>Entra</button>
        <div style={{ textAlign: "center", marginTop: 14 }}>
          <div style={{ width: 40, height: 1, background: "rgba(255,255,255,0.08)", display: "inline-block", verticalAlign: "middle", marginRight: 12 }} />
          <span style={{ fontSize: 11, color: "#6b7280", letterSpacing: 1 }}>nuovo?</span>
          <div style={{ width: 40, height: 1, background: "rgba(255,255,255,0.08)", display: "inline-block", verticalAlign: "middle", marginLeft: 12 }} />
        </div>
        <div style={{ textAlign: "center", marginTop: 10 }}>
          <span style={{ fontSize: 12, fontWeight: 500, letterSpacing: 2, color: accent, textTransform: "uppercase" }}>Crea account</span>
        </div>
      </div>

      <div style={{ margin: "20px 24px 0", display: "flex", alignItems: "center", gap: 10 }}>
        {["#01030E","#0f172a","#312e81","#4f46e5","#6366f1","#38bdf8"].map((c, i) => (
          <div key={i} style={{ width: i===0?20:18, height: i===0?20:18, borderRadius: "50%", background: c, border: "1px solid rgba(255,255,255,0.12)", flexShrink: 0 }} />
        ))}
        <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: 2, color: accent, textTransform: "uppercase", marginLeft: 4 }}>Notte · Indaco</span>
      </div>
    </div>
  );
}
