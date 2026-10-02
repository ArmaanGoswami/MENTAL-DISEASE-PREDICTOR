import unittest
import json
from app import app
from models import SessionLocal, User, Assessment

class AntigravityAPITestCase(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_health_endpoint(self):
        response = self.app.get('/api/health')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data["status"], "healthy")
        print("PASS: /api/health returned 200 and healthy status")

    def test_cards_endpoint(self):
        response = self.app.get('/api/cards')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertTrue(len(data) >= 5)
        print(f"PASS: /api/cards returned {len(data)} situational reaction cards")

    def test_profile_get_and_post(self):
        # GET profile
        res_get = self.app.get('/api/profile')
        self.assertEqual(res_get.status_code, 200)
        
        # POST update profile
        payload = {
            "username": "Armaan Goswami",
            "age": 22,
            "occupation": "Student",
            "baseline_sleep": 7.5,
            "baseline_work_hours": 7.0
        }
        res_post = self.app.post('/api/profile', data=json.dumps(payload), content_type='application/json')
        self.assertEqual(res_post.status_code, 200)
        data = json.loads(res_post.data)
        self.assertEqual(data["age"], 22)
        print("PASS: /api/profile GET & POST verified")

    def test_predict_endpoint(self):
        payload = {
            "journal_text": "I feel extremely anxious and exhausted with continuous project deadlines and lack of sleep.",
            "typing_wpm": 42.0,
            "input_type": "journal",
            "swipes": [
                {"id": "q1", "agreed": True},
                {"id": "q2", "agreed": True}
            ]
        }
        res = self.app.post('/api/predict', data=json.dumps(payload), content_type='application/json')
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        
        # Verify key fields required by the architecture
        self.assertIn("ocean_scores", data)
        self.assertIn("mental_weight", data)
        self.assertIn("burnout_risk", data)
        self.assertIn("depression_risk", data)
        self.assertIn("anxiety_risk", data)
        self.assertIn("recommendations", data)
        
        # Verify OCEAN traits exist
        ocean = data["ocean_scores"]
        self.assertIn("Openness", ocean)
        self.assertIn("Conscientiousness", ocean)
        self.assertIn("Extraversion", ocean)
        self.assertIn("Agreeableness", ocean)
        self.assertIn("Neuroticism", ocean)
        
        # Since text had stress words, Neuroticism should be elevated
        self.assertGreater(ocean["Neuroticism"], 50.0)

        # Verify Personality-based disease diagnostics
        self.assertIn("personality_diagnostics", data)
        p_diag = data["personality_diagnostics"]
        self.assertIn("disorders", p_diag)
        self.assertIn("primary_archetype", p_diag)
        self.assertIn("cluster_summary", p_diag)
        self.assertTrue(len(p_diag["disorders"]) >= 8)

        print(f"PASS: /api/predict verified! Mental Weight: {data['mental_weight']} kg, Neuroticism: {ocean['Neuroticism']}%, Archetype: {p_diag['primary_archetype']}")

    def test_ocpd_perfectionism_detection(self):
        payload = {
            "journal_text": "Everything must be flawless and under complete control or I panic. I micromanage every minute and cannot delegate.",
            "typing_wpm": 45.0,
            "input_type": "journal"
        }
        res = self.app.post('/api/predict', data=json.dumps(payload), content_type='application/json')
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        p_diag = data["personality_diagnostics"]
        
        # Check OCPD condition is evaluated and high
        ocpd = next((d for d in p_diag["disorders"] if d["id"] == "ocpd"), None)
        self.assertIsNotNone(ocpd)
        self.assertGreater(ocpd["score"], 60.0)
        print(f"PASS: OCPD / Perfectionism detected with score: {ocpd['score']}% ({ocpd['tier']})")

    def test_history_endpoint(self):
        res = self.app.get('/api/history')
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertTrue(len(data) >= 1)
        print(f"PASS: /api/history returned {len(data)} assessments for trajectory chart")

    def test_resources_endpoint(self):
        res = self.app.get('/api/resources')
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertIn("helplines", data)
        self.assertIn("exercises", data)
        print("PASS: /api/resources verified with helplines and somatic grounding techniques")

    def test_linear_regression_metrics_and_coefficients(self):
        payload = {
            "journal_text": "Working late hours every night, feeling burned out and unable to catch up on sleep.",
            "typing_wpm": 38.0,
            "input_type": "journal",
            "model_type": "linear_regression"
        }
        res = self.app.post('/api/predict', data=json.dumps(payload), content_type='application/json')
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        
        self.assertIn("model_comparison", data)
        mc = data["model_comparison"]
        self.assertIn("linear_regression", mc)
        self.assertIn("random_forest", mc)
        
        lr = mc["linear_regression"]
        self.assertIn("coefficients", lr)
        self.assertIn("equation", lr)
        self.assertGreater(lr["r2_score"], 0.85)
        self.assertIn("Neuroticism", lr["coefficients"])
        print(f"PASS: Linear Regression verified! R² Score: {lr['r2_score']}, Neuroticism Beta: {lr['coefficients']['Neuroticism']}")

    def test_diseases_endpoint(self):
        res = self.app.get('/api/diseases')
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertGreaterEqual(len(data), 40)
        
        # Verify schema for disorders
        first = data[0]
        self.assertIn("id", first)
        self.assertIn("name", first)
        self.assertIn("category", first)
        self.assertIn("score", first)
        self.assertIn("tier", first)
        self.assertIn("icd_code", first)
        self.assertIn("dsm_code", first)
        self.assertIn("hallmarks", first)
        print(f"PASS: /api/diseases returned {len(data)} distinct disorders (>= 40 requirement met)")

    def test_activities_submit_endpoint(self):
        # 1. Stroop Game submission
        stroop_payload = {
            "activity_type": "stroop_game",
            "metrics": {
                "avg_reaction_time_ms": 620.0,
                "inhibition_errors": 1,
                "total_trials": 8
            }
        }
        res = self.app.post('/api/activities/submit', data=json.dumps(stroop_payload), content_type='application/json')
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertEqual(data["status"], "success")
        self.assertIn("top_flagged_conditions", data)
        self.assertEqual(data["total_conditions_tracked"], 45)

        # 2. Tapping Cadence submission
        tapping_payload = {
            "activity_type": "tapping_test",
            "metrics": {
                "tap_count": 68,
                "duration_seconds": 10.0,
                "taps_per_second": 6.8,
                "interval_variance_ms": 42.5
            }
        }
        res2 = self.app.post('/api/activities/submit', data=json.dumps(tapping_payload), content_type='application/json')
        self.assertEqual(res2.status_code, 200)

        # 3. Somatic Heatmap submission
        somatic_payload = {
            "activity_type": "somatic_heatmap",
            "metrics": {
                "active_zones": ["head", "chest", "gut"],
                "zone_count": 3
            }
        }
        res3 = self.app.post('/api/activities/submit', data=json.dumps(somatic_payload), content_type='application/json')
        self.assertEqual(res3.status_code, 200)

        # 4. CBT Distortions submission
        cbt_payload = {
            "activity_type": "cbt_distortion",
            "metrics": {
                "detected_distortions": ["Catastrophizing", "All-or-Nothing"],
                "distortion_count": 2
            }
        }
        res4 = self.app.post('/api/activities/submit', data=json.dumps(cbt_payload), content_type='application/json')
        self.assertEqual(res4.status_code, 200)
        print("PASS: /api/activities/submit verified across Stroop, Tapping, Somatic, and CBT activities!")

if __name__ == '__main__':
    unittest.main()

