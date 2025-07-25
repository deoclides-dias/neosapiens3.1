// src/components/onboarding/PsychologicalForm.tsx
// ============================================================================
// PSYCHOLOGICAL FORM - ORQUESTRADOR PRINCIPAL LIMPO E FUNCIONAL
// ============================================================================

import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  Loader,
  ArrowLeft,
  ArrowRight,
  Brain
} from 'lucide-react';

// Imports dos Step components - TODOS OS 8 STEPS FUNCIONAIS
import Step1_Openness from './psychological-steps/Step1_Openness';
import Step2_Conscientiousness from './psychological-steps/Step2_Conscientiousness';
import Step3_Extraversion from './psychological-steps/Step3_Extraversion';
import Step4_Agreeableness from './psychological-steps/Step4_Agreeableness';
import Step5_Neuroticism from './psychological-steps/Step5_Neuroticism';
import Step6_DiscVark from './psychological-steps/Step6_DiscVark';
import Step7_MtcWoodFire from './psychological-steps/Step7_MtcWoodFire';
import Step8_MtcEarthMetalWater from './psychological-steps/Step8_MtcEarthMetalWater';

// ============================================================================
// INTERFACES
// ============================================================================

interface PsychologicalFormProps {
  onComplete: (data: PsychologicalFormData) => Promise<void>;
  onBack?: () => void;
  initialData?: Partial<PsychologicalFormData>;
}

interface PsychologicalFormData {
  // Big Five (8 questões cada = 40 total)
  openness: number[];          // Step 1 - 8 questões
  conscientiousness: number[]; // Step 2 - 8 questões  
  extraversion: number[];      // Step 3 - 8 questões
  agreeableness: number[];     // Step 4 - 8 questões
  neuroticism: number[];       // Step 5 - 8 questões
  
  // DISC + VARK (24 questões)
  discVark: number[];          // Step 6 - 24 questões
  
  // MTC 5 Elementos (32 questões)
  mtcWoodFire: number[];       // Step 7 - 16 questões (Madeira + Fogo)
  mtcEarthMetalWater: number[]; // Step 8 - 16 questões (Terra + Metal + Água)
  
  // Metadados
  completedSteps: number[];
  startedAt: string;
  lastUpdated: string;
}

interface StepConfig {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  questionsCount: number;
  category: string;
  color: string;
  estimatedTime: number;
  implemented: boolean;
}

// ============================================================================
// CONFIGURAÇÃO DOS STEPS - TODOS IMPLEMENTADOS!
// ============================================================================

const PSYCHOLOGICAL_STEPS: StepConfig[] = [
  {
    id: 1,
    title: "Abertura à Experiência",
    subtitle: "Como você se relaciona com ideias e experiências novas?",
    icon: "🧠",
    questionsCount: 8,
    category: "Big Five",
    color: "purple",
    estimatedTime: 3,
    implemented: true
  },
  {
    id: 2,
    title: "Conscienciosidade", 
    subtitle: "Como você se organiza e se disciplina para alcançar objetivos?",
    icon: "🎯",
    questionsCount: 8,
    category: "Big Five",
    color: "blue",
    estimatedTime: 3,
    implemented: true
  },
  {
    id: 3,
    title: "Extroversão",
    subtitle: "Como você interage socialmente e de onde vem sua energia?",
    icon: "👥",
    questionsCount: 8,
    category: "Big Five",
    color: "green",
    estimatedTime: 3,
    implemented: true
  },
  {
    id: 4,
    title: "Amabilidade",
    subtitle: "Como você se relaciona e coopera com outras pessoas?",
    icon: "❤️",
    questionsCount: 8,
    category: "Big Five",
    color: "pink",
    estimatedTime: 3,
    implemented: true
  },
  {
    id: 5,
    title: "Neuroticismo",
    subtitle: "Como você lida com estresse e estabilidade emocional?",
    icon: "⚡",
    questionsCount: 8,
    category: "Big Five",
    color: "red",
    estimatedTime: 3,
    implemented: true
  },
  {
    id: 6,
    title: "DISC + VARK",
    subtitle: "Perfil comportamental e estilo de aprendizagem",
    icon: "🔄",
    questionsCount: 24,
    category: "Comportamental",
    color: "orange",
    estimatedTime: 8,
    implemented: true
  },
  {
    id: 7,
    title: "MTC: Madeira & Fogo",
    subtitle: "Elementos Madeira e Fogo da Medicina Tradicional Chinesa",
    icon: "🌱",
    questionsCount: 16,
    category: "MTC",
    color: "emerald",
    estimatedTime: 5,
    implemented: true
  },
  {
    id: 8,
    title: "MTC: Terra, Metal & Água",
    subtitle: "Elementos Terra, Metal e Água da Medicina Tradicional Chinesa",
    icon: "🌍",
    questionsCount: 16,
    category: "MTC",
    color: "amber",
    estimatedTime: 5,
    implemented: true
  }
];

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

const PsychologicalForm: React.FC<PsychologicalFormProps> = ({
  onComplete,
  onBack,
  initialData
}) => {
  // Estados principais
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<PsychologicalFormData>({
    openness: initialData?.openness || new Array(8).fill(0),
    conscientiousness: initialData?.conscientiousness || new Array(8).fill(0),
    extraversion: initialData?.extraversion || new Array(8).fill(0),
    agreeableness: initialData?.agreeableness || new Array(8).fill(0),
    neuroticism: initialData?.neuroticism || new Array(8).fill(0),
    discVark: initialData?.discVark || new Array(24).fill(0),
    mtcWoodFire: initialData?.mtcWoodFire || new Array(16).fill(0),
    mtcEarthMetalWater: initialData?.mtcEarthMetalWater || new Array(16).fill(0),
    completedSteps: initialData?.completedSteps || [],
    startedAt: initialData?.startedAt || new Date().toISOString(),
    lastUpdated: new Date().toISOString()
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showTransition, setShowTransition] = useState(false);

  // ============================================================================
  // FUNÇÕES DE NAVEGAÇÃO
  // ============================================================================

  const handleStepDataChange = async (stepKey: keyof PsychologicalFormData, data: number[]) => {
    const newFormData = {
      ...formData,
      [stepKey]: data,
      lastUpdated: new Date().toISOString()
    };
    setFormData(newFormData);
    console.log(`Step ${currentStep} data updated:`, data);
  };

  const handleNextStep = async () => {
    const implementedSteps = PSYCHOLOGICAL_STEPS.filter(step => step.implemented);
    
    if (currentStep < implementedSteps.length) {
      setShowTransition(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setShowTransition(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 500);
    } else {
      await handleComplete();
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      await onComplete(formData);
    } catch (error) {
      console.error('Erro ao completar formulário psicológico:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStepComplete = () => {
    if (!formData.completedSteps.includes(currentStep)) {
      setFormData(prev => ({
        ...prev,
        completedSteps: [...prev.completedSteps, currentStep]
      }));
    }
  };

  // ============================================================================
  // CÁLCULOS DE PROGRESSO
  // ============================================================================

  const implementedSteps = PSYCHOLOGICAL_STEPS.filter(step => step.implemented);
  const totalQuestions = implementedSteps.reduce((sum, step) => sum + step.questionsCount, 0);
  const currentStepConfig = PSYCHOLOGICAL_STEPS.find(step => step.id === currentStep);
  
  const getStepProgress = (stepId: number) => {
    const stepKey = getStepDataKey(stepId);
    if (!stepKey) return 0;
    const stepData = formData[stepKey] as number[];
    const answered = stepData.filter(answer => answer > 0).length;
    const total = PSYCHOLOGICAL_STEPS.find(s => s.id === stepId)?.questionsCount || 8;
    return (answered / total) * 100;
  };

  const overallProgress = implementedSteps.reduce((sum, step) => {
    return sum + (getStepProgress(step.id) / implementedSteps.length);
  }, 0);

  // ============================================================================
  // HELPERS
  // ============================================================================

  const getStepDataKey = (stepId: number): keyof PsychologicalFormData | null => {
    switch (stepId) {
      case 1: return 'openness';
      case 2: return 'conscientiousness';
      case 3: return 'extraversion';
      case 4: return 'agreeableness';
      case 5: return 'neuroticism';
      case 6: return 'discVark';
      case 7: return 'mtcWoodFire';
      case 8: return 'mtcEarthMetalWater';
      default: return null;
    }
  };

  const getCurrentStepData = () => {
    const stepKey = getStepDataKey(currentStep);
    return stepKey ? formData[stepKey] as number[] : [];
  };

  // ============================================================================
  // RENDER DOS STEPS
  // ============================================================================

  const renderCurrentStep = () => {
    const stepData = getCurrentStepData();
    const stepKey = getStepDataKey(currentStep);
    
    if (!stepKey) return <div>Step não implementado</div>;

    const stepProps = {
      data: stepData,
      onDataChange: (data: number[]) => handleStepDataChange(stepKey, data),
      onNext: handleNextStep,
      onPrevious: handlePreviousStep,
      onStepComplete: handleStepComplete
    };

    switch (currentStep) {
      case 1:
        return <Step1_Openness {...stepProps} />;
      case 2:
        return <Step2_Conscientiousness {...stepProps} />;
      case 3:
        return <Step3_Extraversion {...stepProps} />;
      case 4:
        return <Step4_Agreeableness {...stepProps} />;
      case 5:
        return <Step5_Neuroticism {...stepProps} />;
      case 6:
        return <Step6_DiscVark {...stepProps} />;
      case 7:
        return <Step7_MtcWoodFire {...stepProps} />;
      case 8:
        return <Step8_MtcEarthMetalWater {...stepProps} />;
      default:
        return <div>Step não encontrado</div>;
    }
  };

  // ============================================================================
  // RENDER PRINCIPAL
  // ============================================================================

  if (showTransition) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mx-auto"></div>
          <div className="text-white text-xl">
            Preparando próximo step...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header com progresso */}
      <div className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Progress geral */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-white font-bold text-lg flex items-center">
                <Brain className="w-6 h-6 mr-2 text-purple-400" />
                Avaliação Psicológica Completa
              </h1>
              <span className="text-slate-300 text-sm">
                {Math.round(overallProgress)}% concluído
              </span>
            </div>
            <div className="bg-slate-800 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-700"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>

          {/* Step atual */}
          {currentStepConfig && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{currentStepConfig.icon}</span>
                <div>
                  <h2 className="text-white font-medium">
                    Step {currentStep}/8: {currentStepConfig.title}
                  </h2>
                  <p className="text-slate-400 text-sm">
                    {currentStepConfig.subtitle}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-bold">
                  {Math.round(getStepProgress(currentStep))}%
                </div>
                <div className="text-slate-400 text-xs">
                  ~{currentStepConfig.estimatedTime} min
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="p-6">
        {renderCurrentStep()}
      </div>

      {/* Footer com navegação */}
      {onBack && (
        <div className="sticky bottom-0 bg-slate-900/80 backdrop-blur-sm border-t border-slate-700/50 p-4">
          <div className="max-w-4xl mx-auto flex justify-between">
            <button
              onClick={onBack}
              className="flex items-center px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Menu
            </button>
            
            {/* Resumo do progresso */}
            <div className="text-center">
              <div className="text-purple-400 font-bold text-lg">
                96 Questões
              </div>
              <div className="text-slate-400 text-sm">
                Sistema Mais Completo do Mundo
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PsychologicalForm;