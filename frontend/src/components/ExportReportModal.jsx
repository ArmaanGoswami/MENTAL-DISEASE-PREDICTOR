import React from 'react';
import { X, Printer, Download, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function ExportReportModal({ isOpen, onClose, user, latestResult }) {
  if (!isOpen || !latestResult) return null;

  const handlePrint = () => {
    window.print();
  };

  const pDiag = latestResult.personality_diagnostics || {};
  const disorders = pDiag.disorders || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-3xl neuro-flat border border-white/10 relative print:bg-white print:text-black print:max-h-none print:shadow-none">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/5 print:border-black/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl neuro-inset flex items-center justify-center text-teal-400 print:hidden">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-100 print:text-black">
                Comprehensive Psychometric & Personality Assessment Report
              </h3>
              <p className="text-xs text-neutral-400 print:text-gray-600">
                Generated via Antigravity ML Diagnostic Engine • Non-Diagnostic Wellness Evaluation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl neuro-btn text-xs font-bold text-teal-300 hover:text-teal-200 flex items-center gap-1.5 border border-teal-500/30"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl neuro-btn flex items-center justify-center text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Report Content */}
        <div className="mt-6 space-y-6 text-neutral-200 print:text-black">
          
          {/* Patient Profile */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl neuro-inset print:border print:border-gray-300">
            <div>
              <span className="text-[10px] text-neutral-400 print:text-gray-500 uppercase font-semibold">User / Patient</span>
              <p className="text-xs font-bold text-neutral-100 print:text-black">{user?.username || 'Explorer'}</p>
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 print:text-gray-500 uppercase font-semibold">Demographics</span>
              <p className="text-xs font-bold text-neutral-100 print:text-black">{user?.age} yrs • {user?.occupation}</p>
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 print:text-gray-500 uppercase font-semibold">Sleep Baseline</span>
              <p className="text-xs font-bold text-neutral-100 print:text-black">{user?.baseline_sleep} hrs/night</p>
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 print:text-gray-500 uppercase font-semibold">Assessment Date</span>
              <p className="text-xs font-bold text-neutral-100 print:text-black">
                {latestResult.timestamp ? new Date(latestResult.timestamp).toLocaleString() : 'Recent'}
              </p>
            </div>
          </div>

          {/* Primary Archetype & Mental Weight Banner */}
          <div className="p-5 rounded-2xl neuro-flat border border-teal-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 print:border-teal-700">
            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-400 print:text-gray-600">
                Primary Trait Archetype
              </span>
              <h4 className="text-lg font-black text-teal-300 print:text-teal-800">
                {pDiag.primary_archetype || "The Adaptive Harmonizer"}
              </h4>
              <p className="text-xs text-neutral-400 print:text-gray-600 mt-0.5">
                Gravitational load classification: <strong>{latestResult.risk_level}</strong>
              </p>
            </div>

            <div className="text-right">
              <span className="text-3xl font-black font-mono text-teal-400 print:text-teal-700">
                {latestResult.mental_weight} kg
              </span>
              <span className="block text-[10px] text-neutral-400 print:text-gray-600 font-semibold uppercase">
                Mental Gravity Index
              </span>
            </div>
          </div>

          {/* Core Psychometric OCEAN Traits */}
          <div className="space-y-2">
            <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-400 print:text-gray-700">
              Big Five (OCEAN) Trait Metrics
            </h5>
            <div className="grid grid-cols-5 gap-2 text-center text-xs">
              {Object.entries(latestResult.ocean_scores || {}).map(([trait, val]) => (
                <div key={trait} className="p-2.5 rounded-xl neuro-inset print:border print:border-gray-300">
                  <p className="text-[11px] font-semibold text-neutral-300 print:text-gray-700">{trait}</p>
                  <p className="text-base font-black font-mono text-teal-400 print:text-teal-800">{val}%</p>
                </div>
              ))}
            </div>
          </div>

          {/* Personality-Based Disorders Summary */}
          {disorders.length > 0 && (
            <div className="space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-400 print:text-gray-700">
                DSM-5 / ICD-11 Personality-Based Disease Vulnerabilities
              </h5>
              <div className="space-y-2">
                {disorders.slice(0, 4).map((d) => (
                  <div key={d.id} className="p-3 rounded-xl neuro-inset flex items-center justify-between text-xs print:border print:border-gray-300">
                    <div>
                      <p className="font-bold text-neutral-200 print:text-black">{d.name}</p>
                      <p className="text-[10px] text-neutral-400 print:text-gray-600">{d.cluster} • {d.traits}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-teal-400 print:text-teal-800">{d.score}%</span>
                      <span className="block text-[9px] uppercase font-semibold text-neutral-400 print:text-gray-600">{d.tier}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actionable Recommendations */}
          <div className="space-y-2">
            <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-400 print:text-gray-700">
              Prescribed Interventions & Self-Care Plan
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {(latestResult.recommendations || []).map((r, i) => (
                <div key={i} className="p-3 rounded-xl neuro-flat border border-white/5 print:border-gray-300">
                  <p className="font-bold text-teal-300 print:text-teal-800">{r.title}</p>
                  <p className="text-[11px] text-neutral-300 print:text-gray-700 mt-1">{r.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="p-3 rounded-xl neuro-inset text-[10px] text-neutral-500 print:text-gray-500 leading-relaxed text-center">
            This document is generated by the Antigravity AI Engine as a research and cognitive health tracking tool. It is not an official clinical psychiatric diagnosis.
          </div>

        </div>

      </div>
    </div>
  );
}
