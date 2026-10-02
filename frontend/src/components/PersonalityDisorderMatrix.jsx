import React, { useState } from 'react';
import { 
  BrainCircuit, ShieldAlert, AlertCircle, ChevronDown, ChevronUp, 
  Layers, CheckCircle2, Sparkles, Filter, Info, Fingerprint
} from 'lucide-react';

export default function PersonalityDisorderMatrix({ diagnostics }) {
  if (!diagnostics || !diagnostics.disorders) return null;

  const [activeClusterFilter, setActiveClusterFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const { disorders, primary_archetype, cluster_summary, highest_risk_condition, highest_risk_score } = diagnostics;

  const filterMap = {
    all: () => true,
    cluster_a: (d) => d.cluster.includes('Cluster A'),
    cluster_b: (d) => d.cluster.includes('Cluster B'),
    cluster_c: (d) => d.cluster.includes('Cluster C'),
    syndromes: (d) => d.cluster.includes('Syndrome')
  };

  const filteredDisorders = disorders.filter(filterMap[activeClusterFilter] || (() => true));

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="w-full p-6 sm:p-7 rounded-3xl neuro-flat space-y-6">
      
      {/* Header & Primary Personality Archetype */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <Fingerprint className="w-5 h-5 text-teal-400" />
            <h3 className="text-lg font-bold text-neutral-100">
              Personality-Based Disease & Disorder Matrix
            </h3>
            <span className="text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full neuro-inset font-semibold text-indigo-400">
              DSM-5 & ICD-11
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            Diagnostic mapping of Big Five psychometric dimensions to personality vulnerability clusters.
          </p>
        </div>

        {/* Primary Archetype Badge */}
        <div className="px-4 py-2.5 rounded-2xl neuro-inset border border-teal-500/20 flex items-center gap-3">
          <BrainCircuit className="w-5 h-5 text-teal-400 animate-pulse shrink-0" />
          <div>
            <p className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">
              Primary Trait Archetype
            </p>
            <p className="text-xs font-bold text-teal-300">
              {primary_archetype || "The Adaptive Harmonizer"}
            </p>
          </div>
        </div>
      </div>

      {/* Cluster Risk Summaries */}
      {cluster_summary && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {Object.entries(cluster_summary).map(([name, score], idx) => {
            const isHigh = score >= 65;
            return (
              <div key={idx} className="p-3.5 rounded-2xl neuro-inset space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-neutral-300 truncate" title={name}>
                    {name.split('(')[0].trim()}
                  </span>
                  <span className={`text-xs font-mono font-bold ${isHigh ? 'text-orange-400' : 'text-teal-400'}`}>
                    {score}%
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${isHigh ? 'bg-gradient-to-r from-amber-400 to-orange-500' : 'bg-gradient-to-r from-teal-400 to-indigo-500'}`}
                    style={{ width: `${Math.min(100, score)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <span className="text-xs font-semibold text-neutral-400 flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5" />
          Filter Diagnostic Clusters:
        </span>
        <div className="flex flex-wrap p-1 rounded-2xl neuro-inset gap-1">
          {[
            { id: 'all', label: 'All Patterns' },
            { id: 'cluster_b', label: 'Cluster B (Volatile/BPD)' },
            { id: 'cluster_c', label: 'Cluster C (OCPD/Anxious)' },
            { id: 'cluster_a', label: 'Cluster A (Detached)' },
            { id: 'syndromes', label: 'Syndromes' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveClusterFilter(tab.id)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                activeClusterFilter === tab.id
                  ? 'neuro-pill-active text-teal-300'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Disorder Diagnostic Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDisorders.map((disorder) => {
          const isExpanded = expandedId === disorder.id;
          
          let tierStyle = 'border-emerald-500/20 text-emerald-400';
          let barGradient = 'from-teal-400 to-emerald-400';
          if (disorder.badge === 'amber') {
            tierStyle = 'border-amber-500/30 text-amber-400';
            barGradient = 'from-teal-400 to-amber-400';
          } else if (disorder.badge === 'orange') {
            tierStyle = 'border-orange-500/40 text-orange-400';
            barGradient = 'from-amber-400 to-orange-500';
          } else if (disorder.badge === 'rose') {
            tierStyle = 'border-rose-500/50 text-rose-400';
            barGradient = 'from-orange-500 to-rose-600';
          }

          return (
            <div
              key={disorder.id}
              className={`p-4 rounded-2xl neuro-inset border transition-all duration-300 ${tierStyle} flex flex-col justify-between`}
            >
              <div>
                {/* Card Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">
                      {disorder.cluster}
                    </span>
                    <h4 className="text-sm font-bold text-neutral-100 mt-0.5">
                      {disorder.name}
                    </h4>
                  </div>
                  
                  {/* Probability Score Pill */}
                  <div className="text-right shrink-0">
                    <span className="text-base font-black font-mono tracking-tight block">
                      {disorder.score}%
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider block">
                      {disorder.tier}
                    </span>
                  </div>
                </div>

                {/* Probability Bar */}
                <div className="w-full h-2 rounded-full bg-neutral-800/80 overflow-hidden my-3">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${barGradient} transition-all duration-500`}
                    style={{ width: `${Math.min(100, disorder.score)}%` }}
                  />
                </div>

                {/* Trait Connection */}
                <p className="text-[11px] text-neutral-400 leading-snug">
                  <span className="font-semibold text-neutral-300">Psychometric Links:</span> {disorder.traits}
                </p>
              </div>

              {/* Expandable Clinical Details */}
              <div className="mt-3 pt-2.5 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => toggleExpand(disorder.id)}
                  className="w-full flex items-center justify-between text-[11px] font-semibold text-neutral-400 hover:text-teal-300 transition-colors"
                >
                  <span>{isExpanded ? 'Hide Clinical Insights' : 'View DSM-5 Clinical Insights'}</span>
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {isExpanded && (
                  <div className="mt-2.5 space-y-2 text-xs text-neutral-300 animate-fadeIn">
                    <p className="leading-relaxed bg-black/30 p-2.5 rounded-xl border border-white/5">
                      {disorder.description}
                    </p>
                    <div className="flex items-center gap-1.5 text-[11px] text-indigo-400 font-mono">
                      <Info className="w-3 h-3 shrink-0" />
                      <span>Criteria: {disorder.dsm_marker}</span>
                    </div>
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
