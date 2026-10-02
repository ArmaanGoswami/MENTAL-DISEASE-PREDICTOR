import React, { useState } from 'react';
import { X, Save, Moon, Clock, Briefcase, GraduationCap } from 'lucide-react';

export default function ProfileModal({ isOpen, onClose, user, onSave }) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    username: user?.username || 'Armaan Goswami',
    age: user?.age || 21,
    occupation: user?.occupation || 'Student',
    baseline_sleep: user?.baseline_sleep || 7.0,
    baseline_work_hours: user?.baseline_work_hours || 8.0
  });

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave(formData);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md p-6 rounded-3xl neuro-flat border border-white/10 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div>
            <h3 className="text-lg font-bold text-neutral-100">Baseline Demographics</h3>
            <p className="text-xs text-neutral-400">ML baseline calibration for stress & burnout scoring</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl neuro-btn flex items-center justify-center text-neutral-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          
          {/* Username */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Full Name / Alias</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl neuro-inset text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-teal-400"
              required
            />
          </div>

          {/* Age & Role */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Age</label>
              <input
                type="number"
                min="14"
                max="85"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl neuro-inset text-sm text-neutral-100 focus:outline-none focus:ring-1 focus:ring-teal-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Primary Role</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, occupation: 'Student' })}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                    formData.occupation === 'Student'
                      ? 'neuro-pill-active text-teal-300'
                      : 'neuro-btn text-neutral-400'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, occupation: 'Professional' })}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                    formData.occupation === 'Professional'
                      ? 'neuro-pill-active text-teal-300'
                      : 'neuro-btn text-neutral-400'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  Work
                </button>
              </div>
            </div>
          </div>

          {/* Baseline Sleep Hours */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-neutral-300 flex items-center gap-1.5">
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                Average Sleep Schedule
              </span>
              <span className="text-teal-400 font-bold">{formData.baseline_sleep} hrs / night</span>
            </div>
            <input
              type="range"
              min="3"
              max="11"
              step="0.5"
              value={formData.baseline_sleep}
              onChange={(e) => setFormData({ ...formData, baseline_sleep: Number(e.target.value) })}
              className="w-full accent-teal-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-neutral-500 mt-1">
              <span>3h (Severe Deficit)</span>
              <span>7-8h (Optimal)</span>
              <span>11h</span>
            </div>
          </div>

          {/* Baseline Work Hours */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-neutral-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                Daily Study / Work Hours
              </span>
              <span className="text-teal-400 font-bold">{formData.baseline_work_hours} hrs / day</span>
            </div>
            <input
              type="range"
              min="2"
              max="15"
              step="0.5"
              value={formData.baseline_work_hours}
              onChange={(e) => setFormData({ ...formData, baseline_work_hours: Number(e.target.value) })}
              className="w-full accent-teal-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-neutral-500 mt-1">
              <span>2h Light</span>
              <span>8h Standard</span>
              <span>14h+ High Strain</span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl neuro-btn text-xs font-semibold text-neutral-400 hover:text-neutral-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 rounded-xl neuro-btn text-xs font-bold text-teal-300 hover:text-teal-200 flex items-center justify-center gap-2 border border-teal-500/30"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Calibrating...' : 'Save Baseline'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
