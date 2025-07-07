// src/types/biohacking.ts - Interfaces Científicas Baseadas em Medicina Funcional

export interface BiohackingData {
  // 💪 AVALIAÇÃO ANTROPOMÉTRICA
  anthropometric: {
    height: number;                    // cm
    currentWeight: number;             // kg
    desiredWeight: number;             // kg
    waistCircumference?: number;       // cm (opcional)
    bodyFatPercentage?: number;        // % (opcional)
    bodyType: string;                  // string simples para evitar problemas
    weightHistory: {
      maxWeight: number;
      minAdultWeight: number;
      recentWeightChanges: 'gain' | 'loss' | 'stable' | 'fluctuating';
      easyWeightChange: 'gain' | 'loss' | 'both' | 'neither';
      weightConcerns: string[];
    };
  };

  // 💤 SONO E ENERGIA
  sleep: {
    averageSleepDuration: number;      // horas por noite
    bedtime: string;                   // "22:00"
    wakeTime: string;                  // "06:00"
    sleepQuality: 1 | 2 | 3 | 4 | 5;  // escala 1-5
    chronotype: 'morning' | 'evening' | 'intermediate';
    sleepIssues: string[];             // Array de problemas
    energyLevels: {
      morning: 1 | 2 | 3 | 4 | 5;
      afternoon: 1 | 2 | 3 | 4 | 5;
      evening: 1 | 2 | 3 | 4 | 5;
    };
    sleepAids: {
      naturalSupplements: string[];
      prescriptionMeds: string[];
      other: string[];
    };
  };

  // 🍎 NUTRIÇÃO
  nutrition: {
    dietaryPattern: 'omnivore' | 'vegetarian' | 'vegan' | 'ketogenic' | 'paleo' | 'mediterranean' | 'intermittent_fasting' | 'other';
    mealsPerDay: number;
    snackingFrequency: 'never' | 'rarely' | 'sometimes' | 'often' | 'very_often';
    waterIntake: number;               // copos por dia
    alcoholConsumption: 'never' | 'rarely' | 'weekly' | 'daily' | 'multiple_daily';
    caffeine: {
      consumption: 'never' | 'rarely' | 'daily' | 'multiple_daily';
      sources: string[];              // café, chá, etc.
      timing: string[];               // manhã, tarde, etc.
    };
    foodIntolerances: string[];
    digestiveIssues: string[];
    supplementUsage: {
      current: string[];
      past: string[];
      interested: string[];
    };
  };

  // 🏃‍♂️ ATIVIDADE FÍSICA
  physicalActivity: {
    weeklyExerciseHours: number;
    preferredActivities: string[];
    exerciseIntensity: 'light' | 'moderate' | 'vigorous' | 'mixed';
    fitnessGoals: string[];
    physicalLimitations: string[];
    recoveryMethods: string[];
    activityTracking: boolean;
    gymMembership: boolean;
  };

  // 🏥 STATUS DE SAÚDE
  healthStatus: {
    currentConditions: string[];
    pastConditions: string[];
    medications: {
      prescription: string[];
      overTheCounter: string[];
      supplements: string[];
    };
    familyHistory: string[];
    allergies: string[];
    surgeries: string[];
    lastCheckup: string;               // data da última consulta
    healthcareProvider: string;
    healthGoals: string[];
  };

  // 🧬 MEDICINA FUNCIONAL (5 Elementos MTC)
  functionalMedicine: {
    // Elemento Madeira (Fígado/Vesícula)
    wood: {
      emotionalState: ('calm' | 'irritable' | 'frustrated' | 'creative' | 'decisive')[];
      physicalSymptoms: string[];
      eyeHealth: 1 | 2 | 3 | 4 | 5;
      flexibility: 1 | 2 | 3 | 4 | 5;
    };
    
    // Elemento Fogo (Coração/Intestino Delgado)
    fire: {
      emotionalState: ('joyful' | 'anxious' | 'excited' | 'restless' | 'social')[];
      physicalSymptoms: string[];
      heartHealth: 1 | 2 | 3 | 4 | 5;
      communication: 1 | 2 | 3 | 4 | 5;
    };
    
    // Elemento Terra (Baço/Estômago)
    earth: {
      emotionalState: ('centered' | 'worried' | 'overthinking' | 'stable' | 'caring')[];
      physicalSymptoms: string[];
      digestion: 1 | 2 | 3 | 4 | 5;
      appetite: 1 | 2 | 3 | 4 | 5;
    };
    
    // Elemento Metal (Pulmão/Intestino Grosso)
    metal: {
      emotionalState: ('organized' | 'grief' | 'perfectionist' | 'letting_go' | 'structured')[];
      physicalSymptoms: string[];
      breathing: 1 | 2 | 3 | 4 | 5;
      skinHealth: 1 | 2 | 3 | 4 | 5;
    };
    
    // Elemento Água (Rim/Bexiga)
    water: {
      emotionalState: ('wise' | 'fearful' | 'determined' | 'tired' | 'resilient')[];
      physicalSymptoms: string[];
      kidneyHealth: 1 | 2 | 3 | 4 | 5;
      willpower: 1 | 2 | 3 | 4 | 5;
    };
  };

