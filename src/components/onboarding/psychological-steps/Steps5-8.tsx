// ============================================================================
// Steps5-8.tsx - FORMULÁRIO PSICOLÓGICO LIMPO E FUNCIONAL
// Versão completamente reescrita sem erros
// ============================================================================

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft, 
  Brain, 
  Users, 
  Eye,
  Headphones,
  BookOpen,
  Activity,
  Shield,
  Target,
  Heart,
  Zap,
  Mountain,
  Waves,
  Flame
} from 'lucide-react';

// ============================================================================
// INTERFACES
// ============================================================================

interface StepProps {
  data: number[];
  onDataChange: (data: number[]) => void;
  onNext: () => void;
  onPrevious: () => void;
  onStepComplete?: () => void;
}

interface Question {
  id: number;
  text: string;
  icon?: React.ComponentType<any>;
  color?: string;
  type?: string;
}

interface TabData {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  color: string;
  questions: Question[];
  startIndex: number;
  count: number;
}

// ============================================================================
// STEP 6: DISC + VARK (COM ABAS FUNCIONAIS)
// ============================================================================

export const Step6_DiscVark: React.FC<StepProps> = ({
  data = [],
  onDataChange,
  onNext,
  onPrevious,
  onStepComplete
}) => {
  const [answers, setAnswers] = useState<number[]>(() => {
    return data && data.length === 24 ? data : new Array(24).fill(0);
  });

  const [activeTab, setActiveTab] = useState<string>('disc');

  // Dados das abas
  const tabsData: TabData[] = useMemo(() => [
    {
      id: 'disc',
      title: 'Perfil DISC',
      icon: Users,
      color: 'indigo',
      startIndex: 0,
      count: 16,
      questions: [
        // Dominance (D) - 4 questões
        { id: 1, text: "Gosto de liderar e tomar decisões rapidamente", color: "from-red-500 to-red-600", type: "D" },
        { id: 2, text: "Prefiro enfrentar desafios de forma direta e assertiva", color: "from-red-500 to-red-600", type: "D" },
        { id: 3, text: "Sou competitivo e gosto de estar no controle", color: "from-red-500 to-red-600", type: "D" },
        { id: 4, text: "Aceito riscos calculados para alcançar resultados", color: "from-red-500 to-red-600", type: "D" },
        
        // Influence (I) - 4 questões
        { id: 5, text: "Gosto de trabalhar com pessoas e construir relacionamentos", color: "from-yellow-500 to-orange-500", type: "I" },
        { id: 6, text: "Sou otimista e entusiasmado com novos projetos", color: "from-yellow-500 to-orange-500", type: "I" },
        { id: 7, text: "Prefiro persuadir através de carisma e empatia", color: "from-yellow-500 to-orange-500", type: "I" },
        { id: 8, text: "Gosto de ambientes colaborativos e dinâmicos", color: "from-yellow-500 to-orange-500", type: "I" },
        
        // Steadiness (S) - 4 questões
        { id: 9, text: "Valorizo estabilidade e prefiro mudanças graduais", color: "from-green-600 to-teal-600", type: "S" },
        { id: 10, text: "Gosto de ajudar outros e trabalhar em harmonia", color: "from-green-600 to-teal-600", type: "S" },
        { id: 11, text: "Prefiro ouvir antes de falar e evitar conflitos", color: "from-green-600 to-teal-600", type: "S" },
        { id: 12, text: "Sou paciente e gosto de processos bem estruturados", color: "from-green-600 to-teal-600", type: "S" },
        
        // Compliance (C) - 4 questões
        { id: 13, text: "Valorizo precisão, qualidade e atenção aos detalhes", color: "from-blue-600 to-indigo-600", type: "C" },
        { id: 14, text: "Prefiro analisar dados e fatos antes de tomar decisões", color: "from-blue-600 to-indigo-600", type: "C" },
        { id: 15, text: "Gosto de seguir procedimentos e padrões estabelecidos", color: "from-blue-600 to-indigo-600", type: "C" },
        { id: 16, text: "Prefiro trabalhar independentemente com foco na qualidade", color: "from-blue-600 to-indigo-600", type: "C" }
      ]
    },
    {
      id: 'vark',
      title: 'Estilo VARK',
      icon: Brain,
      color: 'purple',
      startIndex: 16,
      count: 8,
      questions: [
        { id: 17, text: "Aprendo melhor quando posso ver gráficos, diagramas e imagens", color: "from-purple-500 to-violet-500", type: "V" },
        { id: 18, text: "Prefiro mapas mentais e esquemas visuais para organizar informações", color: "from-purple-500 to-violet-500", type: "V" },
        { id: 19, text: "Aprendo melhor ouvindo explicações e discussões", color: "from-indigo-500 to-blue-500", type: "A" },
        { id: 20, text: "Prefiro gravar aulas ou conversar sobre o conteúdo", color: "from-indigo-500 to-blue-500", type: "A" },
        { id: 21, text: "Aprendo melhor lendo textos e fazendo anotações escritas", color: "from-emerald-500 to-green-500", type: "R" },
        { id: 22, text: "Prefiro listas, resumos e material escrito bem organizado", color: "from-emerald-500 to-green-500", type: "R" },
        { id: 23, text: "Aprendo melhor fazendo, praticando e experimentando", color: "from-orange-500 to-red-500", type: "K" },
        { id: 24, text: "Prefiro atividades práticas e experiências hands-on", color: "from-orange-500 to-red-500", type: "K" }
      ]
    }
  ], []);

  const labels = useMemo(() => [
    "Discordo totalmente",
    "Discordo parcialmente", 
    "Neutro",
    "Concordo parcialmente",
    "Concordo totalmente"
  ], []);

  // Handlers otimizados
  const handleAnswerChange = useCallback((questionIndex: number, value: number) => {
    setAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[questionIndex] = value;
      return newAnswers;
    });
  }, []);

  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId);
  }, []);

  // Calculações memoizadas
  const activeTabData = useMemo(() => {
    return tabsData.find(tab => tab.id === activeTab) || tabsData[0];
  }, [activeTab, tabsData]);

  const getTabProgress = useCallback((tabId: string) => {
    const tab = tabsData.find(t => t.id === tabId);
    if (!tab) return 0;
    
    const tabAnswers = answers.slice(tab.startIndex, tab.startIndex + tab.count);
    const completed = tabAnswers.filter(answer => answer > 0).length;
    return Math.round((completed / tab.count) * 100);
  }, [answers, tabsData]);

  const overallProgress = useMemo(() => {
    const completed = answers.filter(answer => answer > 0).length;
    return Math.round((completed / 24) * 100);
  }, [answers]);

  const isComplete = useMemo(() => {
    return answers.every(answer => answer > 0);
  }, [answers]);

  // Effect para notificar mudanças
  useEffect(() => {
    if (onDataChange) {
      onDataChange(answers);
    }
  }, [answers, onDataChange]);

  // Componente QuestionCard
  const QuestionCard: React.FC<{
    question: Question;
    answer: number;
    onAnswerChange: (value: number) => void;
    globalIndex: number;
  }> = ({ question, answer, onAnswerChange, globalIndex }) => (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/70 transition-all duration-300">
      <div className="flex items-start gap-4 mb-6">
        <div className={`bg-gradient-to-r ${question.color} rounded-lg p-2 flex-shrink-0`}>
          <span className="text-white font-bold text-sm">{globalIndex + 1}</span>
        </div>
        <h3 className="text-white text-lg font-medium leading-relaxed">
          {question.text}
        </h3>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              onClick={() => onAnswerChange(value)}
              className={`p-3 rounded-xl border-2 transition-all duration-200 text-sm font-medium ${
                answer === value
                  ? `bg-gradient-to-r ${question.color} text-white shadow-lg scale-105 border-transparent`
                  : 'bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white border-slate-600/50'
              }`}
            >
              {value}
            </button>
          ))}
        </div>
        
        <div className="flex justify-between text-xs text-slate-500">
          {labels.map((label, i) => (
            <span key={i} className="text-center flex-1 px-1">
              {i + 1}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900/20 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className="w-10 h-10 text-indigo-400" />
            <h1 className="text-3xl font-bold text-white">DISC + VARK</h1>
          </div>
          <p className="text-slate-300 text-lg mb-6">
            Seu estilo comportamental e preferência de aprendizagem
          </p>
          
          {/* Progress Bar */}
          <div className="bg-slate-800/50 rounded-full h-3 overflow-hidden mb-4">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <p className="text-sm text-slate-400">
            {overallProgress}% completo • 24 questões
          </p>
        </div>

        {/* Tabs */}
        <div className="flex bg-slate-800/30 rounded-2xl p-2 mb-8">
          {tabsData.map((tab) => {
            const Icon = tab.icon;
            const progress = getTabProgress(tab.id);
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-indigo-500/20 text-indigo-300 border-2 border-indigo-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-medium">{tab.title}</div>
                  <div className="text-xs">{progress}% completo</div>
                </div>
                {progress === 100 && <CheckCircle className="w-4 h-4 text-green-400" />}
              </button>
            );
          })}
        </div>

        {/* Questions */}
        <div className="space-y-6 mb-8">
          {activeTabData.questions.map((question, index) => {
            const globalIndex = activeTabData.startIndex + index;
            return (
              <QuestionCard
                key={question.id}
                question={question}
                answer={answers[globalIndex] || 0}
                onAnswerChange={(value) => handleAnswerChange(globalIndex, value)}
                globalIndex={globalIndex}
              />
            );
          })}
        </div>

        {/* Insights */}
        {overallProgress > 50 && (
          <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-3">
              <Brain className="w-5 h-5 text-indigo-400" />
              <h4 className="text-indigo-300 font-medium">Insights Preliminares</h4>
            </div>
            
            <div className="text-sm text-slate-300 space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p><strong className="text-white">DISC:</strong> {getTabProgress('disc')}% completo</p>
                </div>
                <div>
                  <p><strong className="text-white">VARK:</strong> {getTabProgress('vark')}% completo</p>
                </div>
              </div>
              {isComplete && (
                <p className="text-slate-400 mt-3">
                  ✨ Análise comportamental e de aprendizagem será integrada aos resultados finais
                </p>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={onPrevious}
            className="flex items-center gap-2 px-6 py-3 bg-slate-700/50 hover:bg-slate-600/50 text-white rounded-xl transition-all duration-200 hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4" />
            Neuroticismo
          </button>

          <div className="text-center">
            <p className="text-sm text-slate-400">
              {answers.filter(a => a > 0).length} de 24 questões respondidas
            </p>
            {isComplete && (
              <p className="text-emerald-400 text-sm font-medium mt-1">
                ✓ Seção completa!
              </p>
            )}
          </div>

          <button
            onClick={onNext}
            disabled={!isComplete}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-200 hover:scale-105 ${
              isComplete
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-lg'
                : 'bg-slate-700/30 text-slate-500 cursor-not-allowed'
            }`}
          >
            MTC Elementos
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// STEP 7: MTC PARTE 1 (YIN/YANG, MADEIRA, FOGO)
// ============================================================================

export const Step7_MtcWoodFire: React.FC<StepProps> = ({
  data = [],
  onDataChange,
  onNext,
  onPrevious,
  onStepComplete
}) => {
  const [answers, setAnswers] = useState<number[]>(() => {
    return data && data.length === 24 ? data : new Array(24).fill(0);
  });

  const [activeTab, setActiveTab] = useState<string>('yinyang');

  const tabsData: TabData[] = useMemo(() => [
    {
      id: 'yinyang',
      title: 'Yin & Yang',
      icon: Zap,
      color: 'indigo',
      startIndex: 0,
      count: 8,
      questions: [
        { id: 1, text: "Prefiro atividades mais tranquilas e introspectivas", color: "from-indigo-500 to-purple-500" },
        { id: 2, text: "Gosto de momentos de silêncio e contemplação", color: "from-indigo-500 to-purple-500" },
        { id: 3, text: "Sou mais receptivo e gosto de ouvir os outros", color: "from-indigo-500 to-purple-500" },
        { id: 4, text: "Prefiro ambientes mais reservados e íntimos", color: "from-indigo-500 to-purple-500" },
        { id: 5, text: "Gosto de ação, movimento e atividades dinâmicas", color: "from-orange-500 to-red-500" },
        { id: 6, text: "Sou mais expressivo e extrovertido", color: "from-orange-500 to-red-500" },
        { id: 7, text: "Prefiro liderar e tomar iniciativas", color: "from-orange-500 to-red-500" },
        { id: 8, text: "Gosto de ambientes estimulantes e cheios de energia", color: "from-orange-500 to-red-500" }
      ]
    },
    {
      id: 'wood',
      title: 'Madeira',
      icon: Mountain,
      color: 'green',
      startIndex: 8,
      count: 8,
      questions: [
        { id: 9, text: "Sinto irritação ou raiva com facilidade", color: "from-green-500 to-emerald-500" },
        { id: 10, text: "Tenho dificuldade para perdoar mágoas", color: "from-green-500 to-emerald-500" },
        { id: 11, text: "Fico frustrado quando as coisas não saem como planejado", color: "from-green-500 to-emerald-500" },
        { id: 12, text: "Sinto tensão muscular, especialmente no pescoço e ombros", color: "from-green-500 to-emerald-500" },
        { id: 13, text: "Tenho problemas digestivos ou dores de cabeça frequentes", color: "from-green-500 to-emerald-500" },
        { id: 14, text: "Acordo frequentemente entre 1h e 3h da madrugada", color: "from-green-500 to-emerald-500" },
        { id: 15, text: "Sou muito determinado e gosto de ter controle", color: "from-green-500 to-emerald-500" },
        { id: 16, text: "Tenho visão clara dos meus objetivos e planos", color: "from-green-500 to-emerald-500" }
      ]
    },
    {
      id: 'fire',
      title: 'Fogo',
      icon: Flame,
      color: 'red',
      startIndex: 16,
      count: 8,
      questions: [
        { id: 17, text: "Sinto ansiedade ou agitação mental frequente", color: "from-red-500 to-orange-500" },
        { id: 18, text: "Tenho dificuldade para relaxar e descansar a mente", color: "from-red-500 to-orange-500" },
        { id: 19, text: "Sou muito empático e absorvo as emoções dos outros", color: "from-red-500 to-orange-500" },
        { id: 20, text: "Tenho palpitações ou sensação de calor excessivo", color: "from-red-500 to-orange-500" },
        { id: 21, text: "Falo rápido ou tenho insônia ocasional", color: "from-red-500 to-orange-500" },
        { id: 22, text: "Acordo frequentemente entre 23h e 1h da madrugada", color: "from-red-500 to-orange-500" },
        { id: 23, text: "Sou comunicativo e gosto de estar com pessoas", color: "from-red-500 to-orange-500" },
        { id: 24, text: "Tenho muita alegria e entusiasmo pela vida", color: "from-red-500 to-orange-500" }
      ]
    }
  ], []);

  const handleAnswerChange = useCallback((questionIndex: number, value: number) => {
    setAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[questionIndex] = value;
      return newAnswers;
    });
  }, []);

  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId);
  }, []);

  const activeTabData = useMemo(() => {
    return tabsData.find(tab => tab.id === activeTab) || tabsData[0];
  }, [activeTab, tabsData]);

  const getTabProgress = useCallback((tabId: string) => {
    const tab = tabsData.find(t => t.id === tabId);
    if (!tab) return 0;
    
    const tabAnswers = answers.slice(tab.startIndex, tab.startIndex + tab.count);
    const completed = tabAnswers.filter(answer => answer > 0).length;
    return Math.round((completed / tab.count) * 100);
  }, [answers, tabsData]);

  const overallProgress = useMemo(() => {
    const completed = answers.filter(answer => answer > 0).length;
    return Math.round((completed / 24) * 100);
  }, [answers]);

  const isComplete = useMemo(() => {
    return answers.every(answer => answer > 0);
  }, [answers]);

  useEffect(() => {
    if (onDataChange) {
      onDataChange(answers);
    }
  }, [answers, onDataChange]);

  const labels = useMemo(() => [
    "Nunca",
    "Raramente", 
    "Às vezes",
    "Frequentemente",
    "Sempre"
  ], []);

  const QuestionCard: React.FC<{
    question: Question;
    answer: number;
    onAnswerChange: (value: number) => void;
    globalIndex: number;
  }> = ({ question, answer, onAnswerChange, globalIndex }) => (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/70 transition-all duration-300">
      <div className="flex items-start gap-4 mb-6">
        <div className={`bg-gradient-to-r ${question.color} rounded-lg p-2 flex-shrink-0`}>
          <span className="text-white font-bold text-sm">{globalIndex + 1}</span>
        </div>
        <h3 className="text-white text-lg font-medium leading-relaxed">
          {question.text}
        </h3>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              onClick={() => onAnswerChange(value)}
              className={`p-3 rounded-xl border-2 transition-all duration-200 text-sm font-medium ${
                answer === value
                  ? `bg-gradient-to-r ${question.color} text-white shadow-lg scale-105 border-transparent`
                  : 'bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white border-slate-600/50'
              }`}
            >
              {value}
            </button>
          ))}
        </div>
        
        <div className="flex justify-between text-xs text-slate-500">
          {labels.map((label, i) => (
            <span key={i} className="text-center flex-1 px-1">
              {i + 1}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900/20 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="w-10 h-10 text-green-400" />
            <h1 className="text-3xl font-bold text-white">MTC - Parte 1</h1>
          </div>
          <p className="text-slate-300 text-lg mb-6">
            Medicina Tradicional Chinesa: Yin/Yang, Madeira e Fogo
          </p>
          
          <div className="bg-slate-800/50 rounded-full h-3 overflow-hidden mb-4">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-red-500 transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <p className="text-sm text-slate-400">
            {overallProgress}% completo • 24 questões
          </p>
        </div>

        <div className="flex bg-slate-800/30 rounded-2xl p-2 mb-8">
          {tabsData.map((tab) => {
            const Icon = tab.icon;
            const progress = getTabProgress(tab.id);
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-green-500/20 text-green-300 border-2 border-green-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-medium">{tab.title}</div>
                  <div className="text-xs">{progress}% completo</div>
                </div>
                {progress === 100 && <CheckCircle className="w-4 h-4 text-green-400" />}
              </button>
            );
          })}
        </div>

        <div className="space-y-6 mb-8">
          {activeTabData.questions.map((question, index) => {
            const globalIndex = activeTabData.startIndex + index;
            return (
              <QuestionCard
                key={question.id}
                question={question}
                answer={answers[globalIndex] || 0}
                onAnswerChange={(value) => handleAnswerChange(globalIndex, value)}
                globalIndex={globalIndex}
              />
            );
          })}
        </div>

        {overallProgress > 30 && (
          <div className="bg-gradient-to-r from-green-500/10 to-red-500/10 border border-green-500/20 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-3">
              <Heart className="w-5 h-5 text-green-400" />
              <h4 className="text-green-300 font-medium">Insights Energéticos</h4>
            </div>
            
            <div className="text-sm text-slate-300 space-y-2">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p><strong className="text-white">Yin/Yang:</strong> {getTabProgress('yinyang')}%</p>
                </div>
                <div>
                  <p><strong className="text-white">Madeira:</strong> {getTabProgress('wood')}%</p>
                </div>
                <div>
                  <p><strong className="text-white">Fogo:</strong> {getTabProgress('fire')}%</p>
                </div>
              </div>
              {isComplete && (
                <p className="text-slate-400 mt-3">
                  🔥 Perfil energético está se formando! Próxima etapa: Terra, Metal e Água
                </p>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center">
          <button
            onClick={onPrevious}
            className="flex items-center gap-2 px-6 py-3 bg-slate-700/50 hover:bg-slate-600/50 text-white rounded-xl transition-all duration-200 hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4" />
            DISC + VARK
          </button>

          <div className="text-center">
            <p className="text-sm text-slate-400">
              {answers.filter(a => a > 0).length} de 24 questões respondidas
            </p>
            {isComplete && (
              <p className="text-emerald-400 text-sm font-medium mt-1">
                ✓ Energias mapeadas!
              </p>
            )}
          </div>

          <button
            onClick={onNext}
            disabled={!isComplete}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-200 hover:scale-105 ${
              isComplete
                ? 'bg-gradient-to-r from-green-500 to-red-500 text-white hover:shadow-lg'
                : 'bg-slate-700/30 text-slate-500 cursor-not-allowed'
            }`}
          >
            MTC Parte 2
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// STEP 8: MTC PARTE 2 (TERRA, METAL, ÁGUA)
// ============================================================================

export const Step8_MtcEarthMetalWater: React.FC<StepProps> = ({
  data = [],
  onDataChange,
  onNext,
  onPrevious,
  onStepComplete
}) => {
  const [answers, setAnswers] = useState<number[]>(() => {
    return data && data.length === 16 ? data : new Array(16).fill(0);
  });

  const [activeTab, setActiveTab] = useState<string>('earth');

  const tabsData: TabData[] = useMemo(() => [
    {
      id: 'earth',
      title: 'Terra',
      icon: Mountain,
      color: 'yellow',
      startIndex: 0,
      count: 5,
      questions: [
        { id: 1, text: "Tenho tendência a me preocupar excessivamente", color: "from-yellow-500 to-orange-500" },
        { id: 2, text: "Fico ruminando pensamentos na minha mente", color: "from-yellow-500 to-orange-500" },
        { id: 3, text: "Sinto desconforto digestivo após refeições", color: "from-yellow-500 to-orange-500" },
        { id: 4, text: "Acordo frequentemente entre 7h e 9h da manhã indisposto", color: "from-yellow-500 to-orange-500" },
        { id: 5, text: "Gosto de cuidar e nutrir as pessoas ao meu redor", color: "from-yellow-500 to-orange-500" }
      ]
    },
    {
      id: 'metal',
      title: 'Metal',
      icon: Shield,
      color: 'gray',
      startIndex: 5,
      count: 5,
      questions: [
        { id: 6, text: "Sinto tristeza ou melancolia com frequência", color: "from-gray-400 to-slate-500" },
        { id: 7, text: "Tenho dificuldade para 'soltar' pessoas ou situações", color: "from-gray-400 to-slate-500" },
        { id: 8, text: "Problemas respiratórios ou alergias recorrentes", color: "from-gray-400 to-slate-500" },
        { id: 9, text: "Acordo frequentemente entre 3h e 5h da madrugada", color: "from-gray-400 to-slate-500" },
        { id: 10, text: "Valorizo qualidade, ordem e precisão em tudo", color: "from-gray-400 to-slate-500" }
      ]
    },
    {
      id: 'water',
      title: 'Água',
      icon: Waves,
      color: 'blue',
      startIndex: 10,
      count: 6,
      questions: [
        { id: 11, text: "Sinto medos ou inseguranças que me paralisam", color: "from-blue-500 to-cyan-500" },
        { id: 12, text: "Tenho falta de força de vontade ou determinação", color: "from-blue-500 to-cyan-500" },
        { id: 13, text: "Problemas urinários ou dores na região lombar", color: "from-blue-500 to-cyan-500" },
        { id: 14, text: "Fadiga crônica ou baixa energia vital", color: "from-blue-500 to-cyan-500" },
        { id: 15, text: "Acordo frequentemente entre 17h e 19h indisposto", color: "from-blue-500 to-cyan-500" },
        { id: 16, text: "Sou adaptável e prefiro fluir com as mudanças", color: "from-blue-500 to-cyan-500" }
      ]
    }
  ], []);

  const handleAnswerChange = useCallback((questionIndex: number, value: number) => {
    setAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[questionIndex] = value;
      return newAnswers;
    });
  }, []);

  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId);
  }, []);

  const activeTabData = useMemo(() => {
    return tabsData.find(tab => tab.id === activeTab) || tabsData[0];
  }, [activeTab, tabsData]);

  const getTabProgress = useCallback((tabId: string) => {
    const tab = tabsData.find(t => t.id === tabId);
    if (!tab) return 0;
    
    const tabAnswers = answers.slice(tab.startIndex, tab.startIndex + tab.count);
    const completed = tabAnswers.filter(answer => answer > 0).length;
    return Math.round((completed / tab.count) * 100);
  }, [answers, tabsData]);

  const overallProgress = useMemo(() => {
    const completed = answers.filter(answer => answer > 0).length;
    return Math.round((completed / 16) * 100);
  }, [answers]);

  const isComplete = useMemo(() => {
    return answers.every(answer => answer > 0);
  }, [answers]);

  useEffect(() => {
    if (onDataChange) {
      onDataChange(answers);
    }
  }, [answers, onDataChange]);

  useEffect(() => {
    if (isComplete && onStepComplete) {
      onStepComplete();
    }
  }, [isComplete, onStepComplete]);

  const labels = useMemo(() => [
    "Nunca",
    "Raramente", 
    "Às vezes",
    "Frequentemente",
    "Sempre"
  ], []);

  const QuestionCard: React.FC<{
    question: Question;
    answer: number;
    onAnswerChange: (value: number) => void;
    globalIndex: number;
  }> = ({ question, answer, onAnswerChange, globalIndex }) => (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/70 transition-all duration-300">
      <div className="flex items-start gap-4 mb-6">
        <div className={`bg-gradient-to-r ${question.color} rounded-lg p-2 flex-shrink-0`}>
          <span className="text-white font-bold text-sm">{globalIndex + 1}</span>
        </div>
        <h3 className="text-white text-lg font-medium leading-relaxed">
          {question.text}
        </h3>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              onClick={() => onAnswerChange(value)}
              className={`p-3 rounded-xl border-2 transition-all duration-200 text-sm font-medium ${
                answer === value
                  ? `bg-gradient-to-r ${question.color} text-white shadow-lg scale-105 border-transparent`
                  : 'bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white border-slate-600/50'
              }`}
            >
              {value}
            </button>
          ))}
        </div>
        
        <div className="flex justify-between text-xs text-slate-500">
          {labels.map((label, i) => (
            <span key={i} className="text-center flex-1 px-1">
              {i + 1}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Waves className="w-10 h-10 text-blue-400" />
            <h1 className="text-3xl font-bold text-white">MTC - Parte 2</h1>
          </div>
          <p className="text-slate-300 text-lg mb-6">
            Finalizando: Terra, Metal e Água
          </p>
          
          <div className="bg-slate-800/50 rounded-full h-3 overflow-hidden mb-4">
            <div 
              className="h-full bg-gradient-to-r from-yellow-500 to-blue-500 transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <p className="text-sm text-slate-400">
            {overallProgress}% completo • 16 questões • ETAPA FINAL!
          </p>
        </div>

        <div className="flex bg-slate-800/30 rounded-2xl p-2 mb-8">
          {tabsData.map((tab) => {
            const Icon = tab.icon;
            const progress = getTabProgress(tab.id);
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-500/20 text-blue-300 border-2 border-blue-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-medium">{tab.title}</div>
                  <div className="text-xs">{progress}% completo</div>
                </div>
                {progress === 100 && <CheckCircle className="w-4 h-4 text-green-400" />}
              </button>
            );
          })}
        </div>

        <div className="space-y-6 mb-8">
          {activeTabData.questions.map((question, index) => {
            const globalIndex = activeTabData.startIndex + index;
            return (
              <QuestionCard
                key={question.id}
                question={question}
                answer={answers[globalIndex] || 0}
                onAnswerChange={(value) => handleAnswerChange(globalIndex, value)}
                globalIndex={globalIndex}
              />
            );
          })}
        </div>

        {overallProgress > 50 && (
          <div className="bg-gradient-to-r from-yellow-500/10 to-blue-500/10 border border-blue-500/20 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-3">
              <Waves className="w-5 h-5 text-blue-400" />
              <h4 className="text-blue-300 font-medium">Mapeamento Final dos Elementos</h4>
            </div>
            
            <div className="text-sm text-slate-300 space-y-2">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p><strong className="text-white">Terra:</strong> {getTabProgress('earth')}%</p>
                </div>
                <div>
                  <p><strong className="text-white">Metal:</strong> {getTabProgress('metal')}%</p>
                </div>
                <div>
                  <p><strong className="text-white">Água:</strong> {getTabProgress('water')}%</p>
                </div>
              </div>
              {isComplete && (
                <div className="mt-4 p-4 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-xl">
                  <p className="text-emerald-400 font-medium">
                    🎉 AVALIAÇÃO PSICOLÓGICA COMPLETA!
                  </p>
                  <p className="text-slate-300 text-sm mt-1">
                    Todos os elementos foram mapeados. Seu perfil único será gerado com base em 104 questões científicas!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center">
          <button
            onClick={onPrevious}
            className="flex items-center gap-2 px-6 py-3 bg-slate-700/50 hover:bg-slate-600/50 text-white rounded-xl transition-all duration-200 hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4" />
            MTC Parte 1
          </button>

          <div className="text-center">
            <p className="text-sm text-slate-400">
              {answers.filter(a => a > 0).length} de 16 questões respondidas
            </p>
            {isComplete && (
              <p className="text-emerald-400 text-sm font-medium mt-1">
                ✓ AVALIAÇÃO FINALIZADA!
              </p>
            )}
          </div>

          <button
            onClick={onNext}
            disabled={!isComplete}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-200 hover:scale-105 ${
              isComplete
                ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white hover:shadow-lg'
                : 'bg-slate-700/30 text-slate-500 cursor-not-allowed'
            }`}
          >
            Finalizar Avaliação
            <CheckCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  Step6_DiscVark,
  Step7_MtcWoodFire,
  Step8_MtcEarthMetalWater
};