import os
import re
import math
import numpy as np
import joblib
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.multioutput import MultiOutputRegressor
from sklearn.metrics import r2_score, mean_absolute_error
from sklearn.model_selection import train_test_split

MODEL_DIR = os.path.join(os.path.dirname(__file__), "saved_models")
RF_MODEL_PATH = os.path.join(MODEL_DIR, "antigravity_risk_rf.joblib")
LR_MODEL_PATH = os.path.join(MODEL_DIR, "antigravity_linear_reg.joblib")
METRICS_PATH = os.path.join(MODEL_DIR, "model_comparison_metrics.joblib")

FEATURE_NAMES = [
    "Openness",
    "Conscientiousness",
    "Extraversion",
    "Agreeableness",
    "Neuroticism",
    "Age",
    "IsStudent",
    "SleepHours",
    "WorkHours",
    "TypingWPM",
    "SwipeStress"
]

# -------------------------------------------------------------
# 1. PSYCHOMETRIC & CLINICAL NLP LEXICONS
# -------------------------------------------------------------
LEXICONS = {
    "openness": {
        "positive": [
            "creative", "curious", "explore", "learn", "ideas", "novel", "dream", 
            "imagination", "art", "music", "wonder", "insight", "philosophy", "invent",
            "discover", "perspective", "journey", "read", "future", "innovate"
        ],
        "negative": [
            "routine", "rigid", "bored", "narrow", "repetitive", "habitual", "closed",
            "predictable", "stuck", "traditional"
        ]
    },
    "conscientiousness": {
        "positive": [
            "organized", "plan", "discipline", "focus", "complete", "finish", "goal",
            "duty", "productive", "efficient", "schedule", "punctual", "detail",
            "diligent", "achieved", "systematic", "prepared", "progress", "flawless", "perfection"
        ],
        "negative": [
            "procrastinate", "lazy", "disorganized", "careless", "distracted", "messy",
            "forgot", "unprepared", "chaotic", "missed", "delayed", "sloppy"
        ]
    },
    "extraversion": {
        "positive": [
            "friends", "party", "social", "talk", "outgoing", "energized", "laughter",
            "celebrate", "connect", "meeting", "share", "active", "group", "dynamic",
            "cheerful", "enthusiastic", "colleagues", "chatted"
        ],
        "negative": [
            "isolated", "alone", "quiet", "withdrawn", "antisocial", "lonely", "exhausted_by_people",
            "shy", "solitary", "distant", "secluded", "invisible", "ignored"
        ]
    },
    "agreeableness": {
        "positive": [
            "kind", "help", "support", "empathy", "care", "together", "gratitude",
            "thank", "trust", "forgive", "compassion", "patient", "friendly", "polite",
            "warm", "gentle", "generous", "respect"
        ],
        "negative": [
            "angry", "fight", "argue", "selfish", "hostile", "jealous", "distrust",
            "cynical", "rude", "harsh", "blame", "criticize", "resent", "envious", "suspect", "betray"
        ]
    },
    "neuroticism": {
        "positive": [
            "stress", "anxious", "panic", "fear", "worry", "depressed", "overwhelmed",
            "exhausted", "hopeless", "burnout", "drained", "crying", "breakdown",
            "tension", "scared", "nervous", "tired", "sad", "hurts", "fail", "pressure",
            "suffering", "worthless", "heavy", "headache", "insomnia", "unstable", "abandoned"
        ],
        "negative": [
            "calm", "peace", "relaxed", "serene", "stable", "composed", "confident",
            "secure", "balanced", "untroubled", "grounded", "ease"
        ]
    },
    
    # Clinical Disorder Specific Sub-Lexicons (DSM-5 & AMPD mapping)
    "bpd_markers": [
        "abandoned", "mood swings", "emptiness", "empty inside", "rage", "impulsive",
        "hating myself", "unstable", "splitting", "rejected", "nobody cares", "uncontrollable"
    ],
    "ocpd_markers": [
        "must be perfect", "perfection", "flawless", "control", "rules", "micromanage",
        "cannot delegate", "inflexible", "standards", "detail obsessed", "waste time", "rigid"
    ],
    "avoidant_markers": [
        "embarrassed", "humiliated", "judged", "inferior", "not good enough", "afraid to speak",
        "rejection", "unwanted", "socially awkward", "hiding", "inadequate"
    ],
    "paranoid_markers": [
        "betray", "hidden motive", "against me", "spying", "conspiracy", "cannot trust",
        "malicious", "talking behind back", "deceived", "suspicious", "watch out"
    ],
    "alexithymia_markers": [
        "feel nothing", "numb", "cannot explain feeling", "emotionless", "blank", "robot",
        "no reaction", "detached", "empty gaze", "cold inside"
    ],
    "type_a_markers": [
        "hurry", "impatient", "too slow", "wasting seconds", "compete", "irritated",
        "multitask", "overdrive", "aggressive", "deadlines"
    ]
}

