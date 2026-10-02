import React, { useState } from 'react';
import { 
  Play, Sparkles, Flame, Zap, Shield, ArrowRight, 
  Gamepad2, Brain, Activity, Compass, Heart, Award
} from 'lucide-react';

export default function AppHomeHero({ 
  user, 
  latestResult, 
  onPlay, 
  onNavigate,
  onMoodSelect
}) {
  const [selectedMood, setSelectedMood] = useState('chill');

  const MOODS = [
    { id: 'exhausted', emoji: '🔋', label: 'Low Battery', color: 'from-orange-400 to-amber-500', desc: 'Feeling drained & fatigued' },
    { id: 'chill', emoji: '🧘', label: 'Zen & Calm', color: 'from-teal-400 to-emerald-500', desc: 'Peaceful & grounded' },
    { id: 'overthinking', emoji: '🌪️', label: 'Overthinking', color: 'from-indigo-400 to-purple-500', desc: 'Racing thoughts & worry' },
    { id: 'focused', emoji: '🚀', label: 'Fired Up', color: 'from-blue-500 to-cyan-400', desc: 'Ready for challenges' }
  ];

  const handleMoodClick = (mood) => {
    setSelectedMood(mood.id);
    if (onMoodSelect) onMoodSelect(mood.id);
  };

  const mentalWeight = latestResult?.mental_weight || 52;
  const isHealthyWeight = mentalWeight < 55;

  return (
    <div className="w-full max-w-4xl mx-auto py-2 sm:py-6 px-3 space-y-6 sm:space-y-8 animate-fadeIn">
      
      {/* Top Mobile Status Header (Gamified App Vibe) */}
      <div className="flex items-center justify-between p-3 sm:p-4 rounded-3xl neuro-flat">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl neuro-inset flex items-center justify-center text-teal-600 font-black text-sm">
            Lv.3
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 leading-tight">
              {user?.username || 'Mind Explorer'}
            </h3>
            <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
              <Award className="w-3 h-3 text-teal-600" />
              Mind Resilience Rank #4
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Daily Streak */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl neuro-inset text-orange-600 text-xs font-bold">
            <Flame className="w-4 h-4 fill-orange-500 text-orange-500 animate-pulse" />
            <span>5 Day Streak</span>
          </div>

          {/* Disease Tracking Status */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl neuro-inset text-teal-700 text-xs font-bold">
            <Shield className="w-4 h-4 text-teal-600" />
            <span>45 Diseases Tracked</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Hero Card */}
      <div className="p-6 sm:p-10 rounded-3xl sm:rounded-[2.5rem] neuro-flat relative overflow-hidden flex flex-col items-center text-center space-y-6 sm:space-y-8">
        
        {/* Soft Background Radial Aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-gradient-to-tr from-teal-400/20 via-indigo-400/20 to-purple-400/20 blur-3xl pointer-events-none" />

        {/* Interactive Mind Energy Orb */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative">
            {/* Outer Breathing Rings */}
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full neuro-flat flex items-center justify-center relative animate-breathing">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full neuro-inset flex items-center justify-center p-3">
                {/* Core Orb */}
                <div className="w-full h-full rounded-full bg-gradient-to-tr from-teal-500 via-indigo-500 to-purple-500 flex flex-col items-center justify-center shadow-lg text-white">
                  <Brain className="w-8 h-8 sm:w-10 sm:h-10 text-white animate-pulse" />
                  <span className="text-[10px] font-black tracking-wider uppercase opacity-90 mt-1">
                    {mentalWeight} kg
                  </span>
                </div>
              </div>
            </div>

            {/* Floating Energy Badge */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full neuro-flat text-[10px] font-bold text-slate-700 flex items-center gap-1 whitespace-nowrap shadow-md">
              <Sparkles className="w-3 h-3 text-teal-600" />
              {isHealthyWeight ? 'Buoyant & Free' : 'Heavy Gravity'}
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-6">
            Ready for Today's Mind Expedition?
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mt-1">
            Play cognitive challenges, scan your reflex cadence, and calibrate your 45-disease health matrix.
          </p>
        </div>

        {/* Step 1: Interactive Mood Selector */}
        <div className="w-full max-w-md space-y-2 z-10">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            How does your mind feel right now?
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {MOODS.map((m) => {
              const isSelected = selectedMood === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => handleMoodClick(m)}
                  className={`p-3 rounded-2xl flex flex-col items-center gap-1 transition-all ${
                    isSelected
                      ? 'neuro-pill-active border-2 border-teal-500/40 scale-105'
                      : 'neuro-btn hover:scale-102'
                  }`}
                >
                  <span className="text-2xl">{m.emoji}</span>
                  <span className={`text-[11px] font-bold ${isSelected ? 'text-teal-800' : 'text-slate-600'}`}>
                    {m.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: The Big Bold Pulsing PLAY Button */}
        <div className="pt-2 z-10 w-full flex flex-col items-center">
          <button
            onClick={onPlay}
            className="group relative px-8 sm:px-12 py-4 sm:py-5 rounded-3xl neuro-btn flex items-center gap-3 sm:gap-4 transition-all hover:scale-105 active:scale-95 border-2 border-teal-500/40"
            style={{
              boxShadow: '0 10px 30px rgba(13, 148, 136, 0.25), var(--nm-btn)'
            }}
          >
            {/* Pulsing Play Icon Bulb */}
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-teal-500 to-indigo-600 flex items-center justify-center text-white shadow-md group-hover:rotate-12 transition-transform">
              <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-white ml-1" />
            </div>

            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-extrabold text-teal-600 tracking-wider uppercase">
                  DAILY MISSION • 3 MINS
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-ping" />
              </div>
              <span className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight block">
                PLAY EXPEDITION
              </span>
            </div>

            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform ml-2" />
          </button>

          <span className="text-[11px] text-slate-400 font-medium mt-3">
            ✨ Stroop Test + Tap Cadence + Mood Swipes
          </span>
        </div>

      </div>

      {/* Mobile App Mode Cards (Clean, Visual, Zero Dry Clutter) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Quick Exploration Sections
          </h2>
          <span className="text-[11px] text-teal-600 font-semibold">4 Modules Ready</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          
          {/* Card 1: Game Zone */}
          <button
            onClick={() => onNavigate('activities')}
            className="p-5 rounded-3xl neuro-btn text-left flex items-start gap-4 hover:scale-[1.02] transition-all group"
          >
            <div className="w-12 h-12 rounded-2xl neuro-inset flex items-center justify-center text-teal-600 shrink-0 group-hover:scale-110 transition-transform">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-800">Activities Lab</h3>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 font-bold border border-teal-200">
                  4 Games
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Stroop Inhibition, 10s Motor Tap, Somatic Tension Heatmap, CBT Detective.
              </p>
            </div>
          </button>

          {/* Card 2: 45 Disease Matrix */}
          <button
            onClick={() => onNavigate('diseases')}
            className="p-5 rounded-3xl neuro-btn text-left flex items-start gap-4 hover:scale-[1.02] transition-all group"
          >
            <div className="w-12 h-12 rounded-2xl neuro-inset flex items-center justify-center text-indigo-600 shrink-0 group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-800">45+ Disease Radar</h3>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
                  ICD & DSM-5
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Live probability bars across Mood, Anxiety, OCD, ADHD, and Personality disorders.
              </p>
            </div>
          </button>

          {/* Card 3: Dashboard & Speedometer */}
          <button
            onClick={() => onNavigate('dashboard')}
            className="p-5 rounded-3xl neuro-btn text-left flex items-start gap-4 hover:scale-[1.02] transition-all group"
          >
            <div className="w-12 h-12 rounded-2xl neuro-inset flex items-center justify-center text-purple-600 shrink-0 group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-800">Mental Weight & Stats</h3>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-bold border border-purple-200">
                  Linear vs RF
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Speedometer gauge, regression beta formula, and longitudinal progress trajectory.
              </p>
            </div>
          </button>

          {/* Card 4: Daily Reflection Swipes */}
          <button
            onClick={() => onNavigate('checkin')}
            className="p-5 rounded-3xl neuro-btn text-left flex items-start gap-4 hover:scale-[1.02] transition-all group"
          >
            <div className="w-12 h-12 rounded-2xl neuro-inset flex items-center justify-center text-amber-600 shrink-0 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-800">Daily Journal & Swipes</h3>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold border border-amber-200">
                  WPM Tracker
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                2-line smart reflection with passive typing cadence and Tinder-style reaction cards.
              </p>
            </div>
          </button>

        </div>
      </div>

    </div>
  );
}
