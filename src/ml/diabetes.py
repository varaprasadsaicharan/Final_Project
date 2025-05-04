import math
from typing import List, Dict, Tuple

def normalize_feature(value: float, min_val: float, max_val: float) -> float:
    """Normalize a feature value to range [0, 1]"""
    return (value - min_val) / (max_val - min_val) if max_val > min_val else 0

def get_risk_level(probability: float) -> Tuple[str, List[str]]:
    """Convert probability to risk level and generate insights"""
    if probability < 0.3:
        return "low", ["Annual diabetes screening recommended", 
                      "Maintain balanced diet",
                      "Regular exercise is beneficial"]
    elif probability < 0.6:
        return "moderate", ["Schedule follow-up with endocrinologist",
                          "Monitor blood sugar levels",
                          "Consider dietary modifications"]
    else:
        return "high", ["Immediate diabetes consultation needed",
                       "Comprehensive metabolic testing required",
                       "Develop diabetes management strategy"]

class DiabetesModel:
    def __init__(self):
        # Pre-trained weights for diabetes prediction
        # [age, bmi, glucose, hba1c, random_blood_sugar]
        self.weights = [0.02, 0.03, 0.04, 0.35, 0.025]
        self.bias = -3.0
        
    def sigmoid(self, x: float) -> float:
        return 1 / (1 + math.exp(-x))
    
    def predict(self, features: List[float]) -> float:
        if len(features) != len(self.weights):
            raise ValueError(f"Expected {len(self.weights)} features, got {len(features)}")
        
        z = sum(w * x for w, x in zip(self.weights, features)) + self.bias
        return self.sigmoid(z)

def predict_diabetes(features: List[float]) -> Dict:
    """Predict diabetes risk"""
    # Normalize features
    normalized = [
        normalize_feature(features[0], 20, 90),   # age
        normalize_feature(features[1], 18, 40),   # bmi
        normalize_feature(features[2], 70, 200),  # glucose
        normalize_feature(features[3], 4, 7),     # hba1c
        normalize_feature(features[4], 70, 200),  # random_blood_sugar
    ]
    
    model = DiabetesModel()
    probability = model.predict(normalized)
    risk_level, insights = get_risk_level(probability)
    
    return {
        "probability": probability,
        "risk_level": risk_level,
        "insights": insights
    }