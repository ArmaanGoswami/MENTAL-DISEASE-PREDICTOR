import React from 'react';
import { Feather, User, PhoneCall, Sparkles, Activity, FileDown, Gamepad2, BookOpen, Compass } from 'lucide-react';

export default function Navbar({ 
  user, 
  onOpenProfile, 
  onOpenSOS, 
  onOpenReport, 
  onOpenMorphism,
  currentEmotion = 'equilibrium',
  activeTab, 
  setActiveTab 
}) {
  const emotionConfig = {
    buoyant: { label: 'Zen Buoyant', color: '#0d9488', text: 'text-teal-700 font-bold', ping: 'bg-teal-500' },
    equilibrium: { label: 'Equilibrium', color: '#4f46e5', text: 'text-indigo-700 font-bold', ping: 'bg-indigo-500' },
    agitated: { label: 'Agitated', color: '#ea580c', text: 'text-amber-700 font-bold', ping: 'bg-amber-500' },
    gravitational: { label: 'Gravitational', color: '#7c3aed', text: 'text-purple-700 font-bold', ping: 'bg-purple-500' }
  }[currentEmotion] || { label: 'Adaptive UI', color: '#4f46e5', text: 'text-indigo-700 font-bold', ping: 'bg-indigo-500' };
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[var(--bg-main)]/90 border-b border-white/60 px-4 sm:px-6 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl neuro-flat flex items-center justify-center text-teal-600 shadow-teal-500/10 hover:scale-105 transition-transform cursor-pointer">
            <Feather className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-teal-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                ANTIGRAVITY
              </span>
              <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full neuro-inset font-bold text-teal-700">
                45+ AI LAB
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 font-medium hidden sm:block">Lifting the Heavy Weight of Burnout & Mental Disorders</p>
          </div>
        </div>

        {/* Navigation Tabs (Desktop App Dock) */}
        <div className="hidden xl:flex items-center p-1 rounded-2xl neuro-inset gap-1">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'home'
                ? 'neuro-pill-active text-teal-800'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-teal-600" />
            Home
          </button>

          <button
            onClick={() => setActiveTab('activities')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'activities'
                ? 'neuro-pill-active text-teal-800'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5 text-teal-600" />
            Play Zone
          </button>

          <button
            onClick={() => setActiveTab('diseases')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'diseases'
                ? 'neuro-pill-active text-teal-800'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
            45 Diseases
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'dashboard'
                ? 'neuro-pill-active text-teal-800'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-purple-600" />
            Stats & ML
          </button>

          <button
            onClick={() => setActiveTab('checkin')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'checkin'
                ? 'neuro-pill-active text-teal-800'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Daily Journal
          </button>
        </div>

        {/* User Controls & Actions */}
        <div className="flex items-center gap-2">
          {/* Emotional Adaptive Morphism Studio Trigger */}
          <button
            onClick={onOpenMorphism}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl neuro-btn text-xs font-semibold transition-all border`}
            style={{
              borderColor: `${emotionConfig.color}40`,
              boxShadow: `0 0 14px ${emotionConfig.color}25, var(--nm-btn)`
            }}
            title="Open Emotional Adaptive Morphism Studio"
          >
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${emotionConfig.ping}`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${emotionConfig.ping}`} />
            </span>
            <span className={`hidden md:inline ${emotionConfig.text}`}>
              {emotionConfig.label} UI
            </span>
            <Sparkles className="w-3 h-3 text-neutral-400" />
          </button>

          <button
            onClick={onOpenReport}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl neuro-btn text-teal-300 hover:text-teal-200 text-xs font-medium border border-teal-500/20 transition-all"
            title="Export Assessment Report"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Report</span>
          </button>

          <button
            onClick={onOpenSOS}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl neuro-btn text-rose-400 hover:text-rose-300 text-xs font-medium border border-rose-500/20 hover:border-rose-500/40 transition-all"
            title="Helplines & Crisis Support"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">SOS</span>
          </button>

          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl neuro-btn text-neutral-300 hover:text-white text-xs font-medium"
            title="Profile & Demographics"
          >
            <div className="w-6 h-6 rounded-lg neuro-inset flex items-center justify-center text-teal-400">
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="text-left hidden 2xl:block">
              <p className="leading-none text-[11px] font-semibold text-neutral-200">{user?.username || 'Explorer'}</p>
              <p className="text-[10px] text-neutral-400 mt-0.5">{user?.occupation || 'Student'} • {user?.age || 21}y</p>
            </div>
          </button>
        </div>

      </div>

      {/* Mobile App Navigation Dock */}
      <div className="flex xl:hidden overflow-x-auto items-center mt-2.5 p-1 rounded-xl neuro-inset gap-1">
        <button
          onClick={() => setActiveTab('home')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg shrink-0 flex items-center gap-1 ${
            activeTab === 'home' ? 'neuro-pill-active text-teal-800' : 'text-slate-600'
          }`}
        >
          <Compass className="w-3 h-3 text-teal-600" />
          Home
        </button>
        <button
          onClick={() => setActiveTab('activities')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg shrink-0 flex items-center gap-1 ${
            activeTab === 'activities' ? 'neuro-pill-active text-teal-800' : 'text-slate-600'
          }`}
        >
          <Gamepad2 className="w-3 h-3 text-teal-600" />
          Play Zone
        </button>
        <button
          onClick={() => setActiveTab('diseases')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg shrink-0 flex items-center gap-1 ${
            activeTab === 'diseases' ? 'neuro-pill-active text-teal-800' : 'text-slate-600'
          }`}
        >
          <BookOpen className="w-3 h-3 text-indigo-600" />
          45 Diseases
        </button>
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg shrink-0 flex items-center gap-1 ${
            activeTab === 'dashboard' ? 'neuro-pill-active text-teal-800' : 'text-slate-600'
          }`}
        >
          <Activity className="w-3 h-3 text-purple-600" />
          Stats & ML
        </button>
        <button
          onClick={() => setActiveTab('checkin')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg shrink-0 flex items-center gap-1 ${
            activeTab === 'checkin' ? 'neuro-pill-active text-teal-800' : 'text-slate-600'
          }`}
        >
          <Sparkles className="w-3 h-3 text-amber-500" />
          Journal
        </button>
      </div>
    </header>
  );
}
