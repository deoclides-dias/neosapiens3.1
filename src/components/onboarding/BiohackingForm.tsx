// ============================================================================
// PsychologicalForm.tsx - ORQUESTRADOR CORRIGIDO SEM LOOPS
// ============================================================================

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { CheckCircle, ArrowRight, ArrowLeft, Brain, Sparkles } from 'lucide-react';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { usePsychologicalForm } from '@/hooks/usePsychologicalForm';

// Steps components (importar os steps corrigidos)
import { Step6_DiscVark, Step7_MtcWoodFire, Step8_MtcEarthMetalWater } from './psychological-steps/Steps5-8';


// ============================================================================
// INTERFACES
// ============================================================================

interface PsychologicalFormProps {
  onComplete: (data: any) => Promise<void>;
  onBack?: () => void;
  initialData?: any;
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

const PsychologicalForm: React.FC<PsychologicalFormProps> = ({
  onComplete,
  onBack,
  initialData
}) => {
  // ✅ HOOK CORRIGIDO
  const {
    formState,
    steps,
    goToStep,
    goToNext,
    goToPrevious,
    updateStepData,
    getStepData,
    validateCurrentStep,
    finalizePsychologicalAssessment
  } = usePsychologicalForm();

  // ✅ ESTADO PARA CONTROLE DE TRANSIÇÃO (SEM LOOPS)
  const [showTransition, setShowTransition] = useState(false);
  const [isAutoAdvancing, setIsAutoAdvancing] = useState(false);

  // ✅ SCROLL AUTOMÁTICO OTIMIZADO
  useScrollToTop(formState.currentStep, { behavior: 'smooth', delay: 100 });

  // ============================================================================
  // MAPEAMENTO DOS STEPS
  // ============================================================================

   // ============================================================================
  // HANDLERS OTIMIZADOS
  // ============================================================================

  const handleStepDataChange = useCallback(async (data: number[]) => {
    try {
      await updateStepData(formState.currentStep, data);
    } catch (error) {
      console.error('Erro ao atualizar dados do step:', error);
    }
  }, [formState.currentStep, updateStepData]);

  const handleNext = useCallback(async () => {
    try {
      if (formState.currentStep === 8) {
        // Último step - finalizar avaliação
        const scores = await finalizePsychologicalAssessment();
        if (scores && onComplete) {
          await onComplete(scores);
        }
      } else {
        // Ir para próximo step
        await goToNext();
      }
    } catch (error) {
      console.error('Erro ao avançar:', error);
    }
  }, [formState.currentStep, goToNext, finalizePsychologicalAssessment, onComplete]);

  const handlePrevious = useCallback(() => {
    if (formState.currentStep === 1 && onBack) {
      onBack();
    } else {
      goToPrevious();
    }
  }, [formState.currentStep, goToPrevious, onBack]);

  const handleStepComplete = useCallback(() => {
    console.log(`Step ${formState.currentStep} completo!`);
  }, [formState.currentStep]);

  // ============================================================================
  // AUTO-NAVEGAÇÃO CONTROLADA (SEM LOOPS)
  // ============================================================================

  useEffect(() => {
    // ✅ CONDIÇÕES RÍGIDAS PARA EVITAR LOOPS
    if (
      !showTransition && 
      !isAutoAdvancing && 
      formState.currentStep < 8 && 
      !formState.isLoading &&
      !formState.isSaving
    ) {
      const currentStepData = getStepData(formState.currentStep);
      const isCurrentStepComplete = currentStepData.length > 0 && currentStepData.every(answer => answer > 0);
      
      if (isCurrentStepComplete) {
        setIsAutoAdvancing(true);
        setShowTransition(true);
        
        const timeoutId = setTimeout(() => {
          goToStep(formState.currentStep + 1);
          setShowTransition(false);
          setIsAutoAdvancing(false);
        }, 2000);
        
        return () => {
          clearTimeout(timeoutId);
          setIsAutoAdvancing(false);
        };
      }
    }
  }, [
    formState.currentStep, 
    formState.isLoading, 
    formState.isSaving,
    showTransition,
    isAutoAdvancing,
    getStepData,
    goToStep
  ]);

  // ============================================================================
  // RENDER DO STEP ATUAL
  // ============================================================================

  const renderCurrentStep = useCallback(() => {
    const CurrentStepComponent = stepComponents[formState.currentStep as keyof typeof stepComponents];
    
    if (!CurrentStepComponent) {
      return (
        <div className="text-center py-12">
          <p className="text-red-400">Step {formState.currentStep} não encontrado</p>
        </div>
      );
    }

    const currentStepData = getStepData(formState.currentStep);

    return (
      <CurrentStepComponent
        data={currentStepData}
        onDataChange={handleStepDataChange}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onStepComplete={handleStepComplete}
      />
    );
  }, [
    formState.currentStep,
   
    getStepData,
    handleStepDataChange,
    handleNext,
    handlePrevious,
    handleStepComplete
  ]);

  // ============================================================================
  // MODAL DE TRANSIÇÃO
  // ============================================================================

  const TransitionModal = useMemo(() => {
    if (!showTransition) return null;
    
    const currentStep = steps.find(s => s.id === formState.currentStep);
    
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl animate-scale-in">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {currentStep?.title} Concluído!
          </h3>
          
          <p className="text-gray-600 mb-4">
            Avançando automaticamente para o próximo step...
          </p>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full animate-progress-bar" style={{ width: '100%' }} />
          </div>
        </div>
      </div>
    );
  }, [showTransition, formState.currentStep, steps]);

