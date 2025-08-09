// src/hooks/usePsychologicalForm.ts - VERSÃO CORRIGIDA SEM CONFLITOS
// ============================================================================
// IMPORTS E TIPOS PRINCIPAIS
// ============================================================================

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import psychologicalService, { 
  PsychologicalData, 
  PsychologicalProgress,
  PsychologicalScores 
} from '@/services/psychologicalService';

// ============================================================================
// INTERFACES DO HOOK (NOMES ÚNICOS)
// ============================================================================

export interface PsychStepConfig {
  id: number;
  title: string;
  subtitle: string;
  questionsCount: number;
  completed: boolean;
  progress: number; // 0-100
}

export interface PsychFormState {
  currentStep: number;
  data: Partial<PsychologicalData>;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  completedSteps: number[];
  overallProgress: number;
  canProceed: boolean;
}

export interface PsychStepData {
  stepId: number;
  answers: number[];
  isComplete: boolean;
  lastUpdated: string;
}

export interface UsePsychologicalFormReturn {
  // Estado
  formState: PsychFormState;
  steps: PsychStepConfig[];
  
  // Navegação
  goToStep: (step: number) => void;
  goToNext: () => Promise<void>;
  goToPrevious: () => void;
  
  // Dados
  updateStepData: (stepId: number, answers: number[]) => Promise<void>;
  getStepData: (stepId: number) => number[];
  
  // Persistência
  saveProgress: () => Promise<void>;
  loadProgress: () => Promise<void>;
  finalizePsychologicalAssessment: () => Promise<PsychologicalScores | null>;
  
  // Utilitários
  validateCurrentStep: () => boolean;
  calculateStepProgress: (stepId: number) => number;
  resetForm: () => void;
}

// ============================================================================
// CONFIGURAÇÃO DOS STEPS
// ============================================================================

const PSYCH_STEPS_CONFIG: Omit<PsychStepConfig, 'completed' | 'progress'>[] = [
  {
    id: 1,
    title: "Abertura à Experiência",
    subtitle: "Como você se relaciona com ideias e experiências novas?",
    questionsCount: 8
  },
  {
    id: 2,
    title: "Conscienciosidade",
    subtitle: "Como você se organiza e se disciplina para alcançar seus objetivos?",
    questionsCount: 8
  },
  {
    id: 3,
    title: "Extroversão",
    subtitle: "Como você interage com o mundo ao seu redor?",
    questionsCount: 8
  },
  {
    id: 4,
    title: "Amabilidade",
    subtitle: "Como você se relaciona e confia nas pessoas?",
    questionsCount: 8
  },
  {
    id: 5,
    title: "Neuroticismo",
    subtitle: "Como você lida com estresse e emoções intensas?",
    questionsCount: 8
  },
  {
    id: 6,
    title: "Perfil DISC + VARK",
    subtitle: "Seu estilo comportamental e preferência de aprendizagem",
    questionsCount: 24 // 16 DISC + 8 VARK
  },
  {
    id: 7,
    title: "Medicina Chinesa - Parte 1",
    subtitle: "Yin/Yang, Madeira e Fogo",
    questionsCount: 24 // 8 + 8 + 8
  },
  {
    id: 8,
    title: "Medicina Chinesa - Parte 2",
    subtitle: "Terra, Metal e Água",
    questionsCount: 16 // 5 + 5 + 6
  }
];

// ============================================================================
// FUNÇÕES AUXILIARES
// ============================================================================

