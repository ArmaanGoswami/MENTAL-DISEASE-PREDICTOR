import React, { useState } from 'react';
import { ClipboardList, CheckCircle2, AlertCircle, Sparkles, RotateCcw, HeartPulse } from 'lucide-react';

const PHQ9_QUESTIONS = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
  "Trouble concentrating on things, such as reading the newspaper or watching television",
  "Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual",
  "Thoughts that you would be better off dead, or of hurting yourself in some way"
];

const GAD7_QUESTIONS = [
  "Feeling nervous, anxious, or on edge",
  "Not being able to stop or control worrying",
  "Worrying too much about different things",
  "Trouble relaxing",
  "Being so restless that it's hard to sit still",
  "Becoming easily annoyed or irritable",
  "Feeling afraid as if something awful might happen"
];

const OPTIONS = [
  { label: "Not at all", score: 0 },
  { label: "Several days", score: 1 },
  { label: "More than half the days", score: 2 },
  { label: "Nearly every day", score: 3 }
];

export default function ClinicalScreeners({ onClinicalResult }) {
  const [activeTest, setActiveTest] = useState('phq9'); // 'phq9' or 'gad7'
  const [phqAnswers, setPhqAnswers] = useState(Array(9).fill(null));
  const [gadAnswers, setGadAnswers] = useState(Array(7).fill(null));

  const questions = activeTest === 'phq9' ? PHQ9_QUESTIONS : GAD7_QUESTIONS;
  const answers = activeTest === 'phq9' ? phqAnswers : gadAnswers;
  const setAnswers = activeTest === 'phq9' ? setPhqAnswers : setGadAnswers;

  const handleSelect = (qIdx, score) => {
    const next = [...answers];
    next[qIdx] = score;
    setAnswers(next);
  };

  const isComplete = answers.every((a) => a !== null);
  const totalScore = answers.reduce((acc, curr) => acc + (curr || 0), 0);

  // Clinical Interpretations
  const getPHQInterpretation = (score) => {
    if (score <= 4) return { level: "Minimal or No Depression", badge: "emerald", advice: "Scores suggest low affective symptom burden." };
    if (score <= 9) return { level: "Mild Depressive Symptoms", badge: "amber", advice: "Sub-clinical symptom pattern. Sleep hygiene & exercise recommended." };
    if (score <= 14) return { level: "Moderate Depressive Syndrome", badge: "orange", advice: "Clinically relevant depressive load. Structured counseling advised." };
    if (score <= 19) return { level: "Moderately Severe Depression", badge: "rose", advice: "Significant functional impairment. Professional therapeutic support suggested." };
    return { level: "Severe Depression", badge: "rose", advice: "High clinical urgency. Immediate psychiatric or psychological consultation recommended." };
  };

  const getGADInterpretation = (score) => {
    if (score <= 4) return { level: "Minimal Anxiety", badge: "emerald", advice: "Nervous system within normative baseline." };
    if (score <= 9) return { level: "Mild Anxiety", badge: "amber", advice: "Occasional cognitive tension. Mindfulness & breathing techniques recommended." };
    if (score <= 14) return { level: "Moderate Anxiety", badge: "orange", advice: "Notable sympathetic hyper-arousal. Cognitive Behavioral Therapy (CBT) indicated." };
    return { level: "Severe Anxiety Disorder Range", badge: "rose", advice: "Pronounced autonomic and cognitive distress. Clinical intervention recommended." };
  };

  const interpretation = activeTest === 'phq9' 
    ? getPHQInterpretation(totalScore) 
    : getGADInterpretation(totalScore);

  const resetCurrent = () => {
    setAnswers(Array(questions.length).fill(null));
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-4 space-y-6 animate-fadeIn">
      
      {/* Header & Screener Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-100 flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-teal-400" />
            <span>Standardized Clinical Screeners</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Evidence-based medical inventories used globally by psychiatrists & researchers.
          </p>
        </div>

        <div className="flex p-1 rounded-2xl neuro-inset gap-1 self-start sm:self-auto">
          <button
            onClick={() => setActiveTest('phq9')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTest === 'phq9'
                ? 'neuro-pill-active text-teal-300'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            PHQ-9 (Depression)
          </button>
          <button
            onClick={() => setActiveTest('gad7')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTest === 'gad7'
                ? 'neuro-pill-active text-teal-300'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            GAD-7 (Anxiety)
          </button>
        </div>
      </div>

      {/* Intro info box */}
      <div className="p-4 rounded-2xl neuro-flat border border-white/5 flex items-center justify-between text-xs">
        <span className="text-neutral-300 font-medium">
          {activeTest === 'phq9' 
            ? "Patient Health Questionnaire-9: Over the last 2 weeks, how often have you been bothered by:" 
            : "Generalized Anxiety Disorder-7: Over the last 2 weeks, how often have you felt:"}
        </span>
        <span className="text-[11px] font-mono text-teal-400 font-bold px-2 py-0.5 rounded-full neuro-inset">
          {answers.filter(a => a !== null).length} / {questions.length} Answered
        </span>
      </div>

      {/* Questions list */}
      <div className="p-6 rounded-3xl neuro-flat space-y-5">
        {questions.map((q, idx) => (
          <div key={idx} className="p-4 rounded-2xl neuro-inset border border-white/5 space-y-3">
            <p className="text-sm font-semibold text-neutral-100">
              <span className="text-teal-400 font-mono mr-2">{idx + 1}.</span>
              {q}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              {OPTIONS.map((opt) => {
                const isSelected = answers[idx] === opt.score;
                return (
                  <button
                    key={opt.score}
                    type="button"
                    onClick={() => handleSelect(idx, opt.score)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-semibold text-center transition-all ${
                      isSelected
                        ? 'neuro-pill-active text-teal-300 border border-teal-400/50'
                        : 'neuro-btn text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    <span>{opt.label}</span>
                    <span className="block text-[10px] text-neutral-500 font-mono mt-0.5">
                      (+{opt.score})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Live Clinical Result Score Card */}
        {isComplete && (
          <div className="p-6 rounded-3xl neuro-flat border border-teal-500/30 space-y-4 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/5">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold">
                  {activeTest === 'phq9' ? 'PHQ-9 Clinical Score' : 'GAD-7 Clinical Score'}
                </span>
                <h3 className="text-xl font-bold text-neutral-100">
                  {interpretation.level}
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl neuro-inset flex items-center justify-center font-mono font-black text-2xl text-teal-300">
                  {totalScore}
                </div>
                <span className="text-xs text-neutral-500 font-mono">
                  / {questions.length * 3} Max
                </span>
              </div>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">
              {interpretation.advice}
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={resetCurrent}
                className="px-4 py-2 rounded-xl neuro-btn text-xs font-semibold text-neutral-400 hover:text-neutral-200 flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Retake
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
