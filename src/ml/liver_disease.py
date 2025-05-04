import math
from typing import List, Dict, Tuple

def normalize_feature(value: float, min_val: float, max_val: float) -> float:
    """Normalize a feature value to range [0, 1]"""
    return (value - min_val) / (max_val - min_val) if max_val > min_val else 0

def get_risk_level(probability: float) -> Tuple[str, List[str]]:
    """Convert probability to risk level and generate insights"""
    if probability < 0.3:
        return "low", ["Regular liver function monitoring", 
                      "Maintain healthy liver diet",
                      "Limit alcohol consumption"]
    elif probability < 0.6:
        return "moderate", ["Schedule hepatologist consultation",
                          "Additional liver function tests needed",
                          "Review medication interactions"]
    else:
        return "high", ["Immediate liver specialist consultation",
                       "Comprehensive liver panel required",
                       "Develop liver health management plan"]

class LiverDiseaseModel:
    def __init__(self):
        # Pre-trained weights for liver disease prediction
        # [age, bmi, alt, ast, albumin, bilirubin]
        self.weights = [0.015, 0.02, 0.03, 0.03, -0.25, 0.2]
        self.bias = -2.5
        
    def sigmoid(self, x: float) -> float:
        return 1 / (1 + math.exp(-x))
    
    def predict(self, features: List[float]) -> float:
        if len(features) != len(self.weights):
            raise ValueError(f"Expected {len(self.weights)} features, got {len(features)}")
        
        z = sum(w * x for w, x in zip(self.weights, features)) + self.bias
        return self.sigmoid(z)

def predict_liver_disease(features: List[float]) -> Dict:
    """Predict liver disease risk"""
    # Normalize features
    normalized = [
        normalize_feature(features[0], 20, 90),   # age
        normalize_feature(features[1], 18, 40),   # bmi
        normalize_feature(features[2], 7, 200),   # alt
        normalize_feature(features[3], 10, 200),  # ast
        normalize_feature(features[4], 3, 5),     # albumin
        normalize_feature(features[5], 0.3, 2),   # bilirubin
    ]
    
    model = LiverDiseaseModel()
    probability = model.predict(normalized)
    risk_level, insights = get_risk_level(probability)
    
    return {
        "probability": probability,
        "risk_level": risk_level,
        "insights": insights
    }