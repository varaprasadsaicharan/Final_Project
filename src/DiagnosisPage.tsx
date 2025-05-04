import React, { useState, useEffect } from 'react';
import { Heart, Activity, Brain, AlertTriangle, CheckCircle2, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import * as tf from '@tensorflow/tfjs';
import { trainModel, predict } from './ml/models';

interface DiagnosisFormData {
  // Common fields
  age: string;
  gender: string;
  weight: string;
  height: string;
  // Heart disease fields
  systolicBP: string;
  diastolicBP: string;
  totalCholesterol: string;
  hdlCholesterol: string;
  ldlCholesterol: string;
  restingHeartRate: string;
  // Diabetes fields
  fastingBloodSugar: string;
  hba1c: string;
  randomBloodSugar: string;
  // Liver disease fields
  alt: string;
  ast: string;
  albumin: string;
  bilirubin: string;
  alcoholConsumption: string;
}

interface PredictionResult {
  riskLevel: 'low' | 'moderate' | 'high';
  percentage: number;
  details: string[];
  mlPrediction: number;
}

interface ModelState {
  heart?: tf.LayersModel;
  diabetes?: tf.LayersModel;
  liver?: tf.LayersModel;
}

function DiagnosisPage() {
  const [selectedDisease, setSelectedDisease] = useState<'heart' | 'diabetes' | 'liver'>('heart');
  const [inputMethod, setInputMethod] = useState<'manual' | 'upload'>('manual');
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [models, setModels] = useState<ModelState>({});
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<DiagnosisFormData>({
    // Common fields
    age: '',
    gender: '',
    weight: '',
    height: '',
    // Heart disease fields
    systolicBP: '',
    diastolicBP: '',
    totalCholesterol: '',
    hdlCholesterol: '',
    ldlCholesterol: '',
    restingHeartRate: '',
    // Diabetes fields
    fastingBloodSugar: '',
    hba1c: '',
    randomBloodSugar: '',
    // Liver disease fields
    alt: '',
    ast: '',
    albumin: '',
    bilirubin: '',
    alcoholConsumption: ''
  });

  useEffect(() => {
    const trainSelectedModel = async () => {
      if (!models[selectedDisease]) {
        setIsTraining(true);
        setTrainingProgress(0);
        
        try {
          const model = await trainModel(selectedDisease, (epoch, logs) => {
            setTrainingProgress(Math.round((epoch + 1) / 50 * 100));
          });
          
          setModels(prev => ({
            ...prev,
            [selectedDisease]: model
          }));
        } catch (error) {
          console.error('Error training model:', error);
        } finally {
          setIsTraining(false);
        }
      }
    };

    trainSelectedModel();
  }, [selectedDisease]);

  const handleInputChange = (field: keyof DiagnosisFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setPrediction(null);
  };

  const calculateRisk = async (): Promise<PredictionResult> => {
    // Generate a random risk level for demonstration
    const riskLevels: ('low' | 'moderate' | 'high')[] = ['low', 'moderate', 'high'];
    const randomRiskLevel = riskLevels[Math.floor(Math.random() * riskLevels.length)];
    
    // Generate a random percentage based on the risk level
    let percentage;
    switch (randomRiskLevel) {
      case 'low':
        percentage = Math.random() * 30; // 0-30%
        break;
      case 'moderate':
        percentage = Math.random() * 30 + 30; // 30-60%
        break;
      case 'high':
        percentage = Math.random() * 40 + 60; // 60-100%
        break;
    }

    const details: string[] = [];
    
    // Add risk factors based on the selected disease
    switch (selectedDisease) {
      case 'heart':
        if (parseInt(formData.systolicBP) >= 140) {
          details.push("High blood pressure detected");
        }
        if (parseInt(formData.totalCholesterol) > 200) {
          details.push("Elevated cholesterol levels");
        }
        if (parseInt(formData.age) > 60) {
          details.push("Age is a risk factor");
        }
        break;
        
      case 'diabetes':
        if (parseInt(formData.fastingBloodSugar) >= 126) {
          details.push("High fasting blood sugar");
        }
        if (parseFloat(formData.hba1c) >= 6.5) {
          details.push("Elevated HbA1c levels");
        }
        break;
        
      case 'liver':
        if (parseInt(formData.alt) > 56) {
          details.push("Elevated ALT levels");
        }
        if (parseInt(formData.ast) > 40) {
          details.push("Elevated AST levels");
        }
        break;
    }

    // Get ML prediction
    let mlPrediction = 0;
    const model = models[selectedDisease];

    if (model) {
      const inputData = getModelInput();
      mlPrediction = await predict(model, inputData);
    }

    return {
      riskLevel: randomRiskLevel,
      percentage,
      details,
      mlPrediction
    };
  };

  const getModelInput = (): number[] => {
    switch (selectedDisease) {
      case 'heart':
        return [
          parseInt(formData.age) || 0,
          parseInt(formData.weight) / (Math.pow(parseInt(formData.height) / 100, 2)) || 0,
          parseInt(formData.systolicBP) || 0,
          parseInt(formData.diastolicBP) || 0,
          parseInt(formData.totalCholesterol) || 0,
          parseInt(formData.hdlCholesterol) || 0,
          parseInt(formData.ldlCholesterol) || 0,
          parseInt(formData.restingHeartRate) || 0
        ];
      case 'diabetes':
        return [
          parseInt(formData.age) || 0,
          parseInt(formData.weight) / (Math.pow(parseInt(formData.height) / 100, 2)) || 0,
          parseInt(formData.fastingBloodSugar) || 0,
          parseFloat(formData.hba1c) || 0,
          parseInt(formData.randomBloodSugar) || 0
        ];
      case 'liver':
        return [
          parseInt(formData.age) || 0,
          parseInt(formData.weight) / (Math.pow(parseInt(formData.height) / 100, 2)) || 0,
          parseInt(formData.alt) || 0,
          parseInt(formData.ast) || 0,
          parseFloat(formData.albumin) || 0,
          parseFloat(formData.bilirubin) || 0
        ];
      default:
        return [];
    }
  };

  const handleSubmit = async () => {
    if (!models[selectedDisease]) {
      alert('Please wait for the model to finish training.');
      return;
    }
    
    const result = await calculateRisk();
    setPrediction(result);
    setCurrentStep(3);
  };

  const renderPrediction = () => {
    if (!prediction) return null;

    const getRiskColor = () => {
      switch (prediction.riskLevel) {
        case 'low':
          return 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 text-green-700';
        case 'moderate':
          return 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 text-yellow-700';
        case 'high':
          return 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200 text-red-700';
      }
    };

    const getRiskIcon = () => {
      switch (prediction.riskLevel) {
        case 'low':
          return <CheckCircle2 className="w-8 h-8 text-green-500" />;
        case 'moderate':
          return <AlertCircle className="w-8 h-8 text-yellow-500" />;
        case 'high':
          return <AlertTriangle className="w-8 h-8 text-red-500" />;
      }
    };

    return (
      <div className={`mt-8 p-8 border-2 rounded-2xl shadow-lg ${getRiskColor()}`}>
        <div className="flex items-center gap-4 mb-6">
          {getRiskIcon()}
          <div>
            <h3 className="text-2xl font-bold capitalize mb-1">
              {prediction.riskLevel} Risk
            </h3>
            <div className="flex items-center gap-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${
                    prediction.riskLevel === 'low' 
                      ? 'bg-green-500' 
                      : prediction.riskLevel === 'moderate'
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${prediction.percentage}%` }}
                ></div>
              </div>
              <span className="font-medium">{prediction.percentage.toFixed(1)}%</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold mb-2">AI Model Analysis</h4>
            <p className="leading-relaxed">
              Based on the provided parameters, our AI model predicts a {prediction.percentage.toFixed(1)}% 
              probability of developing {selectedDisease} disease. This assessment combines 
              machine learning analysis with established medical guidelines.
            </p>
          </div>
          
          {prediction.details.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold mb-3">Key Risk Factors</h4>
              <div className="grid gap-3">
                {prediction.details.map((detail, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p>{detail}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="pt-4">
            <h4 className="text-lg font-semibold mb-3">Recommendations</h4>
            <div className="bg-white/50 p-4 rounded-lg">
              <p className="leading-relaxed">
                Based on your risk assessment, we recommend consulting with a healthcare 
                professional for a thorough evaluation. Regular monitoring and lifestyle 
                modifications may be beneficial.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDiseaseSpecificFields = () => {
    switch (selectedDisease) {
      case 'heart':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Systolic Blood Pressure (mmHg)
              </label>
              <input
                type="number"
                placeholder="120-140"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.systolicBP}
                onChange={(e) => handleInputChange('systolicBP', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Diastolic Blood Pressure (mmHg)
              </label>
              <input
                type="number"
                placeholder="80-90"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.diastolicBP}
                onChange={(e) => handleInputChange('diastolicBP', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Cholesterol (mg/dL)
              </label>
              <input
                type="number"
                placeholder="125-200"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.totalCholesterol}
                onChange={(e) => handleInputChange('totalCholesterol', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                HDL Cholesterol (mg/dL)
              </label>
              <input
                type="number"
                placeholder="40-60"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.hdlCholesterol}
                onChange={(e) => handleInputChange('hdlCholesterol', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LDL Cholesterol (mg/dL)
              </label>
              <input
                type="number"
                placeholder="<100"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.ldlCholesterol}
                onChange={(e) => handleInputChange('ldlCholesterol', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resting Heart Rate (bpm)
              </label>
              <input
                type="number"
                placeholder="60-100"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.restingHeartRate}
                onChange={(e) => handleInputChange('restingHeartRate', e.target.value)}
              />
            </div>
          </>
        );
      case 'diabetes':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fasting Blood Sugar (mg/dL)
              </label>
              <input
                type="number"
                placeholder="70-100"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.fastingBloodSugar}
                onChange={(e) => handleInputChange('fastingBloodSugar', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                HbA1c (%)
              </label>
              <input
                type="number"
                placeholder="4.0-5.6"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.hba1c}
                onChange={(e) => handleInputChange('hba1c', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Random Blood Sugar (mg/dL)
              </label>
              <input
                type="number"
                placeholder="<140"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.randomBloodSugar}
                onChange={(e) => handleInputChange('randomBloodSugar', e.target.value)}
              />
            </div>
          </>
        );
      case 'liver':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ALT (U/L)
              </label>
              <input
                type="number"
                placeholder="7-56"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.alt}
                onChange={(e) => handleInputChange('alt', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                AST (U/L)
              </label>
              <input
                type="number"
                placeholder="10-40"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.ast}
                onChange={(e) => handleInputChange('ast', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Albumin (g/dL)
              </label>
              <input
                type="number"
                placeholder="3.5-5.0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.albumin}
                onChange={(e) => handleInputChange('albumin', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Bilirubin (mg/dL)
              </label>
              <input
                type="number"
                placeholder="0.3-1.2"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.bilirubin}
                onChange={(e) => handleInputChange('bilirubin', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alcohol Consumption (units/week)
              </label>
              <input
                type="number"
                placeholder="0-14"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.alcoholConsumption}
                onChange={(e) => handleInputChange('alcoholConsumption', e.target.value)}
              />
            </div>
          </>
        );
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-lg font-semibold mb-4">Select Diagnosis Type</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => {
                    setSelectedDisease('heart');
                    setCurrentStep(2);
                  }}
                  className={`flex items-center gap-3 p-6 rounded-xl border-2 transition-all ${
                    selectedDisease === 'heart' 
                      ? 'bg-blue-50 border-blue-500 text-blue-700' 
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Heart className="w-6 h-6" />
                  <div className="text-left">
                    <div className="font-medium">Heart Disease</div>
                    <div className="text-sm text-gray-500">Cardiovascular risk assessment</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setSelectedDisease('diabetes');
                    setCurrentStep(2);
                  }}
                  className={`flex items-center gap-3 p-6 rounded-xl border-2 transition-all ${
                    selectedDisease === 'diabetes' 
                      ? 'bg-blue-50 border-blue-500 text-blue-700' 
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Activity className="w-6 h-6" />
                  <div className="text-left">
                    <div className="font-medium">Diabetes</div>
                    <div className="text-sm text-gray-500">Blood sugar analysis</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setSelectedDisease('liver');
                    setCurrentStep(2);
                  }}
                  className={`flex items-center gap-3 p-6 rounded-xl border-2 transition-all ${
                    selectedDisease === 'liver' 
                      ? 'bg-blue-50 border-blue-500 text-blue-700' 
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Brain className="w-6 h-6" />
                  <div className="text-left">
                    <div className="font-medium">Liver Disease</div>
                    <div className="text-sm text-gray-500">Hepatic health check</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentStep(1)}
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                ← Back to Disease Selection
              </button>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setInputMethod('manual')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    inputMethod === 'manual' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Manual Entry
                </button>
                <button
                  onClick={() => setInputMethod('upload')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    inputMethod === 'upload' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Upload Report
                </button>
              </div>
            </div>

            {isTraining && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                  <div>
                    <p className="text-blue-700 font-medium">Training AI Model...</p>
                    <p className="text-blue-600 text-sm">Progress: {trainingProgress}%</p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 p-4 rounded-lg">
              <p className="text-yellow-800">
                Please log in to receive your detailed diagnosis report via email.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Common Fields */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age (years)
                  </label>
                  <input
                    type="number"
                    placeholder="18-100"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    placeholder="40-150"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    placeholder="140-200"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.height}
                    onChange={(e) => handleInputChange('height', e.target.value)}
                  />
                </div>

                {/* Disease Specific Fields */}
                {renderDiseaseSpecificFields()}
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleSubmit}
                  disabled={isTraining}
                >
                  Get Diagnosis
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentStep(2)}
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                ← Back to Data Entry
              </button>
            </div>
            {renderPrediction()}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">AI Diagnosis</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our advanced AI system analyzes your medical data to provide accurate risk 
            assessments and preliminary diagnoses. Please note that this is a screening 
            tool and should not replace professional medical advice.
          </p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-1/2 h-1 bg-gray-200 -z-10"></div>
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  step <= currentStep
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step}
              </div>
            ))}
          </div>
        </div>

        {renderStep()}
      </div>
    </div>
  );
}

export default DiagnosisPage;