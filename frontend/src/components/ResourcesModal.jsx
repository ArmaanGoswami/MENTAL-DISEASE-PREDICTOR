import React from 'react';
import { X, Phone, ShieldAlert, Sparkles, ExternalLink, HeartHandshake } from 'lucide-react';

export default function ResourcesModal({ isOpen, onClose, resources }) {
  if (!isOpen) return null;

  const helplines = resources?.helplines || [];
  const exercises = resources?.exercises || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 sm:p-8 rounded-3xl neuro-flat border border-white/10 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl neuro-inset flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-100">Crisis Support & Wellness Protocols</h3>
              <p className="text-xs text-neutral-400">Confidential, toll-free 24x7 verified psychological helplines</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl neuro-btn flex items-center justify-center text-neutral-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Helplines Directory */}
        <div className="mt-6 space-y-3">
          <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-rose-400" />
            National Verified Crisis Helplines
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {helplines.map((line, idx) => (
              <div key={idx} className="p-4 rounded-2xl neuro-inset border border-white/5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-neutral-200">{line.name}</h5>
                  <span className="text-[10px] text-teal-400 font-semibold">{line.timing}</span>
                </div>
                <p className="text-sm font-mono font-bold text-rose-400">{line.number}</p>
                <p className="text-[11px] text-neutral-400 leading-snug">{line.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Grounding & Somatic Protocols */}
        <div className="mt-6 space-y-3">
          <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            Evidence-Based Somatic Grounding
          </h4>

          <div className="space-y-3">
            {exercises.map((ex, idx) => (
              <div key={idx} className="p-4 rounded-2xl neuro-flat border border-white/5 space-y-1">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-teal-300">{ex.name}</h5>
                  <span className="text-[10px] px-2 py-0.5 rounded-full neuro-inset text-neutral-400 font-mono">
                    {ex.duration}
                  </span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">{ex.steps}</p>
                <p className="text-[11px] text-neutral-400 italic pt-0.5">Clinical purpose: {ex.purpose}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 p-3 rounded-2xl neuro-inset text-[10px] text-neutral-500 leading-relaxed text-center">
          <strong>Notice:</strong> Antigravity is an AI psychometric research & self-care companion tool. It is not an alternative to professional clinical medical diagnosis. If in severe crisis, please connect with a qualified therapist or the toll-free services above.
        </div>

      </div>
    </div>
  );
}
