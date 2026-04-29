export function Lusso() {
  const g1 = "#6366F1";
  const g2 = "#EC4899";

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-950">
      <div
        className="relative overflow-hidden rounded-[40px] shadow-2xl"
        style={{ width: 390, height: 844, background: "#06020F", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        {/* Status bar */}
        <div className="flex justify-between items-center px-8 pt-4 pb-2">
          <span className="text-white text-xs font-semibold">9:41</span>
          <div className="flex items-center gap-1">
            <div className="w-4 h-2.5 rounded-sm border border-white/60 relative"><div className="absolute left-0.5 top-0.5 bottom-0.5 w-2 bg-white/60 rounded-sm" /></div>
          </div>
        </div>

        {/* Header */}
        <div className="px-6 pt-2 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <span
                className="text-2xl font-black tracking-tight"
                style={{ background: `linear-gradient(135deg, ${g1}, ${g2})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
              >
                Kapsul
              </span>
              <p className="text-white/40 text-xs mt-0.5">I tuoi eventi</p>
            </div>
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
              style={{ background: `linear-gradient(135deg, ${g1}40, ${g2}40)`, border: `1px solid ${g1}50` }}
            >
              G
            </div>
          </div>
        </div>

        {/* Event card */}
        <div className="px-5 mb-4">
          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div
              className="h-36 relative"
              style={{ background: `linear-gradient(135deg, ${g1}, ${g2})` }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl opacity-30">🎉</span>
              </div>
              <div className="absolute top-3 right-3">
                <div className="px-2.5 py-1 rounded-full text-xs font-bold text-white" style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(8px)" }}>
                  Party
                </div>
              </div>
            </div>

            <div className="p-4" style={{ background: "rgba(255,255,255,0.04)" }}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-white font-bold text-base">Compleanno di Marco</h3>
                  <p className="text-white/40 text-xs mt-0.5">Sabato 3 Maggio</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full" style={{ background: `linear-gradient(135deg, ${g1}, ${g2})` }} />
                  <span className="text-white/50 text-xs">24 ospiti</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-white/40">
                  <div className="w-3.5 h-3.5 rounded-sm" style={{ background: `${g1}40` }} />
                  <span className="text-xs">12 foto</span>
                </div>
                <div className="flex items-center gap-1.5 text-white/40">
                  <div className="w-3.5 h-3.5 rounded-sm" style={{ background: `${g2}40` }} />
                  <span className="text-xs">Real-time</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Second card (partial) */}
        <div className="px-5">
          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div
              className="h-28 relative"
              style={{ background: `linear-gradient(135deg, ${g2}, ${g1})` }}
            >
              <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <span className="text-4xl">💎</span>
              </div>
            </div>
            <div className="p-4" style={{ background: "rgba(255,255,255,0.03)" }}>
              <h3 className="text-white font-bold text-sm">Matrimonio Rossi</h3>
              <p className="text-white/30 text-xs mt-0.5">Domenica 11 Maggio</p>
            </div>
          </div>
        </div>

        {/* Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-48" style={{ background: "linear-gradient(to top, #06020F 40%, transparent)" }} />

        {/* Tab bar */}
        <div
          className="absolute bottom-0 left-0 right-0 pb-6 pt-3 flex justify-around items-center"
          style={{ background: "rgba(6,2,15,0.9)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          {[
            { label: "Crea", active: true, icon: "▦" },
            { label: "Guest", active: false, icon: "⊙" },
            { label: "Profilo", active: false, icon: "◉" },
          ].map(({ label, active, icon }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <span
                className="text-xl"
                style={{ color: active ? g1 : "rgba(255,255,255,0.3)" }}
              >
                {icon}
              </span>
              <span
                className="text-[10px] font-semibold"
                style={{ color: active ? g1 : "rgba(255,255,255,0.3)" }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Label */}
        <div
          className="absolute top-16 right-5 px-3 py-1.5 rounded-full text-xs font-bold text-white"
          style={{ background: `linear-gradient(135deg, ${g1}, ${g2})`, boxShadow: `0 4px 16px ${g1}60` }}
        >
          Lusso
        </div>
      </div>
    </div>
  );
}
