import math
from typing import List, Tuple, Dict
import random

class BaseModel:
    def __init__(self):
        self.weights = []
        self.bias = 0
        
    def sigmoid(self, x: float) -> float:
        return 1 / (1 + math.exp(-x))
    
    def predict(self, features: List[float]) -> float:
        if len(features) != len(self.weights):
            raise ValueError(f"Expected {len(self.weights)} features, got {len(features)}")
        
        z = sum(w * x for w, x in zip(self.weights, features)) + self.bias
        return self.sigmoid(z)

class HeartDiseaseModel(BaseModel):
    def __init__(self):
        super().__init__()
        # Pre-trained weights for heart disease prediction
        # [age, bmi, systolic, diastolic, cholesterol, hdl, ldl, heart_rate]
        self.weights = [0.03, 0.04, 0.02, 0.02, 0.015, -0.02, 0.015, 0.01]
        self.bias = -2.0

class DiabetesModel(BaseModel):
    def __init__(self):
        super().__init__()
        # Pre-trained weights for diabetes prediction
        # [age, bmi, glucose, hba1c, random_blood_sugar]
        self.weights = [0.02, 0.03, 0.04, 0.35, 0.025]
        self.bias = -3.0

class LiverDiseaseModel(BaseModel):
    def __init__(self):
        super().__init__()
        # Pre-trained weights for liver disease prediction
        # [age, bmi, alt, ast, albumin, bilirubin]
        self.weights = [0.015, 0.02, 0.03, 0.03, -0.25, 0.2]
        self.bias = -2.5

def normalize_feature(value: float, min_val: float, max_val: float) -> float:
    """Normalize a feature value to range [0, 1]"""
    return (value - min_val) / (max_val - min_val) if max_val > min_val else 0

def get_risk_level(probability: float) -> Tuple[str, List[str]]:
    """Convert probability to risk level and generate insights"""
    if probability < 0.3:
        return "low", ["Regular health checkups recommended", 
                      "Maintain current healthy lifestyle"]
    elif probability < 0.6:
        return "moderate", ["Schedule follow-up with healthcare provider",
                          "Consider lifestyle modifications",
                          "Monitor symptoms closely"]
    else:
        return "high", ["Immediate medical consultation recommended",
                       "Further diagnostic tests may be needed",
                       "Develop management plan with healthcare provider"]

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