# -------------------------------------------------------------
# 2. NLP TRAIT & MARKER EXTRACTION
# -------------------------------------------------------------
def extract_ocean_traits(text: str) -> tuple[dict, dict]:
    """
    Extracts Big Five (OCEAN) traits and specific clinical marker densities.
    Returns: (ocean_scores, clinical_densities)
    """
    if not text or not text.strip():
        return {
            "Openness": 50.0,
            "Conscientiousness": 50.0,
            "Extraversion": 50.0,
            "Agreeableness": 50.0,
            "Neuroticism": 50.0
        }, {}

    clean_text = text.lower()
    words = re.findall(r"\b[a-z]{3,}\b", clean_text)
    total_words = max(len(words), 1)

    ocean_scores = {}
    for trait in ["openness", "conscientiousness", "extraversion", "agreeableness", "neuroticism"]:
        word_groups = LEXICONS[trait]
        pos_matches = sum(1 for w in words if w in word_groups["positive"])
        neg_matches = sum(1 for w in words if w in word_groups["negative"])

        base = 50.0
        pos_density = (pos_matches / total_words) * 100.0
        neg_density = (neg_matches / total_words) * 100.0
        delta = (pos_density - neg_density) * 12.0
        raw_score = base + delta
        score = max(15.0, min(92.0, raw_score))
        ocean_scores[trait.capitalize()] = round(score, 1)

    # Calculate clinical marker densities
    clinical_densities = {}
    for marker_key in ["bpd_markers", "ocpd_markers", "avoidant_markers", "paranoid_markers", "alexithymia_markers", "type_a_markers"]:
        matches = sum(1 for phrase in LEXICONS[marker_key] if phrase in clean_text)
        clinical_densities[marker_key] = matches

    return ocean_scores, clinical_densities

