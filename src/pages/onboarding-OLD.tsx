// src/pages/onboarding.tsx - Integração do BiohackingForm
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { User, Calendar, Activity, Brain, CheckCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import BirthDataForm from '../components/onboarding/BirthDataForm';
import BiohackingForm from '../components/onboarding/BiohackingForm';
import { BiohackingData } from '../types/biohacking';

// Tipos para os diferentes formulários
interface PersonalData {
  fullName: string;
  email: string;
  gender?: string;
  birthDate: string;
}

interface BirthData {
  fullName: string;
  birthDate: string;
  birthTime: string;
  hasExactTime: boolean;
  birthPlace: string;
  coordinates: { lat: number; lng: number; } | null;
  timezone: string;
}

// Estados do onboarding
type OnboardingStep = 'personal' | 'birth' | 'biohacking' | 'cognitive' | 'complete';

interface OnboardingState {
  currentStep: OnboardingStep;
  completedSteps: OnboardingStep[];
  personalData?: PersonalData;
  birthData?: BirthData;
  biohackingData?: BiohackingData;
  cognitiveData?: any; // Para implementar futuramente
}

const OnboardingPage: React.FC = () => {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const [onboardingState, setOnboardingState] = useState<OnboardingState>({
    currentStep: 'personal',
    completedSteps: []
  });
  
  const [isLoading, setIsLoading] = useState(true);

  // Verificar autenticação
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/auth/login');
        return;
      }
      setIsLoading(false);
    }
  }, [user, authLoading, router]);

  // Carregar progresso existente do usuário
  useEffect(() => {
    if (user?.id) {
      loadUserProgress();
    }
  }, [user?.id]);

  const loadUserProgress = async () => {
    try {
      // Implementar carregamento do progresso do Supabase
      // Por enquanto, começar do início
      setOnboardingState(prev => ({
        ...prev,
        currentStep: 'birth' // Começar com dados de nascimento por agora
      }));
    } catch (error) {
      console.error('Erro ao carregar progresso:', error);
    }
  };

  // Navegação entre steps
  const goToStep = (step: OnboardingStep) => {
    setOnboardingState(prev => ({
      ...prev,
      currentStep: step
    }));
  };

  const markStepComplete = (step: OnboardingStep) => {
    setOnboardingState(prev => ({
      ...prev,
      completedSteps: [...prev.completedSteps.filter(s => s !== step), step]
    }));
  };

  // Handlers para cada formulário
  const handlePersonalDataComplete = (data: PersonalData) => {
    setOnboardingState(prev => ({
      ...prev,
      personalData: data
    }));
    markStepComplete('personal');
    goToStep('birth');
  };

  const handleBirthDataComplete = (data: BirthData) => {
    setOnboardingState(prev => ({
      ...prev,
      birthData: data
    }));
    markStepComplete('birth');
    goToStep('biohacking');
  };

  const handleBiohackingComplete = (data: BiohackingData) => {
    setOnboardingState(prev => ({
      ...prev,
      biohackingData: data
    }));
    markStepComplete('biohacking');
    goToStep('cognitive');
  };

  const handleCognitiveComplete = (data: any) => {
    setOnboardingState(prev => ({
      ...prev,
      cognitiveData: data
    }));
    markStepComplete('cognitive');
    goToStep('complete');
  };

  const handleGoBack = () => {
    const steps: OnboardingStep[] = ['personal', 'birth', 'biohacking', 'cognitive', 'complete'];
    const currentIndex = steps.indexOf(onboardingState.currentStep);
    
    if (currentIndex > 0) {
      goToStep(steps[currentIndex - 1]);
    } else {
      router.push('/'); // Voltar para a home
    }
  };

  const handleOnboardingComplete = () => {
    // Redirecionar para dashboard ou próxima etapa
    router.push('/dashboard');
  };

  // Configuração dos steps
  const steps = [
    { 
      id: 'personal', 
      title: 'Dados Pessoais', 
      icon: User, 
      description: 'Informações básicas sobre você',
      completed: onboardingState.completedSteps.includes('personal')
    },
    { 
      id: 'birth', 
      title: 'Dados de Nascimento', 
      icon: Calendar, 
      description: 'Data, hora e local de nascimento',
      completed: onboardingState.completedSteps.includes('birth')
    },
    { 
      id: 'biohacking', 
      title: 'Avaliação Biohacking', 
      icon: Activity, 
      description: 'Sono, nutrição e atividade física',
      completed: onboardingState.completedSteps.includes('biohacking')
    },
    { 
      id: 'cognitive', 
      title: 'Perfil Cognitivo', 
      icon: Brain, 
      description: 'Aprendizado, foco e criatividade',
      completed: onboardingState.completedSteps.includes('cognitive')
    }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === onboardingState.currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando seu perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      
      {/* Header com Progresso Geral */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Configuração do Seu Perfil</h1>
            <span className="text-sm text-gray-600">
              {Math.round(progress)}% Concluído
            </span>
          </div>
          
          {/* Barra de Progresso Geral */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Navegação de Steps */}
          <div className="flex justify-between">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex flex-col items-center cursor-pointer transition-all ${
                  onboardingState.currentStep === step.id 
                    ? 'text-blue-600 scale-105' 
                    : step.completed 
                    ? 'text-green-600' 
                    : 'text-gray-400'
                }`}
                onClick={() => step.completed && goToStep(step.id as OnboardingStep)}
              >
                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center mb-2 ${
                  step.completed
                    ? 'bg-green-600 border-green-600 text-white'
                    : onboardingState.currentStep === step.id
                    ? 'border-blue-600 bg-blue-50 text-blue-600'
                    : 'border-gray-300 text-gray-400'
                }`}>
                  {step.completed ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <span className="text-xs font-medium text-center leading-tight max-w-20">
                  {step.title}
                </span>
                <span className="text-xs text-gray-500 text-center mt-1 hidden md:block">
                  {step.description}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Conteúdo do Step Atual */}
      <div className="flex-1">
        {onboardingState.currentStep === 'personal' && (
          <div className="max-w-2xl mx-auto p-8">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <User className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Dados Pessoais</h2>
              <p className="text-gray-600 mb-8">
                Este step será implementado em breve. Por enquanto, vamos direto para os dados de nascimento.
              </p>
              <button
                onClick={() => goToStep('birth')}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continuar para Dados de Nascimento
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        )}

        {onboardingState.currentStep === 'birth' && (
          <BirthDataForm
            onComplete={handleBirthDataComplete}
            onBack={handleGoBack}
            initialData={onboardingState.birthData}
          />
        )}

        {onboardingState.currentStep === 'biohacking' && (
          <BiohackingForm
            onComplete={handleBiohackingComplete}
            onBack={handleGoBack}
            initialData={onboardingState.biohackingData}
            onStepChange={(step) => console.log('Biohacking step:', step)}
            onDataUpdate={(data) => console.log('Biohacking data update:', data)}
          />
        )}

        {onboardingState.currentStep === 'cognitive' && (
          <div className="max-w-2xl mx-auto p-8">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <Brain className="w-16 h-16 text-purple-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Perfil Cognitivo</h2>
              <p className="text-gray-600 mb-8">
                A avaliação cognitiva será implementada em breve. Incluirá questionários sobre aprendizado, 
                foco, criatividade e estilo cognitivo.
              </p>
              <div className="space-y-4">
                <button
                  onClick={handleGoBack}
                  className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Voltar
                </button>
                <button
                  onClick={() => handleCognitiveComplete({})}
                  className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Pular por Enquanto e Finalizar
                </button>
              </div>
            </div>
          </div>
        )}

        {onboardingState.currentStep === 'complete' && (
          <div className="max-w-2xl mx-auto p-8">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Perfil Configurado!</h2>
              <p className="text-gray-600 mb-8">
                Parabéns! Você concluiu a configuração do seu perfil. Agora você pode acessar 
                suas análises personalizadas e seu plano de desenvolvimento.
              </p>
              
              {/* Resumo dos dados coletados */}
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Dados Coletados:</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-blue-600 mr-2" />
                    <span>Dados de Nascimento</span>
                    {onboardingState.completedSteps.includes('birth') && (
                      <CheckCircle className="w-4 h-4 text-green-600 ml-auto" />
                    )}
                  </div>
                  <div className="flex items-center">
                    <Activity className="w-4 h-4 text-green-600 mr-2" />
                    <span>Avaliação Biohacking</span>
                    {onboardingState.completedSteps.includes('biohacking') && (
                      <CheckCircle className="w-4 h-4 text-green-600 ml-auto" />
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={handleOnboardingComplete}
                className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
              >
                Acessar Meu Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingPage;