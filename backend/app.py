import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from models import SessionLocal, User, Assessment, ActivityLog, init_db
from ml_engine import predict_mental_health
from disease_ontology import DISEASE_CATALOGUE, calculate_45_disease_probabilities

app = Flask(__name__)
# Enable CORS for local development and production
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Ensure database is created
init_db()

# Pre-defined situational questions for the Tinder-style swipe cards
SITUATIONAL_CARDS = [
    {
        "id": "q1",
        "category": "Perfectionism & OCPD",
        "question": "Do you feel intense panic or frustration when tasks aren't done 100% flawlessly?",
        "stress_weight": 2.2
    },
    {
        "id": "q2",
        "category": "Emotional Volatility & BPD",
        "question": "Do your moods or feelings towards close relationships shift rapidly and unpredictably?",
        "stress_weight": 2.4
    },
    {
        "id": "q3",
        "category": "Social Avoidance (AvPD)",
        "question": "Do you hold back from speaking or connecting out of deep fear of criticism or embarrassment?",
        "stress_weight": 2.2
    },
    {
        "id": "q4",
        "category": "Guardedness & Suspicion",
        "question": "Do you find it difficult to trust people, often wondering about hidden motives?",
        "stress_weight": 1.9
    },
    {
        "id": "q5",
        "category": "Type-A Urgency",
        "question": "Are you chronically rushing, feeling irritated when others or tasks move too slowly?",
        "stress_weight": 1.8
    },
    {
        "id": "q6",
        "category": "Cognitive Burnout & Fatigue",
        "question": "Are unrelenting deadlines and cognitive strain making daily tasks feel overwhelming?",
        "stress_weight": 2.1
    }
]

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "healthy",
        "project": "Antigravity - Mental Disease & Burnout Risk Predictor",
        "mode": "45+ Mental Disease Diagnostic Suite & Behavioral Activities (100% Free & Offline)"
    })

@app.route("/api/profile", methods=["GET", "POST"])
def user_profile():
    db = SessionLocal()
    try:
        user = db.query(User).first()
        if not user:
            user = User(
                username="Explorer",
                age=21,
                occupation="Student",
                baseline_sleep=7.0,
                baseline_work_hours=8.0
            )
            db.add(user)
            db.commit()
            db.refresh(user)

        if request.method == "POST":
            data = request.get_json() or {}
            if "username" in data:
                user.username = str(data["username"]).strip()
            if "age" in data:
                user.age = int(data["age"])
            if "occupation" in data:
                user.occupation = str(data["occupation"])
            if "baseline_sleep" in data:
                user.baseline_sleep = float(data["baseline_sleep"])
            if "baseline_work_hours" in data:
                user.baseline_work_hours = float(data["baseline_work_hours"])

            db.commit()
            db.refresh(user)

        return jsonify(user.to_dict())
    finally:
        db.close()

@app.route("/api/cards", methods=["GET"])
def get_cards():
    return jsonify(SITUATIONAL_CARDS)

@app.route("/api/diseases", methods=["GET"])
def get_diseases():
    """
    Returns full catalogue of 45+ Mental Diseases mapped to user's latest calculated probability.
    """
    db = SessionLocal()
    try:
        user = db.query(User).first()
        if not user:
            return jsonify(DISEASE_CATALOGUE)

        latest_assessment = db.query(Assessment).filter_by(user_id=user.id).order_by(Assessment.timestamp.desc()).first()
        if latest_assessment and latest_assessment.disease_probabilities_45:
            try:
                calculated = json.loads(latest_assessment.disease_probabilities_45)
                return jsonify(calculated)
            except Exception:
                pass

        # Fallback calculate from user baseline
        user_meta = user.to_dict()
        default_ocean = {"Openness": 50, "Conscientiousness": 50, "Extraversion": 50, "Agreeableness": 50, "Neuroticism": 50}
        calculated = calculate_45_disease_probabilities(ocean_scores=default_ocean, user_metadata=user_meta)
        return jsonify(calculated)
    finally:
        db.close()

@app.route("/api/activities/submit", methods=["POST"])
def submit_activity():
    """
    Ingests multi-modal activity telemetry (Stroop, Tapping, Body Scan, CBT Distortion, Voice),
    stores ActivityLog, and recalculates continuous probability across all 45+ disorders.
    """
    db = SessionLocal()
    try:
        user = db.query(User).first()
        if not user:
            user = User(username="Explorer", age=21, occupation="Student", baseline_sleep=7.0, baseline_work_hours=8.0)
            db.add(user)
            db.commit()
            db.refresh(user)

        payload = request.get_json() or {}
        act_type = payload.get("activity_type", "general")
        metrics = payload.get("metrics", {})

        # 1. Save Activity Log
        log = ActivityLog(
            user_id=user.id,
            activity_type=act_type,
            metrics=json.dumps(metrics)
        )
        db.add(log)
        db.commit()
        db.refresh(log)

        # 2. Get latest assessment or create baseline
        latest = db.query(Assessment).filter_by(user_id=user.id).order_by(Assessment.timestamp.desc()).first()
        user_meta = user.to_dict()
        
        ocean = {
            "Openness": latest.openness if latest else 50.0,
            "Conscientiousness": latest.conscientiousness if latest else 50.0,
            "Extraversion": latest.extraversion if latest else 50.0,
            "Agreeableness": latest.agreeableness if latest else 50.0,
            "Neuroticism": latest.neuroticism if latest else 50.0
        }

        # Format activity telemetry
        game_metrics = metrics if act_type in ["stroop", "digit_span"] else {}
        tapping_metrics = metrics if act_type == "tapping" else {}
        somatic_tension = metrics.get("tension_areas", []) if act_type == "body_scan" else []
        cbt_distortions = metrics.get("distortions", []) if act_type == "cbt" else []

        # Recalculate 45 disease probabilities with new behavioral telemetry
        diseases_45 = calculate_45_disease_probabilities(
            ocean_scores=ocean,
            user_metadata=user_meta,
            game_metrics=game_metrics,
            tapping_metrics=tapping_metrics,
            somatic_tension=somatic_tension,
            cbt_distortions=cbt_distortions
        )

        if latest:
            latest.disease_probabilities_45 = json.dumps(diseases_45)
            db.commit()

        return jsonify({
            "status": "success",
            "activity_id": log.id,
            "activity_type": act_type,
            "top_flagged_conditions": diseases_45[:5],
            "total_conditions_tracked": len(diseases_45)
        })
    finally:
        db.close()

@app.route("/api/predict", methods=["POST"])
def predict():
    db = SessionLocal()
    try:
        user = db.query(User).first()
        if not user:
            user = User(username="Explorer", age=21, occupation="Student", baseline_sleep=7.0, baseline_work_hours=8.0)
            db.add(user)
            db.commit()
            db.refresh(user)

        payload = request.get_json() or {}
        journal_text = payload.get("journal_text", "").strip()
        typing_wpm = float(payload.get("typing_wpm", 45.0))
        input_type = payload.get("input_type", "journal")
        swipes = payload.get("swipes", []) # e.g. [{"id": "q1", "agreed": True}, ...]
        preferred_model = payload.get("model_type", "ensemble")

        # Calculate swipe stress score from cards (0.0 to 10.0 scale)
        swipe_stress_score = 5.0
        if swipes and isinstance(swipes, list):
            card_map = {c["id"]: c["stress_weight"] for c in SITUATIONAL_CARDS}
            total_weight = sum(card_map.get(s.get("id"), 2.0) for s in swipes if s.get("agreed"))
            max_possible = sum(c["stress_weight"] for c in SITUATIONAL_CARDS)
            swipe_stress_score = (total_weight / max(max_possible, 1.0)) * 10.0

        user_meta = user.to_dict()

        # Run ML inference pipeline
        prediction = predict_mental_health(
            journal_text=journal_text,
            user_metadata=user_meta,
            typing_wpm=typing_wpm,
            swipes_stress_score=swipe_stress_score,
            preferred_model=preferred_model
        )

        ocean = prediction["ocean_scores"]
        mental_weight = prediction["mental_weight"]
        burnout = prediction["burnout_risk"]
        depression = prediction["depression_risk"]
        anxiety = prediction["anxiety_risk"]
        risk_lvl = prediction["risk_level"]
        recommendations = prediction["recommendations"]
        personality_diagnostics = prediction.get("personality_diagnostics", {})
        model_comparison = prediction.get("model_comparison", {})

        # Calculate full 45+ diseases probability distribution
        diseases_45 = calculate_45_disease_probabilities(
            ocean_scores=ocean,
            user_metadata=user_meta,
            journal_text=journal_text
        )

        # Persist to DB
        assessment = Assessment(
            user_id=user.id,
            input_type=input_type,
            journal_text=journal_text,
            typing_speed_wpm=typing_wpm,
            swipes_summary=json.dumps(swipes),
            openness=ocean["Openness"],
            conscientiousness=ocean["Conscientiousness"],
            extraversion=ocean["Extraversion"],
            agreeableness=ocean["Agreeableness"],
            neuroticism=ocean["Neuroticism"],
            mental_weight=mental_weight,
            burnout_risk=burnout,
            depression_risk=depression,
            anxiety_risk=anxiety,
            risk_level=risk_lvl,
            recommendations=json.dumps(recommendations),
            personality_diagnostics=json.dumps(personality_diagnostics),
            model_comparison=json.dumps(model_comparison),
            disease_probabilities_45=json.dumps(diseases_45)
        )
        db.add(assessment)
        db.commit()
        db.refresh(assessment)

        resp = assessment.to_dict()
        resp["status_color"] = prediction["status_color"]
        return jsonify(resp)
    finally:
        db.close()

