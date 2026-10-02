import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, Waves, Radio, Music } from 'lucide-react';

export default function SoundscapePlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTrack, setActiveTrack] = useState('432hz'); // '432hz', '528hz', 'theta', 'pink_noise'
  const [volume, setVolume] = useState(0.3);

  const audioCtxRef = useRef(null);
  const gainNodeRef = useRef(null);
  const oscRef1 = useRef(null);
  const oscRef2 = useRef(null);
  const noiseNodeRef = useRef(null);

  const TRACKS = [
    { id: '432hz', name: '432 Hz Calm', desc: 'Harmonic natural frequency for somatic decompression' },
    { id: '528hz', name: '528 Hz Clarity', desc: 'Solfeggio frequency for mental focus and emotional release' },
    { id: 'theta', name: '6 Hz Theta Wave', desc: 'Binaural beat promoting deep meditative tranquility' },
    { id: 'pink_noise', name: 'Pink Noise Rain', desc: 'Smooth frequency slope to quiet hyper-active cognitive loops' },
  ];

  const stopAudio = () => {
    try {
      if (oscRef1.current) { oscRef1.current.stop(); oscRef1.current.disconnect(); oscRef1.current = null; }
      if (oscRef2.current) { oscRef2.current.stop(); oscRef2.current.disconnect(); oscRef2.current = null; }
      if (noiseNodeRef.current) { noiseNodeRef.current.stop(); noiseNodeRef.current.disconnect(); noiseNodeRef.current = null; }
    } catch (_) {}
  };

  const startAudio = () => {
    stopAudio();
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volume, ctx.currentTime);
    masterGain.connect(ctx.destination);
    gainNodeRef.current = masterGain;

    if (activeTrack === '432hz') {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(432, ctx.currentTime);
      osc.connect(masterGain);
      osc.start();
      oscRef1.current = osc;
    } else if (activeTrack === '528hz') {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(528, ctx.currentTime);
      osc.connect(masterGain);
      osc.start();
      oscRef1.current = osc;
    } else if (activeTrack === 'theta') {
      // 200 Hz Base + 206 Hz for 6 Hz Theta differential
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(200, ctx.currentTime);
      osc2.frequency.setValueAtTime(206, ctx.currentTime);
      osc1.connect(masterGain);
      osc2.connect(masterGain);
      osc1.start();
      osc2.start();
      oscRef1.current = osc1;
      oscRef2.current = osc2;
    } else if (activeTrack === 'pink_noise') {
      // Generate 5-second buffer of pink noise
      const bufferSize = ctx.sampleRate * 4;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.06;
        b6 = white * 0.115926;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      // Low pass filter for gentle rain effect
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1000, ctx.currentTime);

      noise.connect(filter);
      filter.connect(masterGain);
      noise.start();
      noiseNodeRef.current = noise;
    }
  };

  useEffect(() => {
    if (isPlaying) {
      startAudio();
    } else {
      stopAudio();
    }
    return () => stopAudio();
  }, [isPlaying, activeTrack]);

  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(volume, audioCtxRef.current.currentTime);
    }
  }, [volume]);

  const [isExpanded, setIsExpanded] = useState(false);
  const currentTrackObj = TRACKS.find(t => t.id === activeTrack) || TRACKS[0];

  return (
    <div className="fixed bottom-5 right-5 z-40 animate-fadeIn">
      {isExpanded ? (
        <div className="p-4 sm:p-5 rounded-3xl neuro-flat shadow-2xl border border-white/80 w-80 sm:w-96 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-teal-600 animate-pulse" />
              <span className="text-xs font-bold text-slate-800">Binaural Soundscapes</span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-xs font-bold text-slate-400 hover:text-slate-700 px-2 py-0.5 rounded-lg neuro-btn"
            >
              ✕
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-12 h-12 rounded-2xl neuro-btn flex items-center justify-center text-teal-600 hover:text-teal-700 transition-all shrink-0 shadow-md"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold text-slate-900 truncate">
                {currentTrackObj.name}
              </h4>
              <p className="text-[10px] text-slate-500 truncate mt-0.5">
                {currentTrackObj.desc}
              </p>
            </div>
          </div>

          {/* Track Pills */}
          <div className="grid grid-cols-2 gap-1.5">
            {TRACKS.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTrack(t.id)}
                className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold text-center transition-all ${
                  activeTrack === t.id
                    ? 'neuro-pill-active text-teal-800'
                    : 'neuro-btn text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>

          {/* Volume Slider */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl neuro-inset">
            <Volume2 className="w-3.5 h-3.5 text-slate-500" />
            <input
              type="range"
              min="0"
              max="0.8"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full accent-teal-600 cursor-pointer"
            />
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 p-2 rounded-2xl neuro-flat border border-white/80 shadow-xl">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-10 h-10 rounded-xl neuro-btn flex items-center justify-center text-teal-600 hover:text-teal-700 shrink-0"
            title={isPlaying ? "Pause Soundscape" : "Play Soundscape"}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>
          
          <button
            onClick={() => setIsExpanded(true)}
            className="flex items-center gap-2 pr-2 text-left"
          >
            <div>
              <span className="text-[11px] font-bold text-slate-800 block leading-tight">
                {isPlaying ? currentTrackObj.name : '432 Hz Soundscape'}
              </span>
              <span className="text-[9px] text-teal-600 font-semibold flex items-center gap-1">
                <Music className="w-2.5 h-2.5" />
                {isPlaying ? 'Synthesizing...' : 'Tap for Zen Beats'}
              </span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
