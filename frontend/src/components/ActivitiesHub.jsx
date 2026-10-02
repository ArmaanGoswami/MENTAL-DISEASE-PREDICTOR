import React, { useState, useEffect, useRef } from 'react';
import { 
  Gamepad2, Activity, Brain, UserCheck, Flame, 
  RotateCcw, Sparkles, CheckCircle2, ChevronRight, Zap, Target, AlertTriangle
} from 'lucide-react';

export default function ActivitiesHub({ onActivityCompleted }) {
  const [activeTab, setActiveTab] = useState('stroop'); // 'stroop', 'tapping', 'bodyscan', 'cbt'
  
  // -------------------------------------------------------------
  // ACTIVITY 1: STROOP COGNITIVE INHIBITION GAME
  // -------------------------------------------------------------
  const STROOP_TRIALS = [
    { word: 'RED', color: 'text-blue-400', correct: 'blue' },
    { word: 'GREEN', color: 'text-red-400', correct: 'red' },
    { word: 'BLUE', color: 'text-green-400', correct: 'green' },
    { word: 'YELLOW', color: 'text-purple-400', correct: 'purple' },
    { word: 'RED', color: 'text-yellow-400', correct: 'yellow' },
    { word: 'BLUE', color: 'text-red-400', correct: 'red' },
  ];
  const [stroopIndex, setStroopIndex] = useState(0);
  const [stroopStartTime, setStroopStartTime] = useState(Date.now());
  const [stroopReactionTimes, setStroopReactionTimes] = useState([]);
  const [stroopErrors, setStroopErrors] = useState(0);
  const [stroopFinished, setStroopFinished] = useState(false);

  const handleStroopAnswer = (selectedColor) => {
    const elapsed = Date.now() - stroopStartTime;
    const isCorrect = selectedColor === STROOP_TRIALS[stroopIndex].correct;
    
    if (!isCorrect) {
      setStroopErrors((e) => e + 1);
    }
    setStroopReactionTimes((prev) => [...prev, elapsed]);

    if (stroopIndex + 1 < STROOP_TRIALS.length) {
      setStroopIndex((i) => i + 1);
      setStroopStartTime(Date.now());
    } else {
      setStroopFinished(true);
      // Auto submit stroop telemetry
      const avgRt = Math.round(
        [...stroopReactionTimes, elapsed].reduce((a, b) => a + b, 0) / STROOP_TRIALS.length
      );
      if (onActivityCompleted) {
        onActivityCompleted({
          activity_type: 'stroop',
          metrics: {
            stroop_rt_ms: avgRt,
            stroop_errors: stroopErrors + (isCorrect ? 0 : 1)
          }
        });
      }
    }
  };

  const resetStroop = () => {
    setStroopIndex(0);
    setStroopReactionTimes([]);
    setStroopErrors(0);
    setStroopFinished(false);
    setStroopStartTime(Date.now());
  };

  // -------------------------------------------------------------
  // ACTIVITY 2: PSYCHOMOTOR FINGER TAPPING TEST
  // -------------------------------------------------------------
  const [tappingStarted, setTappingStarted] = useState(false);
  const [tapTimes, setTapTimes] = useState([]);
  const [tappingTimeLeft, setTappingTimeLeft] = useState(10);
  const [tappingFinished, setTappingFinished] = useState(false);

  useEffect(() => {
    let interval = null;
    if (tappingStarted && tappingTimeLeft > 0) {
      interval = setInterval(() => {
        setTappingTimeLeft((t) => t - 1);
      }, 1000);
    } else if (tappingStarted && tappingTimeLeft === 0) {
      setTappingStarted(false);
      setTappingFinished(true);

      // Calculate psychomotor metrics
      const totalTaps = tapTimes.length;
      const tapsPerSec = Number((totalTaps / 10).toFixed(1));
      
      // Calculate variance between successive tap intervals
      let varianceMs = 35;
      if (tapTimes.length > 3) {
        const intervals = [];
        for (let i = 1; i < tapTimes.length; i++) {
          intervals.push(tapTimes[i] - tapTimes[i - 1]);
        }
        const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        const sqDiffs = intervals.map((v) => Math.pow(v - avg, 2));
        varianceMs = Math.round(Math.sqrt(sqDiffs.reduce((a, b) => a + b, 0) / intervals.length));
      }

      if (onActivityCompleted) {
        onActivityCompleted({
          activity_type: 'tapping',
          metrics: {
            taps_per_sec: tapsPerSec,
            variance_ms: varianceMs,
            total_taps: totalTaps
          }
        });
      }
    }
    return () => clearInterval(interval);
  }, [tappingStarted, tappingTimeLeft]);

  const handleTap = () => {
    if (!tappingStarted && !tappingFinished) {
      setTappingStarted(true);
      setTapTimes([Date.now()]);
      return;
    }
    if (tappingStarted) {
      setTapTimes((prev) => [...prev, Date.now()]);
    }
  };

  const resetTapping = () => {
    setTappingStarted(false);
    setTappingFinished(false);
    setTapTimes([]);
    setTappingTimeLeft(10);
  };

  // -------------------------------------------------------------
  // ACTIVITY 3: SOMATIC BODY TENSION HEATMAP
  // -------------------------------------------------------------
  const [selectedBodyAreas, setSelectedBodyAreas] = useState([]);
  const [bodyScanSaved, setBodyScanSaved] = useState(false);

  const BODY_NODES = [
    { id: 'head', label: 'Head / Forehead', desc: 'Tension headaches, racing thoughts, cognitive pressure' },
    { id: 'jaw', label: 'Jaw & Teeth Clenching', desc: 'Bruxism, suppressed anger, OCPD rigidity' },
    { id: 'throat', label: 'Throat & Voice', desc: 'Globus sensation, choked-up feeling, social fear' },
    { id: 'shoulders', label: 'Shoulders & Neck', desc: 'Heavy gravitational posture, chronic work strain' },
    { id: 'chest', label: 'Chest Tightness', desc: 'Panic arousal, acute shortness of breath, heartbreak' },
    { id: 'solar_plexus', label: 'Solar Plexus / Diaphragm', desc: 'Fight-or-flight adrenal hyperarousal' },
    { id: 'gut', label: 'Stomach & Gut Knot', desc: 'Brain-gut axis distress, GAD nervous irritability' },
    { id: 'limbs', label: 'Limbs & Legs Heaviness', desc: 'Lead-like somatic paralysis seen in depression' }
  ];

  const toggleBodyArea = (id) => {
    if (selectedBodyAreas.includes(id)) {
      setSelectedBodyAreas(selectedBodyAreas.filter(a => a !== id));
    } else {
      setSelectedBodyAreas([...selectedBodyAreas, id]);
    }
  };

  const handleSaveBodyScan = () => {
    setBodyScanSaved(true);
    if (onActivityCompleted) {
      onActivityCompleted({
        activity_type: 'body_scan',
        metrics: {
          tension_areas: selectedBodyAreas,
          total_tension_points: selectedBodyAreas.length
        }
      });
    }
  };

  // -------------------------------------------------------------
  // ACTIVITY 4: CBT COGNITIVE DISTORTION DETECTIVE
  // -------------------------------------------------------------
  const [selectedDistortions, setSelectedDistortions] = useState([]);
  const [cbtSaved, setCbtSaved] = useState(false);

  const DISTORTIONS = [
    { id: 'catastrophizing', name: 'Catastrophizing', desc: 'Assuming worst-case catastrophe from minor issues (GAD / Panic)' },
    { id: 'all_or_nothing', name: 'All-or-Nothing Splitting', desc: 'Thinking in absolutes: complete perfection or total failure (OCPD / BPD)' },
    { id: 'mind_reading', name: 'Mind Reading', desc: 'Assuming people are negatively judging or mocking you (Social Anxiety)' },
    { id: 'emotional_reasoning', name: 'Emotional Reasoning', desc: 'Assuming if you feel anxious/worthless, it must be objective truth' },
    { id: 'overgeneralization', name: 'Overgeneralization', desc: 'Believing one setback means "I will always fail at this"' },
    { id: 'personalization', name: 'Personalization', desc: 'Holding yourself responsible for external events beyond your control' }
  ];

  const toggleDistortion = (id) => {
    if (selectedDistortions.includes(id)) {
      setSelectedDistortions(selectedDistortions.filter(d => d !== id));
    } else {
      setSelectedDistortions([...selectedDistortions, id]);
    }
  };

  const handleSaveCbt = () => {
    setCbtSaved(true);
    if (onActivityCompleted) {
      onActivityCompleted({
        activity_type: 'cbt',
        metrics: {
          distortions: selectedDistortions,
          count: selectedDistortions.length
        }
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-4 space-y-6 animate-fadeIn">
      
      {/* Header & Activity Tab Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-100 flex items-center gap-2">
            <Gamepad2 className="w-6 h-6 text-teal-400" />
            <span>Behavioral Biomarker Activities Lab</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Objective cognitive games and somatic tests that continuously extract signals for 45+ disorders.
          </p>
        </div>

        <div className="flex flex-wrap p-1 rounded-2xl neuro-inset gap-1">
          {[
            { id: 'stroop', label: '1. Stroop Test', icon: Brain },
            { id: 'tapping', label: '2. Motor Tapping', icon: Zap },
            { id: 'bodyscan', label: '3. Somatic Scan', icon: UserCheck },
            { id: 'cbt', label: '4. CBT Detective', icon: Target },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeTab === tab.id
                    ? 'neuro-pill-active text-teal-300'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* --------------------------------------------------------- */}
      {/* ACTIVITY 1: STROOP COLOR-WORD CHALLENGE */}
      {/* --------------------------------------------------------- */}
      {activeTab === 'stroop' && (
        <div className="p-6 sm:p-8 rounded-3xl neuro-flat space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div>
              <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider">
                Cognitive Inhibition & Attention Speed
              </span>
              <h3 className="text-lg font-bold text-neutral-100">
                Stroop Conflict Challenge
              </h3>
            </div>
            <span className="text-xs font-mono text-teal-400 px-3 py-1 rounded-full neuro-inset">
              Trial {Math.min(stroopIndex + 1, STROOP_TRIALS.length)} / {STROOP_TRIALS.length}
            </span>
          </div>

          <p className="text-xs text-neutral-400">
            <strong>Rule:</strong> Click the button corresponding to the <em>INK COLOR</em> of the text, not what the word reads!
          </p>

          {!stroopFinished ? (
            <div className="max-w-md mx-auto text-center space-y-8 py-4">
              
              {/* Word Display with color clash */}
              <div className="h-32 rounded-3xl neuro-inset flex items-center justify-center border border-white/5">
                <span className={`text-4xl sm:text-5xl font-black font-mono tracking-widest ${STROOP_TRIALS[stroopIndex].color}`}>
                  {STROOP_TRIALS[stroopIndex].word}
                </span>
              </div>

              {/* Color Choice Buttons */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: 'Red', colorCode: 'red', bg: 'hover:border-red-500/50 text-red-400' },
                  { name: 'Blue', colorCode: 'blue', bg: 'hover:border-blue-500/50 text-blue-400' },
                  { name: 'Green', colorCode: 'green', bg: 'hover:border-green-500/50 text-green-400' },
                  { name: 'Yellow', colorCode: 'yellow', bg: 'hover:border-yellow-500/50 text-yellow-400' },
                  { name: 'Purple', colorCode: 'purple', bg: 'hover:border-purple-500/50 text-purple-400' }
                ].map((c) => (
                  <button
                    key={c.colorCode}
                    type="button"
                    onClick={() => handleStroopAnswer(c.colorCode)}
                    className={`py-3 px-4 rounded-2xl neuro-btn font-bold text-xs uppercase tracking-wider transition-all ${c.bg}`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>

            </div>
          ) : (
            <div className="max-w-md mx-auto text-center space-y-4 py-6 animate-fadeIn">
              <div className="w-14 h-14 rounded-2xl neuro-flat mx-auto flex items-center justify-center text-teal-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-neutral-100">Stroop Telemetry Captured!</h4>
              
              <div className="grid grid-cols-2 gap-3 py-2 font-mono">
                <div className="p-3 rounded-xl neuro-inset">
                  <span className="text-[10px] text-neutral-400 block">Avg Reaction Time</span>
                  <span className="text-lg font-bold text-teal-400">
                    {Math.round(stroopReactionTimes.reduce((a, b) => a + b, 0) / stroopReactionTimes.length)} ms
                  </span>
                </div>
                <div className="p-3 rounded-xl neuro-inset">
                  <span className="text-[10px] text-neutral-400 block">Inhibition Errors</span>
                  <span className="text-lg font-bold text-orange-400">{stroopErrors}</span>
                </div>
              </div>

              <p className="text-xs text-neutral-400 leading-relaxed">
                Biomarkers sent to the 45+ Disease Engine. Short response latencies indicate high alertness; severe delays (&gt;850ms) point toward cognitive fatigue or depression slowing.
              </p>

              <button
                onClick={resetStroop}
                className="mt-2 px-4 py-2 rounded-xl neuro-btn text-xs font-semibold text-neutral-300 hover:text-white inline-flex items-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Play Again
              </button>
            </div>
          )}

        </div>
      )}

      {/* --------------------------------------------------------- */}
      {/* ACTIVITY 2: PSYCHOMOTOR FINGER TAPPING PAD */}
      {/* --------------------------------------------------------- */}
      {activeTab === 'tapping' && (
        <div className="p-6 sm:p-8 rounded-3xl neuro-flat space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div>
              <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider">
                Motor Cadence & Neuromuscular Agitation
              </span>
              <h3 className="text-lg font-bold text-neutral-100">
                Psychomotor Finger Tapping Test
              </h3>
            </div>
            <span className="text-xs font-mono text-teal-400 px-3 py-1 rounded-full neuro-inset">
              {tappingTimeLeft}s Remaining
            </span>
          </div>

          <p className="text-xs text-neutral-400">
            Tap the button as rapidly and consistently as possible using one finger for 10 seconds.
          </p>

          {!tappingFinished ? (
            <div className="max-w-sm mx-auto text-center space-y-6 py-4">
              <button
                type="button"
                onClick={handleTap}
                className="w-48 h-48 rounded-full neuro-btn active:scale-95 border-2 border-teal-500/30 flex flex-col items-center justify-center mx-auto transition-transform select-none cursor-pointer"
              >
                <Zap className="w-8 h-8 text-teal-400 animate-pulse mb-1" />
                <span className="text-sm font-bold text-neutral-100">
                  {tappingStarted ? 'TAP FAST!' : 'CLICK TO START'}
                </span>
                <span className="text-xs font-mono text-teal-400 font-bold mt-1">
                  {tapTimes.length} Taps
                </span>
              </button>
            </div>
          ) : (
            <div className="max-w-md mx-auto text-center space-y-4 py-6 animate-fadeIn">
              <div className="w-14 h-14 rounded-2xl neuro-flat mx-auto flex items-center justify-center text-teal-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-neutral-100">Motor Rhythm Analyzed!</h4>

              <div className="grid grid-cols-2 gap-3 py-2 font-mono">
                <div className="p-3 rounded-xl neuro-inset">
                  <span className="text-[10px] text-neutral-400 block">Cadence</span>
                  <span className="text-lg font-bold text-teal-400">
                    {(tapTimes.length / 10).toFixed(1)} taps/sec
                  </span>
                </div>
                <div className="p-3 rounded-xl neuro-inset">
                  <span className="text-[10px] text-neutral-400 block">Total Motor Output</span>
                  <span className="text-lg font-bold text-neutral-200">{tapTimes.length} Taps</span>
                </div>
              </div>

              <p className="text-xs text-neutral-400 leading-relaxed">
                Tapping speed &lt; 3.5 taps/s correlates with <em>Psychomotor Retardation</em> (Depression), whereas high erratic tapping (&gt; 6.5 taps/s) correlates with <em>Psychomotor Agitation</em> (Mania/Panic).
              </p>

              <button
                onClick={resetTapping}
                className="mt-2 px-4 py-2 rounded-xl neuro-btn text-xs font-semibold text-neutral-300 hover:text-white inline-flex items-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Retest Tapping
              </button>
            </div>
          )}

        </div>
      )}

      {/* --------------------------------------------------------- */}
      {/* ACTIVITY 3: SOMATIC BODY TENSION HEATMAP */}
      {/* --------------------------------------------------------- */}
      {activeTab === 'bodyscan' && (
        <div className="p-6 sm:p-8 rounded-3xl neuro-flat space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div>
              <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider">
                Somatic Physical Mapping
              </span>
              <h3 className="text-lg font-bold text-neutral-100">
                Body Tension & Somatization Heatmap
              </h3>
            </div>
            <span className="text-xs font-mono text-teal-400 px-3 py-1 rounded-full neuro-inset">
              {selectedBodyAreas.length} Areas Selected
            </span>
          </div>

          <p className="text-xs text-neutral-400">
            Select the body regions where you currently feel tightness, constriction, ache, or tension:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {BODY_NODES.map((node) => {
              const isSelected = selectedBodyAreas.includes(node.id);
              return (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => toggleBodyArea(node.id)}
                  className={`p-3.5 rounded-2xl text-left border transition-all ${
                    isSelected
                      ? 'neuro-pill-active border-teal-400/50 text-neutral-100'
                      : 'neuro-inset border-white/5 text-neutral-300 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">{node.label}</span>
                    <span className={`w-3 h-3 rounded-full ${isSelected ? 'bg-teal-400 animate-ping' : 'bg-neutral-700'}`} />
                  </div>
                  <p className="text-[10px] text-neutral-400 mt-1 leading-snug">
                    {node.desc}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleSaveBodyScan}
              className="px-6 py-2.5 rounded-xl neuro-btn text-xs font-bold text-teal-300 hover:text-teal-200 border border-teal-500/30 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              {bodyScanSaved ? 'Somatic Scan Synced!' : 'Submit Somatic Biomarkers'}
            </button>
          </div>

        </div>
      )}

      {/* --------------------------------------------------------- */}
      {/* ACTIVITY 4: CBT COGNITIVE DISTORTION DETECTIVE */}
      {/* --------------------------------------------------------- */}
      {activeTab === 'cbt' && (
        <div className="p-6 sm:p-8 rounded-3xl neuro-flat space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div>
              <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider">
                Cognitive Schema Analysis
              </span>
              <h3 className="text-lg font-bold text-neutral-100">
                CBT Cognitive Distortion Detective
              </h3>
            </div>
            <span className="text-xs font-mono text-teal-400 px-3 py-1 rounded-full neuro-inset">
              {selectedDistortions.length} Distortions Flagged
            </span>
          </div>

          <p className="text-xs text-neutral-400">
            Have you noticed any of these common psychological thinking traps in your mind today? Tag all that resonate:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DISTORTIONS.map((d) => {
              const isSelected = selectedDistortions.includes(d.id);
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => toggleDistortion(d.id)}
                  className={`p-3.5 rounded-2xl text-left border transition-all ${
                    isSelected
                      ? 'neuro-pill-active border-indigo-400/50 text-neutral-100'
                      : 'neuro-inset border-white/5 text-neutral-300 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-teal-300">{d.name}</span>
                    <span className={`w-3 h-3 rounded-full ${isSelected ? 'bg-indigo-400' : 'bg-neutral-700'}`} />
                  </div>
                  <p className="text-[10px] text-neutral-400 mt-1 leading-snug">
                    {d.desc}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleSaveCbt}
              className="px-6 py-2.5 rounded-xl neuro-btn text-xs font-bold text-teal-300 hover:text-teal-200 border border-teal-500/30 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              {cbtSaved ? 'Cognitive Schemas Synced!' : 'Submit Distortion Telemetry'}
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
