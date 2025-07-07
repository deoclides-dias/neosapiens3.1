// src/hooks/useBiohackingForm.ts - VERSÃO CORRIGIDA

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

// ============================================================================
// TIPOS LOCAIS (para evitar problemas de import)
// ============================================================================

interface BiohackingData {
  anthropometric: {
    height: number;
    currentWeight: number;
    desiredWeight: number;
    bodyType: string;
    weightHistory: {
      maxWeight: number;
      minAdultWeight: number;
      recentWeightChanges: string;
      easyWeightChange: string;
      weightConcerns: string[];
    };
  };
  sleep: {
    averageSleepDuration: number;
    bedtime: string;
    wakeTime: string;
    sleepQuality: number;
    chronotype: string;
    sleepIssues: string[];
    energyLevels: {
      morning: number;
      afternoon: number;
      evening: number;
    };
    sleepAids: {
      naturalSupplements: string[];
      prescriptionMeds: string[];
      other: string[];
    };
  };
  nutrition: any;
  physicalActivity: any;
  healthStatus: any;
  functionalMedicine: any;
  cognitive: any;
}

interface BiohackingValidation {
  isValid: boolean;
  errors: Record<string, string>;
  warnings: Record<string, string>;
  completionPercentage: number;
}

interface UseBiohackingFormState {
  data: BiohackingData | null;
  isLoading: boolean;
  isSubmitting: boolean;
  currentStep: number;
  validation: Record<string, BiohackingValidation>;
  hasUnsavedChanges: boolean;
  error: string | null;
}

// ============================================================================
// HOOK PRINCIPAL
// ============================================================================

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

  // ============================================================================
  // FUNÇÕES DE DADOS INICIAIS
  // ============================================================================

  const getInitialData = useCallback((): BiohackingData => {
    return {
      anthropometric: {
        height: 0,
        currentWeight: 0,
        desiredWeight: 0,
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
        averageSleepDuration: 8,
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
      nutrition: {},
      physicalActivity: {},
      healthStatus: {},
      functionalMedicine: {},
      cognitive: {}
    };
  }, []);

  // ============================================================================
  // FUNÇÕES DE MANIPULAÇÃO DE DADOS
  // ============================================================================

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

  const goToStep = useCallback((step: number) => {
    setState(prev => ({
      ...prev,
      currentStep: step
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

  // ============================================================================
  // VALIDAÇÃO
  // ============================================================================

  const validateStep = useCallback((step: number, data: BiohackingData): BiohackingValidation => {
    const errors: Record<string, string> = {};
    const warnings: Record<string, string> = {};

    switch (step) {
      case 1: // Antropométrico
        if (!data.anthropometric.height) errors.height = 'Altura é obrigatória';
        if (!data.anthropometric.currentWeight) errors.currentWeight = 'Peso atual é obrigatório';
        if (!data.anthropometric.desiredWeight) errors.desiredWeight = 'Peso desejado é obrigatório';
        break;
      case 2: // Sono
        if (!data.sleep.averageSleepDuration) errors.sleepDuration = 'Duração do sono é obrigatória';
        if (!data.sleep.bedtime) errors.bedtime = 'Horário de dormir é obrigatório';
        if (!data.sleep.wakeTime) errors.wakeTime = 'Horário de acordar é obrigatório';
        break;
      // Adicionar validações para outros steps conforme implementados
    }

    const isValid = Object.keys(errors).length === 0;
    const completionPercentage = isValid ? 100 : 0;

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

  // ============================================================================
  // PERSISTÊNCIA (Simulada)
  // ============================================================================

  const saveData = useCallback(async () => {
    if (!user || !state.data) return false;

    setState(prev => ({ ...prev, isSubmitting: true, error: null }));

    try {
      // Aqui você implementaria a integração com o Supabase
      console.log('💾 Salvando dados biohacking:', state.data);
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setState(prev => ({ 
        ...prev, 
        isSubmitting: false, 
        hasUnsavedChanges: false 
      }));

      return true;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isSubmitting: false, 
        error: error instanceof Error ? error.message : 'Erro ao salvar' 
      }));
      return false;
    }
  }, [user, state.data]);

  const loadData = useCallback(async () => {
    if (!user) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Aqui você implementaria o carregamento do Supabase
      console.log('📥 Carregando dados biohacking para usuário:', user.id);
      
      // Por enquanto, usar dados iniciais
      const initialData = getInitialData();
      
      setState(prev => ({
        ...prev,
        data: initialData,
        isLoading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao carregar dados'
      }));
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

  // ============================================================================
  // EFFECTS
  // ============================================================================

  useEffect(() => {
    if (user && !state.data) {
      loadData();
    }
  }, [user, state.data, loadData]);

  // Auto-save (opcional)
  useEffect(() => {
    if (state.hasUnsavedChanges && state.data) {
      const timeoutId = setTimeout(() => {
        saveData();
      }, 3000); // Auto-save após 3 segundos

      return () => clearTimeout(timeoutId);
    }
  }, [state.hasUnsavedChanges, state.data, saveData]);

  // ============================================================================
  // INTERFACE PÚBLICA
  // ============================================================================

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
    canGoNext: validateCurrentStep(),
    canGoPrevious: state.currentStep > 1,
    isFirstStep: state.currentStep === 1,
    isLastStep: state.currentStep === 6,
    totalProgress: (Object.keys(state.validation).filter(key => 
      state.validation[parseInt(key)]?.isValid
    ).length / 6) * 100
  };
};

export default useBiohackingForm;