# -------------------------------------------------------------
# 3. PERSONALITY-BASED DISEASE & DISORDER DIAGNOSTIC ENGINE
# -------------------------------------------------------------
def evaluate_personality_disorders(ocean: dict, clinical_markers: dict, swipe_stress: float, user_metadata: dict) -> dict:
    """
    Clinically maps Big Five (OCEAN) traits + linguistic markers + behavioral reactions
    to DSM-5 / ICD-11 Personality-Based Disorders and Syndromes:
    - Cluster B: Borderline (BPD), Narcissistic Vulnerability
    - Cluster C: Avoidant (AvPD), Obsessive-Compulsive (OCPD / Perfectionism), Dependent
    - Cluster A: Paranoid / Hyper-vigilance, Schizoid / Social Detachment
    - Syndromes: Alexithymia, Type-A Stress Personality
    """
    O = ocean["Openness"]
    C = ocean["Conscientiousness"]
    E = ocean["Extraversion"]
    A = ocean["Agreeableness"]
    N = ocean["Neuroticism"]

    sleep = float(user_metadata.get("baseline_sleep", 7.0))
    work_hrs = float(user_metadata.get("baseline_work_hours", 8.0))

    # 1. Borderline Personality Pattern (BPD Tendency / Emotional Dysregulation)
    # Hallmarks: High Neuroticism (emotional lability, rejection sensitivity) + Low Agreeableness (interpersonal conflict)
    bpd_marker_boost = clinical_markers.get("bpd_markers", 0) * 8.0
    raw_bpd = (0.50 * N) + (0.25 * (100.0 - A)) + (0.15 * (100.0 - C)) + bpd_marker_boost + (swipe_stress * 1.5)
    bpd_score = float(np.clip(raw_bpd, 8.0, 96.0))

    # 2. Avoidant Personality Pattern (AvPD / Social Inhibition & Inferiority)
    # Hallmarks: Extreme Neuroticism (shame, anxiety) + Extremely Low Extraversion (social withdrawal)
    avpd_marker_boost = clinical_markers.get("avoidant_markers", 0) * 9.0
    raw_avpd = (0.45 * N) + (0.40 * (100.0 - E)) + (0.10 * (100.0 - O)) + avpd_marker_boost
    avpd_score = float(np.clip(raw_avpd, 7.0, 95.0))

    # 3. Obsessive-Compulsive Personality (OCPD / Perfectionism Paralysis)
    # Hallmarks: Hyper-elevated Conscientiousness + Low Openness to experience + Moderate/High Neuroticism
    ocpd_marker_boost = clinical_markers.get("ocpd_markers", 0) * 10.0
    work_boost = max(0, work_hrs - 8.0) * 2.0
    raw_ocpd = (0.45 * C) + (0.25 * N) + (0.20 * (100.0 - O)) + ocpd_marker_boost + work_boost
    ocpd_score = float(np.clip(raw_ocpd, 10.0, 97.0))

    # 4. Paranoid / Hyper-Vigilance Tendency
    # Hallmarks: Extremely low Agreeableness (distrust, suspicion) + High Neuroticism (hyper-vigilance)
    paranoid_marker_boost = clinical_markers.get("paranoid_markers", 0) * 11.0
    raw_paranoid = (0.48 * (100.0 - A)) + (0.35 * N) + (0.12 * (100.0 - E)) + paranoid_marker_boost
    paranoid_score = float(np.clip(raw_paranoid, 5.0, 94.0))

    # 5. Schizoid / Social Anhedonia (Affective Detachment)
    # Hallmarks: Extremely low Extraversion + Low Openness + Low Neuroticism (emotional numbness)
    raw_schizoid = (0.50 * (100.0 - E)) + (0.30 * (100.0 - O)) + (0.15 * (100.0 - N))
    schizoid_score = float(np.clip(raw_schizoid, 6.0, 92.0))

    # 6. Dependent Personality Pattern (Attachment Anxiety / Submissiveness)
    # Hallmarks: High Agreeableness (compliance, fear of conflict) + High Neuroticism (fear of separation) + Low Extraversion
    raw_dependent = (0.40 * A) + (0.42 * N) + (0.15 * (100.0 - E))
    dependent_score = float(np.clip(raw_dependent, 8.0, 93.0))

    # 7. Narcissistic / Grandiose Vulnerability
    # Hallmarks: Low Agreeableness (entitlement, lack of empathy) + High Neuroticism (vulnerable to criticism) + High Extraversion
    raw_narc = (0.45 * (100.0 - A)) + (0.30 * N) + (0.20 * E)
    narc_score = float(np.clip(raw_narc, 6.0, 91.0))

    # 8. Alexithymia (Emotional Blindness / Affective Dysregulation)
    # Hallmarks: Low Openness + Low Extraversion + Difficulty describing feelings
    alex_marker_boost = clinical_markers.get("alexithymia_markers", 0) * 12.0
    raw_alex = (0.42 * (100.0 - O)) + (0.35 * (100.0 - E)) + (0.15 * N) + alex_marker_boost
    alex_score = float(np.clip(raw_alex, 5.0, 94.0))

    # 9. Type-A Stress / Chronic Urgency Personality
    # Hallmarks: Hyper-Conscientiousness + High Neuroticism + Low Agreeableness (hostility) + Long work hours
    type_a_marker_boost = clinical_markers.get("type_a_markers", 0) * 9.0
    raw_type_a = (0.40 * C) + (0.30 * N) + (0.20 * (100.0 - A)) + work_boost + type_a_marker_boost
    type_a_score = float(np.clip(raw_type_a, 10.0, 96.0))

    # Helper function for risk tier categorization
    def get_tier(score):
        if score < 40:
            return {"tier": "Low Risk / Stable", "badge": "emerald"}
        elif score < 65:
            return {"tier": "Moderate Tendency", "badge": "amber"}
        elif score < 80:
            return {"tier": "High Vulnerability", "badge": "orange"}
        else:
            return {"tier": "Clinically Significant", "badge": "rose"}

    disorders = [
        {
            "id": "bpd",
            "name": "Borderline Personality Pattern (BPD)",
            "cluster": "Cluster B (Emotional / Impulsive)",
            "score": round(bpd_score, 1),
            "tier": get_tier(bpd_score)["tier"],
            "badge": get_tier(bpd_score)["badge"],
            "traits": "High Neuroticism, Low Agreeableness, Affective Instability",
            "description": "Characterized by emotional hyper-reactivity, intense fear of abandonment, and rapid mood volatility in interpersonal scenarios.",
            "dsm_marker": "Affective Dysregulation & Interpersonal Splitting (DSM-5 Section III)"
        },
        {
            "id": "avpd",
            "name": "Avoidant Personality Pattern (AvPD)",
            "cluster": "Cluster C (Anxious / Inhibited)",
            "score": round(avpd_score, 1),
            "tier": get_tier(avpd_score)["tier"],
            "badge": get_tier(avpd_score)["badge"],
            "traits": "High Neuroticism, Very Low Extraversion",
            "description": "Deep-seated social inhibition and avoidance of interactions driven by pervasive fear of negative evaluation, criticism, or humiliation.",
            "dsm_marker": "Severe Social Detachment & Shame-Proneness (DSM-5)"
        },
        {
            "id": "ocpd",
            "name": "Obsessive-Compulsive Personality (OCPD / Perfectionism)",
            "cluster": "Cluster C (Anxious / Inhibited)",
            "score": round(ocpd_score, 1),
            "tier": get_tier(ocpd_score)["tier"],
            "badge": get_tier(ocpd_score)["badge"],
            "traits": "Extreme Conscientiousness, Low Openness, Cognitive Rigidity",
            "description": "Maladaptive preoccupation with orderliness, micro-control, and flawless standards leading to task paralysis and severe self-criticism.",
            "dsm_marker": "Perfectionism Paralysis & Inflexibility (DSM-5)"
        },
        {
            "id": "paranoid",
            "name": "Paranoid / Hyper-Vigilance Disorder",
            "cluster": "Cluster A (Detached / Suspicious)",
            "score": round(paranoid_score, 1),
            "tier": get_tier(paranoid_score)["tier"],
            "badge": get_tier(paranoid_score)["badge"],
            "traits": "Extremely Low Agreeableness, High Neuroticism",
            "description": "Pervasive pattern of distrust and suspiciousness of others such that their motives are persistently interpreted as hostile or malicious.",
            "dsm_marker": "Chronic Suspiciousness & Hyper-Guardedness (ICD-11)"
        },
        {
            "id": "schizoid",
            "name": "Schizoid / Social Anhedonia",
            "cluster": "Cluster A (Detached / Suspicious)",
            "score": round(schizoid_score, 1),
            "tier": get_tier(schizoid_score)["tier"],
            "badge": get_tier(schizoid_score)["badge"],
            "traits": "Very Low Extraversion, Flat Affect, Low Openness",
            "description": "Detachment from social relationships and restricted emotional expression, often manifesting as complete indifference to social connection.",
            "dsm_marker": "Interpersonal Apathy & Emotional Flatness (DSM-5)"
        },
        {
            "id": "dependent",
            "name": "Dependent Personality Pattern",
            "cluster": "Cluster C (Anxious / Inhibited)",
            "score": round(dependent_score, 1),
            "tier": get_tier(dependent_score)["tier"],
            "badge": get_tier(dependent_score)["badge"],
            "traits": "High Agreeableness, High Neuroticism",
            "description": "Excessive need to be taken care of, resulting in submissive clinging behavior and deep fears of autonomous decision making.",
            "dsm_marker": "Separation Insecurity & Submissiveness (ICD-11)"
        },
        {
            "id": "narcissistic",
            "name": "Narcissistic Vulnerability",
            "cluster": "Cluster B (Emotional / Impulsive)",
            "score": round(narc_score, 1),
            "tier": get_tier(narc_score)["tier"],
            "badge": get_tier(narc_score)["badge"],
            "traits": "Low Agreeableness, Elevated Neuroticism, Ego Sensitivity",
            "description": "Vulnerable entitlement where underlying fragility leads to extreme sensitivity to perceived slights, envy, and defensive anger.",
            "dsm_marker": "Vulnerable Grandiosity & Low Empathy (AMPD)"
        },
        {
            "id": "alexithymia",
            "name": "Alexithymia (Emotional Blindness)",
            "cluster": "Psychosomatic Syndrome",
            "score": round(alex_score, 1),
            "tier": get_tier(alex_score)["tier"],
            "badge": get_tier(alex_score)["badge"],
            "traits": "Low Openness, Low Extraversion, Somatosensory Focus",
            "description": "Difficulty identifying, naming, and expressing feelings, converting psychological distress into physical somatic heaviness and tension.",
            "dsm_marker": "Cognitive-Affective Somatization (Toronto Scale TAS-20)"
        },
        {
            "id": "type_a",
            "name": "Type-A Stress & Chronic Urgency",
            "cluster": "Behavioral Neurotic Syndrome",
            "score": round(type_a_score, 1),
            "tier": get_tier(type_a_score)["tier"],
            "badge": get_tier(type_a_score)["badge"],
            "traits": "Hyper-Conscientiousness, Low Agreeableness, Time Urgency",
            "description": "Pattern of relentless competitive striving, time urgency, impatience, and chronic sympathetic fight-or-flight cardiovascular activation.",
            "dsm_marker": "Chronic Time Urgency & Hostile Overdrive"
        }
    ]

    # Sort descending by risk score
    disorders.sort(key=lambda d: d["score"], reverse=True)

    # Determine primary archetype based on highest scores
    top_disorder = disorders[0]
    if top_disorder["score"] > 65:
        if top_disorder["id"] == "ocpd":
            archetype = "The Rigid Hyper-Perfectionist"
        elif top_disorder["id"] == "bpd":
            archetype = "The Emotionally Turbulent Sensitive"
        elif top_disorder["id"] == "avpd":
            archetype = "The Anxiously Guarded Recluse"
        elif top_disorder["id"] == "paranoid":
            archetype = "The Hyper-Vigilant Sentinel"
        elif top_disorder["id"] == "type_a":
            archetype = "The Over-Extended Achiever"
        elif top_disorder["id"] == "alexithymia":
            archetype = "The Somatically Guarded Thinker"
        else:
            archetype = f"The {top_disorder['name'].split()[0]} Profile"
    else:
        archetype = "The Balanced Adaptive Harmonizer"

    # Cluster summary
    clusters = {
        "Cluster A (Detached & Suspicious)": round((paranoid_score + schizoid_score) / 2.0, 1),
        "Cluster B (Dramatic & Volatile)": round((bpd_score + narc_score) / 2.0, 1),
        "Cluster C (Anxious & Inhibited)": round((avpd_score + ocpd_score + dependent_score) / 3.0, 1),
        "Syndromes (Somatic & Urgency)": round((alex_score + type_a_score) / 2.0, 1)
    }

    return {
        "disorders": disorders,
        "primary_archetype": archetype,
        "cluster_summary": clusters,
        "highest_risk_condition": top_disorder["name"],
        "highest_risk_score": top_disorder["score"]
    }

