import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Camera, ArrowRight } from 'lucide-react';

export function CenteredCard() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div
      className="flex items-center justify-center min-h-screen relative overflow-hidden font-sans text-white"
      style={{ background: '#08060F' }}
    >
      {/* Ambient background glows — indigo / violet / pink */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[100px] pointer-events-none" style={{ background: 'rgba(99,102,241,0.25)' }} />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[120px] pointer-events-none" style={{ background: 'rgba(236,72,153,0.12)' }} />
      <div className="absolute top-[40%] left-[20%] w-[40%] h-[40%] rounded-full blur-[90px] pointer-events-none" style={{ background: 'rgba(139,92,246,0.18)' }} />

      {/* Main Container */}
      <div className="w-full max-w-[390px] px-6 relative z-10">

        {/* Glass Card */}
        <div
          className="rounded-3xl p-8 shadow-2xl"
          style={{ background: '#130F1C', border: '1px solid #2D2540' }}
        >

          {/* Logo / Header */}
          <div className="flex flex-col items-center mb-8">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #6366F1, #8B5CF6, #EC4899)',
                boxShadow: '0 8px 24px rgba(99,102,241,0.3)',
              }}
            >
              <Camera className="w-6 h-6 text-white" />
            </div>
            <h1
              className="text-2xl font-bold tracking-wider"
              style={{
                background: 'linear-gradient(90deg, #6366F1, #8B5CF6, #EC4899)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              KAPSUL
            </h1>
            <p className="text-sm mt-2 font-medium tracking-wide" style={{ color: '#9CA3AF' }}>
              Capture the moment
            </p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider ml-1" style={{ color: '#9CA3AF' }}>
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4" style={{ color: '#9CA3AF' }} />
                </div>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full rounded-xl py-3 pl-10 pr-4 text-sm text-white transition-all outline-none"
                  style={{
                    background: '#1C1726',
                    border: '1px solid #2D2540',
                  }}
                  onFocus={e => (e.target.style.borderColor = '#6366F1')}
                  onBlur={e => (e.target.style.borderColor = '#2D2540')}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between ml-1">
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#9CA3AF' }}>
                  Password
                </label>
                <button className="text-xs font-medium transition-colors" style={{ color: '#8B5CF6' }}>
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4" style={{ color: '#9CA3AF' }} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full rounded-xl py-3 pl-10 pr-10 text-sm text-white transition-all outline-none"
                  style={{
                    background: '#1C1726',
                    border: '1px solid #2D2540',
                  }}
                  onFocus={e => (e.target.style.borderColor = '#6366F1')}
                  onBlur={e => (e.target.style.borderColor = '#2D2540')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center transition-colors"
                  style={{ color: '#9CA3AF' }}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* CTA */}
            <button
              className="w-full mt-6 text-white font-medium py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 group"
              style={{
                background: 'linear-gradient(90deg, #6366F1, #8B5CF6, #EC4899)',
                boxShadow: '0 8px 20px rgba(99,102,241,0.3)',
              }}
            >
              Sign In
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t" style={{ borderColor: '#2D2540' }} />
            <span className="px-3 text-xs font-medium uppercase tracking-wider" style={{ color: '#9CA3AF' }}>
              Or continue with
            </span>
            <div className="flex-1 border-t" style={{ borderColor: '#2D2540' }} />
          </div>

          {/* Social Logins */}
          <div className="flex gap-3">
            <button
              className="flex-1 flex items-center justify-center py-2.5 rounded-xl transition-colors"
              style={{ background: '#1C1726', border: '1px solid #2D2540' }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            </button>
            <button
              className="flex-1 flex items-center justify-center py-2.5 rounded-xl transition-colors text-white"
              style={{ background: '#1C1726', border: '1px solid #2D2540' }}
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.34-.85 3.74-.78 1.79.11 2.89 1.1 3.53 2.15-3.13 1.94-2.61 5.95.42 7.15-.71 1.65-1.63 2.82-2.77 3.65zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center mt-8 text-sm" style={{ color: '#9CA3AF' }}>
          Don't have an account?{' '}
          <button className="font-medium text-white hover:opacity-80 transition-opacity">
            Create one
          </button>
        </p>
      </div>
    </div>
  );
}
