// src/hooks/useBiohackingForm.ts - Hook Customizado para Formulário de Biohacking
import { useState, useEffect, useCallback } from 'react';
import { BiohackingData, BiohackingValidation } from '../types/biohacking';
import BiohackingService from '../services/biohackingService';
import { useAuth } from './useAuth';

interface UseBiohackingFormState {
  data: BiohackingData | null;
  isLoading: boolean;
  isSubmitting: boolean;
  currentStep: number;
  validation: Record<string, BiohackingValidation>;
  hasUnsavedChanges: boolean;
  error: string | null;
}

interface UseBiohackingFormActions {
  loadUserData: () => Promise<void>;
  updateField: (path: string, value: any) => void;
  validateStep: (step: number) => boolean;
  saveProgress: (step?: number) => Promise<boolean>;
  submitForm: () => Promise<boolean>;
  setCurrentStep: (step: number) => void;
  resetForm: () => void;
  generateAnalysis: () => Promise<any>;
}

interface UseBiohackingFormReturn extends UseBiohackingFormState, UseBiohackingFormActions {}

// 🎯 DADOS INICIAIS DO FORMULÁRIO
const getInitialData = (): BiohackingData => ({
  anthropometric: {
    height: 0,
    currentWeight: 0,
    desiredWeight: 0,
    bodyType: 'unknown',
    weightHistory: {
      maxWeight: 0,
      minAdultWeight: 0,
      recentWeightChanges: 'stable',
      easyWeightChange: 'neither'
    }
  },
  sleep: {
    bedtime: '23:00',
    fallAsleepTime: 15,
    wakeupTime: '07:00',
    effectiveSleepHours: 7,
    sleepQuality: 5,
    sleepMedication: false,
    daytimeSleepiness: 5,
    sleepDisorders: {
      snoring: false,
      apnea: false,
      insomnia: false,
      nightmareDisturbances: false,
      restlessLegs: false,
      bruxism: false
    },
    chronotype: 'intermediate',
    energyPattern: {
      morningEnergy: 5,
      afternoonEnergy: 5,
      eveningEnergy: 5
    }
  },
  nutrition: {
    mealsPerDay: 3,
    mealTimes: ['08:00', '13:00', '19:00'],
    waterIntake: 2,
    alcoholConsumption: {
      frequency: 'rarely',
      quantity: 0
    },
    caffeineConsumption: {
      amount: 100,
      lastIntakeTime: '14:00',
      sources: ['coffee']
    },
    dietaryRestrictions: [],
    foodPreferences: {
      sweetCravings: 5,
      saltyFoods: 5,
      processedFoods: 5,
      organicFoods: 5
    },
    digestiveSymptoms: {
      reflux: false,
      bloating: false,
      constipation: false,
      diarrhea: false,
      gasExcessive: false,
      stomachPain: false,
      foodIntolerances: [],
      digestiveSpeed: 'normal',
      bloatingAfterMeals: false
    }
  },
  physicalActivity: {
    exerciseFrequency: 0,
    preferredActivities: [],
    sessionDuration: 0,
    intensity: 'light',
    physicalLimitations: [],
    sportsHistory: '',
    functionalCapacity: {
      stairClimbing: true,
      carryWeight: true,
      flexibility: true,
      balance: true,
      pushups: 0,
      walkingDistance: 0
    },
    fitnessLevel: 5,
    motivationFactors: []
  },
  healthStatus: {
    chronicConditions: [],
    familyHistory: [],
    currentMedications: [],
    supplements: [],
    allergies: [],
    deficiencySymptoms: {
      chronicFatigue: false,
      hairLoss: false,
      weakNails: false,
      skinProblems: false,
      slowHealing: false,
      frequentInfections: false,
      muscleCramps: false,
      moodSwings: false,
      memoryIssues: false,
      coldIntolerance: false
    },
    mentalHealth: {
      stressLevel: 5,
      anxietyLevel: 5,
      depressionSymptoms: false,
      panicAttacks: false,
      therapyHistory: false
    }
  },
  functionalMedicine: {
    wood: {
      irritability: 5,
      frustrationLevel: 5,
      headaches: 0,
      eyeStrain: false,
      muscleStiffness: false,
      decisionMaking: 5,
      angerManagement: 5,
      planningAbility: 5
    },
    fire: {
      heartPalpitations: false,
      chestTightness: false,
      sleepIssues: false,
      excessiveTalking: false,
      socialAnxiety: 5,
      emotionalInstability: 5,
      joyExpression: 5,
      connectionWithOthers: 5,
      speechClarity: 5
    },
    earth: {
      digestiveStrength: 5,
      worryTendency: 5,
      overthinking: 5,
      sweetCravings: false,
      bloatingAfterMeals: false,
      concentrationIssues: false,
      empathy: 5,
      groundedness: 5,
      nurturingAbility: 5
    },
    metal: {
      respiratoryHealth: 5,
      skinHealth: 5,
      griefProcessing: 5,
      detoxCapacity: 5,
      immuneStrength: 5,
      breathingQuality: 5,
      organizationSkills: 5,
      perfectionism: 5,
      boundariesSetting: 5
    },
    water: {
      adrenalFatigue: 5,
      fearAnxiety: 5,
      sexualVitality: 5,
      boneHealth: 5,
      willpower: 5,
      coldTolerance: 5,
      urinaryHealth: 5,
      memoryRetention: 5,
      motivation: 5,
      resilience: 5
    }
  },
  cognitive: {
    focusQuality: 5,
    memoryQuality: 5,
    mentalClarity: 5,
    creativityLevel: 5,
    learningSpeed: 5,
    cognitiveSymptoms: {
      brainFog: false,
      concentrationDifficulty: false,
      memoryLapses: false,
      mentalFatigue: false,
      decisionFatigue: false,
      wordFinding: false,
      multitaskingDifficulty: false
    },
    preferredLearningStyle: 'visual',
    attentionSpan: 30,
    stressResponse: {
      stressTriggers: [],
      copingMechanisms: [],
      stressRecovery: 5
    }
  }
});

// 🎯 HOOK PRINCIPAL
export const useBiohackingForm = (initialData?: Partial<BiohackingData>): UseBiohackingFormReturn => {
  const { user } = useAuth();
  
  // 📊 ESTADOS
  const [state, setState] = useState<UseBiohackingFormState>({
    data: null,
    isLoading: true,
    isSubmitting: false,
    currentStep: 1,
    validation: {},
    hasUnsavedChanges: false,
    error: null
  });

  // 🔄 INICIALIZAÇÃO
  useEffect(() => {
    if (user?.id) {
      loadUserData();
    } else {
      // Se não tem usuário logado, usa dados iniciais
      setState(prev => ({
        ...prev,
        data: { ...getInitialData(), ...initialData },
        isLoading: false
      }));
    }
  }, [user?.id]);

  // 📥 CARREGAR DADOS DO USUÁRIO
  const loadUserData = useCallback(async () => {
    if (!user?.id) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await BiohackingService.getBiohackingData(user.id);
      
      if (response.success) {
        const userData = response.data || getInitialData();
        setState(prev => ({
          ...prev,
          data: { ...userData, ...initialData },
          isLoading: false
        }));
      } else {
        throw new Error(response.error || 'Erro ao carregar dados');
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
      setState(prev => ({
        ...prev,
        data: { ...getInitialData(), ...initialData },
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      }));
    }
  }, [user?.id, initialData]);

  // ✏️ ATUALIZAR CAMPO
  const updateField = useCallback((path: string, value: any) => {
    setState(prev => {
      if (!prev.data) return prev;

      const newData = { ...prev.data };
      const keys = path.split('.');
      let current = newData as any;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      
      return {
        ...prev,
        data: newData,
        hasUnsavedChanges: true
      };
    });
  }, []);

  // ✅ VALIDAR STEP
  const validateStep = useCallback((step: number): boolean => {
    if (!state.data) return false;

    const validations: Record<string, BiohackingValidation> = {};
    let isValid = true;

    switch (step) {
      case 1: // Antropométrico
        if (!state.data.anthropometric.height || state.data.anthropometric.height <= 0) {
          validations['anthropometric.height'] = {
            field: 'height',
            isValid: false,
            message: 'Altura é obrigatória',
            severity: 'error'
          };
          isValid = false;
        }
        
        if (!state.data.anthropometric.currentWeight || state.data.anthropometric.currentWeight <= 0) {
          validations['anthropometric.currentWeight'] = {
            field: 'currentWeight',
            isValid: false,
            message: 'Peso atual é obrigatório',
            severity: 'error'
          };
          isValid = false;
        }

        if (state.data.anthropometric.bodyType === 'unknown') {
          validations['anthropometric.bodyType'] = {
            field: 'bodyType',
            isValid: false,
            message: 'Selecione seu biotipo corporal',
            severity: 'warning'
          };
        }
        break;

      case 2: // Sono
        if (!state.data.sleep.bedtime || !state.data.sleep.wakeupTime) {
          validations['sleep.schedule'] = {
            field: 'schedule',
            isValid: false,
            message: 'Horários de sono são obrigatórios',
            severity: 'error'
          };
          isValid = false;
        }

        if (state.data.sleep.sleepQuality < 1) {
          validations['sleep.quality'] = {
            field: 'sleepQuality',
            isValid: false,
            message: 'Avalie a qualidade do seu sono',
            severity: 'error'
          };
          isValid = false;
        }

        if (state.data.sleep.effectiveSleepHours < 4 || state.data.sleep.effectiveSleepHours > 12) {
          validations['sleep.hours'] = {
            field: 'effectiveSleepHours',
            isValid: false,
            message: 'Horas de sono devem estar entre 4 e 12',
            severity: 'warning'
          };
        }
        break;

      case 3: // Nutrição
        if (state.data.nutrition.waterIntake <= 0) {
          validations['nutrition.water'] = {
            field: 'waterIntake',
            isValid: false,
            message: 'Consumo de água é obrigatório',
            severity: 'error'
          };
          isValid = false;
        }

        if (state.data.nutrition.mealsPerDay < 1 || state.data.nutrition.mealsPerDay > 8) {
          validations['nutrition.meals'] = {
            field: 'mealsPerDay',
            isValid: false,
            message: 'Número de refeições deve ser entre 1 e 8',
            severity: 'error'
          };
          isValid = false;
        }
        break;

      case 4: // Atividade Física
        if (state.data.physicalActivity.fitnessLevel < 1) {
          validations['fitness.level'] = {
            field: 'fitnessLevel',
            isValid: false,
            message: 'Avalie seu nível de condicionamento',
            severity: 'error'
          };
          isValid = false;
        }

        if (state.data.physicalActivity.exerciseFrequency < 0 || state.data.physicalActivity.exerciseFrequency > 7) {
          validations['fitness.frequency'] = {
            field: 'exerciseFrequency',
            isValid: false,
            message: 'Frequência deve ser entre 0 e 7 dias',
            severity: 'warning'
          };
        }
        break;

      case 5: // Saúde Geral
        if (state.data.healthStatus.mentalHealth.stressLevel < 1) {
          validations['health.stress'] = {
            field: 'stressLevel',
            isValid: false,
            message: 'Avalie seu nível de stress',
            severity: 'error'
          };
          isValid = false;
        }
        break;

      case 6: // Medicina Funcional
        if (state.data.cognitive.focusQuality < 1) {
          validations['cognitive.focus'] = {
            field: 'focusQuality',
            isValid: false,
            message: 'Avalie sua qualidade de foco',
            severity: 'error'
          };
          isValid = false;
        }
        break;
    }

    setState(prev => ({
      ...prev,
      validation: { ...prev.validation, ...validations }
    }));

    return isValid;
  }, [state.data]);

  // 💾 SALVAR PROGRESSO
  const saveProgress = useCallback(async (step?: number): Promise<boolean> => {
    if (!user?.id || !state.data) {
      console.warn('Usuário não logado ou dados não disponíveis');
      return false;
    }

    setState(prev => ({ ...prev, isSubmitting: true, error: null }));

    try {
      const currentStep = step || state.currentStep;
      const response = await BiohackingService.updateProgress(user.id, currentStep, state.data);
      
      if (response.success) {
        setState(prev => ({
          ...prev,
          hasUnsavedChanges: false,
          isSubmitting: false
        }));
        return true;
      } else {
        throw new Error(response.error || 'Erro ao salvar progresso');
      }
    } catch (error) {
      console.error('Erro ao salvar progresso:', error);
      setState(prev => ({
        ...prev,
        isSubmitting: false,
        error: error instanceof Error ? error.message : 'Erro ao salvar'
      }));
      return false;
    }
  }, [user?.id, state.data, state.currentStep]);

  // 📤 SUBMETER FORMULÁRIO
  const submitForm = useCallback(async (): Promise<boolean> => {
    if (!user?.id || !state.data) {
      console.warn('Usuário não logado ou dados não disponíveis');
      return false;
    }

    // Validar todos os steps antes de submeter
    for (let i = 1; i <= 6; i++) {
      if (!validateStep(i)) {
        setState(prev => ({
          ...prev,
          error: `Existem campos obrigatórios não preenchidos na etapa ${i}`
        }));
        return false;
      }
    }

    setState(prev => ({ ...prev, isSubmitting: true, error: null }));

    try {
      const response = await BiohackingService.saveBiohackingData(user.id, state.data);
      
      if (response.success) {
        setState(prev => ({
          ...prev,
          hasUnsavedChanges: false,
          isSubmitting: false
        }));
        console.log('✅ Formulário de biohacking submetido com sucesso');
        return true;
      } else {
        throw new Error(response.error || 'Erro ao submeter formulário');
      }
    } catch (error) {
      console.error('Erro ao submeter formulário:', error);
      setState(prev => ({
        ...prev,
        isSubmitting: false,
        error: error instanceof Error ? error.message : 'Erro ao submeter'
      }));
      return false;
    }
  }, [user?.id, state.data, validateStep]);

  // 🔬 GERAR ANÁLISE
  const generateAnalysis = useCallback(async () => {
    if (!user?.id || !state.data) {
      return null;
    }

    try {
      const response = await BiohackingService.generateBiohackingAnalysis(user.id, state.data);
      
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error || 'Erro ao gerar análise');
      }
    } catch (error) {
      console.error('Erro ao gerar análise:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Erro ao gerar análise'
      }));
      return null;
    }
  }, [user?.id, state.data]);

  // 🚶 NAVEGAR ENTRE STEPS
  const setCurrentStep = useCallback((step: number) => {
    if (step >= 1 && step <= 6) {
      setState(prev => ({ ...prev, currentStep: step }));
    }
  }, []);

  // 🔄 RESETAR FORMULÁRIO
  const resetForm = useCallback(() => {
    setState(prev => ({
      ...prev,
      data: getInitialData(),
      currentStep: 1,
      validation: {},
      hasUnsavedChanges: false,
      error: null
    }));
  }, []);

  // 💾 AUTO-SAVE (salvar automaticamente a cada mudança após 3 segundos)
  useEffect(() => {
    if (state.hasUnsavedChanges && user?.id) {
      const autoSaveTimer = setTimeout(() => {
        saveProgress();
      }, 3000);

      return () => clearTimeout(autoSaveTimer);
    }
  }, [state.hasUnsavedChanges, user?.id, saveProgress]);

  // 🚨 AVISO DE SAÍDA SEM SALVAR
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (state.hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'Você tem alterações não salvas. Deseja realmente sair?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [state.hasUnsavedChanges]);

  return {
    // Estado
    data: state.data,
    isLoading: state.isLoading,
    isSubmitting: state.isSubmitting,
    currentStep: state.currentStep,
    validation: state.validation,
    hasUnsavedChanges: state.hasUnsavedChanges,
    error: state.error,
    
    // Ações
    loadUserData,
    updateField,
    validateStep,
    saveProgress,
    submitForm,
    setCurrentStep,
    resetForm,
    generateAnalysis
  };
};

// ... lógica anterior do formulário

const setValueByPath = (obj: any, path: string, value: any) => {
  const keys = path.split('.');
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) {
      current[keys[i]] = {};
    }
    current = current[keys[i]];
  }

  current[keys[keys.length - 1]] = value;
};

export default useBiohackingForm;
