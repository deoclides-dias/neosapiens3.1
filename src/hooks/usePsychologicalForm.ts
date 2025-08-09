// ============================================================================
// usePsychologicalForm.ts - HOOK CORRIGIDO SEM LOOPS INFINITOS
// ============================================================================

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import psychologicalService, { 
  PsychologicalData, 
  PsychologicalProgress,
  PsychologicalScores 
} from '@/services/psychologicalService';

// ============================================================================
// INTERFACES
// ============================================================================

export interface PsychStepConfig {
  id: number;
  title: string;
  subtitle: string;
  questionsCount: number;
  completed: boolean;
  progress: number;
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

export interface UsePsychologicalFormReturn {
  formState: PsychFormState;
  steps: PsychStepConfig[];
  goToStep: (step: number) => void;
  goToNext: () => Promise<void>;
  goToPrevious: () => void;
  updateStepData: (stepId: number, answers: number[]) => Promise<void>;
  getStepData: (stepId: number) => number[];
  saveProgress: () => Promise<void>;
  loadProgress: () => Promise<void>;
  finalizePsychologicalAssessment: () => Promise<PsychologicalScores | null>;
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
    questionsCount: 24
  },
  {
    id: 7,
    title: "Medicina Chinesa - Parte 1",
    subtitle: "Yin/Yang, Madeira e Fogo",
    questionsCount: 24
  },
  {
    id: 8,
    title: "Medicina Chinesa - Parte 2", 
    subtitle: "Terra, Metal e Água",
    questionsCount: 16
  }
];

// ============================================================================
// FUNÇÕES AUXILIARES PURAS
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
  const newData = { ...data };
  
  switch (stepId) {
    case 1:
      newData.openness = answers;
      break;
    case 2:
      newData.conscientiousness = answers;
      break;
    case 3:
      newData.extraversion = answers;
      break;
    case 4:
      newData.agreeableness = answers;
      break;
    case 5:
      newData.neuroticism = answers;
      break;
    case 6:
      newData.disc = answers.slice(0, 16);
      newData.vark = answers.slice(16, 24);
      break;
    case 7:
      newData.mtc_yinyang = answers.slice(0, 8);
      newData.mtc_wood = answers.slice(8, 16);
      newData.mtc_fire = answers.slice(16, 24);
      break;
    case 8:
      newData.mtc_earth = answers.slice(0, 5);
      newData.mtc_metal = answers.slice(5, 10);
      newData.mtc_water = answers.slice(10, 16);
      break;
  }
  
  return newData;
};

const createInitialState = (): PsychFormState => ({
  currentStep: 1,
  data: {},
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

export const usePsychologicalForm = (): UsePsychologicalFormReturn => {
  const { user } = useAuth();
  const [formState, setFormState] = useState<PsychFormState>(createInitialState);
  
  // ✅ REF PARA EVITAR RENDERIZAÇÕES DESNECESSÁRIAS
  const lastSavedData = useRef<string>('');
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ============================================================================
  // FUNÇÕES MEMOIZADAS COM useCallback
  // ============================================================================

  const calculateStepProgress = useCallback((stepId: number): number => {
    const stepData = getStepDataMapping(stepId, formState.data);
    const completed = stepData.filter(answer => answer > 0).length;
    const total = PSYCH_STEPS_CONFIG.find(s => s.id === stepId)?.questionsCount || 1;
    return Math.round((completed / total) * 100);
  }, [formState.data]);

  const calculateOverallProgress = useCallback((): number => {
    const totalQuestions = PSYCH_STEPS_CONFIG.reduce((sum, step) => sum + step.questionsCount, 0);
    let answeredQuestions = 0;

    PSYCH_STEPS_CONFIG.forEach(step => {
      const stepData = getStepDataMapping(step.id, formState.data);
      answeredQuestions += stepData.filter(answer => answer > 0).length;
    });

    return Math.round((answeredQuestions / totalQuestions) * 100);
  }, [formState.data]);

  const validateCurrentStep = useCallback((): boolean => {
    const currentStepData = getStepDataMapping(formState.currentStep, formState.data);
    return currentStepData.every(answer => answer > 0);
  }, [formState.currentStep, formState.data]);

  const getStepData = useCallback((stepId: number): number[] => {
    return getStepDataMapping(stepId, formState.data);
  }, [formState.data]);

  // ============================================================================
  // FUNÇÕES DE NAVEGAÇÃO
  // ============================================================================

  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= 8) {
      setFormState(prev => ({
        ...prev,
        currentStep: step
      }));
    }
  }, []);

  const goToNext = useCallback(async () => {
    const isValid = validateCurrentStep();
    if (isValid && formState.currentStep < 8) {
      // Salvar progresso antes de avançar
      await saveProgress();
      
      setFormState(prev => ({
        ...prev,
        currentStep: prev.currentStep + 1,
        completedSteps: [...new Set([...prev.completedSteps, prev.currentStep])]
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

  const updateStepData = useCallback(async (stepId: number, answers: number[]) => {
    const newData = updateDataFromStep(stepId, answers, formState.data);
    
    setFormState(prev => ({
      ...prev,
      data: newData
    }));

    // ✅ DEBOUNCE PARA AUTO-SAVE (evita muitas chamadas)
    const dataString = JSON.stringify(newData);
    if (dataString !== lastSavedData.current) {
      // Cancelar timeout anterior
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      // Novo timeout para salvar após 2 segundos
      saveTimeoutRef.current = setTimeout(async () => {
        try {
          if (user?.id) {
            await psychologicalService.savePsychologicalProgress(
              user.id, 
              newData,
              stepId,
              formState.completedSteps
            );
            lastSavedData.current = dataString;
          }
        } catch (error) {
          console.error('Auto-save error:', error);
        }
      }, 2000);
    }
  }, [formState.data, formState.completedSteps, user?.id]);

  // ============================================================================
  // FUNÇÕES DE PERSISTÊNCIA
  // ============================================================================

  const saveProgress = useCallback(async () => {
    if (!user?.id || formState.isSaving) return;

    try {
      setFormState(prev => ({ ...prev, isSaving: true, error: null }));

      const progressData: PsychologicalProgress = {
        userId: user.id,
        currentStep: formState.currentStep,
        completedSteps: formState.completedSteps,
        stepProgress: {},
        data: formState.data,
        lastUpdated: new Date().toISOString()
      };

      // Calcular progresso de cada step
      PSYCH_STEPS_CONFIG.forEach(step => {
        progressData.stepProgress[step.id] = calculateStepProgress(step.id);
      });

      await psychologicalService.savePsychologicalProgress(
        user.id, 
        formState.data,
        formState.currentStep,
        formState.completedSteps
      );
      lastSavedData.current = JSON.stringify(formState.data);

      setFormState(prev => ({ ...prev, isSaving: false }));
    } catch (error) {
      console.error('Erro ao salvar progresso:', error);
      setFormState(prev => ({
        ...prev,
        isSaving: false,
        error: 'Erro ao salvar progresso'
      }));
    }
  }, [user?.id, formState.currentStep, formState.completedSteps, formState.data, formState.isSaving, calculateStepProgress]);

  const loadProgress = useCallback(async () => {
    if (!user?.id || formState.isLoading) return;

    try {
      setFormState(prev => ({ ...prev, isLoading: true, error: null }));

      const result = await psychologicalService.getPsychologicalProgress(user.id);
      
      if (result.success && result.progress) {
        const progress = result.progress;
        
        setFormState(prev => ({
          ...prev,
          currentStep: progress.currentStep,
          completedSteps: progress.completedSteps,
          data: progress.data,
          isLoading: false
        }));
        
        lastSavedData.current = JSON.stringify(progress.data);
      } else {
        // Sem progresso salvo, começar do início
        setFormState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error('Erro ao carregar progresso:', error);
      setFormState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Erro ao carregar progresso'
      }));
    }
  }, [user?.id, formState.isLoading]);

  const finalizePsychologicalAssessment = useCallback(async (): Promise<PsychologicalScores | null> => {
    if (!user?.id) {
      throw new Error('Usuário não autenticado');
    }

    // ✅ VALIDAÇÃO COMPLETA ANTES DE FINALIZAR
    const allStepsComplete = PSYCH_STEPS_CONFIG.every(step => {
      const stepData = getStepDataMapping(step.id, formState.data);
      return stepData.every(answer => answer > 0);
    });

    if (!allStepsComplete) {
      throw new Error('Avaliação incompleta. Complete todos os steps antes de finalizar.');
    }

    try {
      setFormState(prev => ({ ...prev, isSaving: true, error: null }));

      // Salvar dados finais e calcular scores
      const result = await psychologicalService.calculateAndSaveScores(user.id, formState.data as PsychologicalData);
      
      if (!result.success || !result.scores) {
        throw new Error(result.error || 'Erro ao calcular scores');
      }
      
      setFormState(prev => ({
        ...prev,
        isSaving: false,
        completedSteps: [1, 2, 3, 4, 5, 6, 7, 8]
      }));

      return result.scores;
    } catch (error) {
      console.error('Erro ao finalizar avaliação:', error);
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
    lastSavedData.current = '';
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }
  }, []);

  // ============================================================================
  // EFFECTS OTIMIZADOS
  // ============================================================================

  // Carregar progresso inicial
  useEffect(() => {
    if (user?.id && !formState.isLoading) {
      loadProgress();
    }
  }, [user?.id]); // ✅ Só depende do user ID

  // ✅ RECALCULAR PROGRESSO SOMENTE QUANDO OS DADOS REALMENTE MUDAM
  const dataHash = useMemo(() => {
    return JSON.stringify(formState.data);
  }, [formState.data]);

  useEffect(() => {
    const overallProgress = calculateOverallProgress();
    const canProceed = validateCurrentStep();
    
    setFormState(prev => {
      // ✅ SÓ ATUALIZA SE REALMENTE MUDOU
      if (prev.overallProgress !== overallProgress || prev.canProceed !== canProceed) {
        return {
          ...prev,
          overallProgress,
          canProceed
        };
      }
      return prev; // ✅ RETORNA MESMO OBJETO SE NADA MUDOU
    });
  }, [dataHash, formState.currentStep]); // ✅ Dependências estáveis

  // Cleanup na desmontagem
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // ============================================================================
  // STEPS COM PROGRESSO CALCULADO
  // ============================================================================

  const steps: PsychStepConfig[] = useMemo(() => {
    return PSYCH_STEPS_CONFIG.map(stepConfig => ({
      ...stepConfig,
      completed: formState.completedSteps.includes(stepConfig.id),
      progress: calculateStepProgress(stepConfig.id)
    }));
  }, [formState.completedSteps, calculateStepProgress]);

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
// EXPORTS
// ============================================================================

export default usePsychologicalForm;