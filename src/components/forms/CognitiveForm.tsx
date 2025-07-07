// =============================================================================
// COGNITIVE FORM COMPONENT - NEOSAPIENS - VERSÃO CORRIGIDA
// =============================================================================
// Componente: Formulário de Avaliação Cognitiva (60 questões em 6 steps)
// Versão: 1.1 - Corrigida
// Data: 2025-01-03

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  Circle, 
  Brain,
  BookOpen,
  Zap,
  Target,
  Lightbulb,
  Gauge,
  Timer,
  RotateCcw
} from 'lucide-react';
import { useCognitiveForm } from '../../hooks/useCognitiveForm';
import { CognitiveData } from '../../services/cognitiveService';

// =============================================================================
// COMPONENTES DE QUESTÕES POR STEP
// =============================================================================

// STEP 1: ESTILOS DE APRENDIZAGEM
const LearningStylesStep: React.FC<{
  data: Partial<CognitiveData>;
  updateAnswers: (field: keyof CognitiveData, answers: number[]) => void;
}> = ({ data, updateAnswers }) => {
  
  const visualQuestions = [
    "Prefiro estudar com diagramas e mapas mentais",
    "Aprendo melhor vendo demonstrações visuais",
    "Gosto de usar cores e destaques para organizar informações"
  ];
  
  const auditoryQuestions = [
    "Prefiro ouvir explicações do que ler textos",
    "Aprendo melhor discutindo o conteúdo com outros",
    "Gosto de estudar com música ou sons de fundo"
  ];
  
  const readingQuestions = [
    "Prefiro ler textos detalhados para aprender",
    "Faço muitas anotações e resumos escritos",
    "Aprendo melhor fazendo listas e esquemas textuais"
  ];
  
  const kinestheticQuestions = [
    "Preciso me mover ou usar as mãos enquanto estudo",
    "Aprendo melhor fazendo atividades práticas",
    "Prefiro experimentar do que apenas ouvir teorias"
  ];

  const renderQuestionGroup = (
    title: string,
    questions: string[],
    field: keyof CognitiveData,
    icon: React.ReactNode
  ) => (
    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
      <div className="flex items-center gap-3 mb-4">
        {icon}
        <h3 className="text-lg font-medium text-white">{title}</h3>
      </div>
      
      {questions.map((question, index) => (
        <div key={index} className="mb-4">
          <p className="text-white/90 mb-2">{question}</p>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((value) => (
              <button
                key={value}
                onClick={() => {
                  const currentAnswers = [...(data[field] || [])];
                  currentAnswers[index] = value;
                  updateAnswers(field, currentAnswers);
                }}
                className={`px-3 py-2 rounded-lg border transition-all ${
                  (data[field] || [])[index] === value
                    ? 'bg-blue-500 border-blue-400 text-white'
                    : 'border-white/20 text-white/70 hover:border-white/40'
                }`}
              >
                {value === 1 ? 'Nunca' : value === 2 ? 'Às vezes' : value === 3 ? 'Frequente' : 'Sempre'}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">🧠 Estilos de Aprendizagem</h2>
        <p className="text-white/70">Como você melhor absorve e processa informações?</p>
      </div>

      {renderQuestionGroup("📊 Visual", visualQuestions, 'visual_learning', <Target className="w-5 h-5 text-blue-400" />)}
      {renderQuestionGroup("🎧 Auditivo", auditoryQuestions, 'auditory_learning', <Gauge className="w-5 h-5 text-green-400" />)}
      {renderQuestionGroup("📖 Leitura/Escrita", readingQuestions, 'reading_learning', <BookOpen className="w-5 h-5 text-purple-400" />)}
      {renderQuestionGroup("🤸 Cinestésico", kinestheticQuestions, 'kinesthetic_learning', <Zap className="w-5 h-5 text-orange-400" />)}
    </div>
  );
};

// STEP 2: PROCESSAMENTO COGNITIVO
const ProcessingStylesStep: React.FC<{
  data: Partial<CognitiveData>;
  updateAnswers: (field: keyof CognitiveData, answers: number[]) => void;
}> = ({ data, updateAnswers }) => {
  
  const sequentialQuestions = [
    "Prefiro instruções passo a passo bem detalhadas",
    "Trabalho melhor com cronogramas e estruturas definidas",
    "Prefiro completar uma tarefa antes de começar outra"
  ];
  
  const holisticQuestions = [
    "Prefiro ver o panorama geral antes dos detalhes",
    "Trabalho bem com múltiplos projetos simultaneamente"
  ];
  
  const analyticalQuestions = [
    "Preciso de dados e evidências para tomar decisões",
    "Prefiro quebrar problemas complexos em partes menores",
    "Gosto de analisar prós e contras detalhadamente"
  ];
  
  const intuitiveQuestions = [
    "Confio na minha intuição para resolver problemas",
    "Frequentemente tenho insights súbitos sobre situações"
  ];

  const renderQuestionGroup = (
    title: string,
    questions: string[],
    field: keyof CognitiveData,
    color: string
  ) => (
    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
      <h3 className={`text-lg font-medium mb-4 ${color}`}>{title}</h3>
      {questions.map((question, index) => (
        <div key={index} className="mb-4">
          <p className="text-white/90 mb-2">{question}</p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                onClick={() => {
                  const currentAnswers = [...(data[field] || [])];
                  currentAnswers[index] = value;
                  updateAnswers(field, currentAnswers);
                }}
                className={`px-3 py-1 rounded border transition-all ${
                  (data[field] || [])[index] === value
                    ? 'bg-blue-500 border-blue-400 text-white'
                    : 'border-white/20 text-white/70 hover:border-white/40'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-xs text-white/50 mt-1">
            <span>Discordo</span>
            <span>Concordo</span>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">🧮 Processamento Cognitivo</h2>
        <p className="text-white/70">Como sua mente organiza e processa informações?</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          {renderQuestionGroup("📋 Sequencial", sequentialQuestions, 'sequential_processing', 'text-blue-400')}
          {renderQuestionGroup("🔍 Analítico", analyticalQuestions, 'analytical_thinking', 'text-green-400')}
        </div>
        <div className="space-y-6">
          {renderQuestionGroup("🌐 Holístico", holisticQuestions, 'holistic_processing', 'text-purple-400')}
          {renderQuestionGroup("💫 Intuitivo", intuitiveQuestions, 'intuitive_thinking', 'text-orange-400')}
        </div>
      </div>
    </div>
  );
};

// STEP 3: CRIATIVIDADE & INOVAÇÃO
const CreativityStep: React.FC<{
  data: Partial<CognitiveData>;
  updateAnswers: (field: keyof CognitiveData, answers: number[]) => void;
}> = ({ data, updateAnswers }) => {
  
  const creativityQuestions = [
    "Frequentemente tenho ideias originais e inovadoras",
    "Gosto de encontrar soluções não convencionais",
    "Me sinto confortável pensando 'fora da caixa'",
    "Tenho facilidade para conectar ideias aparentemente desconexas"
  ];
  
  const problemSolvingQuestions = [
    "Abordo problemas de múltiplas perspectivas",
    "Persistindo quando enfrento desafios complexos",
    "Costumo encontrar padrões em situações complexas",
    "Tenho facilidade para gerar várias alternativas de solução"
  ];

  const renderQuestionGroup = (
    title: string,
    questions: string[],
    field: keyof CognitiveData,
    icon: React.ReactNode,
    color: string
  ) => (
    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
      <div className="flex items-center gap-3 mb-4">
        {icon}
        <h3 className={`text-lg font-medium ${color}`}>{title}</h3>
      </div>
      {questions.map((question, index) => (
        <div key={index} className="mb-4">
          <p className="text-white/90 mb-2">{question}</p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                onClick={() => {
                  const currentAnswers = [...(data[field] || [])];
                  currentAnswers[index] = value;
                  updateAnswers(field, currentAnswers);
                }}
                className={`px-3 py-1 rounded border transition-all ${
                  (data[field] || [])[index] === value
                    ? 'bg-blue-500 border-blue-400 text-white'
                    : 'border-white/20 text-white/70 hover:border-white/40'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">🎨 Criatividade & Inovação</h2>
        <p className="text-white/70">Avalie seus padrões de pensamento criativo e resolução de problemas</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {renderQuestionGroup(
          "Pensamento Criativo", 
          creativityQuestions, 
          'creative_thinking',
          <Lightbulb className="w-5 h-5 text-yellow-400" />,
          'text-yellow-400'
        )}
        {renderQuestionGroup(
          "Resolução de Problemas", 
          problemSolvingQuestions, 
          'problem_solving',
          <Target className="w-5 h-5 text-red-400" />,
          'text-red-400'
        )}
      </div>
    </div>
  );
};

// STEP 4: TOMADA DE DECISÃO
const DecisionMakingStep: React.FC<{
  data: Partial<CognitiveData>;
  updateAnswers: (field: keyof CognitiveData, answers: number[]) => void;
}> = ({ data, updateAnswers }) => {
  
  const rationalQuestions = [
    "Preciso de dados concretos para tomar decisões importantes",
    "Analiso cuidadosamente prós e contras antes de decidir",
    "Prefiro decisões baseadas em lógica do que em sentimentos"
  ];
  
  const emotionalQuestions = [
    "Confio na minha intuição para decisões importantes",
    "Considero como me sinto sobre uma decisão antes de tomá-la"
  ];
  
  const quickQuestions = [
    "Tomo decisões rapidamente quando necessário",
    "Confio na minha primeira impressão sobre situações",
    "Prefiro decidir logo do que ficar pensando muito tempo"
  ];
  
  const deliberativeQuestions = [
    "Gosto de ter tempo para pensar antes de decidir",
    "Consulto outras pessoas antes de decisões importantes"
  ];

  const renderQuestionGroup = (
    title: string,
    questions: string[],
    field: keyof CognitiveData,
    color: string,
    icon: React.ReactNode
  ) => (
    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
      <div className="flex items-center gap-3 mb-4">
        {icon}
        <h3 className={`text-lg font-medium ${color}`}>{title}</h3>
      </div>
      {questions.map((question, index) => (
        <div key={index} className="mb-4">
          <p className="text-white/90 mb-2 text-sm">{question}</p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                onClick={() => {
                  const currentAnswers = [...(data[field] || [])];
                  currentAnswers[index] = value;
                  updateAnswers(field, currentAnswers);
                }}
                className={`px-3 py-1 rounded border transition-all ${
                  (data[field] || [])[index] === value
                    ? 'bg-blue-500 border-blue-400 text-white'
                    : 'border-white/20 text-white/70 hover:border-white/40'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-xs text-white/50 mt-1">
            <span>Discordo</span>
            <span>Concordo</span>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">⚖️ Tomada de Decisão</h2>
        <p className="text-white/70">Como você processa escolhas e toma decisões?</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          {renderQuestionGroup(
            "Racional", 
            rationalQuestions, 
            'rational_decisions',
            'text-blue-400',
            <Brain className="w-5 h-5 text-blue-400" />
          )}
          {renderQuestionGroup(
            "Rápido", 
            quickQuestions, 
            'quick_decisions',
            'text-green-400',
            <Zap className="w-5 h-5 text-green-400" />
          )}
        </div>
        <div className="space-y-6">
          {renderQuestionGroup(
            "Emocional", 
            emotionalQuestions, 
            'emotional_decisions',
            'text-purple-400',
            <Target className="w-5 h-5 text-purple-400" />
          )}
          {renderQuestionGroup(
            "Deliberativo", 
            deliberativeQuestions, 
            'deliberative_decisions',
            'text-orange-400',
            <Timer className="w-5 h-5 text-orange-400" />
          )}
        </div>
      </div>
    </div>
  );
};

// STEP 5: FUNÇÕES EXECUTIVAS
const ExecutiveFunctionsStep: React.FC<{
  data: Partial<CognitiveData>;
  updateAnswers: (field: keyof CognitiveData, answers: number[]) => void;
}> = ({ data, updateAnswers }) => {
  
  const planningQuestions = [
    "Faço planos detalhados antes de começar projetos importantes",
    "Tenho facilidade para organizar tarefas em ordem de prioridade",
    "Consigo estimar bem o tempo necessário para completar atividades",
    "Mantenho agendas e listas organizadas regularmente"
  ];
  
  const focusQuestions = [
    "Consigo me concentrar por longos períodos em uma tarefa",
    "Não me distraio facilmente com ruídos ou movimento ao redor",
    "Termino tarefas mesmo quando elas se tornam entediantes",
    "Mantenho atenção aos detalhes importantes em projetos"
  ];
  
  const flexibilityQuestions = [
    "Me adapto facilmente quando planos precisam mudar",
    "Consigo alternar entre diferentes tarefas sem dificuldade",
    "Aceito bem feedback e modifico minha abordagem quando necessário",
    "Encontro soluções alternativas quando algo não funciona"
  ];

  const renderQuestionGroup = (
    title: string,
    questions: string[],
    field: keyof CognitiveData,
    color: string,
    icon: React.ReactNode
  ) => (
    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
      <div className="flex items-center gap-3 mb-4">
        {icon}
        <h3 className={`text-lg font-medium ${color}`}>{title}</h3>
      </div>
      {questions.map((question, index) => (
        <div key={index} className="mb-4">
          <p className="text-white/90 mb-2 text-sm">{question}</p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                onClick={() => {
                  const currentAnswers = [...(data[field] || [])];
                  currentAnswers[index] = value;
                  updateAnswers(field, currentAnswers);
                }}
                className={`px-3 py-1 rounded border transition-all ${
                  (data[field] || [])[index] === value
                    ? 'bg-blue-500 border-blue-400 text-white'
                    : 'border-white/20 text-white/70 hover:border-white/40'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-xs text-white/50 mt-1">
            <span>Nunca</span>
            <span>Sempre</span>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">🎯 Funções Executivas</h2>
        <p className="text-white/70">Avalie suas capacidades de planejamento, foco e organização</p>
      </div>

      <div className="space-y-6">
        {renderQuestionGroup(
          "Planejamento & Organização", 
          planningQuestions, 
          'planning_organization',
          'text-blue-400',
          <Target className="w-5 h-5 text-blue-400" />
        )}
        {renderQuestionGroup(
          "Foco & Atenção", 
          focusQuestions, 
          'focus_attention',
          'text-green-400',
          <Brain className="w-5 h-5 text-green-400" />
        )}
        {renderQuestionGroup(
          "Flexibilidade Cognitiva", 
          flexibilityQuestions, 
          'cognitive_flexibility',
          'text-purple-400',
          <RotateCcw className="w-5 h-5 text-purple-400" />
        )}
      </div>
    </div>
  );
};

// STEP 6: TESTES COGNITIVOS SIMPLIFICADOS (placeholder)
const CognitiveTestsStep: React.FC<{
  data: Partial<CognitiveData>;
  updateAnswers: (field: keyof CognitiveData, answers: number[]) => void;
}> = ({ data, updateAnswers }) => {
  
  // Simulação simples dos testes - na implementação real seria interativo
  const handleTestComplete = (testType: keyof CognitiveData, score: number) => {
    const currentAnswers = [...(data[testType] || [])];
    currentAnswers.push(score);
    updateAnswers(testType, currentAnswers);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">🧪 Testes Cognitivos</h2>
        <p className="text-white/70">Testes práticos das suas capacidades mentais</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-medium text-blue-400 mb-4">🧠 Teste de Memória</h3>
          <p className="text-white/70 mb-4">Teste simplificado de amplitude de memória</p>
          <button
            onClick={() => handleTestComplete('memory_span', Math.floor(Math.random() * 5) + 3)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Iniciar Teste
          </button>
          {(data.memory_span?.length || 0) > 0 && (
            <p className="text-green-400 mt-2">✅ Teste concluído!</p>
          )}
        </div>

        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-medium text-green-400 mb-4">🔍 Reconhecimento de Padrões</h3>
          <p className="text-white/70 mb-4">Teste de identificação de padrões</p>
          <button
            onClick={() => handleTestComplete('pattern_recognition', Math.floor(Math.random() * 5) + 3)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Iniciar Teste
          </button>
          {(data.pattern_recognition?.length || 0) > 0 && (
            <p className="text-green-400 mt-2">✅ Teste concluído!</p>
          )}
        </div>

        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-medium text-purple-400 mb-4">⚡ Velocidade de Processamento</h3>
          <p className="text-white/70 mb-4">Teste de velocidade de reação</p>
          <button
            onClick={() => handleTestComplete('processing_speed', Math.floor(Math.random() * 2000) + 1000)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            Iniciar Teste
          </button>
          {(data.processing_speed?.length || 0) > 0 && (
            <p className="text-green-400 mt-2">✅ Teste concluído!</p>
          )}
        </div>

        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-medium text-orange-400 mb-4">🔄 Memória de Trabalho</h3>
          <p className="text-white/70 mb-4">Teste de memória de trabalho</p>
          <button
            onClick={() => handleTestComplete('working_memory', Math.floor(Math.random() * 5) + 3)}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
          >
            Iniciar Teste
          </button>
          {(data.working_memory?.length || 0) > 0 && (
            <p className="text-green-400 mt-2">✅ Teste concluído!</p>
          )}
        </div>
      </div>
      
      {[data.memory_span, data.pattern_recognition, data.processing_speed, data.working_memory]
        .every(test => (test?.length || 0) > 0) && (
        <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 text-center">
          <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <p className="text-green-200 font-medium">
            🎉 Todos os testes cognitivos foram concluídos!
          </p>
        </div>
      )}
    </div>
  );
};

// =============================================================================
// COMPONENTE PRINCIPAL
// =============================================================================

const CognitiveForm: React.FC = () => {
  const {
    data,
    currentStep,
    currentStepConfig,
    steps,
    goToStep,
    nextStep,
    previousStep,
    completedSteps,
    overallProgress,
    progressStats,
    canGoNext,
    canFinalize,
    isFirstStep,
    isLastStep,
    isLoading,
    isSaving,
    error,
    updateAnswers,
    saveProgress,
    finalizeCognitiveAssessment
  } = useCognitiveForm();

  const [showSuccess, setShowSuccess] = useState(false);

  // Handler para finalizar avaliação
  const handleFinalize = async () => {
    try {
      const scores = await finalizeCognitiveAssessment();
      if (scores) {
        setShowSuccess(true);
        setTimeout(() => {
          // Redirecionar para resultados ou próxima etapa
          window.location.href = '/analysis';
        }, 2000);
      }
    } catch (error) {
      console.error('Erro ao finalizar:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-16 h-16 text-white/50 animate-pulse mx-auto mb-4" />
          <p className="text-white/70">Carregando avaliação cognitiva...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* HEADER COM PROGRESSO */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-white">⚡ Avaliação Cognitiva</h1>
            <div className="text-right">
              <div className="text-sm text-white/70">Progresso Geral</div>
              <div className="text-xl font-bold text-white">{progressStats.totalProgress}%</div>
            </div>
          </div>
          
          {/* BARRA DE PROGRESSO */}
          <div className="w-full bg-white/10 rounded-full h-3">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressStats.totalProgress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          
          {/* STEPS INDICATOR */}
          <div className="flex justify-between mt-4">
            {steps.map((step) => (
              <button
                key={step.id}
                onClick={() => step.canAccess && goToStep(step.id)}
                className={`flex flex-col items-center p-2 rounded-lg transition-all ${
                  step.id === currentStep
                    ? 'bg-white/10 text-white'
                    : step.completed
                    ? 'text-green-400 hover:bg-white/5'
                    : step.canAccess
                    ? 'text-white/50 hover:bg-white/5'
                    : 'text-white/20 cursor-not-allowed'
                }`}
                disabled={!step.canAccess}
              >
                {step.completed ? (
                  <CheckCircle className="w-6 h-6 mb-1" />
                ) : (
                  <Circle className="w-6 h-6 mb-1" />
                )}
                <span className="text-xs">{step.emoji}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ERRO */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {/* CONTEÚDO DO STEP ATUAL */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10"
          >
            {currentStep === 1 && <LearningStylesStep data={data} updateAnswers={updateAnswers} />}
            {currentStep === 2 && <ProcessingStylesStep data={data} updateAnswers={updateAnswers} />}
            {currentStep === 3 && <CreativityStep data={data} updateAnswers={updateAnswers} />}
            {currentStep === 4 && <DecisionMakingStep data={data} updateAnswers={updateAnswers} />}
            {currentStep === 5 && <ExecutiveFunctionsStep data={data} updateAnswers={updateAnswers} />}
            {currentStep === 6 && <CognitiveTestsStep data={data} updateAnswers={updateAnswers} />}
          </motion.div>
        </AnimatePresence>

        {/* NAVEGAÇÃO */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={previousStep}
            disabled={isFirstStep}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
              isFirstStep
                ? 'bg-white/5 text-white/30 cursor-not-allowed'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            Anterior
          </button>

          <div className="text-center">
            <div className="text-white/70 text-sm">
              {currentStepConfig?.title}
            </div>
            <div className="text-white/50 text-xs">
              {currentStepConfig?.estimatedTime}
            </div>
          </div>

          {isLastStep ? (
            <button
              onClick={handleFinalize}
              disabled={!canFinalize || isSaving}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
                canFinalize && !isSaving
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-white/5 text-white/30 cursor-not-allowed'
              }`}
            >
              {isSaving ? 'Finalizando...' : 'Finalizar'}
              <CheckCircle className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={nextStep}
              disabled={!canGoNext}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
                canGoNext
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-white/5 text-white/30 cursor-not-allowed'
              }`}
            >
              Próximo
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* AUTO-SAVE INDICATOR */}
        {isSaving && (
          <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg">
            💾 Salvando...
          </div>
        )}

        {/* SUCCESS MODAL */}
        {showSuccess && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                🎉 Avaliação Cognitiva Concluída!
              </h3>
              <p className="text-gray-600">
                Redirecionando para o hub de análises...
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CognitiveForm;