import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Feather, Scale, Zap, Moon, Sliders, 
  RotateCcw, Activity, Shield, Eye, Waves, Radio
} from 'lucide-react';

export const EMOTIONAL_STATES = {
  buoyant: {
    id: 'buoyant',
    label: 'Zen Buoyant',
    sublabel: 'Featherlight & Serene',
    icon: Feather,
    color: '#0d9488',
    gradient: 'from-teal-500 to-emerald-500',
    accentText: 'text-teal-700 font-bold',
    borderStyle: 'border-teal-500/40',
    glow: 'rgba(13, 148, 136, 0.3)',
    curvature: '32px (Fluid Pillow)',
    elevation: 'Light Diffusion (-10px, +10px)',
    gravity: '24 g/cm²',
    resonance: '0.08 Hz (Theta Calm)',
    description: 'Elevated light source, fluid convex curvature, soft bioluminescent mint aura that reduces sensory fatigue.'
  },
  equilibrium: {
    id: 'equilibrium',
    label: 'Harmonic Equilibrium',
    sublabel: 'Stable & Grounded',
    icon: Scale,
    color: '#4f46e5',
    gradient: 'from-indigo-600 to-teal-600',
    accentText: 'text-indigo-700 font-bold',
    borderStyle: 'border-indigo-500/40',
    glow: 'rgba(79, 70, 229, 0.25)',
    curvature: '24px (Balanced Soft Bevel)',
    elevation: 'Crisp Dual Offset (-8px, +8px)',
    gravity: '55 g/cm²',
    resonance: '0.12 Hz (Alpha Balance)',
    description: 'Standard dual-source tactile Neumorphism with balanced slate-indigo depth and controlled contrast.'
  },
  agitated: {
    id: 'agitated',
    label: 'Hyper-Vigilant Agitation',
    sublabel: 'Sensory Overload & Tension',
    icon: Zap,
    color: '#ea580c',
    gradient: 'from-orange-500 to-amber-500',
    accentText: 'text-amber-700 font-bold',
    borderStyle: 'border-amber-500/50',
    glow: 'rgba(234, 88, 12, 0.35)',
    curvature: '16px (Sharp Tense Edge)',
    elevation: 'Compressed High-Tension (-6px, +6px)',
    gravity: '82 g/cm²',
    resonance: '0.24 Hz (Beta Alert)',
    description: 'Crisp, high-frequency shadow displacement, glowing amber alert borders, and tight structural micro-bevels.'
  },
  gravitational: {
    id: 'gravitational',
    label: 'Gravitational Burnout',
    sublabel: 'Sunken Psychological Weight',
    icon: Moon,
    color: '#7c3aed',
    gradient: 'from-purple-600 to-indigo-600',
    accentText: 'text-purple-700 font-bold',
    borderStyle: 'border-purple-500/40',
    glow: 'rgba(124, 58, 237, 0.3)',
    curvature: '20px (Sunken Void)',
    elevation: 'Deep Concave Inset (-14px, +14px)',
    gravity: '96 g/cm²',
    resonance: '0.04 Hz (Delta Sinking)',
    description: 'Deep concave inset depressions where surfaces physically sink into soft royal lilac, mirroring gravitational burnout.'
  }
};