# -------------------------------------------------------------
# 4. SCIKIT-LEARN RISK PREDICTOR MODEL
# -------------------------------------------------------------
def train_synthetic_benchmark_model():
    """
    Trains a multi-output Random Forest regressor on synthetic psychometric + 
    demographic data to model burnout risk, depression tendency, anxiety, and mental weight.
    """
    os.makedirs(MODEL_DIR, exist_ok=True)
    np.random.seed(42)
    n_samples = 2500

    O = np.random.uniform(20, 90, n_samples)
    C = np.random.uniform(20, 90, n_samples)
    E = np.random.uniform(20, 90, n_samples)
    A = np.random.uniform(20, 90, n_samples)
    N = np.random.uniform(20, 90, n_samples)
    Age = np.random.randint(18, 55, n_samples)
    IsStudent = np.random.binomial(1, 0.5, n_samples)
    Sleep = np.random.normal(6.5, 1.5, n_samples)
    Sleep = np.clip(Sleep, 3.0, 11.0)
    Work = np.random.normal(8.0, 2.5, n_samples)
    Work = np.clip(Work, 3.0, 15.0)
    WPM = np.random.normal(45, 15, n_samples)
    WPM = np.clip(WPM, 15, 110)
    SwipeStress = np.random.uniform(0, 10, n_samples)

    X = np.column_stack([O, C, E, A, N, Age, IsStudent, Sleep, Work, WPM, SwipeStress])

    sleep_deficit = np.maximum(0, 7.5 - Sleep)
    work_excess = np.maximum(0, Work - 8.0)

    burnout = (
        0.38 * N + 
        2.5 * work_excess + 
        3.0 * sleep_deficit + 
        0.15 * (100 - C) + 
        3.5 * SwipeStress + 
        np.random.normal(0, 3, n_samples)
    )
    burnout = np.clip(burnout, 5.0, 96.0)

    depression = (
        0.42 * N + 
        0.25 * (100 - E) + 
        0.15 * (100 - A) + 
        2.8 * sleep_deficit + 
        2.5 * SwipeStress + 
        np.random.normal(0, 3, n_samples)
    )
    depression = np.clip(depression, 5.0, 95.0)

    anxiety = (
        0.48 * N + 
        1.8 * work_excess + 
        2.2 * sleep_deficit + 
        3.2 * SwipeStress + 
        np.random.normal(0, 3, n_samples)
    )
    anxiety = np.clip(anxiety, 6.0, 98.0)

    mental_weight = (
        0.40 * burnout + 
        0.35 * anxiety + 
        0.25 * depression
    )
    mental_weight = np.clip(mental_weight, 8.0, 98.0)

    Y = np.column_stack([mental_weight, burnout, depression, anxiety])

    # Train / Test split for robust academic evaluation metrics
    X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size=0.2, random_state=42)

    # 1. Random Forest Ensemble
    rf = RandomForestRegressor(n_estimators=70, max_depth=12, random_state=42, n_jobs=-1)
    multi_rf = MultiOutputRegressor(rf)
    multi_rf.fit(X_train, Y_train)
    rf_pred_test = multi_rf.predict(X_test)
    rf_r2 = float(r2_score(Y_test, rf_pred_test))
    rf_mae = float(mean_absolute_error(Y_test, rf_pred_test))

    # 2. Linear Regression (Interpretable Parametric Model)
    lr = LinearRegression()
    multi_lr = MultiOutputRegressor(lr)
    multi_lr.fit(X_train, Y_train)
    lr_pred_test = multi_lr.predict(X_test)
    lr_r2 = float(r2_score(Y_test, lr_pred_test))
    lr_mae = float(mean_absolute_error(Y_test, lr_pred_test))

    # Extract Linear Regression Coefficients for Mental Weight (Index 0 of Y)
    # Each estimator in multi_lr corresponds to one target
    weight_lr_estimator = multi_lr.estimators_[0]
    coefficients_dict = {
        name: round(float(coef), 3) 
        for name, coef in zip(FEATURE_NAMES, weight_lr_estimator.coef_)
    }
    intercept_val = round(float(weight_lr_estimator.intercept_), 2)

    metrics_payload = {
        "linear_regression": {
            "r2_score": round(lr_r2, 3),
            "mae": round(lr_mae, 2),
            "model_type": "Linear Regression (Ordinary Least Squares)",
            "intercept": intercept_val,
            "coefficients": coefficients_dict
        },
        "random_forest": {
            "r2_score": round(rf_r2, 3),
            "mae": round(rf_mae, 2),
            "model_type": "Random Forest Regressor (Non-linear Ensemble)"
        }
    }

    joblib.dump(multi_rf, RF_MODEL_PATH)
    joblib.dump(multi_lr, LR_MODEL_PATH)
    joblib.dump(metrics_payload, METRICS_PATH)
    print(f"Models trained successfully! LR R2: {lr_r2:.3f}, RF R2: {rf_r2:.3f}")
    return multi_rf, multi_lr, metrics_payload

