// src/hooks/useCognitiveForm.ts

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
// Import corrigido para usar a classe estática
import { CognitiveService, CognitiveData, CognitiveScores, CognitiveProgress } from '../services/cognitiveService';

// =============================================================================
// INTERFACES E TIPOS
// =============================================================================

interface CognitiveFormState {
  // DADOS DA AVALIAÇÃO
  data: Partial<CognitiveData>;
  
  // CONTROLE DE PROGRESSO
  currentStep: number;
  completedSteps: number[];
  overallProgress: number;
  canProceed: boolean;
  
  // ESTADOS DE UI
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  
  // VALIDAÇÃO
  stepValidations: { [key: number]: boolean };
}

// Estado inicial
const createInitialState = (): CognitiveFormState => ({
  data: {},
  currentStep: 1,
  completedSteps: [],
  overallProgress: 0,
  canProceed: false,
  isLoading: false,
  isSaving: false,
  error: null,
  stepValidations: {}
});

// =============================================================================
// CONFIGURAÇÃO DOS STEPS
// =============================================================================

export interface CognitiveStepConfig {
  id: number;
  title: string;
  subtitle: string;
  emoji: string;
  estimatedTime: string;
  totalQuestions: number;
  description: string;
  fields: string[];
  completed: boolean;
  canAccess: boolean;
}

const COGNITIVE_STEPS_CONFIG: Omit<CognitiveStepConfig, 'completed' | 'canAccess'>[] = [
  {
    id: 1,
    title: 'Estilos de Aprendizagem',
    subtitle: 'Como você melhor absorve informação',
    emoji: '📚',
    estimatedTime: '3-4 min',
    totalQuestions: 12,
    description: 'Identifique suas preferências de aprendizagem: visual, auditivo, leitura/escrita ou cinestésico.',
    fields: ['visual_learning', 'auditory_learning', 'reading_learning', 'kinesthetic_learning']
  },
  {
    id: 2,
    title: 'Processamento Cognitivo',
    subtitle: 'Seu estilo de processar informações',
    emoji: '🧮',
    estimatedTime: '2-3 min',
    totalQuestions: 10,
    description: 'Descubra se você processa informações de forma sequencial ou holística, analítica ou intuitiva.',
    fields: ['sequential_processing', 'holistic_processing', 'analytical_thinking', 'intuitive_thinking']
  },
  {
    id: 3,
    title: 'Criatividade & Inovação',
    subtitle: 'Seu potencial criativo e inovador',
    emoji: '💡',
    estimatedTime: '2-3 min',
    totalQuestions: 8,
    description: 'Avalie sua capacidade criativa e habilidades de resolução de problemas inovadores.',
    fields: ['creative_thinking', 'problem_solving']
  },
  {
    id: 4,
    title: 'Tomada de Decisão',
    subtitle: 'Como você toma decisões importantes',
    emoji: '⚖️',
    estimatedTime: '3-4 min',
    totalQuestions: 12,
    description: 'Entenda seu estilo de tomada de decisão: racional vs emocional, rápido vs deliberativo.',
    fields: ['rational_decisions', 'emotional_decisions', 'quick_decisions', 'deliberative_decisions']
  },
  {
    id: 5,
    title: 'Funções Executivas',
    subtitle: 'Planejamento, foco e flexibilidade',
    emoji: '🎯',
    estimatedTime: '3-4 min',
    totalQuestions: 9,
    description: 'Avalie suas habilidades de planejamento, organização, foco e flexibilidade cognitiva.',
    fields: ['planning_organization', 'focus_attention', 'cognitive_flexibility']
  },
  {
    id: 6,
    title: 'Testes Cognitivos',
    subtitle: 'Capacidades mentais práticas',
    emoji: '🧪',
    estimatedTime: '3-5 min',
    totalQuestions: 8,
    description: 'Testes interativos de memória, reconhecimento de padrões e velocidade de processamento.',
    fields: ['memory_span', 'pattern_recognition', 'processing_speed', 'working_memory']
  }
];

// =============================================================================
// HOOK PRINCIPAL
// =============================================================================

