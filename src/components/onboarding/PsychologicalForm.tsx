// src/components/onboarding/PsychologicalFormDebug.tsx - VERSÃO COM DEBUG PARA CAÇAR O BUG

import React, { useState, useEffect } from 'react';
import { Brain, ChevronLeft, ChevronRight, Clock, AlertTriangle } from 'lucide-react';

// Import estático de TODOS os componentes para evitar tree shaking
import Step1_Openness from './psychological-steps/Step1_Openness';
import Step2_Conscientiousness from './psychological-steps/Step2_Conscientiousness';
import Step3_Extraversion from './psychological-steps/Step3_Extraversion';
import Step4_Agreeableness from './psychological-steps/Step4_Agreeableness';
import Step5_Neuroticism from './psychological-steps/Step5_Neuroticism';
import Step6_DiscVark from './psychological-steps/Step6_DiscVark';
import Step7_MtcWoodFire from './psychological-steps/Step7_MtcWoodFire';
import Step8_MtcEarthMetalWater from './psychological-steps/Step8_MtcEarthMetalWater';

interface PsychologicalFormProps {
  onComplete: (data: any) => void;
  onStepChange?: (step: number) => void;
}

interface StepConfig {
  id: number;
  title: string;
  subtitle: string;
  component: React.ComponentType<any>;
  questionsCount: number;
  estimatedTime: number;
  category: string;
}

// CONFIGURAÇÃO FIXA DOS 8 STEPS - NÃO PODE SER ALTERADA!
const STEPS_CONFIG: StepConfig[] = [
  {
    id: 1,
    title: 'Abertura à Experiência',
    subtitle: 'Curiosidade, criatividade e abertura para novas ideias',
    component: Step1_Openness,
    questionsCount: 8,
    estimatedTime: 3,
    category: 'Big Five'
  },
  {
    id: 2,
    title: 'Conscienciosidade',
    subtitle: 'Organização, disciplina e responsabilidade',
    component: Step2_Conscientiousness,
    questionsCount: 8,
    estimatedTime: 3,
    category: 'Big Five'
  },
  {
    id: 3,
    title: 'Extroversão',
    subtitle: 'Sociabilidade, assertividade e energia',
    component: Step3_Extraversion,
    questionsCount: 8,
    estimatedTime: 3,
    category: 'Big Five'
  },
  {
    id: 4,
    title: 'Amabilidade',
    subtitle: 'Cooperação, confiança e empatia',
    component: Step4_Agreeableness,
    questionsCount: 8,
    estimatedTime: 3,
    category: 'Big Five'
  },
  {
    id: 5,
    title: 'Neuroticismo',
    subtitle: 'Estabilidade emocional e gestão do estresse',
    component: Step5_Neuroticism,
    questionsCount: 8,
    estimatedTime: 3,
    category: 'Big Five'
  },
  {
    id: 6,
    title: 'Perfil Comportamental',
    subtitle: 'DISC + Estilo de Aprendizagem VARK',
    component: Step6_DiscVark,
    questionsCount: 24,
    estimatedTime: 8,
    category: 'Comportamental'
  },
  {
    id: 7,
    title: 'Elementos Madeira & Fogo',
    subtitle: 'Medicina Tradicional Chinesa - Crescimento e Comunicação',
    component: Step7_MtcWoodFire,
    questionsCount: 16,
    estimatedTime: 6,
    category: 'MTC'
  },
  {
    id: 8,
    title: 'Elementos Terra, Metal & Água',
    subtitle: 'Medicina Tradicional Chinesa - Estabilidade, Qualidade e Adaptação',
    component: Step8_MtcEarthMetalWater,
    questionsCount: 16,
    estimatedTime: 6,
    category: 'MTC'
  }
];

const PsychologicalFormDebug: React.FC<PsychologicalFormProps> = ({ 
  onComplete, 
  onStepChange 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [debugInfo, setDebugInfo] = useState<any>({});

  // 🚨 DEBUG CRÍTICO - LOGS PARA CAÇAR O BUG
  useEffect(() => {
    console.log('🔍 PSYCHOLOGICAL FORM DEBUG - INICIANDO...');
    console.log('='.repeat(50));
    
    const debugData = {
      environment: window.location.hostname.includes('vercel') ? 'PRODUCTION' : 'LOCAL',
      timestamp: new Date().toISOString(),
      totalStepsConfigured: STEPS_CONFIG.length,
      totalQuestionsConfigured: STEPS_CONFIG.reduce((sum, step) => sum + step.questionsCount, 0),
      componentsImported: {
        Step1_Openness: !!Step1_Openness,
        Step2_Conscientiousness: !!Step2_Conscientiousness,
        Step3_Extraversion: !!Step3_Extraversion,
        Step4_Agreeableness: !!Step4_Agreeableness,
        Step5_Neuroticism: !!Step5_Neuroticism,
        Step6_DiscVark: !!Step6_DiscVark,
        Step7_MtcWoodFire: !!Step7_MtcWoodFire,
        Step8_MtcEarthMetalWater: !!Step8_MtcEarthMetalWater
      }
    };

    console.log('🌍 Ambiente:', debugData.environment);
    console.log('📊 Steps Configurados:', debugData.totalStepsConfigured);
    console.log('❓ Questões Configuradas:', debugData.totalQuestionsConfigured);
    console.log('📋 Componentes Importados:');
    
    Object.entries(debugData.componentsImported).forEach(([name, imported]) => {
      const status = imported ? '✅' : '❌';
      console.log(`  ${status} ${name}: ${imported}`);
    });

    // Verificar se todos os steps têm componentes válidos
    const stepsWithoutComponents = STEPS_CONFIG.filter(step => !step.component);
    if (stepsWithoutComponents.length > 0) {
      console.log('🚨 STEPS SEM COMPONENTES:');
      stepsWithoutComponents.forEach(step => {
        console.log(`  ❌ Step ${step.id}: ${step.title}`);
      });
    }

    console.log('='.repeat(50));
    setDebugInfo(debugData);
  }, []);

  // Log quando mudar de step
  useEffect(() => {
    const currentStepConfig = STEPS_CONFIG.find(s => s.id === currentStep);
    console.log(`🎯 Mudança para Step ${currentStep}:`, currentStepConfig?.title);
    
    if (onStepChange) {
      onStepChange(currentStep);
    }
  }, [currentStep, onStepChange]);

  // Função para avançar step com logs
  const goToNextStep = () => {
    const nextStep = currentStep + 1;
    console.log(`➡️ Avançando do Step ${currentStep} para ${nextStep}`);
    
    if (nextStep <= STEPS_CONFIG.length) {
      setCurrentStep(nextStep);
    } else {
      console.log('🎉 Todos os steps concluídos! Finalizando...');
      handleComplete();
    }
  };

  // Função para voltar step
  const goToPreviousStep = () => {
    const prevStep = currentStep - 1;
    console.log(`⬅️ Voltando do Step ${currentStep} para ${prevStep}`);
    
    if (prevStep >= 1) {
      setCurrentStep(prevStep);
    }
  };

  // Salvar respostas de cada step
  const handleStepComplete = (stepData: any) => {
    console.log(`💾 Salvando dados do Step ${currentStep}:`, stepData);
    
    setResponses(prev => ({
      ...prev,
      [`step${currentStep}`]: stepData
    }));

    // Auto-avançar para próximo step
    setTimeout(() => {
      goToNextStep();
    }, 500);
  };

  // Finalizar formulário
  const handleComplete = () => {
    console.log('🎯 Finalizando formulário psicológico...');
    console.log('📊 Respostas coletadas:', responses);
    
    const totalResponses = Object.keys(responses).length;
    const expectedResponses = STEPS_CONFIG.length;
    
    console.log(`✅ Steps completados: ${totalResponses}/${expectedResponses}`);
    
    if (totalResponses < expectedResponses) {
      console.log('⚠️ ATENÇÃO: Nem todos os steps foram completados!');
    }

    onComplete(responses);
  };

  // Obter configuração do step atual
  const getCurrentStepConfig = (): StepConfig | null => {
    const config = STEPS_CONFIG.find(s => s.id === currentStep);
    if (!config) {
      console.log(`🚨 ERRO: Configuração não encontrada para Step ${currentStep}`);
    }
    return config || null;
  };

  // Renderizar componente do step atual
  const renderCurrentStep = () => {
    const stepConfig = getCurrentStepConfig();
    
    if (!stepConfig) {
      console.log(`🚨 ERRO CRÍTICO: Step ${currentStep} não tem configuração!`);
      return (
        <div className="text-center p-8">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-red-600 mb-2">Erro no Step {currentStep}</h3>
          <p className="text-gray-600">Configuração do step não encontrada.</p>
          <div className="mt-4 p-4 bg-red-50 rounded-lg text-left text-sm">
            <strong>Debug Info:</strong>
            <br />• Step solicitado: {currentStep}
            <br />• Steps disponíveis: {STEPS_CONFIG.map(s => s.id).join(', ')}
            <br />• Total configurado: {STEPS_CONFIG.length}
          </div>
        </div>
      );
    }

    if (!stepConfig.component) {
      console.log(`🚨 ERRO CRÍTICO: Step ${currentStep} não tem componente!`);
      return (
        <div className="text-center p-8">
          <AlertTriangle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-orange-600 mb-2">Componente Não Carregado</h3>
          <p className="text-gray-600">O componente para "{stepConfig.title}" não foi carregado.</p>
          <div className="mt-4 p-4 bg-orange-50 rounded-lg text-left text-sm">
            <strong>Debug Info:</strong>
            <br />• Step: {stepConfig.id} - {stepConfig.title}
            <br />• Componente: {stepConfig.component ? 'Carregado' : 'AUSENTE'}
            <br />• Categoria: {stepConfig.category}
          </div>
        </div>
      );
    }

    const StepComponent = stepConfig.component;
    console.log(`🎨 Renderizando Step ${currentStep}: ${stepConfig.title}`);

    return (
      <StepComponent
        onComplete={handleStepComplete}
        responses={responses[`step${currentStep}`] || {}}
      />
    );
  };

  const currentStepConfig = getCurrentStepConfig();
  const progress = (currentStep / STEPS_CONFIG.length) * 100;
  const totalQuestions = STEPS_CONFIG.reduce((sum, step) => sum + step.questionsCount, 0);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Debug Panel - Só mostra em desenvolvimento */}
      {debugInfo.environment === 'LOCAL' && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-bold text-blue-800 mb-2">🔍 Debug Info</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Ambiente:</strong> {debugInfo.environment}
              <br />
              <strong>Steps:</strong> {STEPS_CONFIG.length}
              <br />
              <strong>Questões:</strong> {totalQuestions}
            </div>
            <div>
              <strong>Step Atual:</strong> {currentStep}/{STEPS_CONFIG.length}
              <br />
              <strong>Progresso:</strong> {progress.toFixed(1)}%
              <br />
              <strong>Componentes:</strong> {Object.values(debugInfo.componentsImported || {}).filter(Boolean).length}/8
            </div>
          </div>
        </div>
      )}

      {/* Header Principal */}
      <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-8 mb-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Avaliação Psicológica</h2>
          <p className="text-slate-300 text-lg">
            Sistema científico completo com {totalQuestions} questões validadas
          </p>
        </div>

        {/* Barra de Progresso Global */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-400">Progresso Geral</span>
            <span className="text-sm text-slate-400">
              Step {currentStep} de {STEPS_CONFIG.length}
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-center mt-2 text-slate-400 text-sm">
            {progress.toFixed(1)}% concluído
          </div>
        </div>

        {/* Info do Step Atual */}
        {currentStepConfig && (
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {currentStepConfig.category}
                  </span>
                  <span className="text-slate-400 text-sm">
                    {currentStepConfig.questionsCount} questões
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white">
                  {currentStepConfig.title}
                </h3>
                <p className="text-slate-300">
                  {currentStepConfig.subtitle}
                </p>
              </div>
              <div className="flex items-center space-x-2 text-slate-400">
                <Clock className="w-4 h-4" />
                <span className="text-sm">~{currentStepConfig.estimatedTime} min</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Conteúdo do Step */}
      <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-8 mb-8">
        {renderCurrentStep()}
      </div>

      {/* Navegação */}
      <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-6">
        <div className="flex items-center justify-between">
          <button
            onClick={goToPreviousStep}
            disabled={currentStep === 1}
            className="flex items-center px-6 py-3 text-slate-300 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Step Anterior
          </button>

          <div className="flex items-center space-x-2">
            {STEPS_CONFIG.map((step) => (
              <div
                key={step.id}
                className={`w-3 h-3 rounded-full transition-all ${
                  step.id === currentStep
                    ? 'bg-purple-500 w-8'
                    : step.id < currentStep
                    ? 'bg-green-500'
                    : 'bg-slate-600'
                }`}
              />
            ))}
          </div>

          <button
            onClick={goToNextStep}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all"
          >
            {currentStep === STEPS_CONFIG.length ? 'Finalizar' : 'Próximo Step'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PsychologicalFormDebug;