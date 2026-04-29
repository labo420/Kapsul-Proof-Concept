import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';

export function FullBleedDark() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex justify-center min-h-screen bg-[#000000] text-white selection:bg-rose-500/30 font-sans">
      <div className="relative w-full max-w-[390px] min-h-[100dvh] flex flex-col overflow-hidden bg-[#050505]">
        
        {/* Ambient Glows */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/20 via-rose-500/5 to-transparent blur-3xl rounded-full pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-rose-600/10 via-amber-600/5 to-transparent blur-3xl rounded-full pointer-events-none" />

        {/* Watermark */}
        <div className="absolute top-12 -right-12 text-[320px] font-serif tracking-tighter text-white/[0.02] select-none pointer-events-none leading-none">
          K
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col flex-1 px-8 pt-36 pb-12">
          <div className="mb-16">
            <h1 className="text-4xl font-bold tracking-tight mb-3 text-white">Welcome back.</h1>
            <p className="text-white/50 text-base font-light">Sign in to continue to Piclo</p>
          </div>

          <form className="flex-1 flex flex-col space-y-10" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2 relative group">
              <label className="text-[10px] font-semibold text-white/40 uppercase tracking-[0.2em]">Email</label>
              <input
                type="email"
                placeholder="hello@example.com"
                className="w-full bg-transparent border-0 border-b border-white/10 pb-3 pt-1 text-lg focus:outline-none focus:border-amber-400/70 focus:ring-0 transition-colors placeholder:text-white/10 text-white/90"
              />
            </div>

            <div className="space-y-2 relative group">
              <label className="text-[10px] font-semibold text-white/40 uppercase tracking-[0.2em]">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full bg-transparent border-0 border-b border-white/10 pb-3 pt-1 text-lg focus:outline-none focus:border-amber-400/70 focus:ring-0 transition-colors placeholder:text-white/10 text-white/90 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/80 transition-colors pb-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex justify-start pt-2">
              <button type="button" className="text-sm font-medium text-white/40 hover:text-amber-400/80 transition-colors">
                Forgot password?
              </button>
            </div>

            <div className="flex-1" />

            <button
              type="submit"
              className="w-full group relative flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-600 to-rose-600 text-white rounded-full py-4 text-base font-medium shadow-[0_0_40px_-10px_rgba(245,158,11,0.3)] active:scale-[0.98] transition-all overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <span className="relative z-10">Continue</span>
              <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FullBleedDark;