export function useCognitiveForm() {
  const { user } = useAuth();
  const [formState, setFormState] = useState<CognitiveFormState>(createInitialState());

  // ===========================================================================
  // VALIDAÇÃO E CÁLCULOS
  // ===========================================================================

  const validateCurrentStep = useCallback((): boolean => {
    const currentStepConfig = COGNITIVE_STEPS_CONFIG.find(s => s.id === formState.currentStep);
    if (!currentStepConfig) return false;

    // Verificar se todos os campos do step atual estão preenchidos
    return currentStepConfig.fields.every(field => {
      const fieldData = formState.data[field as keyof CognitiveData];
      return fieldData && Array.isArray(fieldData) && fieldData.length > 0 && fieldData.every(answer => answer > 0);
    });
  }, [formState.currentStep, formState.data]);

  // CORREÇÃO: Método estático sem argumentos
  const calculateOverallProgress = useCallback((): number => {
    return CognitiveService.calculateOverallProgress();
  }, []);

  // CORREÇÃO: Método que agora recebe argumentos corretamente
  const updateCompletedSteps = useCallback((data: Partial<CognitiveData>): number[] => {
    const completed: number[] = [];
    
    COGNITIVE_STEPS_CONFIG.forEach(stepConfig => {
      const isStepComplete = stepConfig.fields.every(field => {
        const fieldData = data[field as keyof CognitiveData];
        return fieldData && Array.isArray(fieldData) && fieldData.length > 0 && fieldData.every(answer => answer > 0);
      });
      
      if (isStepComplete) {
        completed.push(stepConfig.id);
      }
    });
    
    return completed;
  }, []);

  // ===========================================================================
  // OPERAÇÕES DE DADOS
  // ===========================================================================

  const updateAnswers = useCallback((field: keyof CognitiveData, newAnswers: number[]) => {
    setFormState(prev => ({
      ...prev,
      data: {
        ...prev.data,
        [field]: newAnswers
      },
      error: null
    }));
  }, []);

  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= 6) {
      setFormState(prev => ({
        ...prev,
        currentStep: step,
        error: null
      }));
    }
  }, []);

  const nextStep = useCallback(() => {
    if (formState.currentStep < 6 && validateCurrentStep()) {
      setFormState(prev => ({
        ...prev,
        currentStep: prev.currentStep + 1,
        error: null
      }));
    }
  }, [formState.currentStep, validateCurrentStep]);

  const previousStep = useCallback(() => {
    if (formState.currentStep > 1) {
      setFormState(prev => ({
        ...prev,
        currentStep: prev.currentStep - 1,
        error: null
      }));
    }
  }, [formState.currentStep]);

  // ===========================================================================
  // PERSISTÊNCIA DE DADOS
  // ===========================================================================

  const saveProgress = useCallback(async (): Promise<boolean> => {
    if (!user?.id) {
      console.warn('🚫 Usuário não autenticado para salvar progresso cognitivo');
      return false;
    }

    try {
      setFormState(prev => ({ ...prev, isSaving: true, error: null }));

      const completedSteps = updateCompletedSteps(formState.data);
      
      // CORREÇÃO: Métodos estáticos da classe CognitiveService
      const result = await CognitiveService.saveCognitiveProgress(
        user.id,
        formState.data,
        formState.currentStep,
        completedSteps
      );

      if (result.success) {
        setFormState(prev => ({
          ...prev,
          completedSteps,
          isSaving: false
        }));
        console.log('✅ Progresso cognitivo salvo com sucesso!');
        return true;
      } else {
        throw new Error(result.error || 'Erro ao salvar progresso cognitivo');
      }

    } catch (error) {
      console.error('❌ Erro ao salvar progresso cognitivo:', error);
      setFormState(prev => ({
        ...prev,
        isSaving: false,
        error: error instanceof Error ? error.message : 'Erro ao salvar'
      }));
      throw error;
    }
  }, [user?.id, formState.data, formState.currentStep, updateCompletedSteps]);

  const loadProgress = useCallback(async (): Promise<void> => {
    if (!user?.id) return;

    try {
      setFormState(prev => ({ ...prev, isLoading: true, error: null }));

      // CORREÇÃO: Método estático da classe CognitiveService
      const result = await CognitiveService.getCognitiveProgress(user.id);

      if (result.success && result.progress) {
        const progress = result.progress;
        const completedSteps = updateCompletedSteps(progress.data);
        const overallProgress = CognitiveService.calculateOverallProgress();

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
  }, [user?.id, updateCompletedSteps]);

  const finalizeCognitiveAssessment = useCallback(async (): Promise<CognitiveScores | null> => {
    if (!user?.id) {
      throw new Error('Usuário não autenticado');
    }

    // CORREÇÃO: Método estático de validação
    if (!CognitiveService.validateCognitiveData(formState.data)) {
      throw new Error('Dados incompletos - complete todas as questões');
    }

    try {
      setFormState(prev => ({ ...prev, isSaving: true, error: null }));

      // CORREÇÃO: Método estático da classe CognitiveService
      const result = await CognitiveService.calculateAndSaveScores(
        user.id, 
        formState.data as CognitiveData
      );

      if (!result.success) {
        throw new Error(result.error || 'Erro ao finalizar avaliação cognitiva');
      }

      setFormState(prev => ({ 
        ...prev, 
        isSaving: false,
        completedSteps: [1, 2, 3, 4, 5, 6],
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

  // ===========================================================================
  // EFFECTS
  // ===========================================================================

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
    const completedSteps = updateCompletedSteps(formState.data);
    
    setFormState(prev => {
      // SÓ ATUALIZA SE REALMENTE MUDOU
      if (prev.overallProgress !== overallProgress || 
          prev.canProceed !== canProceed || 
          JSON.stringify(prev.completedSteps) !== JSON.stringify(completedSteps)) {
        return {
          ...prev,
          overallProgress,
          canProceed,
          completedSteps
        };
      }
      return prev; // RETORNA O MESMO OBJETO SE NADA MUDOU
    });
  }, [JSON.stringify(formState.data), formState.currentStep, calculateOverallProgress, validateCurrentStep, updateCompletedSteps]);

  // Auto-save periódico (a cada mudança significativa)
  useEffect(() => {
    if (!user?.id || formState.overallProgress === 0 || formState.isSaving) return;

    // Debounce para evitar muitas chamadas
    const timeoutId = setTimeout(() => {
      saveProgress().catch(error => {
        console.error('Auto-save error:', error);
      });
    }, 3000); // 3 segundos após mudança

    return () => clearTimeout(timeoutId);
  }, [formState.data, user?.id, saveProgress]);

  // ===========================================================================
  // STEPS CONFIGURADOS COM PROGRESSO
  // ===========================================================================

  const steps: CognitiveStepConfig[] = COGNITIVE_STEPS_CONFIG.map(stepConfig => ({
    ...stepConfig,
    completed: formState.completedSteps.includes(stepConfig.id),
    canAccess: stepConfig.id === 1 || formState.completedSteps.includes(stepConfig.id - 1)
  }));

  // ===========================================================================
  // GETTERS E COMPUTED VALUES
  // ===========================================================================

  const currentStepConfig = steps.find(step => step.id === formState.currentStep);
  const isFirstStep = formState.currentStep === 1;
  const isLastStep = formState.currentStep === 6;
  const canGoNext = validateCurrentStep() && !isLastStep;
  const canFinalize = formState.completedSteps.length === 6;
  const totalProgress = Math.round((formState.completedSteps.length / 6) * 100);

  // Estatísticas do progresso
  const progressStats = {
    totalSteps: 6,
    completedSteps: formState.completedSteps.length,
    currentStep: formState.currentStep,
    overallProgress: formState.overallProgress,
    totalProgress,
    estimatedTimeRemaining: (6 - formState.completedSteps.length) * 3 // minutos
  };

  // ===========================================================================
  // INTERFACE PÚBLICA DO HOOK
  // ===========================================================================

  return {
    // DADOS
    data: formState.data,
    
    // NAVEGAÇÃO
    currentStep: formState.currentStep,
    currentStepConfig,
    steps,
    goToStep,
    nextStep,
    previousStep,
    
    // PROGRESSO
    completedSteps: formState.completedSteps,
    overallProgress: formState.overallProgress,
    progressStats,
    
    // VALIDAÇÃO E CONTROLE
    canProceed: formState.canProceed,
    canGoNext,
    canFinalize,
    isFirstStep,
    isLastStep,
    validateCurrentStep,
    
    // ESTADOS DE UI
    isLoading: formState.isLoading,
    isSaving: formState.isSaving,
    error: formState.error,
    
    // OPERAÇÕES
    updateAnswers,
    saveProgress,
    loadProgress,
    finalizeCognitiveAssessment,
    resetForm,
    
    // UTILITÁRIOS
    hasCompletedAny: formState.completedSteps.length > 0,
    isComplete: formState.completedSteps.length === 6,
    completionPercentage: totalProgress
  };
}

export default useCognitiveForm;