const getStepDataMapping = (stepId: number, data: Partial<PsychologicalData>): number[] => {
  switch (stepId) {
    case 1: return data.openness || new Array(8).fill(0);
    case 2: return data.conscientiousness || new Array(8).fill(0);
    case 3: return data.extraversion || new Array(8).fill(0);
    case 4: return data.agreeableness || new Array(8).fill(0);
    case 5: return data.neuroticism || new Array(8).fill(0);
    case 6: return [
      ...(data.disc || new Array(16).fill(0)),
      ...(data.vark || new Array(8).fill(0))
    ];
    case 7: return [
      ...(data.mtc_yinyang || new Array(8).fill(0)),
      ...(data.mtc_wood || new Array(8).fill(0)),
      ...(data.mtc_fire || new Array(8).fill(0))
    ];
    case 8: return [
      ...(data.mtc_earth || new Array(5).fill(0)),
      ...(data.mtc_metal || new Array(5).fill(0)),
      ...(data.mtc_water || new Array(6).fill(0))
    ];
    default: return [];
  }
};

const updateDataFromStep = (stepId: number, answers: number[], data: Partial<PsychologicalData>): Partial<PsychologicalData> => {
  switch (stepId) {
    case 1: return { ...data, openness: answers };
    case 2: return { ...data, conscientiousness: answers };
    case 3: return { ...data, extraversion: answers };
    case 4: return { ...data, agreeableness: answers };
    case 5: return { ...data, neuroticism: answers };
    case 6: return { 
      ...data, 
      disc: answers.slice(0, 16),
      vark: answers.slice(16, 24)
    };
    case 7: return {
      ...data,
      mtc_yinyang: answers.slice(0, 8),
      mtc_wood: answers.slice(8, 16),
      mtc_fire: answers.slice(16, 24)
    };
    case 8: return {
      ...data,
      mtc_earth: answers.slice(0, 5),
      mtc_metal: answers.slice(5, 10),
      mtc_water: answers.slice(10, 16)
    };
    default: return data;
  }
};

const updateCompletedSteps = (data: Partial<PsychologicalData>): number[] => {
  const completed: number[] = [];
  
  if (data.openness?.every(a => a > 0)) completed.push(1);
  if (data.conscientiousness?.every(a => a > 0)) completed.push(2);
  if (data.extraversion?.every(a => a > 0)) completed.push(3);
  if (data.agreeableness?.every(a => a > 0)) completed.push(4);
  if (data.neuroticism?.every(a => a > 0)) completed.push(5);
  
  if (data.disc?.every(a => a > 0) && data.vark?.every(a => a > 0)) {
    completed.push(6);
  }
  
  if (data.mtc_yinyang?.every(a => a > 0) && 
      data.mtc_wood?.every(a => a > 0) && 
      data.mtc_fire?.every(a => a > 0)) {
    completed.push(7);
  }
  
  if (data.mtc_earth?.every(a => a > 0) && 
      data.mtc_metal?.every(a => a > 0) && 
      data.mtc_water?.every(a => a > 0)) {
    completed.push(8);
  }
  
  return completed;
};

// ============================================================================
// ESTADO INICIAL
// ============================================================================

const createInitialState = (): PsychFormState => ({
  currentStep: 1,
  data: {
    openness: new Array(8).fill(0),
    conscientiousness: new Array(8).fill(0),
    extraversion: new Array(8).fill(0),
    agreeableness: new Array(8).fill(0),
    neuroticism: new Array(8).fill(0),
    disc: new Array(16).fill(0),
    vark: new Array(8).fill(0),
    mtc_yinyang: new Array(8).fill(0),
    mtc_wood: new Array(8).fill(0),
    mtc_fire: new Array(8).fill(0),
    mtc_earth: new Array(5).fill(0),
    mtc_metal: new Array(5).fill(0),
    mtc_water: new Array(6).fill(0)
  },
  isLoading: false,
  isSaving: false,
  error: null,
  completedSteps: [],
  overallProgress: 0,
  canProceed: false
});

// ============================================================================
// HOOK PRINCIPAL
// ============================================================================