@app.route("/api/history", methods=["GET"])
def history():
    db = SessionLocal()
    try:
        user = db.query(User).first()
        if not user:
            return jsonify([])

        assessments = db.query(Assessment).filter_by(user_id=user.id).order_by(Assessment.timestamp.asc()).all()
        return jsonify([a.to_dict() for a in assessments])
    finally:
        db.close()

@app.route("/api/resources", methods=["GET"])
def get_resources():
    helplines = [
        {
            "name": "Tele-MANAS (Govt of India)",
            "number": "14416 / 1800-891-4416",
            "timing": "24x7 Free & Toll-Free",
            "desc": "National Tele Mental Health Programme providing comprehensive psychological counseling."
        },
        {
            "name": "KIRAN Helpline",
            "number": "1800-599-0019",
            "timing": "24x7 Toll-Free",
            "desc": "Ministry of Social Justice & Empowerment dedicated mental health rehabilitation helpline."
        },
        {
            "name": "Vandrevala Foundation",
            "number": "+91 9999 666 555",
            "timing": "24x7 Free Crisis Counseling",
            "desc": "Experienced counselors providing crisis support and emotional distress intervention."
        },
        {
            "name": "AASRA Suicide Prevention",
            "number": "+91 98204 66726",
            "timing": "24x7 Confidential",
            "desc": "Free emotional and suicide crisis prevention helpline."
        }
    ]
    
    exercises = [
        {
            "name": "Box Breathing (Sama Vritti)",
            "duration": "4-4-4-4 Seconds",
            "steps": "Inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds, hold empty for 4 seconds.",
            "purpose": "Rapidly resets sympathetic fight-or-flight nervous system."
        },
        {
            "name": "5-4-3-2-1 Somatic Grounding",
            "duration": "3 Minutes",
            "steps": "Notice 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste.",
            "purpose": "Pulls awareness out of racing cognitive loops back into the physical present."
        },
        {
            "name": "Physiological Sigh",
            "duration": "60 Seconds",
            "steps": "Two rapid inhales through the nose, followed by one long, slow exhale through the mouth.",
            "purpose": "Clinically proven to maximize lung alveolar expansion and drop heart rate immediately."
        }
    ]

    return jsonify({
        "helplines": helplines,
        "exercises": exercises
    })

if __name__ == "__main__":
    print("Starting Antigravity Flask ML Server on http://127.0.0.1:5000 ...")
    app.run(host="0.0.0.0", port=5000, debug=True)
