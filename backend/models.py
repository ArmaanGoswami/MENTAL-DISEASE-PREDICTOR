import datetime
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Text, ForeignKey
from sqlalchemy.orm import declarative_base, sessionmaker, relationship
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///antigravity_db.sqlite3")

# Handle SQLite connect_args
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), default="Explorer", nullable=False)
    age = Column(Integer, default=21)
    occupation = Column(String(50), default="Student") # 'Student' or 'Professional'
    baseline_sleep = Column(Float, default=7.0) # hours per night
    baseline_work_hours = Column(Float, default=8.0) # daily study/work hours
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    assessments = relationship("Assessment", back_populates="user", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "age": self.age,
            "occupation": self.occupation,
            "baseline_sleep": self.baseline_sleep,
            "baseline_work_hours": self.baseline_work_hours,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    
    # Input metadata
    input_type = Column(String(50), default="journal") # 'journal', 'swipes', 'hybrid'
    journal_text = Column(Text, nullable=True)
    typing_speed_wpm = Column(Float, default=0.0)
    swipes_summary = Column(Text, nullable=True) # JSON summary of swipes

    # OCEAN Big Five Personality Scores (0.0 to 1.0 or 0 to 100)
    openness = Column(Float, default=50.0)
    conscientiousness = Column(Float, default=50.0)
    extraversion = Column(Float, default=50.0)
    agreeableness = Column(Float, default=50.0)
    neuroticism = Column(Float, default=50.0)

    # Core Prediction Outputs
    mental_weight = Column(Float, default=50.0) # 0 to 100 kg scale
    burnout_risk = Column(Float, default=30.0) # %
    depression_risk = Column(Float, default=25.0) # %
    anxiety_risk = Column(Float, default=25.0) # %
    risk_level = Column(String(50), default="Moderate") # 'Low', 'Moderate', 'High', 'Severe'
    recommendations = Column(Text, default="[]") # JSON list of suggestions
    personality_diagnostics = Column(Text, nullable=True) # JSON personality disorder breakdown
    model_comparison = Column(Text, nullable=True) # JSON comparing Linear Regression vs Random Forest
    disease_probabilities_45 = Column(Text, nullable=True) # JSON 45+ disease probability scores

    user = relationship("User", back_populates="assessments")

    def to_dict(self):
        import json
        recs = []
        try:
            recs = json.loads(self.recommendations) if self.recommendations else []
        except Exception:
            recs = [self.recommendations] if self.recommendations else []

        diag = {}
        try:
            diag = json.loads(self.personality_diagnostics) if self.personality_diagnostics else {}
        except Exception:
            diag = {}

        comparison = {}
        try:
            comparison = json.loads(self.model_comparison) if self.model_comparison else {}
        except Exception:
            comparison = {}

        diseases_45 = []
        try:
            diseases_45 = json.loads(self.disease_probabilities_45) if self.disease_probabilities_45 else []
        except Exception:
            diseases_45 = []

        return {
            "id": self.id,
            "user_id": self.user_id,
            "timestamp": self.timestamp.isoformat() if self.timestamp else None,
            "input_type": self.input_type,
            "journal_text": self.journal_text,
            "typing_speed_wpm": self.typing_speed_wpm,
            "ocean_scores": {
                "Openness": round(self.openness, 1),
                "Conscientiousness": round(self.conscientiousness, 1),
                "Extraversion": round(self.extraversion, 1),
                "Agreeableness": round(self.agreeableness, 1),
                "Neuroticism": round(self.neuroticism, 1)
            },
            "mental_weight": round(self.mental_weight, 1),
            "burnout_risk": round(self.burnout_risk, 1),
            "depression_risk": round(self.depression_risk, 1),
            "anxiety_risk": round(self.anxiety_risk, 1),
            "risk_level": self.risk_level,
            "recommendations": recs,
            "personality_diagnostics": diag,
            "model_comparison": comparison,
            "disease_probabilities_45": diseases_45
        }

class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    activity_type = Column(String(50), nullable=False) # 'stroop', 'digit_span', 'tapping', 'body_scan', 'cbt', 'voice'
    metrics = Column(Text, default="{}")

    def to_dict(self):
        import json
        m = {}
        try:
            m = json.loads(self.metrics) if self.metrics else {}
        except Exception:
            m = {}
        return {
            "id": self.id,
            "user_id": self.user_id,
            "timestamp": self.timestamp.isoformat() if self.timestamp else None,
            "activity_type": self.activity_type,
            "metrics": m
        }

def init_db():
    Base.metadata.create_all(bind=engine)
    # Ensure default user exists
    session = SessionLocal()
    try:
        user = session.query(User).first()
        if not user:
            default_user = User(
                username="Armaan Goswami",
                age=21,
                occupation="Student",
                baseline_sleep=6.5,
                baseline_work_hours=8.5
            )
            session.add(default_user)
            session.commit()
    finally:
        session.close()

if __name__ == "__main__":
    init_db()
    print("Database initialized successfully.")
