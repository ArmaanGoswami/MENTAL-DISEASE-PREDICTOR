import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import Navbar from './components/Navbar';
import ProfileModal from './components/ProfileModal';
import DailyCheckIn from './components/DailyCheckIn';
import Dashboard from './components/Dashboard';
import ClinicalScreeners from './components/ClinicalScreeners';
import SoundscapePlayer from './components/SoundscapePlayer';
import BreathingWidget from './components/BreathingWidget';
import ActivitiesHub from './components/ActivitiesHub';
import DiseaseEncyclopedia from './components/DiseaseEncyclopedia';
import AppHomeHero from './components/AppHomeHero';
import EmotionalMorphismStudio from './components/EmotionalMorphismStudio';
import ResourcesModal from './components/ResourcesModal';
import ExportReportModal from './components/ExportReportModal';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState(null);
  const [cards, setCards] = useState([]);
  const [history, setHistory] = useState([]);
  const [latestResult, setLatestResult] = useState(null);
  const [diseases, setDiseases] = useState([]);
  const [resources, setResources] = useState(null);

  // Emotional Adaptive Morphism State
  const [currentEmotion, setCurrentEmotion] = useState('equilibrium');
  const [isMorphismStudioOpen, setIsMorphismStudioOpen] = useState(false);
  const [autoSyncEmotion, setAutoSyncEmotion] = useState(true);

  // Modals
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [isBreathingOpen, setIsBreathingOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Synchronize Emotional Adaptive Morphism with latest assessment
  useEffect(() => {
    if (!autoSyncEmotion || !latestResult) return;
    const mw = latestResult.mental_weight || 50;
    const anx = latestResult.anxiety_risk || 40;
    const burn = latestResult.burnout_risk || 40;
    const dep = latestResult.depression_risk || 40;
    const n = latestResult.ocean_scores?.Neuroticism || 50;

    if (mw < 42 && anx < 45) {
      setCurrentEmotion('buoyant');
    } else if (anx > 62 || n > 72) {
      setCurrentEmotion('agitated');
    } else if (mw > 65 || burn > 70 || dep > 65) {
      setCurrentEmotion('gravitational');
    } else {
      setCurrentEmotion('equilibrium');
    }
  }, [latestResult, autoSyncEmotion]);

  // Apply Morphism attribute to root element for smooth instantaneous CSS variable adaptation
  useEffect(() => {
    document.documentElement.setAttribute('data-emotion', currentEmotion);
  }, [currentEmotion]);

  // Initial Load
  useEffect(() => {
    fetchProfile();
    fetchCards();
    fetchHistory();
    fetchDiseases();
    fetchResources();
  }, []);

  const fetchDiseases = async () => {
    try {
      const res = await fetch('/api/diseases');
      if (res.ok) {
        const data = await res.json();
        setDiseases(data);
      }
    } catch (err) {
      console.error("Error fetching diseases:", err);
    }
  };

  const handleActivityCompleted = async (payload) => {
    try {
      const res = await fetch('/api/activities/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        showToast(data.message || "Biomarkers calibrated! Recalculated 45+ disorders.");
        // Refresh 45 diseases and longitudinal history
        fetchDiseases();
        fetchHistory();
      } else {
        showToast("Activity recorded locally.");
      }
    } catch (err) {
      console.error("Error submitting activity:", err);
      showToast("Activity saved locally.");
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/profile');
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    } catch (err) {
      console.warn("Backend not reached yet, using defaults:", err);
      setUser({
        username: "Armaan Goswami",
        age: 21,
        occupation: "Student",
        baseline_sleep: 6.5,
        baseline_work_hours: 8.5
      });
    }
  };

  const fetchCards = async () => {
    try {
      const res = await fetch('/api/cards');
      if (res.ok) {
        const data = await res.json();
        setCards(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/history');
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
        if (data.length > 0) {
          setLatestResult(data[data.length - 1]);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchResources = async () => {
    try {
      const res = await fetch('/api/resources');
      if (res.ok) {
        const data = await res.json();
        setResources(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveProfile = async (formData) => {
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        const updated = await res.json();
        setUser(updated);
        showToast("Profile and baseline calibrations updated successfully!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAnalyze = async (payload) => {
    setLoading(true);
    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        setLatestResult(data);
        setHistory((prev) => [...prev, data]);
        setActiveTab('dashboard');
        
        // If mental weight is buoyant / featherlight, celebratory confetti!
        if (data.mental_weight < 45) {
          try {
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.7 },
              colors: ['#2dd4bf', '#818cf8', '#c084fc']
            });
          } catch (_) {}
        }

        showToast(`Assessment complete! Mental Weight calibrated at ${data.mental_weight} kg.`);
      } else {
        showToast("Failed to calculate assessment. Please check backend server.");
      }
    } catch (err) {
      console.error(err);
      showToast("Error connecting to Antigravity AI Engine.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] flex flex-col selection:bg-teal-500/20 selection:text-teal-900 transition-colors duration-500">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-2xl neuro-flat border border-teal-500/30 text-teal-800 text-xs font-bold shadow-xl flex items-center gap-2 animate-bounce bg-white/95">
          <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
          {toastMessage}
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenSOS={() => setIsSOSOpen(true)}
        onOpenReport={() => setIsReportOpen(true)}
        onOpenMorphism={() => setIsMorphismStudioOpen(true)}
        currentEmotion={currentEmotion}
      />

      {/* Offline Synthesized Soundscape Bar */}
      <SoundscapePlayer />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-4">
        {activeTab === 'home' && (
          <AppHomeHero
            user={user}
            latestResult={latestResult}
            onPlay={() => setActiveTab('activities')}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'checkin' && (
          <DailyCheckIn
            cards={cards}
            onAnalyze={handleAnalyze}
            loading={loading}
          />
        )}

        {activeTab === 'dashboard' && (
          <Dashboard
            latestResult={latestResult}
            history={history}
            onGoToCheckin={() => setActiveTab('checkin')}
            onOpenBreathing={() => setIsBreathingOpen(true)}
          />
        )}

        {activeTab === 'activities' && (
          <ActivitiesHub onActivityCompleted={handleActivityCompleted} />
        )}

        {activeTab === 'diseases' && (
          <DiseaseEncyclopedia diseases={diseases} />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/5 py-4 text-center text-xs text-neutral-500">
        <p>
          Antigravity AI • 100% Free & Open-Source Psychometric & Burnout Prediction Architecture • SIH / College Portfolio Edition
        </p>
      </footer>

      {/* Modals & Dialogs */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
        onSave={handleSaveProfile}
      />

      <BreathingWidget
        isOpen={isBreathingOpen}
        onClose={() => setIsBreathingOpen(false)}
      />

      <ResourcesModal
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
        resources={resources}
      />

      <ExportReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        user={user}
        latestResult={latestResult}
      />

      {/* Emotional Adaptive Morphism Studio */}
      <EmotionalMorphismStudio
        isOpen={isMorphismStudioOpen}
        onClose={() => setIsMorphismStudioOpen(false)}
        currentEmotion={currentEmotion}
        setEmotion={setCurrentEmotion}
        autoSync={autoSyncEmotion}
        setAutoSync={setAutoSyncEmotion}
        latestResult={latestResult}
      />

    </div>
  );
}
