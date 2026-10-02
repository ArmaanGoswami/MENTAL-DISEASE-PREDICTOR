import React, { useState } from 'react';
import { 
  Search, Filter, ShieldAlert, ChevronDown, ChevronUp, 
  Info, AlertTriangle, CheckCircle2, Bookmark, BookOpen, Layers
} from 'lucide-react';

export default function DiseaseEncyclopedia({ diseases }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedId, setExpandedId] = useState(null);

  const categories = [
    'All',
    'Mood & Affective Disorders',
    'Anxiety & Panic Spectrum',
    'Trauma & Stress Spectrum',
    'Obsessive-Compulsive Spectrum',
    'Neurodevelopmental & Executive',
    'Personality Disorders',
    'Dissociative & Somatic',
    'Sleep-Wake & Cognitive Syndromes'
  ];

  const filteredDiseases = (diseases || []).filter((d) => {
    const matchesCat = selectedCategory === 'All' || d.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      d.name.toLowerCase().includes(q) ||
      d.description.toLowerCase().includes(q) ||
      (d.hallmarks && d.hallmarks.toLowerCase().includes(q)) ||
      (d.icd_code && d.icd_code.toLowerCase().includes(q));
    return matchesCat && matchesSearch;
  });

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-6 px-4 space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-100 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-teal-400" />
            <span>45+ Mental Disease & Disorder Directory</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Full DSM-5 & ICD-11 psychiatric spectrum with live user probability scores.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-400 font-mono">
            {filteredDiseases.length} Conditions Listed
          </span>
        </div>
      </div>

      {/* Search Bar & Category Filter Pills */}
      <div className="p-4 rounded-3xl neuro-flat space-y-4">
        
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Search 45+ disorders by name, symptom (e.g. 'panic', 'insomnia', 'ocd'), or ICD code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl neuro-inset text-xs sm:text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-teal-400"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? 'neuro-pill-active text-teal-300'
                    : 'neuro-btn text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {cat.split(' ')[0]} {cat.includes('&') ? cat.split('&')[1]?.trim().split(' ')[0] : ''}
              </button>
            );
          })}
        </div>
      </div>

      {/* Disease Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDiseases.map((disease) => {
          const isExpanded = expandedId === disease.id;
          
          let tierStyle = 'border-emerald-500/20';
          let barGradient = 'from-teal-400 to-emerald-400';
          let textColor = 'text-teal-400';
          
          if (disease.badge === 'amber') {
            tierStyle = 'border-amber-500/30';
            barGradient = 'from-teal-400 to-amber-400';
            textColor = 'text-amber-400';
          } else if (disease.badge === 'orange') {
            tierStyle = 'border-orange-500/40';
            barGradient = 'from-amber-400 to-orange-500';
            textColor = 'text-orange-400';
          } else if (disease.badge === 'rose') {
            tierStyle = 'border-rose-500/50';
            barGradient = 'from-orange-500 to-rose-600';
            textColor = 'text-rose-400';
          }

          return (
            <div
              key={disease.id}
              className={`p-5 rounded-3xl neuro-flat border ${tierStyle} flex flex-col justify-between transition-all`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-indigo-400 font-mono font-semibold">
                        ICD: {disease.icd_code}
                      </span>
                      <span className="text-[9px] uppercase px-2 py-0.5 rounded-full neuro-inset text-neutral-400">
                        {disease.category.split(' ')[0]}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-neutral-100 mt-1">
                      {disease.name}
                    </h3>
                  </div>

                  {/* Calculated Probability Score */}
                  <div className="text-right shrink-0">
                    <span className={`text-base font-black font-mono tracking-tight ${textColor}`}>
                      {disease.score || 15.0}%
                    </span>
                    <span className="block text-[9px] uppercase font-semibold text-neutral-400">
                      {disease.tier || 'Low / Stable'}
                    </span>
                  </div>
                </div>

                {/* Probability Bar */}
                <div className="w-full h-1.5 rounded-full neuro-inset overflow-hidden my-3">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${barGradient} transition-all duration-500`}
                    style={{ width: `${Math.min(100, disease.score || 15)}%` }}
                  />
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed">
                  {disease.description}
                </p>

                {disease.hallmarks && (
                  <p className="text-[11px] text-neutral-400 mt-2 font-mono">
                    <strong className="text-teal-400 font-sans">Biomarkers:</strong> {disease.hallmarks}
                  </p>
                )}
              </div>

              {/* Expandable Criteria */}
              <div className="mt-4 pt-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => toggleExpand(disease.id)}
                  className="w-full flex items-center justify-between text-xs font-semibold text-neutral-400 hover:text-teal-300 transition-colors"
                >
                  <span>{isExpanded ? 'Hide DSM-5 Criteria' : 'View DSM-5 Clinical Criteria'}</span>
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {isExpanded && (
                  <div className="mt-3 space-y-2 text-xs text-neutral-300 animate-fadeIn">
                    <div className="p-3 rounded-2xl neuro-inset border border-white/5 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[11px] text-indigo-400 font-bold">
                        <Info className="w-3.5 h-3.5" />
                        <span>Diagnostic Criteria ({disease.dsm_code})</span>
                      </div>
                      <p className="text-neutral-400 leading-relaxed text-[11px]">
                        {disease.dsm_criteria}
                      </p>
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
