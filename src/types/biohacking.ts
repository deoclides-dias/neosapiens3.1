// src/types/biohacking.ts - Interfaces Científicas Baseadas em Medicina Funcional
export interface BiohackingData {
  // 💪 AVALIAÇÃO ANTROPOMÉTRICA
  anthropometric: {
    height: number;                    // cm
    currentWeight: number;             // kg
    desiredWeight: number;             // kg
    waistCircumference?: number;       // cm (opcional)
    bodyFatPercentage?: number;        // % (opcional)
    bodyType: 'ectomorph' | 'mesomorph' | 'endomorph' | 'unknown';
    weightHistory: {
      maxWeight: number;
      minAdultWeight: number;
      recentWeightChanges: 'gain' | 'loss' | 'stable' | 'fluctuating';
      easyWeightChange: 'gain' | 'loss' | 'both' | 'neither';
    };
  };

  // 😴 AVALIAÇÃO DO SONO (Pittsburgh Sleep Quality Index adaptado)
  sleep: {
    bedtime: string;                   // HH:MM
    fallAsleepTime: number;            // minutos para adormecer
    wakeupTime: string;                // HH:MM
    effectiveSleepHours: number;       // horas reais de sono
    sleepQuality: number;              // 1-10
    sleepMedication: boolean;
    daytimeSleepiness: number;         // Escala Epworth 1-24
    sleepDisorders: {
      snoring: boolean;
      apnea: boolean;
      insomnia: boolean;
      nightmareDisturbances: boolean;
      restlessLegs: boolean;
      bruxism: boolean;
    };
    chronotype: 'morning' | 'evening' | 'intermediate';
    energyPattern: {
      morningEnergy: number;           // 1-10
      afternoonEnergy: number;         // 1-10
      eveningEnergy: number;           // 1-10
    };
  };

  // 🍎 AVALIAÇÃO NUTRICIONAL
  nutrition: {
    mealsPerDay: number;               // 3-6
    mealTimes: string[];               // ["08:00", "12:00", "19:00"]
    waterIntake: number;               // litros/dia
    alcoholConsumption: {
      frequency: 'never' | 'rarely' | 'weekly' | 'daily';
      quantity: number;                // doses/semana
    };
    caffeineConsumption: {
      amount: number;                  // mg/dia
      lastIntakeTime: string;          // HH:MM
      sources: string[];               // ['coffee', 'tea', 'energy_drinks']
    };
    dietaryRestrictions: string[];     // ['vegetarian', 'vegan', 'keto', 'paleo', etc.]
    foodPreferences: {
      sweetCravings: number;           // 1-10 intensidade
      saltyFoods: number;              // 1-10 preferência
      processedFoods: number;          // 1-10 consumo
      organicFoods: number;            // 1-10 preferência
    };
    digestiveSymptoms: {
      reflux: boolean;
      bloating: boolean;
      constipation: boolean;
      diarrhea: boolean;
      gasExcessive: boolean;
      stomachPain: boolean;
      foodIntolerances: string[];      // ['lactose', 'gluten', 'nuts', etc.]
      digestiveSpeed: 'slow' | 'normal' | 'fast';
      bloatingAfterMeals: boolean;
    };
  };

  // 🏃‍♂️ AVALIAÇÃO DE ATIVIDADE FÍSICA
  physicalActivity: {
    exerciseFrequency: number;         // dias/semana
    preferredActivities: string[];     // ['running', 'weightlifting', 'yoga', etc.]
    sessionDuration: number;           // minutos médios
    intensity: 'light' | 'moderate' | 'intense';
    physicalLimitations: string[];     // ['knee_injury', 'back_pain', etc.]
    sportsHistory: string;             // texto livre sobre histórico
    functionalCapacity: {
      stairClimbing: boolean;          // 3 andares sem cansar
      carryWeight: boolean;            // 10kg por 50m
      flexibility: boolean;            // toca os pés sem dobrar joelhos
      balance: boolean;                // 30s em um pé só
      pushups: number;                 // quantidade máxima consecutiva
      walkingDistance: number;         // km sem cansar
    };
    fitnessLevel: number;              // 1-10 autoavaliação
    motivationFactors: string[];       // ['health', 'appearance', 'performance', etc.]
  };

  // 🏥 AVALIAÇÃO DE SAÚDE GERAL
  healthStatus: {
    chronicConditions: string[];       // ['hypertension', 'diabetes', 'thyroid', etc.]
    familyHistory: string[];           // condições familiares relevantes
    currentMedications: Array<{
      name: string;
      dosage: string;
      frequency: string;
      purpose: string;
    }>;
    supplements: Array<{
      name: string;
      dosage: string;
      frequency: string;
      purpose: string;
      duration: string;                // há quanto tempo toma
    }>;
    allergies: string[];               // alergias conhecidas
    deficiencySymptoms: {
      chronicFatigue: boolean;
      hairLoss: boolean;
      weakNails: boolean;
      skinProblems: boolean;
      slowHealing: boolean;
      frequentInfections: boolean;
      muscleCramps: boolean;
      moodSwings: boolean;
      memoryIssues: boolean;
      coldIntolerance: boolean;
    };
    mentalHealth: {
      stressLevel: number;             // 1-10
      anxietyLevel: number;            // 1-10
      depressionSymptoms: boolean;
      panicAttacks: boolean;
      therapyHistory: boolean;
    };
  };

  // 🧪 MARCADORES LABORATORIAIS (Opcionais)
  labResults?: {
    hasRecentLabs: boolean;
    labDate?: string;                  // YYYY-MM-DD
    uploadedFiles?: string[];          // URLs dos arquivos
    results?: {
      // Básicos metabólicos
      glucose: number;                 // mg/dL
      hba1c: number;                   // %
      insulin?: number;                // mU/L
      
      // Perfil lipídico
      totalCholesterol: number;        // mg/dL
      hdl: number;                     // mg/dL
      ldl: number;                     // mg/dL
      triglycerides: number;           // mg/dL
      
      // Função tireoidiana
      tsh: number;                     // mU/L
      t3?: number;                     // ng/dL
      t4?: number;                     // ng/dL
      
      // Hormônios
      cortisol?: number;               // μg/dL
      testosterone?: number;           // ng/dL (se aplicável)
      estrogen?: number;               // pg/mL (se aplicável)
      
      // Vitaminas essenciais
      vitaminD: number;                // ng/mL
      b12?: number;                    // pg/mL
      folate?: number;                 // ng/mL
      vitaminB6?: number;              // ng/mL
      
      // Minerais
      iron?: number;                   // μg/dL
      ferritin?: number;               // ng/mL
      magnesium?: number;              // mg/dL
      zinc?: number;                   // μg/dL
      
      // Marcadores inflamatórios
      crp?: number;                    // mg/L
      homocysteine?: number;           // μmol/L
      esr?: number;                    // mm/hr
      
      // Função hepática
      alt?: number;                    // U/L
      ast?: number;                    // U/L
      
      // Função renal
      creatinine?: number;             // mg/dL
      bun?: number;                    // mg/dL
    };
  };

  // 🌿 MEDICINA TRADICIONAL CHINESA (5 Elementos)
  functionalMedicine: {
    // Elemento Madeira (Fígado/Vesícula Biliar)
    wood: {
      irritability: number;            // 1-10
      frustrationLevel: number;        // 1-10
      headaches: number;               // frequência/mês
      eyeStrain: boolean;
      muscleStiffness: boolean;
      decisionMaking: number;          // 1-10 facilidade
      angerManagement: number;         // 1-10 controle
      planningAbility: number;         // 1-10 capacidade
    };
    
    // Elemento Fogo (Coração/Intestino Delgado)
    fire: {
      heartPalpitations: boolean;
      chestTightness: boolean;
      sleepIssues: boolean;
      excessiveTalking: boolean;
      socialAnxiety: number;           // 1-10
      emotionalInstability: number;    // 1-10
      joyExpression: number;           // 1-10 capacidade
      connectionWithOthers: number;    // 1-10 facilidade
      speechClarity: number;           // 1-10
    };
    
    // Elemento Terra (Baço/Estômago)
    earth: {
      digestiveStrength: number;       // 1-10
      worryTendency: number;           // 1-10
      overthinking: number;            // 1-10
      sweetCravings: boolean;
      bloatingAfterMeals: boolean;
      concentrationIssues: boolean;
      empathy: number;                 // 1-10 capacidade
      groundedness: number;            // 1-10 sensação
      nurturingAbility: number;        // 1-10
    };
    
    // Elemento Metal (Pulmão/Intestino Grosso)
    metal: {
      respiratoryHealth: number;       // 1-10
      skinHealth: number;              // 1-10
      griefProcessing: number;         // 1-10 capacidade
      detoxCapacity: number;           // 1-10 percepção
      immuneStrength: number;          // 1-10 autoavaliação
      breathingQuality: number;        // 1-10
      organizationSkills: number;      // 1-10
      perfectionism: number;           // 1-10 tendência
      boundariesSetting: number;       // 1-10 facilidade
    };
    
    // Elemento Água (Rim/Bexiga)
    water: {
      adrenalFatigue: number;          // 1-10
      fearAnxiety: number;             // 1-10
      sexualVitality: number;          // 1-10
      boneHealth: number;              // 1-10 percepção
      willpower: number;               // 1-10
      coldTolerance: number;           // 1-10
      urinaryHealth: number;           // 1-10
      memoryRetention: number;         // 1-10
      motivation: number;              // 1-10
      resilience: number;              // 1-10
    };
  };

  // 🧠 AVALIAÇÃO COGNITIVA FUNCIONAL
  cognitive: {
    focusQuality: number;              // 1-10
    memoryQuality: number;             // 1-10
    mentalClarity: number;             // 1-10
    creativityLevel: number;           // 1-10
    learningSpeed: number;             // 1-10
    cognitiveSymptoms: {
      brainFog: boolean;
      concentrationDifficulty: boolean;
      memoryLapses: boolean;
      mentalFatigue: boolean;
      decisionFatigue: boolean;
      wordFinding: boolean;             // dificuldade para encontrar palavras
      multitaskingDifficulty: boolean;
    };
    preferredLearningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
    attentionSpan: number;             // minutos sem distração
    stressResponse: {
      stressTriggers: string[];        // principais gatilhos
      copingMechanisms: string[];      // como lida com stress
      stressRecovery: number;          // 1-10 velocidade de recuperação
    };
  };

  // 📊 MÉTRICAS DE PROGRESSO
  progressMetrics?: {
    completedAt: string;               // ISO date
    currentStep: number;               // 1-6
    stepsCompleted: boolean[];         // [true, true, false, false, false, false]
    validationErrors: string[];
    dataQuality: number;               // 1-10 completude dos dados
  };
}

// 🎯 INTERFACES AUXILIARES

export interface BiohackingFormProps {
  onComplete: (data: BiohackingData) => void;
  onBack?: () => void;
  initialData?: Partial<BiohackingData>;
  onStepChange?: (step: number) => void;
  onDataUpdate?: (data: Partial<BiohackingData>) => void;
}

export interface BiohackingStep {
  id: number;
  title: string;
  icon: any;                           // Lucide icon component
  description: string;
  fields: string[];                    // campos que são preenchidos neste step
  isOptional?: boolean;
  estimatedTime: number;               // minutos estimados
}

export interface BiohackingValidation {
  field: string;
  isValid: boolean;
  message?: string;
  severity: 'error' | 'warning' | 'info';
}

export interface BiohackingAnalysis {
  userId: string;
  data: BiohackingData;
  analysis: {
    anthropometricScore: number;       // 0-100
    sleepQualityScore: number;         // 0-100
    nutritionScore: number;            // 0-100
    fitnessScore: number;              // 0-100
    healthScore: number;               // 0-100
    tcmBalance: {
      wood: number;                    // 0-100
      fire: number;                    // 0-100
      earth: number;                   // 0-100
      metal: number;                   // 0-100
      water: number;                   // 0-100
    };
    overallWellness: number;           // 0-100
    recommendations: string[];
    priorities: string[];              // áreas que precisam mais atenção
  };
  createdAt: string;
  updatedAt: string;
}

// 🌿 CONSTANTES E ENUMS

export const BODY_TYPES = [
  { value: 'ectomorph', label: 'Ectomorfo', description: 'Magro, dificuldade para ganhar peso' },
  { value: 'mesomorph', label: 'Mesomorfo', description: 'Muscular, ganha/perde peso facilmente' },
  { value: 'endomorph', label: 'Endomorfo', description: 'Tendência a ganhar peso facilmente' },
  { value: 'unknown', label: 'Não sei', description: 'Não tenho certeza do meu biotipo' }
] as const;

export const CHRONOTYPES = [
  { value: 'morning', label: 'Matutino', description: 'Acordo cedo e rendo mais pela manhã' },
  { value: 'intermediate', label: 'Intermediário', description: 'Rendo melhor entre manhã e tarde' },
  { value: 'evening', label: 'Vespertino', description: 'Sou mais produtivo à noite' }
] as const;

export const DIET_TYPES = [
  'omnivore', 'vegetarian', 'vegan', 'pescetarian', 'keto', 'paleo', 
  'mediterranean', 'intermittent_fasting', 'low_carb', 'other'
] as const;

export const EXERCISE_ACTIVITIES = [
  'walking', 'running', 'cycling', 'swimming', 'weightlifting', 'yoga', 
  'pilates', 'martial_arts', 'dancing', 'sports', 'crossfit', 'calisthenics',
  'hiking', 'rock_climbing', 'tennis', 'soccer', 'basketball', 'other'
] as const;

export const HEALTH_CONDITIONS = [
  'hypertension', 'diabetes_type1', 'diabetes_type2', 'thyroid_hypo', 
  'thyroid_hyper', 'heart_disease', 'autoimmune', 'depression', 'anxiety',
  'arthritis', 'osteoporosis', 'sleep_apnea', 'chronic_fatigue', 'fibromyalgia',
  'ibs', 'crohns', 'celiac', 'pcos', 'endometriosis', 'other'
] as const;

export const SUPPLEMENT_CATEGORIES = [
  'vitamins', 'minerals', 'omega3', 'probiotics', 'adaptogens', 'nootropics',
  'protein', 'amino_acids', 'herbs', 'hormones', 'other'
] as const;