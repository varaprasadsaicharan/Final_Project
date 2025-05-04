import * as tf from '@tensorflow/tfjs';

interface RiskSuggestions {
  lifestyle: string[];
  monitoring: string[];
  consultation: string[];
}

function getHeartDiseaseSuggestions(risk: number): RiskSuggestions {
  if (risk < 0.3) {
    return {
      lifestyle: [
        "Maintain a heart-healthy Mediterranean diet",
        "Aim for 150 minutes of moderate exercise weekly",
        "Practice stress management techniques"
      ],
      monitoring: [
        "Annual blood pressure checkups",
        "Regular cholesterol screening",
        "Track physical activity levels"
      ],
      consultation: [
        "Schedule routine check-ups with primary care physician",
        "Discuss family history during next visit"
      ]
    };
  } else if (risk < 0.6) {
    return {
      lifestyle: [
        "Reduce sodium intake to under 2300mg daily",
        "Increase cardiovascular exercise frequency",
        "Consider smoking cessation if applicable"
      ],
      monitoring: [
        "Monthly blood pressure monitoring",
        "Keep detailed food and exercise diary",
        "Regular heart rate monitoring"
      ],
      consultation: [
        "Schedule consultation with cardiologist",
        "Consider stress test evaluation",
        "Discuss preventive medications"
      ]
    };
  } else {
    return {
      lifestyle: [
        "Immediate lifestyle modifications needed",
        "Strict adherence to heart-healthy diet",
        "Supervised exercise program recommended"
      ],
      monitoring: [
        "Daily blood pressure monitoring",
        "Weekly weight tracking",
        "Symptom journal maintenance"
      ],
      consultation: [
        "Urgent cardiovascular evaluation needed",
        "Comprehensive heart health assessment",
        "Regular cardiology follow-ups"
      ]
    };
  }
}

function getDiabetesSuggestions(risk: number): RiskSuggestions {
  if (risk < 0.3) {
    return {
      lifestyle: [
        "Maintain balanced diet with whole grains",
        "Regular physical activity",
        "Healthy weight maintenance"
      ],
      monitoring: [
        "Annual blood sugar screening",
        "Regular weight checks",
        "Track dietary habits"
      ],
      consultation: [
        "Routine check-ups with primary care",
        "Discuss family history of diabetes"
      ]
    };
  } else if (risk < 0.6) {
    return {
      lifestyle: [
        "Reduce refined carbohydrate intake",
        "Increase fiber-rich foods",
        "Daily 30-minute exercise routine"
      ],
      monitoring: [
        "Regular blood glucose testing",
        "Quarterly A1C checks",
        "Food diary maintenance"
      ],
      consultation: [
        "Endocrinologist consultation recommended",
        "Diabetes prevention program participation",
        "Nutritionist consultation"
      ]
    };
  } else {
    return {
      lifestyle: [
        "Strict glycemic index diet adherence",
        "Structured exercise program",
        "Weight management essential"
      ],
      monitoring: [
        "Daily blood glucose monitoring",
        "Regular A1C testing",
        "Careful foot examination"
      ],
      consultation: [
        "Immediate endocrinologist evaluation",
        "Diabetes management planning",
        "Regular specialist follow-up"
      ]
    };
  }
}

function getLiverDiseaseSuggestions(risk: number): RiskSuggestions {
  if (risk < 0.3) {
    return {
      lifestyle: [
        "Maintain alcohol-free or minimal consumption",
        "Balanced diet with lean proteins",
        "Regular physical activity"
      ],
      monitoring: [
        "Annual liver function tests",
        "Regular health check-ups",
        "Monitor weight changes"
      ],
      consultation: [
        "Routine medical check-ups",
        "Discuss liver health during visits"
      ]
    };
  } else if (risk < 0.6) {
    return {
      lifestyle: [
        "Complete alcohol abstinence recommended",
        "Low-fat, liver-friendly diet",
        "Gentle exercise routine"
      ],
      monitoring: [
        "Regular liver function monitoring",
        "Track symptoms and changes",
        "Medication review"
      ],
      consultation: [
        "Hepatologist consultation needed",
        "Liver ultrasound consideration",
        "Detailed health assessment"
      ]
    };
  } else {
    return {
      lifestyle: [
        "Strict liver-protective diet",
        "Avoid all alcohol consumption",
        "Modified exercise under guidance"
      ],
      monitoring: [
        "Frequent liver function testing",
        "Regular imaging studies",
        "Careful symptom tracking"
      ],
      consultation: [
        "Immediate liver specialist evaluation",
        "Comprehensive liver assessment",
        "Regular specialist monitoring"
      ]
    };
  }
}

// Training function for all models
export async function trainModel(
  diseaseType: 'heart' | 'diabetes' | 'liver',
  onEpochEnd?: (epoch: number, logs?: tf.Logs) => void
): Promise<tf.LayersModel> {
  const model = tf.sequential();
  
  // Add layers based on disease type
  switch (diseaseType) {
    case 'heart':
      model.add(tf.layers.dense({ units: 16, activation: 'relu', inputShape: [8] }));
      model.add(tf.layers.dense({ units: 8, activation: 'relu' }));
      model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));
      break;
    case 'diabetes':
      model.add(tf.layers.dense({ units: 12, activation: 'relu', inputShape: [5] }));
      model.add(tf.layers.dense({ units: 6, activation: 'relu' }));
      model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));
      break;
    case 'liver':
      model.add(tf.layers.dense({ units: 12, activation: 'relu', inputShape: [6] }));
      model.add(tf.layers.dense({ units: 6, activation: 'relu' }));
      model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));
      break;
  }

  model.compile({
    optimizer: 'adam',
    loss: 'binaryCrossentropy',
    metrics: ['accuracy']
  });

  // Generate some dummy training data
  const numSamples = 1000;
  const inputDim = model.inputs[0].shape![1];
  const xs = tf.randomNormal([numSamples, inputDim]);
  const ys = tf.randomUniform([numSamples, 1]);

  // Train the model
  await model.fit(xs, ys, {
    epochs: 50,
    validationSplit: 0.2,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        if (onEpochEnd) {
          onEpochEnd(epoch, logs);
        }
      }
    }
  });

  return model;
}

// Prediction function that takes a model and input data
export async function predict(
  model: tf.LayersModel, 
  inputData: number[], 
  diseaseType: 'heart' | 'diabetes' | 'liver'
): Promise<{
  probability: number;
  suggestions: RiskSuggestions;
}> {
  const tensor = tf.tensor2d([inputData]);
  const prediction = model.predict(tensor) as tf.Tensor;
  const value = await prediction.data();
  tensor.dispose();
  prediction.dispose();
  
  const probability = value[0];
  
  // Get suggestions based on disease type and risk level
  let suggestions: RiskSuggestions;
  switch (diseaseType) {
    case 'heart':
      suggestions = getHeartDiseaseSuggestions(probability);
      break;
    case 'diabetes':
      suggestions = getDiabetesSuggestions(probability);
      break;
    case 'liver':
      suggestions = getLiverDiseaseSuggestions(probability);
      break;
  }
  
  return {
    probability,
    suggestions
  };
}