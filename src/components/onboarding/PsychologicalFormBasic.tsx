// src/components/onboarding/PsychologicalFormBasic.tsx - VERSÃO BÁSICA FUNCIONAL
import React, { useState, useCallback } from 'react';
import { 
  Brain, ChevronRight, ChevronLeft, CheckCircle, AlertCircle, 
  User, Heart, Zap, Target, Users
} from 'lucide-react';

// ============================================================================
// INTERFACES E TIPOS
// ============================================================================

interface PsychologicalFormProps {
  onComplete: (data: PsychologicalData) => Promise<void>;
  onBack?: () => void;
  initialData?: PsychologicalData;
  onStepChange?: (step: number) => void;
  onDataUpdate?: (data: PsychologicalData) => void;
}

interface PsychologicalStep {
  id: number;
  title: string;
  icon: any;
  description: string;
  questions: number;
  estimatedTime: number;
}

interface PsychologicalData {
  bigFive: {
    openness: number;          // Abertura a experiências
    conscientiousness: number; // Conscienciosidade  
    extraversion: number;      // Extroversão
    agreeableness: number;     // Amabilidade
    neuroticism: number;       // Neuroticismo
  };
  workStyle: {
    teamwork: number;
    leadership: number;
    independence: number;
    innovation: number;
  };
  communication: {
    directness: number;
    empathy: number;
    conflictResolution: number;
    publicSpeaking: number;
  };
  motivation: {
    achievement: number;
    recognition: number;
    autonomy: number;
    purpose: number;
  };
  stressResponse: {
    pressureHandling: number;
    adaptability: number;
    resilience: number;
    workLifeBalance: number;
  };
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

const PsychologicalFormBasic: React.FC<PsychologicalFormProps> = ({ 
  onComplete, 
  onBack, 
  initialData,
  onStepChange,
  onDataUpdate 
}) => {
  // 📊 ESTADOS DO FORMULÁRIO
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<PsychologicalData>(() => {
    const initial = getInitialFormData();
    return initialData ? { ...initial, ...initialData } : initial;
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🎯 CONFIGURAÇÃO DOS STEPS
  const steps: PsychologicalStep[] = [
    { 
      id: 1, 
      title: 'Personalidade', 
      icon: User, 
      description: 'Big Five - Traços fundamentais',
      questions: 5,
      estimatedTime: 5
    },
    { 
      id: 2, 
      title: 'Trabalho', 
      icon: Target, 
      description: 'Estilo de trabalho e liderança',
      questions: 4,
      estimatedTime: 4
    },
    { 
      id: 3, 
      title: 'Comunicação', 
      icon: Users, 
      description: 'Habilidades interpessoais',
      questions: 4,
      estimatedTime: 4
    },
    { 
      id: 4, 
      title: 'Motivação', 
      icon: Zap, 
      description: 'O que te move e inspira',
      questions: 4,
      estimatedTime: 4
    },
    { 
      id: 5, 
      title: 'Estresse', 
      icon: Heart, 
      description: 'Resposta a pressão e mudanças',
      questions: 4,
      estimatedTime: 3
    }
  ];

  // 🔧 FUNÇÃO INICIAL DOS DADOS
  function getInitialFormData(): PsychologicalData {
    return {
      bigFive: {
        openness: 5,
        conscientiousness: 5,
        extraversion: 5,
        agreeableness: 5,
        neuroticism: 5
      },
      workStyle: {
        teamwork: 5,
        leadership: 5,
        independence: 5,
        innovation: 5
      },
      communication: {
        directness: 5,
        empathy: 5,
        conflictResolution: 5,
        publicSpeaking: 5
      },
      motivation: {
        achievement: 5,
        recognition: 5,
        autonomy: 5,
        purpose: 5
      },
      stressResponse: {
        pressureHandling: 5,
        adaptability: 5,
        resilience: 5,
        workLifeBalance: 5
      }
    };
  }

  // 🔧 FUNÇÕES UTILITÁRIAS
  const updateField = useCallback((path: string, value: number) => {
    setFormData(prev => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current = newData as any;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      
      onDataUpdate?.(newData);
      
      return newData;
    });
  }, [onDataUpdate]);

  const validateStep = (step: number): boolean => {
    return true; // Para versão básica, aceitar qualquer valor
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      onStepChange?.(nextStep);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      onStepChange?.(prevStep);
    } else {
      onBack?.();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onComplete(formData);
    } catch (error) {
      console.error('Erro ao submeter formulário psicológico:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================================================
  // FUNÇÕES DE RENDERIZAÇÃO DOS STEPS
  // ============================================================================

  const renderBigFiveStep = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <User className="w-16 h-16 text-purple-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900">Traços de Personalidade</h2>
        <p className="text-gray-600 mt-2">Como você se vê? Responda intuitivamente</p>
      </div>

      <div className="space-y-6">
        {[
          { key: 'openness', label: 'Abertura a novas experiências', desc: 'Curioso, criativo, aventureiro' },
          { key: 'conscientiousness', label: 'Organização e disciplina', desc: 'Planejado, responsável, pontual' },
          { key: 'extraversion', label: 'Energia social', desc: 'Sociável, falante, energético' },
          { key: 'agreeableness', label: 'Cooperação e confiança', desc: 'Amigável, compassivo, cooperativo' },
          { key: 'neuroticism', label: 'Estabilidade emocional', desc: 'Calmo, confiante, resistente ao estresse' }
        ].map((trait) => (
          <div key={trait.key} className="bg-purple-50 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{trait.label}</h3>
                <p className="text-sm text-gray-600">{trait.desc}</p>
              </div>
              <span className="text-2xl font-bold text-purple-600">
                {formData.bigFive[trait.key as keyof typeof formData.bigFive]}/10
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={formData.bigFive[trait.key as keyof typeof formData.bigFive]}
              onChange={(e) => updateField(`bigFive.${trait.key}`, Number(e.target.value))}
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Baixo</span>
              <span>Alto</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderWorkStyleStep = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <Target className="w-16 h-16 text-blue-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900">Estilo de Trabalho</h2>
        <p className="text-gray-600 mt-2">Como você prefere trabalhar?</p>
      </div>

      <div className="space-y-6">
        {[
          { key: 'teamwork', label: 'Trabalho em equipe', desc: 'Prefere colaborar e trabalhar com outros' },
          { key: 'leadership', label: 'Liderança', desc: 'Gosta de liderar projetos e pessoas' },
          { key: 'independence', label: 'Independência', desc: 'Prefere trabalhar de forma autônoma' },
          { key: 'innovation', label: 'Inovação', desc: 'Busca constantemente novas formas de fazer' }
        ].map((trait) => (
          <div key={trait.key} className="bg-blue-50 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{trait.label}</h3>
                <p className="text-sm text-gray-600">{trait.desc}</p>
              </div>
              <span className="text-2xl font-bold text-blue-600">
                {formData.workStyle[trait.key as keyof typeof formData.workStyle]}/10
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={formData.workStyle[trait.key as keyof typeof formData.workStyle]}
              onChange={(e) => updateField(`workStyle.${trait.key}`, Number(e.target.value))}
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Pouco</span>
              <span>Muito</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCommunicationStep = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <Users className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900">Comunicação</h2>
        <p className="text-gray-600 mt-2">Como você se relaciona com outras pessoas?</p>
      </div>

      <div className="space-y-6">
        {[
          { key: 'directness', label: 'Comunicação direta', desc: 'Fala de forma clara e objetiva' },
          { key: 'empathy', label: 'Empatia', desc: 'Compreende facilmente os sentimentos dos outros' },
          { key: 'conflictResolution', label: 'Resolução de conflitos', desc: 'Habilidade para mediar e resolver problemas' },
          { key: 'publicSpeaking', label: 'Falar em público', desc: 'Conforto para apresentações e palestras' }
        ].map((trait) => (
          <div key={trait.key} className="bg-green-50 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{trait.label}</h3>
                <p className="text-sm text-gray-600">{trait.desc}</p>
              </div>
              <span className="text-2xl font-bold text-green-600">
                {formData.communication[trait.key as keyof typeof formData.communication]}/10
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={formData.communication[trait.key as keyof typeof formData.communication]}
              onChange={(e) => updateField(`communication.${trait.key}`, Number(e.target.value))}
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Baixo</span>
              <span>Alto</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMotivationStep = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <Zap className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900">Motivação</h2>
        <p className="text-gray-600 mt-2">O que te inspira e energiza?</p>
      </div>

      <div className="space-y-6">
        {[
          { key: 'achievement', label: 'Conquista de resultados', desc: 'Motivado por atingir metas e objetivos' },
          { key: 'recognition', label: 'Reconhecimento', desc: 'Valoriza feedback positivo e visibilidade' },
          { key: 'autonomy', label: 'Autonomia', desc: 'Importante ter liberdade e controle sobre o trabalho' },
          { key: 'purpose', label: 'Propósito', desc: 'Precisa sentir que o trabalho tem significado' }
        ].map((trait) => (
          <div key={trait.key} className="bg-yellow-50 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{trait.label}</h3>
                <p className="text-sm text-gray-600">{trait.desc}</p>
              </div>
              <span className="text-2xl font-bold text-yellow-600">
                {formData.motivation[trait.key as keyof typeof formData.motivation]}/10
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={formData.motivation[trait.key as keyof typeof formData.motivation]}
              onChange={(e) => updateField(`motivation.${trait.key}`, Number(e.target.value))}
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Pouco importante</span>
              <span>Muito importante</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStressStep = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <Heart className="w-16 h-16 text-red-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900">Gestão de Estresse</h2>
        <p className="text-gray-600 mt-2">Como você lida com pressão e mudanças?</p>
      </div>

      <div className="space-y-6">
        {[
          { key: 'pressureHandling', label: 'Trabalho sob pressão', desc: 'Mantém performance mesmo com prazos apertados' },
          { key: 'adaptability', label: 'Adaptabilidade', desc: 'Facilidade para se ajustar a mudanças' },
          { key: 'resilience', label: 'Resiliência', desc: 'Capacidade de se recuperar de adversidades' },
          { key: 'workLifeBalance', label: 'Equilíbrio vida-trabalho', desc: 'Consegue separar trabalho da vida pessoal' }
        ].map((trait) => (
          <div key={trait.key} className="bg-red-50 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{trait.label}</h3>
                <p className="text-sm text-gray-600">{trait.desc}</p>
              </div>
              <span className="text-2xl font-bold text-red-600">
                {formData.stressResponse[trait.key as keyof typeof formData.stressResponse]}/10
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={formData.stressResponse[trait.key as keyof typeof formData.stressResponse]}
              onChange={(e) => updateField(`stressResponse.${trait.key}`, Number(e.target.value))}
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Dificuldade</span>
              <span>Facilidade</span>
            </div>
          </div>
        ))}
      </div>

      {/* Resumo Final */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border border-purple-200 mt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
          <CheckCircle className="w-5 h-5 mr-2 text-purple-600" />
          Avaliação Psicológica Completa!
        </h3>
        <p className="text-gray-700">
          Seus dados psicológicos serão analisados para gerar insights sobre sua personalidade, 
          estilo de trabalho, comunicação, motivações e gestão de estresse.
        </p>
      </div>
    </div>
  );

  // Renderizar step atual
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderBigFiveStep();
      case 2:
        return renderWorkStyleStep();
      case 3:
        return renderCommunicationStep();
      case 4:
        return renderMotivationStep();
      case 5:
        return renderStressStep();
      default:
        return <div>Step não encontrado</div>;
    }
  };

  const currentStepInfo = steps[currentStep - 1];
  const isValid = validateStep(currentStep);
  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header com progresso */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Avaliação Psicológica</h1>
            <span className="text-sm text-gray-600">
              {currentStep} de {steps.length}
            </span>
          </div>
          
          {/* Barra de Progresso */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Info do Step Atual */}
          <div className="flex items-center space-x-3">
            <currentStepInfo.icon className="w-6 h-6 text-purple-600" />
            <div>
              <h3 className="font-medium text-gray-900">{currentStepInfo.title}</h3>
              <p className="text-sm text-gray-600">{currentStepInfo.description}</p>
            </div>
            <div className="ml-auto text-sm text-gray-500">
              ⏱️ ~{currentStepInfo.estimatedTime} min
            </div>
          </div>
        </div>

        {/* Conteúdo do Step */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          {renderCurrentStep()}
        </div>

        {/* Navegação */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevious}
              className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              {currentStep === 1 ? 'Voltar' : 'Anterior'}
            </button>

            <div className="flex items-center space-x-4">
              {/* Indicador de Validação */}
              <div className="flex items-center text-green-600">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span className="text-sm">Pronto para avançar</span>
              </div>

              <button
                onClick={handleNext}
                disabled={!isValid || isSubmitting}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
                  isValid && !isSubmitting
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  'Processando...'
                ) : currentStep < steps.length ? (
                  <>
                    Próximo
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  'Finalizar Avaliação'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PsychologicalFormBasic;