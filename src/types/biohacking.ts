// src/types/biohacking.ts - Interface Unificada para BiohackingForm

import { LucideIcon } from 'lucide-react';

// 🎯 INTERFACE PRINCIPAL - Unificando ambas as versões
export interface BiohackingData {
  // 💪 STEP 1: DADOS FÍSICOS
  anthropometric: {
    height: number;                    // cm (altura)
    currentWeight: number;             // kg (peso atual)
    desiredWeight: number;             // kg (peso desejado)
    waistCircumference?: number;       // cm (circunferencia cintura)
    hipCircumference?: number;         // cm (circunferencia quadril)
    bodyFatPercentage?: number;        // % (opcional)
    bodyType: string;                  // biotipo: ectomorfo, mesomorfo, etc.
    weightHistory: {
      maxWeight: number;
      minAdultWeight: number;
      recentWeightChanges: string; // ✅ ALTERADO: de union type para string simples
      easyWeightChange: string;    // ✅ ALTERADO: de union type para string simples  
      weightConcerns: string[];
    };
  };

  // 💤 STEP 2: SONO E ENERGIA
  sleep: {
    averageSleepDuration: number;      // horas por noite (horasDeSono)
    bedtime: string;                   // "22:00"
    wakeTime: string;                  // "06:00"
    sleepQuality: number;              // ✅ ALTERADO: de 1|2|3|4|5 para number simples
    chronotype: string;                // ✅ ALTERADO: de union type para string simples
    sleepIssues: string[];             // Array de problemas
    energyLevels: {
      morning: number;                 // ✅ ALTERADO: de 1|2|3|4|5 para number simples
      afternoon: number;               // ✅ ALTERADO: de 1|2|3|4|5 para number simples  
      evening: number;                 // ✅ ALTERADO: de 1|2|3|4|5 para number simples
    };
    sleepAids: {
      naturalSupplements: string[];
      prescriptionMeds: string[];
      other: string[];
    };
  };

  // 🍎 STEP 3: NUTRIÇÃO
  nutrition: {
    dietaryPattern: string;            // ✅ ALTERADO: de union type para string simples
    mealsPerDay: number;               // refeicoesPorDia
    snackingFrequency: string;         // ✅ ALTERADO: de union type para string simples
    waterIntake: number;               // litrosAguaPorDia (copos por dia)
    alcoholConsumption: string;        // ✅ ALTERADO: de union type para string simples
    caffeine: {
      consumption: string;             // ✅ ALTERADO: de union type para string simples
      sources: string[];              // café, chá, etc.
      timing: string[];               // manhã, tarde, etc.
    };
    foodIntolerances: string[];       // restricoesAlimentares
    supplements: string[];            // suplementos
    digestiveHealth: number;          // ✅ ALTERADO: de 1|2|3|4|5 para number simples
    eatingPatterns: {
      emotionalEating: boolean;
      socialEating: boolean;
      stressEating: boolean;
      lateNightEating: boolean;
    };
  };

  // 🏃‍♂️ STEP 4: ATIVIDADE FÍSICA
  physicalActivity: {
    weeklyFrequency: number;          // frequenciaExercicio (dias por semana)
    averageSessionDuration: number;   // minutos por sessão
    preferredIntensity: string;       // ✅ ALTERADO: de union type para string simples
    activityTypes: string[];          // tiposExercicio
    currentFitnessLevel: number;      // ✅ ALTERADO: de 1|2|3|4|5 para number simples
    functionalCapacity: number;       // ✅ ALTERADO: de 1|2|3|4|5 para number simples
    limitations: string[];            // limitações físicas
    goals: string[];                  // objetivos fitness
    recovery: {
      quality: number;                // ✅ ALTERADO: de 1|2|3|4|5 para number simples
      methods: string[];              // métodos de recuperação
    };
  };

  // 🏥 STEP 5: SAÚDE GERAL
  healthStatus: {
    overallHealth: number;            // ✅ ALTERADO: de 1|2|3|4|5 para number simples
    mentalHealth: number;             // ✅ ALTERADO: de 1|2|3|4|5 para number simples
    chronicConditions: string[];
    medications: string[];            // medicamentos
    regularSupplements: string[];     // suplementosRegulares
    nutritionalDeficiencies: string[]; // deficienciasNutricionais
    allergies: string[];
    recentHealthChanges: string[];
    stressLevel: number;              // ✅ ALTERADO: de 1|2|3|4|5 para number simples
    medicalHistory: {
      surgeries: string[];
      hospitalizations: string[];
      significantIllnesses: string[];
      familyHistory: string[]; // ← ADICIONAR ESTA LINHA
    };
  };

  // 🧬 STEP 6: MEDICINA FUNCIONAL + COGNITIVO
  functionalMedicine: {
    fiveElements: {
      wood: {
        liverHealth: 1 | 2 | 3 | 4 | 5; // elementoMadeira
        angerManagement: 1 | 2 | 3 | 4 | 5;
        flexibility: 1 | 2 | 3 | 4 | 5;
        visionHealth: 1 | 2 | 3 | 4 | 5;
        decisionMaking: 1 | 2 | 3 | 4 | 5;
        planningAbility: 1 | 2 | 3 | 4 | 5;
        muscleStrength: 1 | 2 | 3 | 4 | 5;
        creativity: 1 | 2 | 3 | 4 | 5;
        adaptability: 1 | 2 | 3 | 4 | 5;
      };
      fire: {
        heartHealth: 1 | 2 | 3 | 4 | 5; // elementoFogo
        circulation: 1 | 2 | 3 | 4 | 5;
        socialConnection: 1 | 2 | 3 | 4 | 5;
        emotionalExpression: 1 | 2 | 3 | 4 | 5;
        joyfulness: 1 | 2 | 3 | 4 | 5;
        communicationSkills: 1 | 2 | 3 | 4 | 5;
        enthusiasm: 1 | 2 | 3 | 4 | 5;
        sleepDisturbances: boolean;
        anxietyTendency: boolean;
      };
      earth: {
        digestiveStrength: 1 | 2 | 3 | 4 | 5; // elementoTerra
        worryTendency: 1 | 2 | 3 | 4 | 5;
        overthinking: 1 | 2 | 3 | 4 | 5;
        sweetCravings: boolean;
        bloatingAfterMeals: boolean;
        concentrationIssues: boolean;
        empathy: 1 | 2 | 3 | 4 | 5;
        groundedness: 1 | 2 | 3 | 4 | 5;
        nurturingAbility: 1 | 2 | 3 | 4 | 5;
      };
      metal: {
        respiratoryHealth: 1 | 2 | 3 | 4 | 5; // elementoMetal
        skinHealth: 1 | 2 | 3 | 4 | 5;
        griefProcessing: 1 | 2 | 3 | 4 | 5;
        detoxCapacity: 1 | 2 | 3 | 4 | 5;
        immuneStrength: 1 | 2 | 3 | 4 | 5;
        breathingQuality: 1 | 2 | 3 | 4 | 5;
        organizationSkills: 1 | 2 | 3 | 4 | 5;
        perfectionism: 1 | 2 | 3 | 4 | 5;
        boundariesSetting: 1 | 2 | 3 | 4 | 5;
      };
      water: {
        adrenalFatigue: 1 | 2 | 3 | 4 | 5; // elementoAgua
        fearAnxiety: 1 | 2 | 3 | 4 | 5;
        sexualVitality: 1 | 2 | 3 | 4 | 5;
        boneHealth: 1 | 2 | 3 | 4 | 5;
        willpower: 1 | 2 | 3 | 4 | 5;
        coldTolerance: 1 | 2 | 3 | 4 | 5;
        urinaryHealth: 1 | 2 | 3 | 4 | 5;
        memoryRetention: 1 | 2 | 3 | 4 | 5;
        motivation: 1 | 2 | 3 | 4 | 5;
        resilience: 1 | 2 | 3 | 4 | 5;
      };
    };
  };

  // 🧠 AVALIAÇÃO COGNITIVA
  cognitive: {
    focusQuality: number;              // ✅ ALTERADO: de 1|2|3|4|5 para number simples
    memoryQuality: number;             // ✅ ALTERADO: de 1|2|3|4|5 para number simples
    mentalClarity: number;             // ✅ ALTERADO: de 1|2|3|4|5 para number simples
    creativityLevel: number;           // ✅ ALTERADO: de 1|2|3|4|5 para number simples
    learningSpeed: number;             // ✅ ALTERADO: de 1|2|3|4|5 para number simples
    cognitiveSymptoms: {
      brainFog: boolean;
      concentrationDifficulty: boolean;
      memoryLapses: boolean;
      mentalFatigue: boolean;
      decisionFatigue: boolean;
      wordFinding: boolean;
      multitaskingDifficulty: boolean;
    };
    preferredLearningStyle: string;    // ✅ ALTERADO: de union type para string simples
    attentionSpan: number; // minutos
    stressResponse: {
      stressTriggers: string[];
      copingMechanisms: string[];
      stressRecovery: number;          // ✅ ALTERADO: de 1|2|3|4|5 para number simples
    };
  };
}

// 🎯 STEPS DO FORMULÁRIO
export interface BiohackingStep {
  id: number;
  title: string;
  icon: LucideIcon;
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

// 📊 RESULTADO DA ANÁLISE BIOHACKING
export interface BiohackingAnalysis {
  userId: string;
  
  // Scores calculados
  scores: {
    overallHealth: number;
    biotype: string;
    chronotype: string;
    metabolicProfile: string;
    stressLevel: number;
    fitnessLevel: number;
    dominantElement: string;
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