const usePsychologicalForm = (): UsePsychologicalFormReturn => {
  const { user } = useAuth();
  const [formState, setFormState] = useState<PsychFormState>(createInitialState());

  // ============================================================================
  // FUNÇÕES DE CÁLCULO E VALIDAÇÃO
  // ============================================================================

  const calculateStepProgress = useCallback((stepId: number): number => {
    const stepData = getStepDataMapping(stepId, formState.data);
    const completed = stepData.filter(answer => answer > 0).length;
    const total = stepData.length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }, [formState.data]);

  const calculateOverallProgress = useCallback((): number => {
    const totalQuestions = 104; // Total de questões psicológicas
    let answeredQuestions = 0;

    // Contar questões respondidas
    Object.values(formState.data).forEach(stepArray => {
      if (Array.isArray(stepArray)) {
        answeredQuestions += stepArray.filter(answer => answer > 0).length;
      }
    });

    return Math.round((answeredQuestions / totalQuestions) * 100);
  }, [formState.data]);

  const validateCurrentStep = useCallback((): boolean => {
    const currentStepData = getStepDataMapping(formState.currentStep, formState.data);
    return currentStepData.every(answer => answer > 0);
  }, [formState.currentStep, formState.data]);

  // ============================================================================
  // FUNÇÕES DE NAVEGAÇÃO
  // ============================================================================

  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= 8) {
      setFormState(prev => ({
        ...prev,
        currentStep: step,
        error: null
      }));
    }
  }, []);

  const goToNext = useCallback(async (): Promise<void> => {
    if (!validateCurrentStep()) {
      setFormState(prev => ({
        ...prev,
        error: 'Complete todas as questões antes de continuar'
      }));
      return;
    }

    try {
      await saveProgress();
      
      if (formState.currentStep < 8) {
        setFormState(prev => ({
          ...prev,
          currentStep: prev.currentStep + 1,
          error: null
        }));
      }
    } catch (error) {
      setFormState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Erro ao salvar progresso'
      }));
    }
  }, [formState.currentStep, validateCurrentStep]);

  const goToPrevious = useCallback(() => {
    if (formState.currentStep > 1) {
      setFormState(prev => ({
        ...prev,
        currentStep: prev.currentStep - 1
      }));
    }
  }, [formState.currentStep]);

  // ============================================================================
  // FUNÇÕES DE DADOS
  // ============================================================================

  const getStepData = useCallback((stepId: number): number[] => {
    return getStepDataMapping(stepId, formState.data);
  }, [formState.data]);

  const updateStepData = useCallback(async (stepId: number, answers: number[]) => {
    try {
      const newData = updateDataFromStep(stepId, answers, formState.data);
      const completedSteps = updateCompletedSteps(newData);
      const overallProgress = psychologicalService.calculateOverallProgress(newData);

      setFormState(prev => ({
        ...prev,
        data: newData,
        completedSteps,
        overallProgress,
        canProceed: answers.every(a => a > 0),
        error: null
      }));

      // ❌ REMOVIDO AUTO-SAVE QUE CAUSAVA LOOP:
      // setTimeout(() => saveProgress(), 1000);
    } catch (error) {
      setFormState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Erro ao atualizar dados'
      }));
    }
  }, [formState.data, updateCompletedSteps]);

  // ============================================================================
  // FUNÇÕES DE PERSISTÊNCIA
  // ============================================================================

  const saveProgress = useCallback(async (): Promise<void> => {
    if (!user?.id) {
      throw new Error('Usuário não autenticado');
    }

    try {
      setFormState(prev => ({ ...prev, isSaving: true }));

      const result = await psychologicalService.savePsychologicalProgress(
        user.id,
        formState.data,
        formState.currentStep,
        formState.completedSteps
      );

      if (!result.success) {
        throw new Error(result.error || 'Erro ao salvar progresso');
      }

      setFormState(prev => ({ ...prev, isSaving: false }));
    } catch (error) {
      setFormState(prev => ({ 
        ...prev, 
        isSaving: false,
        error: error instanceof Error ? error.message : 'Erro ao salvar'
      }));
      throw error;
    }
  }, [user?.id, formState.data, formState.currentStep, formState.completedSteps]);

  const loadProgress = useCallback(async (): Promise<void> => {
    if (!user?.id) return;

    try {
      setFormState(prev => ({ ...prev, isLoading: true, error: null }));

      const result = await psychologicalService.getPsychologicalProgress(user.id);

      if (result.success && result.progress) {
        const progress = result.progress;
        const completedSteps = updateCompletedSteps(progress.data);
        const overallProgress = psychologicalService.calculateOverallProgress(progress.data);

        setFormState(prev => ({
          ...prev,
          currentStep: progress.currentStep,
          data: { ...prev.data, ...progress.data },
          completedSteps,
          overallProgress,
          isLoading: false
        }));
      } else {
        setFormState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      setFormState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao carregar progresso'
      }));
    }
  }, [user?.id]);

  const finalizePsychologicalAssessment = useCallback(async (): Promise<PsychologicalScores | null> => {
    if (!user?.id) {
      throw new Error('Usuário não autenticado');
    }

    if (!psychologicalService.validatePsychologicalData(formState.data)) {
      throw new Error('Dados incompletos - complete todas as questões');
    }

    try {
      setFormState(prev => ({ ...prev, isSaving: true, error: null }));

      const result = await psychologicalService.calculateAndSaveScores(
        user.id, 
        formState.data as PsychologicalData
      );

      if (!result.success) {
        throw new Error(result.error || 'Erro ao finalizar avaliação');
      }

      setFormState(prev => ({ 
        ...prev, 
        isSaving: false,
        completedSteps: [1, 2, 3, 4, 5, 6, 7, 8],
        overallProgress: 100
      }));

      return result.scores || null;
    } catch (error) {
      setFormState(prev => ({
        ...prev,
        isSaving: false,
        error: error instanceof Error ? error.message : 'Erro ao finalizar avaliação'
      }));
      throw error;
    }
  }, [user?.id, formState.data]);

  const resetForm = useCallback(() => {
    setFormState(createInitialState());
  }, []);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  // Carrega progresso ao montar o componente
  useEffect(() => {
    if (user?.id) {
      loadProgress();
    }
  }, [user?.id, loadProgress]);

  // Recalcula progresso quando dados mudam
  useEffect(() => {
    const overallProgress = calculateOverallProgress();
    const canProceed = validateCurrentStep();
    
    setFormState(prev => ({
      ...prev,
      overallProgress,
      canProceed
    }));
  }, [formState.data, formState.currentStep, calculateOverallProgress, validateCurrentStep]);

  // Auto-save periódico (a cada 30 segundos se houver mudanças)
  useEffect(() => {
    if (!user?.id || formState.overallProgress === 0 || formState.isSaving) return;

    // Debounce para evitar muitas chamadas
    const timeoutId = setTimeout(() => {
      saveProgress().catch(error => {
        console.error('Auto-save error:', error);
      });
    }, 3000); // 3 segundos após mudança

    return () => clearTimeout(timeoutId);
  }, [formState.data, user?.id, saveProgress]); // ✅ Dependências específicas

  // ============================================================================
  // STEPS CONFIGURADOS COM PROGRESSO
  // ============================================================================

  const steps: PsychStepConfig[] = PSYCH_STEPS_CONFIG.map(stepConfig => ({
    ...stepConfig,
    completed: formState.completedSteps.includes(stepConfig.id),
    progress: calculateStepProgress(stepConfig.id)
  }));

  // ============================================================================
  // RETURN DO HOOK
  // ============================================================================

  return {
    // Estado
    formState,
    steps,
    
    // Navegação
    goToStep,
    goToNext,
    goToPrevious,
    
    // Dados
    updateStepData,
    getStepData,
    
    // Persistência
    saveProgress,
    loadProgress,
    finalizePsychologicalAssessment,
    
    // Utilitários
    validateCurrentStep,
    calculateStepProgress,
    resetForm
  };
};

// ============================================================================
// EXPORTS - MANTENDO CONSISTÊNCIA COM O PADRÃO DO PROJETO
// ============================================================================

// Export default para flexibilidade
export default usePsychologicalForm;

// Named export para manter consistência com outros hooks do projeto
export { usePsychologicalForm };