export default function EmotionalMorphismStudio({ 
  currentEmotion, 
  setEmotion, 
  autoSync, 
  setAutoSync,
  isOpen, 
  onClose,
  latestResult
}) {
  const [tensionSlider, setTensionSlider] = useState(50);

  // Sync tension slider with emotion
  useEffect(() => {
    if (currentEmotion === 'buoyant') setTensionSlider(15);
    else if (currentEmotion === 'equilibrium') setTensionSlider(45);
    else if (currentEmotion === 'agitated') setTensionSlider(80);
    else if (currentEmotion === 'gravitational') setTensionSlider(95);
  }, [currentEmotion]);

  const handleSliderChange = (val) => {
    setTensionSlider(val);
    setAutoSync(false);
    if (val < 30) setEmotion('buoyant');
    else if (val < 65) setEmotion('equilibrium');
    else if (val < 85) setEmotion('agitated');
    else setEmotion('gravitational');
  };

  const activeState = EMOTIONAL_STATES[currentEmotion] || EMOTIONAL_STATES.equilibrium;
  const StateIcon = activeState.icon;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div 
        className="w-full max-w-2xl p-6 sm:p-8 rounded-3xl neuro-flat border border-white/80 space-y-6 relative max-h-[92vh] overflow-y-auto"
        style={{
          boxShadow: `0 0 50px ${activeState.glow}, var(--nm-flat)`
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-2xl neuro-flat flex items-center justify-center transition-all duration-500"
              style={{
                boxShadow: `0 0 20px ${activeState.glow}, var(--nm-flat)`
              }}
            >
              <StateIcon className={`w-6 h-6 ${activeState.accentText} transition-all duration-500 animate-pulse`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold text-neutral-100 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-400" />
                  Emotional Adaptive Morphism
                </h3>
                <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full neuro-inset font-mono text-teal-300">
                  REAL-TIME SHADOW SYNTHESIS
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                UI surfaces dynamically alter curvature, bevel depression, and bioluminescent aura to reflect your emotional state.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl neuro-btn flex items-center justify-center text-neutral-400 hover:text-white text-xs font-bold"
          >
            ✕
          </button>
        </div>

        {/* Bio-Sync Toggle */}
        <div className="p-4 rounded-2xl neuro-inset flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Radio className={`w-4 h-4 ${autoSync ? 'text-teal-400 animate-pulse' : 'text-neutral-500'}`} />
            <div>
              <span className="text-xs font-semibold text-neutral-200 block">
                Bio-Telemetry Auto-Sync
              </span>
              <span className="text-[10px] text-neutral-400">
                {autoSync 
                  ? `Adapting UI automatically to Mental Weight (${latestResult?.mental_weight || 58} kg) & Biomarkers`
                  : 'Manual Simulation Mode active (Override controls)'}
              </span>
            </div>
          </div>

          <button
            onClick={() => setAutoSync(!autoSync)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              autoSync ? 'neuro-pill-active text-teal-300' : 'neuro-btn text-neutral-400 hover:text-neutral-200'
            }`}
          >
            {autoSync ? 'Auto Sync ON' : 'Turn Auto ON'}
          </button>
        </div>

        {/* Emotional State Preset Selectors */}
        <div className="space-y-2">
          <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
            Select Emotional Morphism Preset
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {Object.values(EMOTIONAL_STATES).map((state) => {
              const Icon = state.icon;
              const isSelected = currentEmotion === state.id;
              return (
                <button
                  key={state.id}
                  onClick={() => {
                    setEmotion(state.id);
                    setAutoSync(false);
                  }}
                  className={`p-3.5 rounded-2xl text-left flex flex-col justify-between gap-3 transition-all ${
                    isSelected
                      ? 'neuro-pill-active border'
                      : 'neuro-btn hover:border-white/10'
                  }`}
                  style={{
                    borderColor: isSelected ? state.color : undefined
                  }}
                >
                  <div className="flex items-center justify-between">
                    <Icon className="w-5 h-5" style={{ color: state.color }} />
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: state.color }} />
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-neutral-100 block leading-tight">
                      {state.label.split(' ')[0]}
                    </span>
                    <span className="text-[10px] text-neutral-400 block truncate">
                      {state.sublabel}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Real-time Tension Morphism Slider */}
        <div className="p-4 rounded-2xl neuro-flat space-y-3 border border-white/5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-neutral-300 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-teal-400" />
              Continuous Emotional Tension Slider
            </span>
            <span className={`font-mono font-bold ${activeState.accentText}`}>
              {tensionSlider}% • {activeState.label}
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            value={tensionSlider}
            onChange={(e) => handleSliderChange(parseInt(e.target.value))}
            className="w-full h-2 rounded-lg neuro-inset accent-teal-400 cursor-pointer"
          />

          <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
            <span>0% Buoyant</span>
            <span>45% Equilibrium</span>
            <span>75% Agitated</span>
            <span>100% Gravitational</span>
          </div>
        </div>

        {/* Live Morphism Telemetry Grid */}
        <div className="p-4 rounded-2xl neuro-inset space-y-3">
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
            Physical Morphism Telemetry Specs
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-2.5 rounded-xl neuro-flat">
              <span className="text-[10px] text-neutral-500 block">Surface Curvature</span>
              <span className="font-mono font-semibold text-neutral-200">{activeState.curvature}</span>
            </div>
            <div className="p-2.5 rounded-xl neuro-flat">
              <span className="text-[10px] text-neutral-500 block">Shadow Elevation</span>
              <span className="font-mono font-semibold text-neutral-200">{activeState.elevation}</span>
            </div>
            <div className="p-2.5 rounded-xl neuro-flat">
              <span className="text-[10px] text-neutral-500 block">Atmospheric Gravity</span>
              <span className="font-mono font-semibold text-teal-300">{activeState.gravity}</span>
            </div>
            <div className="p-2.5 rounded-xl neuro-flat">
              <span className="text-[10px] text-neutral-500 block">Kinetic Resonance</span>
              <span className="font-mono font-semibold text-indigo-300">{activeState.resonance}</span>
            </div>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed italic pt-1">
            "{activeState.description}"
          </p>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl neuro-btn text-xs font-semibold text-teal-300 hover:text-white border border-teal-500/20"
          >
            Apply & Experience Adaptive UI
          </button>
        </div>
      </div>
    </div>
  );
}