  // 🧠 AVALIAÇÃO COGNITIVA
  cognitive: {
    stressLevel: 1 | 2 | 3 | 4 | 5;
    stressManagement: string[];
    mentalClarity: 1 | 2 | 3 | 4 | 5;
    focus: 1 | 2 | 3 | 4 | 5;
    memory: 1 | 2 | 3 | 4 | 5;
    mood: ('happy' | 'neutral' | 'sad' | 'anxious' | 'energetic' | 'tired')[];
    mentalHealthHistory: string[];
    copingMechanisms: string[];
    currentTherapies: string[];
  };
}

// 📊 ANÁLISE E RESULTADOS
export interface BiohackingAnalysis {
  id: string;
  userId: string;
  
  // Scores calculados
  scores: {
    anthropometric: {
      bmi: number;
      bodyTypeMatch: number;
      weightGoalRealistic: boolean;
    };
    sleep: {
      sleepEfficiency: number;
      chronotypeMatch: number;
      energyConsistency: number;
    };
    nutrition: {
      dietQuality: number;
      hydrationLevel: number;
      supplementNeed: string[];
    };
    fitness: {
      activityLevel: number;
      goalAlignment: number;
      recoveryAdequacy: number;
    };
    health: {
      riskFactors: string[];
      preventiveScore: number;
      wellnessIndicators: number;
    };
    functionalMedicine: {
      dominantElement: string;
      elementBalance: {
        wood: number;
        fire: number;
        earth: number;
        metal: number;
        water: number;
      };
      organSystemHealth: {
        liver: number;
        heart: number;
        spleen: number;
        lungs: number;
        kidneys: number;
      };
    };
  };
  
  // Recomendações personalizadas
  recommendations: {
    nutrition: {
      macroTargets: {
        protein: number;
        carbs: number;
        fat: number;
      };
      supplements: string[];
      mealTiming: string[];
      foods: {
        include: string[];
        avoid: string[];
        moderate: string[];
      };
    };
    exercise: {
      weeklyPlan: {
        cardio: number;
        strength: number;
        flexibility: number;
        recovery: number;
      };
      specificActivities: string[];
      intensity: string;
      timing: string[];
    };
    sleep: {
      optimalSchedule: {
        bedtime: string;
        wakeTime: string;
        duration: number;
      };
      sleepHygiene: string[];
      environment: string[];
      supplements: string[];
    };
    stress: {
      techniques: string[];
      lifestyle: string[];
      professional: string[];
    };
    functionalMedicine: {
      elementBalancing: {
        overactive: string[];
        deficient: string[];
        strategies: string[];
      };
      organSupport: {
        liver: string[];
        heart: string[];
        spleen: string[];
        lungs: string[];
        kidneys: string[];
      };
    };
  };
  
  // Métricas de progresso
  tracking: {
    keyMetrics: string[];
    frequency: string;
    targets: Record<string, number>;
    timeline: string;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

// 🎯 STEPS DO FORMULÁRIO
export interface BiohackingStep {
  id: number;
  title: string;
  icon: any; // Lucide icon
  description: string;
  fields: string[];
  estimatedTime: number; // minutos
}

// 📝 PROPS DO COMPONENTE
export interface BiohackingFormProps {
  onComplete: (data: BiohackingData) => Promise<void>;
  onBack?: () => void;
  initialData?: Partial<BiohackingData>;
  onStepChange?: (step: number) => void;
  onDataUpdate?: (data: Partial<BiohackingData>) => void;
}

// 🔍 TIPOS DE VALIDAÇÃO
export interface BiohackingValidation {
  isValid: boolean;
  errors: Record<string, string>;
  warnings: Record<string, string>;
  completionPercentage: number;
}

// 📈 PROGRESSO DO FORMULÁRIO
export interface BiohackingProgress {
  currentStep: number;
  completedSteps: number[];
  totalSteps: number;
  estimatedTimeRemaining: number;
  canProceed: boolean;
  canGoBack: boolean;
}