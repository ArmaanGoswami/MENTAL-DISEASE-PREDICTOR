import json
import datetime
import os
from models import SessionLocal, User, Assessment, init_db, engine
from ml_engine import evaluate_personality_disorders
from disease_ontology import calculate_45_disease_probabilities

def seed_sample_history():
    init_db()
    db = SessionLocal()
    try:
        user = db.query(User).first()
        if not user:
            user = User(
                username="Armaan Goswami",
                age=21,
                occupation="Student",
                baseline_sleep=6.5,
                baseline_work_hours=8.5
            )
            db.add(user)
            db.commit()
            db.refresh(user)

        # Clear existing assessments so new schema is cleanly populated
        db.query(Assessment).filter_by(user_id=user.id).delete()
        db.commit()

        now = datetime.datetime.utcnow()
        sample_days = [
            {
                "days_ago": 6,
                "input_type": "journal",
                "journal_text": "Started my college assignment. Felt quite motivated and organized today. Brain is feeling good.",
                "wpm": 48.0,
                "o": 65.0, "c": 70.0, "e": 55.0, "a": 60.0, "n": 30.0,
                "weight": 34.2, "burnout": 28.5, "depression": 22.0, "anxiety": 26.5,
                "risk": "Low (Featherlight)"
            },
            {
                "days_ago": 4,
                "input_type": "journal",
                "journal_text": "Had back to back classes and late night coding. Sleep was low around 5 hours, starting to feel the pressure.",
                "wpm": 42.0,
                "o": 58.0, "c": 62.0, "e": 48.0, "a": 52.0, "n": 56.0,
                "weight": 54.8, "burnout": 52.0, "depression": 45.0, "anxiety": 50.2,
                "risk": "Moderate (Balanced)"
            },
            {
                "days_ago": 1,
                "input_type": "journal",
                "journal_text": "Everything must be flawless and under complete control or I panic. Work deadlines are insane, feeling drained and anxious.",
                "wpm": 50.0,
                "o": 52.0, "c": 88.0, "e": 40.0, "a": 48.0, "n": 78.0,
                "weight": 74.4, "burnout": 76.2, "depression": 62.5, "anxiety": 78.0,
                "risk": "High (Heavy Gravity)"
            }
        ]

        user_meta = user.to_dict()

        for s in sample_days:
            dt = now - datetime.timedelta(days=s["days_ago"])
            recs = [
                {"title": "Hydration & Walk", "category": "Physical", "desc": "Take a 15-minute screenless walk outdoors."},
                {"title": "Focused Reset", "category": "Mindfulness", "desc": "Perform 3 rounds of box breathing."}
            ]
            ocean = {
                "Openness": s["o"],
                "Conscientiousness": s["c"],
                "Extraversion": s["e"],
                "Agreeableness": s["a"],
                "Neuroticism": s["n"]
            }
            p_diag = evaluate_personality_disorders(
                ocean=ocean,
                clinical_markers={"ocpd_markers": 2 if s["c"] > 80 else 0},
                swipe_stress=6.0,
                user_metadata=user_meta
            )

            model_comp = {
                "active_model": "Linear Regression + Random Forest (Ensemble)",
                "linear_regression": {
                    "mental_weight": s["weight"],
                    "burnout_risk": s["burnout"],
                    "depression_risk": s["depression"],
                    "anxiety_risk": s["anxiety"],
                    "r2_score": 0.938,
                    "mae": 3.12,
                    "intercept": 14.2,
                    "coefficients": {
                        "Neuroticism": 0.42,
                        "WorkHours": 1.85,
                        "SleepHours": -2.1,
                        "Conscientiousness": -0.15,
                        "Extraversion": -0.22,
                        "Agreeableness": -0.18,
                        "SwipeStress": 2.45
                    }
                },
                "random_forest": {
                    "mental_weight": round(s["weight"] + 0.8, 1),
                    "burnout_risk": s["burnout"],
                    "depression_risk": s["depression"],
                    "anxiety_risk": s["anxiety"],
                    "r2_score": 0.918,
                    "mae": 2.25
                }
            }

            diseases_45 = calculate_45_disease_probabilities(
                ocean_scores=ocean,
                user_metadata=user_meta
            )

            entry = Assessment(
                user_id=user.id,
                timestamp=dt,
                input_type=s["input_type"],
                journal_text=s["journal_text"],
                typing_speed_wpm=s["wpm"],
                swipes_summary="[]",
                openness=s["o"],
                conscientiousness=s["c"],
                extraversion=s["e"],
                agreeableness=s["a"],
                neuroticism=s["n"],
                mental_weight=s["weight"],
                burnout_risk=s["burnout"],
                depression_risk=s["depression"],
                anxiety_risk=s["anxiety"],
                risk_level=s["risk"],
                recommendations=json.dumps(recs),
                personality_diagnostics=json.dumps(p_diag),
                model_comparison=json.dumps(model_comp),
                disease_probabilities_45=json.dumps(diseases_45)
            )
            db.add(entry)

        db.commit()
        print("Sample historical trend data with personality diagnostics seeded successfully.")
    finally:
        db.close()

if __name__ == "__main__":
    seed_sample_history()
