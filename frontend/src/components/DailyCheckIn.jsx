import React, { useState, useEffect, useRef } from 'react';
import { PenLine, Layers, Sparkles, Send, Flame, ThumbsUp, ThumbsDown, CheckCircle2, RotateCcw, Zap } from 'lucide-react';

export default function DailyCheckIn({ cards, onAnalyze, loading }) {
  const [activeMode, setActiveMode] = useState('journal'); // 'journal' or 'swipes'
  
  // Journal State & Passive Typing tracker
  const [journalText, setJournalText] = useState('');
  const [keystrokes, setKeystrokes] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [typingWPM, setTypingWPM] = useState(45.0);
  
  // Swipes State
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [swipes, setSwipes] = useState([]); // [{ id, agreed: boolean }]
  const [swipeFinished, setSwipeFinished] = useState(false);

  // Passive typing cadence calculator
  const handleTextChange = (e) => {
    const val = e.target.value;
    setJournalText(val);

    const now = Date.now();
    if (!startTime && val.length > 0) {
      setStartTime(now);
    }

    setKeystrokes((prev) => prev + 1);

    if (startTime && val.length > 10) {
      const minutesElapsed = (now - startTime) / 60000;
      if (minutesElapsed > 0.05) {
        const words = val.trim().split(/\s+/).length;
        const calculatedWpm = Math.min(120, Math.max(15, Math.round(words / minutesElapsed)));
        setTypingWPM(calculatedWpm);
      }
    }
  };

  const handleJournalSubmit = (e) => {
    e.preventDefault();
    if (!journalText.trim()) return;

    onAnalyze({
      input_type: 'journal',
      journal_text: journalText,
      typing_wpm: typingWPM,
      swipes: swipes
    });
  };

  const handleCardReaction = (agreed) => {
    if (currentCardIndex >= cards.length) return;

    const currentCard = cards[currentCardIndex];
    const newSwipes = [...swipes, { id: currentCard.id, agreed }];
    setSwipes(newSwipes);

    if (currentCardIndex + 1 < cards.length) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      setSwipeFinished(true);
    }
  };

  const resetSwipes = () => {
    setSwipes([]);
    setCurrentCardIndex(0);
    setSwipeFinished(false);
  };

  const handleSwipeSubmit = () => {
    onAnalyze({
      input_type: 'swipes',
      journal_text: `Situational Check-in with ${swipes.filter(s => s.agreed).length} stress indicators marked.`,
      typing_wpm: 50.0,
      swipes: swipes
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-4 animate-fadeIn">
      
      {/* Mode Switcher */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-100 flex items-center gap-2">
            <span>Daily 'Weight' Check</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full neuro-inset text-teal-400 font-mono">
              Passive & Active
            </span>
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Log your thoughts or react to fast situation prompts to calculate your gravitational stress.
          </p>
        </div>

        <div className="flex p-1 rounded-2xl neuro-inset gap-1">
          <button
            onClick={() => setActiveMode('journal')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeMode === 'journal'
                ? 'neuro-pill-active text-teal-300'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <PenLine className="w-3.5 h-3.5" />
            AI Journal
          </button>
          <button
            onClick={() => setActiveMode('swipes')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeMode === 'swipes'
                ? 'neuro-pill-active text-teal-300'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Quick Swipes
          </button>
        </div>
      </div>

      {/* MODE 1: SMART AI JOURNAL */}
      {activeMode === 'journal' && (
        <div className="p-6 rounded-3xl neuro-flat space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-400" />
              Express Your Mind (2-4 lines)
            </span>
            
            {/* Passive Typing Meter */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl neuro-inset text-[11px] text-neutral-300 font-mono">
                <Zap className="w-3 h-3 text-amber-400 animate-bounce" />
                <span>Typing Cadence:</span>
                <span className="text-teal-400 font-bold">{typingWPM} WPM</span>
              </div>
              <span className="text-[11px] text-neutral-500 font-mono">
                {journalText.trim().split(/\s+/).filter(Boolean).length} words
              </span>
            </div>
          </div>

          <form onSubmit={handleJournalSubmit} className="space-y-4">
            <textarea
              rows={5}
              value={journalText}
              onChange={handleTextChange}
              placeholder="How did your day feel today? (e.g. 'Deadlines were heavy and meetings felt endless, but I managed to finish my project. Felt quite exhausted by evening...')"
              className="w-full p-4 rounded-2xl neuro-inset text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-teal-400 resize-none transition-all leading-relaxed"
            />

            {/* Prompt suggestions */}
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="text-[10px] text-neutral-400 self-center">Quick Inspiration:</span>
              {[
                "Work deadlines were intense today...",
                "Felt calm and got good sleep last night.",
                "Struggled with focus, feeling mentally drained."
              ].map((pill, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setJournalText(pill);
                    setTypingWPM(52);
                  }}
                  className="px-2.5 py-1 rounded-lg neuro-btn text-[11px] text-neutral-400 hover:text-teal-300 transition-colors"
                >
                  {pill}
                </button>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={loading || !journalText.trim()}
                className="px-6 py-3 rounded-2xl neuro-btn text-xs font-bold text-teal-300 hover:text-teal-200 flex items-center gap-2 border border-teal-500/30 disabled:opacity-50 transition-all"
              >
                <Send className="w-4 h-4" />
                {loading ? 'Extracting NLP & Calculating...' : 'Calculate Mental Weight & Risk'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODE 2: TINDER-STYLE SITUATIONAL SWIPES */}
      {activeMode === 'swipes' && (
        <div className="p-6 sm:p-8 rounded-3xl neuro-flat">
          {!swipeFinished && currentCardIndex < cards.length ? (
            <div className="max-w-md mx-auto text-center space-y-6">
              
              {/* Progress counter */}
              <div className="flex items-center justify-between text-xs text-neutral-400 px-2">
                <span>Reaction Card {currentCardIndex + 1} of {cards.length}</span>
                <span className="text-teal-400 font-mono font-semibold">
                  {Math.round(((currentCardIndex) / cards.length) * 100)}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full neuro-inset overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-400 to-indigo-500 transition-all duration-300 rounded-full"
                  style={{ width: `${((currentCardIndex) / cards.length) * 100}%` }}
                />
              </div>

              {/* The Interactive Neumorphic Card */}
              <div className="p-8 rounded-3xl neuro-flat border border-white/5 shadow-2xl relative min-h-[220px] flex flex-col justify-center items-center transition-all transform hover:scale-[1.02]">
                <span className="text-[11px] uppercase tracking-wider px-3 py-1 rounded-full neuro-inset text-indigo-400 font-bold mb-3">
                  {cards[currentCardIndex].category}
                </span>
                
                <h3 className="text-lg sm:text-xl font-medium text-neutral-100 leading-snug">
                  "{cards[currentCardIndex].question}"
                </h3>
              </div>

              {/* Reaction Buttons */}
              <div className="flex items-center justify-center gap-6 pt-2">
                
                {/* Disagree / Not relatable */}
                <button
                  type="button"
                  onClick={() => handleCardReaction(false)}
                  className="group flex flex-col items-center gap-2"
                >
                  <div className="w-16 h-16 rounded-2xl neuro-btn flex items-center justify-center text-neutral-400 group-hover:text-rose-400 group-hover:border-rose-500/40 transition-all">
                    <ThumbsDown className="w-7 h-7" />
                  </div>
                  <span className="text-[11px] font-semibold text-neutral-400 group-hover:text-rose-400">
                    Disagree (Swipe Left)
                  </span>
                </button>

                {/* Agree / Very relatable */}
                <button
                  type="button"
                  onClick={() => handleCardReaction(true)}
                  className="group flex flex-col items-center gap-2"
                >
                  <div className="w-16 h-16 rounded-2xl neuro-btn flex items-center justify-center text-neutral-400 group-hover:text-teal-400 group-hover:border-teal-500/40 transition-all">
                    <ThumbsUp className="w-7 h-7" />
                  </div>
                  <span className="text-[11px] font-semibold text-neutral-400 group-hover:text-teal-400">
                    Relatable (Swipe Right)
                  </span>
                </button>

              </div>
            </div>
          ) : (
            /* Completed Swipes View */
            <div className="max-w-md mx-auto text-center space-y-5 py-4">
              <div className="w-14 h-14 rounded-2xl neuro-flat mx-auto flex items-center justify-center text-teal-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-neutral-100">Situational Reactions Complete!</h3>
                <p className="text-xs text-neutral-400 mt-1">
                  You marked {swipes.filter(s => s.agreed).length} out of {cards.length} stress triggers as active.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-3">
                <button
                  onClick={resetSwipes}
                  className="px-4 py-2.5 rounded-xl neuro-btn text-xs font-semibold text-neutral-400 hover:text-neutral-200 flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Retake
                </button>
                <button
                  onClick={handleSwipeSubmit}
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl neuro-btn text-xs font-bold text-teal-300 hover:text-teal-200 flex items-center gap-2 border border-teal-500/30"
                >
                  <Sparkles className="w-4 h-4" />
                  {loading ? 'Synthesizing...' : 'Submit to Antigravity Engine'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