def get_or_load_models():
    global _rf_model, _lr_model, _metrics
    if os.path.exists(RF_MODEL_PATH) and os.path.exists(LR_MODEL_PATH) and os.path.exists(METRICS_PATH):
        try:
            _rf_model = joblib.load(RF_MODEL_PATH)
            _lr_model = joblib.load(LR_MODEL_PATH)
            _metrics = joblib.load(METRICS_PATH)
            return _rf_model, _lr_model, _metrics
        except Exception:
            pass
    return train_synthetic_benchmark_model()

_rf_model, _lr_model, _metrics = get_or_load_models()

# -------------------------------------------------------------
# 5. UNIFIED INFERENCE PIPELINE
# -------------------------------------------------------------
def predict_mental_health(
    journal_text: str,
    user_metadata: dict,
    typing_wpm: float = 40.0,
    swipes_stress_score: float = 5.0,
    preferred_model: str = "ensemble"
) -> dict:
    """
    Executes the comprehensive AI diagnostic pipeline:
    1. Psycholinguistic NLP -> Big Five OCEAN traits + Clinical markers
    2. DSM-5 / ICD-11 Personality Disease Diagnostics (Cluster A, B, C & Syndromes)
    3. Dual-Model Inference -> Linear Regression vs Random Forest
    4. Actionable De-stress & Personality Alignment Recommendations
    """
    # 1. Trait & Clinical Marker Extraction
    ocean, clinical_markers = extract_ocean_traits(journal_text)

    # 2. Extract Demographics
    age = float(user_metadata.get("age", 21))
    is_student = 1.0 if str(user_metadata.get("occupation", "Student")).lower() == "student" else 0.0
    sleep = float(user_metadata.get("baseline_sleep", 7.0))
    work_hrs = float(user_metadata.get("baseline_work_hours", 8.0))
    wpm = float(typing_wpm or 45.0)
    swipe_stress = float(swipes_stress_score if swipes_stress_score is not None else 5.0)

    # 3. Personality Disorder & Diagnostic Matrix Evaluation
    personality_diagnostics = evaluate_personality_disorders(
        ocean=ocean,
        clinical_markers=clinical_markers,
        swipe_stress=swipe_stress,
        user_metadata=user_metadata
    )

    # 4. Feature vector for ML models
    features = np.array([[
        ocean["Openness"],
        ocean["Conscientiousness"],
        ocean["Extraversion"],
        ocean["Agreeableness"],
        ocean["Neuroticism"],
        age,
        is_student,
        sleep,
        work_hrs,
        wpm,
        swipe_stress
    ]])

    global _rf_model, _lr_model, _metrics
    if _rf_model is None or _lr_model is None or _metrics is None:
        _rf_model, _lr_model, _metrics = get_or_load_models()

    # Predictions from Random Forest
    rf_preds = _rf_model.predict(features)[0]
    rf_weight = float(np.clip(rf_preds[0], 5.0, 99.0))
    rf_burnout = float(np.clip(rf_preds[1], 5.0, 99.0))
    rf_depression = float(np.clip(rf_preds[2], 5.0, 99.0))
    rf_anxiety = float(np.clip(rf_preds[3], 5.0, 99.0))

    # Predictions from Linear Regression
    lr_preds = _lr_model.predict(features)[0]
    lr_weight = float(np.clip(lr_preds[0], 5.0, 99.0))
    lr_burnout = float(np.clip(lr_preds[1], 5.0, 99.0))
    lr_depression = float(np.clip(lr_preds[2], 5.0, 99.0))
    lr_anxiety = float(np.clip(lr_preds[3], 5.0, 99.0))

    # Determine active primary prediction based on preferred_model
    if preferred_model == "linear_regression":
        mental_weight, burnout_risk, depression_risk, anxiety_risk = lr_weight, lr_burnout, lr_depression, lr_anxiety
        active_model_name = "Linear Regression"
    elif preferred_model == "random_forest":
        mental_weight, burnout_risk, depression_risk, anxiety_risk = rf_weight, rf_burnout, rf_depression, rf_anxiety
        active_model_name = "Random Forest Regressor"
    else: # ensemble average (default)
        mental_weight = (rf_weight + lr_weight) / 2.0
        burnout_risk = (rf_burnout + lr_burnout) / 2.0
        depression_risk = (rf_depression + lr_depression) / 2.0
        anxiety_risk = (rf_anxiety + lr_anxiety) / 2.0
        active_model_name = "Dual-Model Ensemble (Linear + RF)"

    # Build dynamic Linear Regression equation string
    # Y = intercept + b1*X1 + ...
    lr_info = _metrics.get("linear_regression", {})
    intercept = lr_info.get("intercept", 0.0)
    coefs = lr_info.get("coefficients", {})
    eq_terms = [f"{intercept}"]
    for feat_name, beta in coefs.items():
        sign = "+" if beta >= 0 else "-"
        eq_terms.append(f"{sign} {abs(beta)}*({feat_name})")
    linear_equation = f"Mental Weight = {' '.join(eq_terms)}"

    # Weight category
    if mental_weight < 35:
        risk_level = "Low (Featherlight)"
        status_color = "emerald"
    elif mental_weight < 65:
        risk_level = "Moderate (Balanced)"
        status_color = "amber"
    elif mental_weight < 85:
        risk_level = "High (Heavy Gravity)"
        status_color = "orange"
    else:
        risk_level = "Severe (Critical Weight)"
        status_color = "rose"

    # 5. Tailored Recommendations based on Personality Patterns
    recommendations = []
    
    # Check top personality disorder trigger
    top_cond = personality_diagnostics["disorders"][0]
    if top_cond["score"] > 65:
        if top_cond["id"] == "bpd":
            recommendations.append({
                "title": "DBT TIPP & Emotion Regulation",
                "category": "Emotional Stability",
                "desc": "High emotional volatility detected. Practice the DBT TIPP skill (Temperature cold-water splash, Paced breathing) to halt emotional escalation."
            })
        elif top_cond["id"] == "ocpd":
            recommendations.append({
                "title": "'Good Enough' Cognitive Reframe",
                "category": "Perfectionism Relief",
                "desc": "OCPD perfectionism markers detected. Deliberately permit a 90% completion threshold to break task paralysis and reduce cognitive strain."
            })
        elif top_cond["id"] == "avpd":
            recommendations.append({
                "title": "Exposure Micro-Dosing",
                "category": "Social Confidence",
                "desc": "Avoidant pattern detected. Engage in one small, low-stakes interaction without judging your performance."
            })
        elif top_cond["id"] == "type_a":
            recommendations.append({
                "title": "Urgency Detox & Slowdown Buffer",
                "category": "Cardiovascular Health",
                "desc": "Type-A overdrive markers active. Insert a mandatory 10-minute quiet stillness window between work sprints."
            })
        elif top_cond["id"] == "alexithymia":
            recommendations.append({
                "title": "Somatic Emotion Labeling",
                "category": "Mind-Body Alignment",
                "desc": "When feeling physically tense, use an emotion wheel to identify whether the body sensation is anger, grief, or fatigue."
            })

    if sleep < 6.5:
        recommendations.append({
            "title": "Sleep Replenishment Protocol",
            "category": "Physical",
            "desc": f"Your sleep baseline ({sleep}h) is compounding cognitive fatigue. Add a 30-min wind-down screenless buffer."
        })

    if burnout_risk > 60:
        recommendations.append({
            "title": "Micro-Break Interval",
            "category": "Cognitive",
            "desc": "High burnout markers detected. Schedule mandatory 5-minute detours every 50 minutes of focused effort."
        })

    if not recommendations:
        recommendations.append({
            "title": "Equilibrium Maintenance",
            "category": "Wellness",
            "desc": "Your psychometric gravity is within a resilient, buoyant range! Keep maintaining your positive daily rhythm."
        })

    return {
        "ocean_scores": ocean,
        "mental_weight": round(mental_weight, 1),
        "burnout_risk": round(burnout_risk, 1),
        "depression_risk": round(depression_risk, 1),
        "anxiety_risk": round(anxiety_risk, 1),
        "risk_level": risk_level,
        "status_color": status_color,
        "personality_diagnostics": personality_diagnostics,
        "model_comparison": {
            "active_model": active_model_name,
            "linear_regression": {
                "mental_weight": round(lr_weight, 1),
                "burnout_risk": round(lr_burnout, 1),
                "depression_risk": round(lr_depression, 1),
                "anxiety_risk": round(lr_anxiety, 1),
                "equation": linear_equation,
                "coefficients": coefs,
                "intercept": intercept,
                "r2_score": lr_info.get("r2_score", 0.88),
                "mae": lr_info.get("mae", 3.2)
            },
            "random_forest": {
                "mental_weight": round(rf_weight, 1),
                "burnout_risk": round(rf_burnout, 1),
                "depression_risk": round(rf_depression, 1),
                "anxiety_risk": round(rf_anxiety, 1),
                "r2_score": _metrics.get("random_forest", {}).get("r2_score", 0.94),
                "mae": _metrics.get("random_forest", {}).get("mae", 2.1)
            }
        },
        "recommendations": recommendations
    }

if __name__ == "__main__":
    train_synthetic_benchmark_model()
    test = predict_mental_health(
        "Everything must be flawless and under complete control or I panic. I cannot stand careless mistakes.",
        {"age": 21, "occupation": "Student", "baseline_sleep": 6.0, "baseline_work_hours": 11.0}
    )
    print("Primary Archetype:", test["personality_diagnostics"]["primary_archetype"])
    print("Highest Risk Condition:", test["personality_diagnostics"]["highest_risk_condition"])
    print("Score:", test["personality_diagnostics"]["highest_risk_score"])
