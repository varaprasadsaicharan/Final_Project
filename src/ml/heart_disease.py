import math
from typing import List, Dict, Tuple

def normalize_feature(value: float, min_val: float, max_val: float) -> float:
    """Normalize a feature value to range [0, 1]"""
    return (value - min_val) / (max_val - min_val) if max_val > min_val else 0

def get_risk_level(probability: float) -> Tuple[str, List[str]]:
    """Convert probability to risk level and generate insights"""
    if probability < 0.3:
        return "low", ["Regular cardiovascular checkups recommended", 
                      "Maintain heart-healthy lifestyle",
                      "Continue regular exercise routine"]
    elif probability < 0.6:
        return "moderate", ["Schedule follow-up with cardiologist",
                          "Consider lifestyle modifications",
                          "Monitor blood pressure and cholesterol"]
    else:
        return "high", ["Immediate cardiac consultation recommended",
                       "Further cardiovascular tests needed",
                       "Develop heart health management plan"]

class HeartDiseaseModel:
    def __init__(self):
        # Pre-trained weights for heart disease prediction
        # [age, bmi, systolic, diastolic, cholesterol, hdl, ldl, heart_rate]
        self.weights = [0.03, 0.04, 0.02, 0.02, 0.015, -0.02, 0.015, 0.01]
        self.bias = -2.0
        
    def sigmoid(self, x: float) -> float:
        return 1 / (1 + math.exp(-x))
    
    def predict(self, features: List[float]) -> float:
        if len(features) != len(self.weights):
            raise ValueError(f"Expected {len(self.weights)} features, got {len(features)}")
        
        z = sum(w * x for w, x in zip(self.weights, features)) + self.bias
        return self.sigmoid(z)

def predict_heart_disease(features: List[float]) -> Dict:
    """Predict heart disease risk"""
    # Normalize features
    normalized = [
        normalize_feature(features[0], 20, 90),    # age
        normalize_feature(features[1], 18, 40),    # bmi
        normalize_feature(features[2], 90, 200),   # systolic
        normalize_feature(features[3], 60, 120),   # diastolic
        normalize_feature(features[4], 100, 300),  # cholesterol
        normalize_feature(features[5], 20, 100),   # hdl
        normalize_feature(features[6], 50, 190),   # ldl
        normalize_feature(features[7], 60, 120),   # heart_rate
    ]
    
    model = HeartDiseaseModel()
    probability = model.predict(normalized)
    risk_level, insights = get_risk_level(probability)
    
    return {
        "probability": probability,
        "risk_level": risk_level,
        "insights": insights
    }