  // ============================================================================
  // HEADER COM PROGRESSO
  // ============================================================================

  const ProgressHeader = useMemo(() => (
    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Brain className="w-8 h-8 text-indigo-400" />
          <div>
            <h2 className="text-xl font-bold text-white">
              Avaliação Psicológica NeoSapiens
            </h2>
            <p className="text-slate-400 text-sm">
              Step {formState.currentStep} de 8 • {formState.overallProgress}% completo
            </p>
          </div>
        </div>
        
        {formState.isSaving && (
          <div className="flex items-center gap-2 text-indigo-400">
            <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">Salvando...</span>
          </div>
        )}
      </div>
      
      {/* Progress Bar Global */}
      <div className="space-y-3">
        <div className="flex justify-between text-sm text-slate-400">
          <span>Progresso Geral</span>
          <span>{formState.overallProgress}%</span>
        </div>
        
        <div className="bg-slate-700/50 rounded-full h-3 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-700 ease-out"
            style={{ width: `${formState.overallProgress}%` }}
          />
        </div>
      </div>
      
      {/* Steps Indicators */}
      <div className="grid grid-cols-8 gap-2 mt-4">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`text-center p-2 rounded-lg transition-all duration-200 ${
              step.id === formState.currentStep
                ? 'bg-indigo-500/20 border border-indigo-500/50'
                : step.completed
                ? 'bg-green-500/20 border border-green-500/50'
                : 'bg-slate-700/30 border border-slate-600/50'
            }`}
          >
            <div className={`text-xs font-medium ${
              step.id === formState.currentStep
                ? 'text-indigo-300'
                : step.completed
                ? 'text-green-300'
                : 'text-slate-400'
            }`}>
              {step.id}
            </div>
            
            <div className="w-full bg-slate-600/50 rounded-full h-1 mt-1">
              <div 
                className={`h-1 rounded-full transition-all duration-300 ${
                  step.completed
                    ? 'bg-green-400'
                    : step.id === formState.currentStep
                    ? 'bg-indigo-400'
                    : 'bg-slate-500'
                }`}
                style={{ width: `${step.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  ), [formState, steps]);

  // ============================================================================
  // LOADING STATE
  // ============================================================================

  if (formState.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900/20 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Carregando avaliação...</p>
        </div>
      </div>
    );
  }

  // ============================================================================
  // ERROR STATE
  // ============================================================================

  if (formState.error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900/20 to-slate-900 flex items-center justify-center">
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 max-w-md mx-4 text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-400 text-2xl">⚠️</span>
          </div>
          <h3 className="text-xl font-bold text-red-300 mb-2">Erro na Avaliação</h3>
          <p className="text-red-200 mb-4">{formState.error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  // ============================================================================
  // RENDER PRINCIPAL
  // ============================================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900/20 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {ProgressHeader}
        {renderCurrentStep()}
        {TransitionModal}
      </div>
      
      {/* Styles personalizados */}
      <style jsx>{`
        @keyframes scale-in {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        @keyframes progress-bar {
          from { width: 0%; }
          to { width: 100%; }
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
        
        .animate-progress-bar {
          animation: progress-bar 2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PsychologicalForm;