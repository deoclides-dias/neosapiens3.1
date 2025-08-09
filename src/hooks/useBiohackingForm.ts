// src/hooks/useBiohackingForm.ts - Hook Integrado com Supabase

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '../lib/supabase';
import { BiohackingData, BiohackingValidation } from '../types/biohacking';

// 🎯 INTERFACE DO ESTADO
interface UseBiohackingFormState {
  data: BiohackingData | null;
  isLoading: boolean;
  isSubmitting: boolean;
  currentStep: number;
  validation: Record<string, BiohackingValidation>;
  hasUnsavedChanges: boolean;
  error: string | null;
}

// 🎯 HOOK PRINCIPAL
export const useBiohackingForm = () => {
  const { user } = useAuth();
  
  const [state, setState] = useState<UseBiohackingFormState>({
    data: null,
    isLoading: false,
    isSubmitting: false,
    currentStep: 1,
    validation: {},
    hasUnsavedChanges: false,
    error: null
  });

  // 🔧 FUNÇÃO PARA DADOS INICIAIS
  const getInitialData = useCallback((): BiohackingData => {
    return {
      anthropometric: {
        height: 0,
        currentWeight: 0,
        desiredWeight: 0,
        waistCircumference: undefined,
        hipCircumference: undefined,
        bodyFatPercentage: undefined,
        bodyType: 'unknown',
        weightHistory: {
          maxWeight: 0,
          minAdultWeight: 0,
          recentWeightChanges: 'stable',
          easyWeightChange: 'neither',
          weightConcerns: []
        }
      },
      sleep: {
        averageSleepDuration: 7,
        bedtime: '22:00',
        wakeTime: '06:00',
        sleepQuality: 3,
        chronotype: 'intermediate',
        sleepIssues: [],
        energyLevels: {
          morning: 3,
          afternoon: 3,
          evening: 3
        },
        sleepAids: {
          naturalSupplements: [],
          prescriptionMeds: [],
          other: []
        }
      },
      nutrition: {
        dietaryPattern: 'omnivore',
        mealsPerDay: 3,
        snackingFrequency: 'sometimes',
        waterIntake: 8,
        alcoholConsumption: 'rarely',
        caffeine: {
          consumption: 'daily',
          sources: ['café'],
          timing: ['manhã']
        },
        foodIntolerances: [],
        supplements: [],
        digestiveHealth: 3,
        eatingPatterns: {
          emotionalEating: false,
          socialEating: false,
          stressEating: false,
          lateNightEating: false
        }
      },
      physicalActivity: {
        weeklyFrequency: 3,
        averageSessionDuration: 45,
        preferredIntensity: 'moderate',
        activityTypes: [],
        currentFitnessLevel: 3,
        functionalCapacity: 3,
        limitations: [],
        goals: [],
        recovery: {
          quality: 3,
          methods: []
        }
      },
      healthStatus: {
        overallHealth: 3,
        mentalHealth: 3,
        chronicConditions: [],
        medications: [],
        regularSupplements: [],
        nutritionalDeficiencies: [],
        allergies: [],
        recentHealthChanges: [],
        stressLevel: 3,
        medicalHistory: {
          surgeries: [],
          hospitalizations: [],
          significantIllnesses: [],
          familyHistory: [] // ← ADICIONAR ESTA LINHA
        }
      },
      functionalMedicine: {
        fiveElements: {
          wood: {
            liverHealth: 3,
            angerManagement: 3,
            flexibility: 3,
            visionHealth: 3,
            decisionMaking: 3,
            planningAbility: 3,
            muscleStrength: 3,
            creativity: 3,
            adaptability: 3
          },
          fire: {
            heartHealth: 3,
            circulation: 3,
            socialConnection: 3,
            emotionalExpression: 3,
            joyfulness: 3,
            communicationSkills: 3,
            enthusiasm: 3,
            sleepDisturbances: false,
            anxietyTendency: false
          },
          earth: {
            digestiveStrength: 3,
            worryTendency: 3,
            overthinking: 3,
            sweetCravings: false,
            bloatingAfterMeals: false,
            concentrationIssues: false,
            empathy: 3,
            groundedness: 3,
            nurturingAbility: 3
          },
          metal: {
            respiratoryHealth: 3,
            skinHealth: 3,
            griefProcessing: 3,
            detoxCapacity: 3,
            immuneStrength: 3,
            breathingQuality: 3,
            organizationSkills: 3,
            perfectionism: 3,
            boundariesSetting: 3
          },
          water: {
            adrenalFatigue: 3,
            fearAnxiety: 3,
            sexualVitality: 3,
            boneHealth: 3,
            willpower: 3,
            coldTolerance: 3,
            urinaryHealth: 3,
            memoryRetention: 3,
            motivation: 3,
            resilience: 3
          }
        }
      },
      cognitive: {
        focusQuality: 3,
        memoryQuality: 3,
        mentalClarity: 3,
        creativityLevel: 3,
        learningSpeed: 3,
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
          stressRecovery: 3
        }
      }
    };
  }, []);

  // 🔧 FUNÇÕES DE MANIPULAÇÃO DE DADOS
  const updateData = useCallback((newData: Partial<BiohackingData>) => {
    setState(prev => ({
      ...prev,
      data: prev.data ? { ...prev.data, ...newData } : { ...getInitialData(), ...newData },
      hasUnsavedChanges: true
    }));
  }, [getInitialData]);

  const updateField = useCallback((path: string, value: any) => {
    setState(prev => {
      if (!prev.data) return prev;
      
      const newData = { ...prev.data };
      const keys = path.split('.');
      let current: any = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (current[keys[i]] === undefined) {
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

  // 🔧 FUNÇÕES DE NAVEGAÇÃO
  const goToStep = useCallback((step: number) => {
    setState(prev => ({
      ...prev,
      currentStep: Math.max(1, Math.min(6, step))
    }));
  }, []);

  const nextStep = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, 6)
    }));
  }, []);

  const previousStep = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 1)
    }));
  }, []);

  // 🔧 VALIDAÇÃO
  const validateStep = useCallback((step: number, data: BiohackingData): BiohackingValidation => {
    const errors: Record<string, string> = {};
    const warnings: Record<string, string> = {};

    switch (step) {
      case 1: // Antropométrico
        if (!data.anthropometric.height || data.anthropometric.height < 100) {
          errors.height = 'Altura deve ser maior que 100cm';
        }
        if (!data.anthropometric.currentWeight || data.anthropometric.currentWeight < 30) {
          errors.currentWeight = 'Peso atual deve ser maior que 30kg';
        }
        if (!data.anthropometric.desiredWeight || data.anthropometric.desiredWeight < 30) {
          errors.desiredWeight = 'Peso desejado deve ser maior que 30kg';
        }
        if (data.anthropometric.bodyType === 'unknown') {
          warnings.bodyType = 'Recomendamos identificar seu biotipo';
        }
        break;
      
      case 2: // Sono
        if (!data.sleep.averageSleepDuration || data.sleep.averageSleepDuration < 4) {
          errors.sleepDuration = 'Duração do sono deve ser pelo menos 4 horas';
        }
        if (!data.sleep.bedtime) {
          errors.bedtime = 'Horário de dormir é obrigatório';
        }
        if (!data.sleep.wakeTime) {
          errors.wakeTime = 'Horário de acordar é obrigatório';
        }
        if (data.sleep.averageSleepDuration < 6) {
          warnings.sleepDuration = 'Menos de 6 horas pode afetar sua saúde';
        }
        break;
      
      case 3: // Nutrição
        if (data.nutrition.waterIntake < 4) {
          warnings.waterIntake = 'Recomendamos pelo menos 6-8 copos de água por dia';
        }
        if (data.nutrition.mealsPerDay < 2) {
          warnings.mealsPerDay = 'Pelo menos 2 refeições por dia são recomendadas';
        }
        break;
      
      case 4: // Atividade Física
        if (data.physicalActivity.weeklyFrequency === 0) {
          warnings.weeklyFrequency = 'Atividade física regular é importante para a saúde';
        }
        if (data.physicalActivity.activityTypes.length === 0) {
          warnings.activityTypes = 'Selecione pelo menos um tipo de atividade';
        }
        break;
      
      case 5: // Saúde Geral
        if (data.healthStatus.stressLevel >= 4) {
          warnings.stressLevel = 'Nível alto de estresse pode afetar sua saúde';
        }
        break;
      
      case 6: // Medicina Funcional + Cognitivo
        // Validações específicas para MTC se necessário
        break;
    }

    const isValid = Object.keys(errors).length === 0;
    const completionPercentage = isValid ? 100 : 50;

    return {
      isValid,
      errors,
      warnings,
      completionPercentage
    };
  }, []);

  const validateCurrentStep = useCallback(() => {
    if (!state.data) return false;
    const validation = validateStep(state.currentStep, state.data);
    
    setState(prev => ({
      ...prev,
      validation: {
        ...prev.validation,
        [state.currentStep]: validation
      }
    }));
    
    return validation.isValid;
  }, [state.currentStep, state.data, validateStep]);

  // 🔧 PERSISTÊNCIA DE DADOS
  const saveData = useCallback(async () => {
    if (!user || !state.data) {
      console.error('Usuário não autenticado ou dados ausentes');
      return;
    }

    setState(prev => ({ ...prev, isSubmitting: true, error: null }));

    try {
      const { error } = await supabase
        .from('onboarding_progress')
        .upsert({
          user_id: user.id,
          biohacking_data: state.data,
          biohacking_data_complete: state.currentStep === 6,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setState(prev => ({
        ...prev,
        hasUnsavedChanges: false,
        error: null
      }));

      console.log('Dados salvos com sucesso');
    } catch (error: any) {
      console.error('Erro ao salvar dados:', error);
      setState(prev => ({
        ...prev,
        error: error.message || 'Erro ao salvar dados'
      }));
    } finally {
      setState(prev => ({ ...prev, isSubmitting: false }));
    }
  }, [user, state.data, state.currentStep]);

  const loadData = useCallback(async () => {
    if (!user) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const { data, error } = await supabase
        .from('onboarding_progress')
        .select('biohacking_data, step')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data?.biohacking_data) {
        setState(prev => ({
          ...prev,
          data: { ...getInitialData(), ...data.biohacking_data },
          currentStep: data.step || 1
        }));
      } else {
        setState(prev => ({
          ...prev,
          data: getInitialData()
        }));
      }
    } catch (error: any) {
      console.error('Erro ao carregar dados:', error);
      setState(prev => ({
        ...prev,
        data: getInitialData(),
        error: error.message || 'Erro ao carregar dados'
      }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [user, getInitialData]);

  const resetForm = useCallback(() => {
    setState({
      data: getInitialData(),
      isLoading: false,
      isSubmitting: false,
      currentStep: 1,
      validation: {},
      hasUnsavedChanges: false,
      error: null
    });
  }, [getInitialData]);

  // 🔧 EFEITOS
  useEffect(() => {
    if (user && !state.data) {
      loadData();
    }
  }, [user, state.data, loadData]);

  // Auto-save a cada 10 segundos se houver mudanças
  useEffect(() => {
    if (state.hasUnsavedChanges && state.data && !state.isSubmitting) {
      const timeoutId = setTimeout(() => {
        saveData();
      }, 10000); // 10 segundos

      return () => clearTimeout(timeoutId);
    }
  }, [state.hasUnsavedChanges, state.data, state.isSubmitting, saveData]);

  // 🎯 INTERFACE PÚBLICA
  return {
    // Estado
    data: state.data,
    isLoading: state.isLoading,
    isSubmitting: state.isSubmitting,
    error: state.error,
    hasUnsavedChanges: state.hasUnsavedChanges,

    // Navegação
    currentStep: state.currentStep,
    goToStep,
    nextStep,
    previousStep,

    // Manipulação de dados
    updateData,
    updateField,

    // Validação
    validation: state.validation,
    validateCurrentStep,

    // Persistência
    saveData,
    loadData,
    resetForm,

    // Utilitários
    canGoNext: state.data ? validateStep(state.currentStep, state.data).isValid : false,
    canGoPrevious: state.currentStep > 1,
    isFirstStep: state.currentStep === 1,
    isLastStep: state.currentStep === 6,
    totalProgress: (Object.keys(state.validation).filter(key => 
      state.validation[parseInt(key)]?.isValid
    ).length / 6) * 100,
    
    // Progresso por step
    getStepProgress: (step: number) => state.validation[step]?.completionPercentage || 0,
    getAllStepsValid: () => {
      for (let i = 1; i <= 6; i++) {
        if (!state.validation[i]?.isValid) return false;
      }
      return true;
    }
  };
};

export default useBiohackingForm;