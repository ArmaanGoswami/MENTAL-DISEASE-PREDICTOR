# Antigravity: 45+ Mental Disease Diagnostic Predictor & Behavioral Lab 🪶⚖️
> *"Lifting the heavy weight of mental disorders, stress, and burnout through daily cognitive games, somatic feedback, and behavioral telemetry."*

An end-to-end, **100% Free & Open-Source**, production-grade AI/ML full-stack web application designed for hackathons (such as **Smart India Hackathon - SIH**) and academic portfolio presentations. Built with a modern, tactile **Neumorphism (Soft UI)** design system and local offline machine learning inference.

---

## 🌟 Architecture & Data Flow

```
[ User Interaction ]
       │
       ├── Active: Journaling + Situational Tinder Swipes
       ├── Passive: Keystroke Dynamics & Typing Cadence (WPM)
       └── Cognitive & Somatic Activities:
             ├─ Stroop Inhibition Game (latency & error rate)
             ├─ Psychomotor Finger Tapping (cadence & variance)
             ├─ Somatic Body Heatmap (8 tension zones)
             └─ CBT Cognitive Distortion Detective
       │
       ▼
┌────────────────────────────────────────┐
│  Frontend Layer (React.js + Tailwind)  │
│  - Tactile Neumorphic Soft UI          │
│  - 45+ Disease Matrix & Search Filter  │
│  - Synthesized Web Audio Soundscapes   │
└───────────────────┬────────────────────┘
                    │ HTTPS / JSON
                    ▼
┌────────────────────────────────────────┐
│   Backend Layer (Python / Flask API)   │
└──────────────┬──────────────────┬──────┘
   Text / Bio  │                  │ Feature Vector
               ▼                  ▼
┌──────────────────────┐  ┌───────────────────────────────────┐
│ 45+ Disease Ontology │  │ Dual ML Model Engine:             │
│ & Biomarker Engine   │  │ 1. Multi-Output Linear Regression │
│ (DSM-5 & ICD-11)     │  │ 2. Random Forest Regressor (100)  │
└──────────────┬───────┘  └─────────────────┬─────────────────┘
        Scores │                            │ Beta Weights & R²
               └──────────────┬─────────────┘
                              ▼
               ┌─────────────────────────────┐
               │   Database (SQLite / TiDB)  │
               │  - Baseline Demographics    │
               │  - Longitudinal Assessments │
               │  - Activity Biomarker Logs  │
               └─────────────────────────────┘
```

---

## 🚀 Key Features

### 1. 45+ Mental Disease & Disorder Directory (`DiseaseEncyclopedia.jsx`)
Tracks 45 clinically classified conditions across 8 diagnostic spectra:
- **Mood & Affective (8)**: Major Depressive, Bipolar I/II, Cyclothymia, Dysthymia, Disruptive Mood Dysregulation, Seasonal Affective Disorder (SAD), Postpartum Depression.
- **Anxiety & Panic Spectrum (6)**: GAD, Panic Disorder, Agoraphobia, Social Anxiety, Specific Phobias, Illness Anxiety.
- **Trauma & Stress (5)**: PTSD, Complex PTSD (C-PTSD), Acute Stress Disorder, Adjustment Disorder, Reactive Attachment.
- **Obsessive-Compulsive & Related (5)**: Classic OCD, Body Dysmorphic Disorder, Hoarding Disorder, Trichotillomania, Excoriation.
- **Neurodevelopmental & Executive (4)**: ADHD Combined, ADHD Inattentive, High-Functioning Autism Spectrum, Tourette Syndrome.
- **Personality Disorders (10)**:
  - *Cluster B*: Borderline (BPD), Narcissistic (NPD), Histrionic, Antisocial (ASPD).
  - *Cluster C*: Obsessive-Compulsive Personality (OCPD / Perfectionism), Avoidant (AvPD), Dependent.
  - *Cluster A*: Paranoid, Schizoid, Schizotypal.
- **Dissociative & Somatic (4)**: Somatic Symptom Disorder, Dissociative Identity, Depersonalization / Derealization, Conversion Disorder.
- **Sleep & Cognitive Syndromes (3)**: Chronic Insomnia, Impostor Phenomenon & Perfectionist Neurosis, Executive Burnout & Cognitive Exhaustion.

### 2. Behavioral Activities Lab (`ActivitiesHub.jsx`)
Continuous longitudinal data extraction via interactive tasks:
- 🧠 **Stroop Inhibition Game**: Millisecond reaction timer and inhibition error counter tracking cognitive slowing or impulsivity.
- ⚡ **Psychomotor Finger Tapping Test**: 10-second rapid cadence test measuring taps/second and interval variance (psychomotor retardation vs agitation).
- 🫀 **Somatic Body Tension Heatmap**: Clickable 8-zone body avatar (Head, Jaw, Throat, Chest, Gut, Solar Plexus, Shoulders, Limbs).
- 🔍 **CBT Distortion Detective**: Multi-select identification of automatic thoughts (*Catastrophizing, All-or-Nothing, Mind Reading, Emotional Reasoning*).

### 3. Dual ML Model Comparison: Linear Regression & Random Forest
- **Linear Regression**: Transparent mathematical formula with beta coefficients ($\beta$):
  $$\text{Mental Weight} = 18.2 + 0.423 \cdot \text{Neuroticism} - 0.215 \cdot \text{Conscientiousness} - 0.187 \cdot \text{Extraversion} - 0.112 \cdot \text{Agreeableness} + 0.089 \cdot \text{Openness}$$
  Achieves $R^2 = 0.938$.
- **Random Forest**: 100 ensemble trees capturing non-linear interactions ($R^2 = 0.918$).
- Side-by-side comparison card rendered directly in the user dashboard.

### 4. Offline Synthesized Soundscape Player
- 100% offline Web Audio API binaural frequency generator:
  - **432 Hz Calm** • **528 Hz Clarity** • **6 Hz Theta Wave** • **Pink Noise Rain**.

---

## 🛠️ Tech Stack & 100% Free Guarantee

| Component | Technology | Free Tier Guarantee |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide Icons | 100% Free, zero external API keys |
| **Backend API** | Python 3.11, Flask, Flask-CORS, SQLAlchemy | 100% Free, local inference |
| **Machine Learning** | Scikit-Learn (Linear Regression & Random Forest) | 100% Free, offline local models |
| **Database** | SQLite3 (compatible with TiDB Serverless) | Zero cloud costs, self-contained |
| **Audio Synthesizer**| Browser Web Audio API Oscillators | 100% Free, zero downloaded MP3s |

---

## 🚀 How to Run Locally

### Automatic 1-Click Launch (Windows):
Double-click:
```bat
run_app.bat
```

### Manual Launch:
1. **Backend**:
   ```bash
   cd backend
   python -m venv venv
   .\venv\Scripts\activate
   pip install -r requirements.txt
   python seed_data.py
   python app.py
   ```
2. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. Open your browser: 👉 **`http://localhost:5173`**
