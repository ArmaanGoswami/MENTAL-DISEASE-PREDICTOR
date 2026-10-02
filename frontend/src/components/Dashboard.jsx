import React from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';
import { 
  Feather, Activity, AlertTriangle, ShieldCheck, Flame, HeartHandshake, 
  Sparkles, TrendingDown, ArrowUpRight, Compass, HeartPulse
} from 'lucide-react';
import PersonalityDisorderMatrix from './PersonalityDisorderMatrix';
import ModelComparisonCard from './ModelComparisonCard';

export default function Dashboard({ latestResult, history, onGoToCheckin, onOpenBreathing }) {
  if (!latestResult) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl neuro-flat mx-auto flex items-center justify-center text-teal-400">
          <Feather className="w-8 h-8 animate-pulse" />
        </div>
        <h3 className="text-xl font-bold text-neutral-200">No Assessment Recorded Yet</h3>
        <p className="text-xs text-neutral-400 max-w-md mx-auto">
          Start your first 'Weight' check via journal or situational swipes to calibrate your Antigravity score.
        </p>
        <button
          onClick={onGoToCheckin}
          className="px-6 py-2.5 rounded-2xl neuro-btn text-xs font-bold text-teal-300 hover:text-teal-200 inline-flex items-center gap-2 border border-teal-500/30"
        >
          <Sparkles className="w-4 h-4" />
          Take First Assessment
        </button>
      </div>
    );
  }

  // Format Radar data for OCEAN
  const oceanData = [
    { trait: 'Openness', score: latestResult.ocean_scores?.Openness || 50, fullMark: 100 },
    { trait: 'Conscientious', score: latestResult.ocean_scores?.Conscientiousness || 50, fullMark: 100 },
    { trait: 'Extraversion', score: latestResult.ocean_scores?.Extraversion || 50, fullMark: 100 },
    { trait: 'Agreeable', score: latestResult.ocean_scores?.Agreeableness || 50, fullMark: 100 },
    { trait: 'Neuroticism', score: latestResult.ocean_scores?.Neuroticism || 50, fullMark: 100 },
  ];

  // Format historical trend data
  const historyData = (history || []).map((item, idx) => ({
    name: item.timestamp ? new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : `Day ${idx + 1}`,
    weight: item.mental_weight,
    burnout: item.burnout_risk,
    anxiety: item.anxiety_risk
  }));

  // Determine weight tier badge & visual description
  const weight = latestResult.mental_weight || 50;
  let weightDescriptor = {
    title: 'Featherlight & Free',
    status: 'Optimal Well-being',
    color: 'text-teal-400',
    barColor: 'from-teal-400 to-emerald-400',
    advice: 'Your cognitive buoyancy is high. Excellent equilibrium.'
  };

  if (weight >= 35 && weight < 65) {
    weightDescriptor = {
      title: 'Balanced Gravity',
      status: 'Moderate Equilibrium',
      color: 'text-amber-400',
      barColor: 'from-amber-400 to-yellow-500',
      advice: 'Manageable tension. Regular recovery breaks recommended.'
    };
  } else if (weight >= 65 && weight < 85) {
    weightDescriptor = {
      title: 'Heavy Gravity',
      status: 'High Strain & Burnout Warning',
      color: 'text-orange-400',
      barColor: 'from-orange-500 to-amber-500',
      advice: 'Substantial cognitive weight detected. Prioritize active rest.'
    };
  } else if (weight >= 85) {
    weightDescriptor = {
      title: 'Critical Gravitational Pull',
      status: 'Severe Overwhelm',
      color: 'text-rose-400',
      barColor: 'from-rose-500 to-red-600',
      advice: 'High emotional drag. Reach out to peer or professional support.'
    };
  }

  return (
    <div className="w-full max-w-6xl mx-auto py-6 px-4 space-y-6 animate-fadeIn">
      
      {/* Top Banner: Core Antigravity Score & Quick Action */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Core 'Mental Weight' Dial */}
        <div className="lg:col-span-1 p-6 rounded-3xl neuro-flat flex flex-col items-center justify-center text-center relative overflow-hidden">
          <span className="text-[11px] uppercase tracking-wider px-3 py-1 rounded-full neuro-inset text-neutral-400 font-bold mb-4">
            Current Mental Weight
          </span>

          {/* Neumorphic Dial Visual */}
          <div className="w-48 h-48 rounded-full neuro-inset flex items-center justify-center relative p-3">
            <div className="w-full h-full rounded-full neuro-flat flex flex-col items-center justify-center relative">
              <span className={`text-5xl font-black font-mono tracking-tight ${weightDescriptor.color}`}>
                {weight}
              </span>
              <span className="text-xs text-neutral-400 font-semibold uppercase tracking-wider mt-0.5">
                kg Gravity
              </span>
            </div>
          </div>

          <div className="mt-4">
            <h4 className={`text-base font-bold ${weightDescriptor.color}`}>
              {weightDescriptor.title}
            </h4>
            <p className="text-xs text-neutral-400 mt-1 max-w-[240px]">
              {weightDescriptor.advice}
            </p>
          </div>

          {/* Quick breathing CTA */}
          <button
            onClick={onOpenBreathing}
            className="mt-4 px-4 py-2 rounded-xl neuro-btn text-xs font-bold text-teal-300 hover:text-teal-200 flex items-center gap-2 border border-teal-500/20"
          >
            <HeartPulse className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
            Launch Somatic Reset Bubble
          </button>
        </div>

        {/* Big Five OCEAN Radar Chart */}
        <div className="lg:col-span-2 p-6 rounded-3xl neuro-flat flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <div>
              <h3 className="text-base font-bold text-neutral-100 flex items-center gap-2">
                <Compass className="w-4 h-4 text-indigo-400" />
                NLP Psychometric Radar (Big Five OCEAN)
              </h3>
              <p className="text-xs text-neutral-400">
                Psychological traits extracted from your language patterns and journal sentiment.
              </p>
            </div>
            <span className="text-[11px] px-2.5 py-1 rounded-xl neuro-inset text-indigo-300 font-mono">
              Traits Analysis
            </span>
          </div>

          <div className="w-full h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={oceanData}>
                <PolarGrid stroke="#2d3748" />
                <PolarAngleAxis dataKey="trait" stroke="#9ca3af" tick={{ fill: '#a0aec0', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#4a5568" tick={false} />
                <Radar
                  name="OCEAN Trait Score"
                  dataKey="score"
                  stroke="#2dd4bf"
                  fill="#2dd4bf"
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Trait Pills */}
          <div className="grid grid-cols-5 gap-2 pt-2 text-center text-[10px] text-neutral-400">
            {oceanData.map((t, i) => (
              <div key={i} className="p-1.5 rounded-xl neuro-inset">
                <p className="font-semibold text-neutral-300">{t.trait}</p>
                <p className="font-mono text-teal-400 font-bold">{t.score}%</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Middle Section: Risk Predictor Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Burnout Risk */}
        <div className="p-5 rounded-3xl neuro-flat space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-orange-400" />
              Burnout Risk
            </span>
            <span className="text-xs font-mono font-bold text-orange-400">
              {latestResult.burnout_risk}%
            </span>
          </div>
          <div className="w-full h-3 rounded-full neuro-inset overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, latestResult.burnout_risk)}%` }}
            />
          </div>
          <p className="text-[11px] text-neutral-400">
            Probability of cognitive fatigue based on work schedule & conscientiousness.
          </p>
        </div>

        {/* Anxiety Tendency */}
        <div className="p-5 rounded-3xl neuro-flat space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Anxiety Index
            </span>
            <span className="text-xs font-mono font-bold text-amber-400">
              {latestResult.anxiety_risk}%
            </span>
          </div>
          <div className="w-full h-3 rounded-full neuro-inset overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-400 to-amber-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, latestResult.anxiety_risk)}%` }}
            />
          </div>
          <p className="text-[11px] text-neutral-400">
            Neuroticism markers & acute tension indicators synthesized from reactions.
          </p>
        </div>

        {/* Depression Tendency */}
        <div className="p-5 rounded-3xl neuro-flat space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              Depression Tendency
            </span>
            <span className="text-xs font-mono font-bold text-indigo-400">
              {latestResult.depression_risk}%
            </span>
          </div>
          <div className="w-full h-3 rounded-full neuro-inset overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, latestResult.depression_risk)}%` }}
            />
          </div>
          <p className="text-[11px] text-neutral-400">
            Social detachment & emotional exhaustion signals evaluated in tandem.
          </p>
        </div>

      </div>

      {/* Personality-Based Disease & Disorder Diagnostic Matrix */}
      {latestResult.personality_diagnostics && (
        <PersonalityDisorderMatrix diagnostics={latestResult.personality_diagnostics} />
      )}

      {/* Multi-Model Comparison & Linear Regression Interpretability */}
      {latestResult.model_comparison && (
        <ModelComparisonCard modelComparison={latestResult.model_comparison} />
      )}

      {/* Historical Trend Chart */}
      <div className="p-6 rounded-3xl neuro-flat space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-white/5">
          <div>
            <h3 className="text-base font-bold text-neutral-100 flex items-center gap-2">
              <Activity className="w-4 h-4 text-teal-400" />
              Historical Mental Weight Trajectory
            </h3>
            <p className="text-xs text-neutral-400">
              Tracking how your mental weight lightens as you decompress.
            </p>
          </div>
          <span className="text-[11px] px-2.5 py-1 rounded-xl neuro-inset text-teal-300 font-mono">
            {historyData.length} Check-ins Logged
          </span>
        </div>

        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historyData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#232a36" />
              <XAxis dataKey="name" stroke="#718096" tick={{ fill: '#718096', fontSize: 11 }} />
              <YAxis domain={[0, 100]} stroke="#718096" tick={{ fill: '#718096', fontSize: 11 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#141922', borderRadius: '16px', border: '1px solid #2d3748', color: '#fff', fontSize: '12px' }}
              />
              <Line 
                type="monotone" 
                dataKey="weight" 
                stroke="#2dd4bf" 
                strokeWidth={3} 
                dot={{ r: 5, fill: '#2dd4bf' }} 
                activeDot={{ r: 8 }} 
                name="Mental Weight (kg)"
              />
              <Line 
                type="monotone" 
                dataKey="burnout" 
                stroke="#f97316" 
                strokeWidth={2} 
                strokeDasharray="4 4" 
                name="Burnout %"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Personalized AI Self-Care Interventions */}
      <div className="p-6 rounded-3xl neuro-flat space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-white/5">
          <h3 className="text-base font-bold text-neutral-100 flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-teal-400" />
            AI Prescribed Antigravity Actions
          </h3>
          <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">
            Non-Diagnostic Wellness
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(latestResult.recommendations || []).map((rec, i) => (
            <div key={i} className="p-4 rounded-2xl neuro-inset space-y-1.5 border border-white/5 hover:border-teal-500/20 transition-all">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-teal-300">{rec.title}</h4>
                <span className="text-[10px] px-2 py-0.5 rounded-full neuro-flat text-indigo-400 font-semibold">
                  {rec.category}
                </span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">{rec.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
