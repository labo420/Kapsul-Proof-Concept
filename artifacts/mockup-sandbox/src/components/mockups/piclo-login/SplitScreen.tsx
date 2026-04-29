import React, { useState } from 'react';
import { Mail, Lock, Apple, Command } from 'lucide-react';

export function SplitScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="flex justify-center items-center min-h-screen bg-neutral-900 overflow-hidden font-sans">
      <div className="relative w-full max-w-[390px] h-[844px] bg-white overflow-hidden flex flex-col">
        {/* Top Section - Expressive Collage */}
        <div className="relative h-[55%] w-full overflow-hidden flex-shrink-0 bg-neutral-100">
          {/* Collage Grid */}
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-4 gap-2 p-2 transform -rotate-6 scale-125 origin-center opacity-90">
            {/* Generating pseudo-images with gradients */}
            <div className="col-span-2 row-span-2 bg-gradient-to-br from-rose-300 to-orange-200 rounded-lg shadow-sm"></div>
            <div className="bg-gradient-to-tr from-blue-200 to-indigo-300 rounded-lg shadow-sm"></div>
            <div className="bg-gradient-to-b from-amber-100 to-orange-300 rounded-lg shadow-sm"></div>
            <div className="col-span-2 bg-gradient-to-r from-emerald-200 to-teal-400 rounded-lg shadow-sm"></div>
            <div className="row-span-2 bg-gradient-to-t from-fuchsia-300 to-pink-200 rounded-lg shadow-sm"></div>
            <div className="bg-gradient-to-br from-violet-300 to-purple-400 rounded-lg shadow-sm"></div>
            <div className="bg-gradient-to-bl from-yellow-200 to-amber-300 rounded-lg shadow-sm"></div>
          </div>
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-rose-900/40 to-black/80"></div>
          
          {/* Tagline */}
          <div className="absolute inset-0 flex flex-col justify-end p-8 pb-12">
            <h1 className="text-4xl font-serif text-white leading-tight mb-2 tracking-tight">
              Every moment,<br />
              <span className="italic text-rose-200">perfectly</span> captured.
            </h1>
            <p className="text-white/80 text-sm">Your memories, beautifully collected.</p>
          </div>
        </div>

        {/* Bottom Section - Clean Form */}
        <div className="relative h-full flex-grow bg-white -mt-6 rounded-t-3xl flex flex-col px-8 pt-8 pb-6 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-10">
          {/* Handle */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-neutral-200 rounded-full"></div>

          <div className="flex-1 flex flex-col">
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900 mb-6">Welcome to <span className="text-rose-500">Piclo</span></h2>
            
            <div className="space-y-4 mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  type="email"
                  className="block w-full pl-10 pr-3 py-3 border border-neutral-200 rounded-xl bg-neutral-50 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 focus:bg-white transition-colors outline-none text-neutral-900 placeholder:text-neutral-400"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  type="password"
                  className="block w-full pl-10 pr-3 py-3 border border-neutral-200 rounded-xl bg-neutral-50 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 focus:bg-white transition-colors outline-none text-neutral-900 placeholder:text-neutral-400"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button className="w-full bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-rose-500/30 transition-all flex justify-center items-center gap-2">
              Sign in
            </button>

            <div className="mt-6 flex items-center">
              <div className="flex-grow border-t border-neutral-200"></div>
              <span className="flex-shrink-0 mx-4 text-sm text-neutral-400">Or continue with</span>
              <div className="flex-grow border-t border-neutral-200"></div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button className="flex justify-center items-center gap-2 py-2.5 px-4 border border-neutral-200 rounded-xl hover:bg-neutral-50 active:bg-neutral-100 transition-colors text-neutral-700 font-medium text-sm">
                <Command className="w-4 h-4" />
                Google
              </button>
              <button className="flex justify-center items-center gap-2 py-2.5 px-4 border border-neutral-200 rounded-xl hover:bg-neutral-50 active:bg-neutral-100 transition-colors text-neutral-700 font-medium text-sm">
                <Apple className="w-5 h-5 mb-0.5" />
                Apple
              </button>
            </div>
            
            <div className="mt-auto pt-6 text-center">
              <p className="text-sm text-neutral-500">
                New to Piclo?{' '}
                <a href="#" className="text-rose-500 font-semibold hover:text-rose-600 transition-colors">
                  Get started
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
