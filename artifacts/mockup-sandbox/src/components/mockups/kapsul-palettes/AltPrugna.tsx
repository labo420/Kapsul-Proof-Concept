// C · Prugna — viola-fucsia, direzione opposta al borgogna (più freddo/viola)
export function AltPrugna() {
  const indigo = "#4c1d95";
  const primary = "#a21caf";
  const primaryDeep = "#701a75";
  const accent = "#e879f9";
  const labelColor = "#f0abfc";
  const textMuted = "#fae8ff";

  return (
    <div style={{ width: 390, minHeight: 844, background: "#06000A", fontFamily: "'Inter', sans-serif", position: "relative", overflow: "hidden", color: "#fff" }}>
      <div style={{ position: "absolute", top: -120, left: -80, width: 400, height: 400, background: `radial-gradient(circle, ${primaryDeep}33 0%, transparent 65%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 280, right: -80, width: 300, height: 300, background: `radial-gradient(circle, ${indigo}22 0%, transparent 65%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: 0, left: "15%", width: 260, height: 260, background: `radial-gradient(circle, ${primary}22 0%, transparent 65%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", pointerEvents: "none" }} />

      <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 24px 0", fontSize: 11, fontWeight: 600, color: labelColor, letterSpacing: 0.5 }}>
        <span>9:41</span><span>▲▲▲ 100%</span>
      </div>

      <div style={{ padding: "36px 0 0", textAlign: "center" }}>
        <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <div style={{ width: 54, height: 54, borderRadius: 16, background: `linear-gradient(135deg, ${indigo}, ${primaryDeep}, ${primary})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 30px ${primary}55, 0 0 60px ${indigo}22` }}>
            <span style={{ color: "#fff", fontWeight: 300, fontSize: 22, letterSpacing: -1 }}>K</span>
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 300, letterSpacing: 8, textTransform: "uppercase", color: textMuted }}>KAPSUL</div>
            <div style={{ fontSize: 10, fontWeight: 400, letterSpacing: 4, color: accent, textTransform: "uppercase", marginTop: 3 }}>moments preserved</div>
          </div>
        </div>
      </div>

      <div style={{ margin: "28px 20px 0", borderRadius: 20, height: 160, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(120deg, ${indigo}, ${primaryDeep}, ${primary})`, opacity: 0.95 }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 40%, rgba(6,0,10,0.7))" }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${accent}44, transparent)` }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "16px 20px" }}>
          <div style={{ fontSize: 13, fontWeight: 300, letterSpacing: 3, textTransform: "uppercase", color: accent, marginBottom: 4 }}>Estate 2025</div>
          <div style={{ fontSize: 18, fontWeight: 500, color: "#fff" }}>Capri · 48 foto</div>
        </div>
        <div style={{ position: "absolute", top: 16, right: 20, display: "flex" }}>
          {["#fff2","#fff3","#fff4"].map((c, i) => (
            <div key={i} style={{ width: 28, height: 28, borderRadius: "50%", background: c, border: "1.5px solid rgba(255,255,255,0.25)", marginLeft: i ? -8 : 0 }} />
          ))}
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: primary, border: `1.5px solid ${accent}66`, marginLeft: -8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 10, color: "#fff", fontWeight: 700 }}>+5</span>
          </div>
        </div>
      </div>

      <div style={{ margin: "16px 20px 0", background: `rgba(162,28,175,0.05)`, backdropFilter: "blur(40px)", WebkitBackdropFilter: "blur(40px)", borderRadius: 24, border: `1px solid rgba(232,121,249,0.16)`, padding: "22px 22px 20px", boxShadow: `0 8px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(240,171,252,0.05)` }}>
        <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: 3, color: labelColor, textTransform: "uppercase", marginBottom: 18 }}>Accedi</div>
        {["Email","Password"].map((label, i) => (
          <div key={label} style={{ marginBottom: i === 0 ? 12 : 18 }}>
            <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: "13px 16px", border: "1px solid rgba(232,121,249,0.12)" }}>
              <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: 2, color: accent, textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 14, fontWeight: 300, color: "#6b7280" }}>{i === 0 ? "nome@email.com" : "••••••••••"}</div>
            </div>
          </div>
        ))}
        <button style={{ width: "100%", padding: "15px", borderRadius: 14, border: "none", background: `linear-gradient(90deg, ${indigo}, ${primaryDeep}, ${primary})`, color: "#fff", fontWeight: 400, fontSize: 13, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer", boxShadow: `0 4px 20px ${primary}40` }}>Entra</button>
        <div style={{ textAlign: "center", marginTop: 14 }}>
          <div style={{ width: 40, height: 1, background: "rgba(255,255,255,0.08)", display: "inline-block", verticalAlign: "middle", marginRight: 12 }} />
          <span style={{ fontSize: 11, color: "#6b7280", letterSpacing: 1 }}>nuovo?</span>
          <div style={{ width: 40, height: 1, background: "rgba(255,255,255,0.08)", display: "inline-block", verticalAlign: "middle", marginLeft: 12 }} />
        </div>
        <div style={{ textAlign: "center", marginTop: 10 }}>
          <span style={{ fontSize: 12, fontWeight: 500, letterSpacing: 2, color: primary, textTransform: "uppercase" }}>Crea account</span>
        </div>
      </div>

      <div style={{ margin: "20px 24px 0", display: "flex", alignItems: "center", gap: 10 }}>
        {["#06000A","#4c1d95","#701a75","#a21caf","#c026d3","#f0abfc"].map((c, i) => (
          <div key={i} style={{ width: i===0?20:18, height: i===0?20:18, borderRadius: "50%", background: c, border: "1px solid rgba(255,255,255,0.12)", flexShrink: 0 }} />
        ))}
        <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: 2, color: accent, textTransform: "uppercase", marginLeft: 4 }}>C · Prugna</span>
      </div>
    </div>
  );
}
