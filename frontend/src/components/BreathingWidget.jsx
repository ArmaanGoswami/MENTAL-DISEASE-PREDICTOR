import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, HeartPulse } from 'lucide-react';

export default function BreathingWidget({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [isActive, setIsActive] = useState(true);
  const [phaseIndex, setPhaseIndex] = useState(0); // 0: Inhale, 1: Hold, 2: Exhale, 3: Rest
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [cycleCount, setCycleCount] = useState(0);

  const PHASES = [
    { name: 'Inhale Slowly', duration: 4, scale: 'scale-125', color: 'text-teal-300', glow: 'shadow-[0_0_50px_rgba(45,212,191,0.5)]' },
    { name: 'Hold Gently', duration: 4, scale: 'scale-125', color: 'text-indigo-300', glow: 'shadow-[0_0_50px_rgba(129,140,248,0.5)]' },
    { name: 'Exhale Completely', duration: 4, scale: 'scale-75', color: 'text-purple-300', glow: 'shadow-[0_0_30px_rgba(192,132,252,0.4)]' },
    { name: 'Hold Empty', duration: 4, scale: 'scale-75', color: 'text-neutral-400', glow: 'shadow-[0_0_20px_rgba(255,255,255,0.1)]' },
  ];

  useEffect(() => {
    let timer = null;
    if (isActive) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setPhaseIndex((currPhase) => {
              const nextPhase = (currPhase + 1) % PHASES.length;
              if (nextPhase === 0) {
                setCycleCount((c) => c + 1);
              }
              return nextPhase;
            });
            return PHASES[(phaseIndex + 1) % PHASES.length].duration;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isActive, phaseIndex]);

  const currentPhase = PHASES[phaseIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg p-8 rounded-3xl neuro-flat border border-white/10 relative text-center flex flex-col items-center">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-xl neuro-btn flex items-center justify-center text-neutral-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full neuro-inset text-[11px] text-teal-400 font-semibold mb-2">
            <HeartPulse className="w-3.5 h-3.5 animate-pulse" />
            Somatic Nervous System Reset
          </div>
          <h3 className="text-xl font-bold text-neutral-100">Box Breathing (4-4-4-4)</h3>
          <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto">
            Regulate autonomic nervous system arousal to actively drop cortisol and lighten mental load.
          </p>
        </div>

        {/* Dynamic Neumorphic Breathing Sphere */}
        <div className="w-64 h-64 my-6 rounded-full neuro-inset flex items-center justify-center relative">
          <div
            className={`w-44 h-44 rounded-full neuro-flat flex flex-col items-center justify-center transition-all duration-1000 ease-in-out ${currentPhase.scale} ${currentPhase.glow}`}
          >
            <span className={`text-4xl font-black font-mono tracking-tight ${currentPhase.color}`}>
              {secondsLeft}
            </span>
            <span className={`text-xs font-bold uppercase tracking-wider mt-1 ${currentPhase.color}`}>
              {currentPhase.name}
            </span>
          </div>
        </div>

        {/* Cycle Counter */}
        <div className="text-xs text-neutral-400 font-mono mb-6">
          Completed Cycles: <span className="text-teal-400 font-bold">{cycleCount}</span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsActive(!isActive)}
            className="px-5 py-2.5 rounded-2xl neuro-btn text-xs font-bold text-teal-300 hover:text-teal-200 flex items-center gap-2 border border-teal-500/30"
          >
            {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isActive ? 'Pause' : 'Resume'}
          </button>

          <button
            onClick={() => {
              setPhaseIndex(0);
              setSecondsLeft(4);
              setCycleCount(0);
            }}
            className="px-4 py-2.5 rounded-2xl neuro-btn text-xs font-semibold text-neutral-400 hover:text-neutral-200 flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>

      </div>
    </div>
  );
}
