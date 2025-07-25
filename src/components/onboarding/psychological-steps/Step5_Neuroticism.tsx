// src/components/onboarding/psychological-steps/Step5_Neuroticism.tsx
// ============================================================================
// STEP 5: NEUROTICISMO (Big Five)
// ============================================================================

import React, { useState, useCallback } from 'react';
import { ChevronRight, ChevronLeft, Zap, Shield, Brain, TrendingUp } from 'lucide-react';
import { QuestionCardWithScale } from './ScaleSystem';

// ============================================================================
// INTERFACES
// ============================================================================

interface StepProps {
  data: number[];
  onDataChange: (data: number[]) => Promise<void>;
  onNext: () => Promise<void>;
  onPrevious: () => void;
  onStepComplete?: () => void;
}

interface NeuroticismQuestion {
  id: number;
  text: string;
  hint?: string;
  reversed?: boolean;
}

// ============================================================================
// QUESTÕES DO BIG FIVE - NEUROTICISMO
// ============================================================================

const NEUROTICISM_QUESTIONS: NeuroticismQuestion[] = [
  {
    id: 1,
    text: "Eu me preocupo excessivamente com coisas que podem dar errado.",
    hint: "Reflita sobre sua tendência a antecipar problemas e cenários negativos."
  },
  {
    id: 2,
    text: "Eu mantenho a calma mesmo em situações muito estressantes.",
    hint: "Pense na sua reação natural diante de pressão e urgência.",
    reversed: true
  },
  {
    id: 3,
    text: "Eu sinto ansiedade ou nervosismo com frequência.",
    hint: "Considere a frequência com que você experimenta tensão interna."
  },
  {
    id: 4,
    text: "Pequenos contratempos conseguem arruinar meu humor por horas.",
    hint: "Avalie como você reage a frustrações menores do dia a dia."
  },
  {
    id: 5,
    text: "Eu me recupero rapidamente de decepções e fracassos.",
    hint: "Reflita sobre sua resiliência emocional diante de adversidades.",
    reversed: true
  },
  {
    id: 6,
    text: "Eu tendo a ser muito autocrítico com meus erros e falhas.",
    hint: "Pense na forma como você avalia e julga suas próprias imperfeições."
  },
  {
    id: 7,
    text: "Eu raramente me sinto triste ou deprimido.",
    hint: "Considere a frequência de estados emocionais negativos em sua vida.",
    reversed: true
  },
  {
    id: 8,
    text: "Eu sinto que as emoções me dominam mais do que eu gostaria.",
    hint: "Avalie sua sensação de controle sobre suas reações emocionais."
  }
];

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

const Step5_Neuroticism: React.FC<StepProps> = ({
  data,
  onDataChange,
  onNext,
  onPrevious,
  onStepComplete
}) => {
  // Estados locais
  const [answers, setAnswers] = useState<number[]>(data || new Array(8).fill(0));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // ============================================================================
  // FUNÇÕES DE NAVEGAÇÃO
  // ============================================================================

  const handleAnswerChange = useCallback(async (questionIndex: number, value: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = value;
    setAnswers(newAnswers);
    
    // Salvar automaticamente
    await onDataChange(newAnswers);
    
    // Auto-avançar para próxima questão (se não for a última)
    if (questionIndex < NEUROTICISM_QUESTIONS.length - 1 && value > 0) {
      setTimeout(() => {
        setCurrentQuestion(questionIndex + 1);
      }, 800);
    }
    
    // Verificar se step está completo
    if (newAnswers.every(answer => answer > 0) && onStepComplete) {
      onStepComplete();
    }
  }, [answers, onDataChange, onStepComplete]);

  const goToQuestion = (index: number) => {
    if (index >= 0 && index < NEUROTICISM_QUESTIONS.length) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentQuestion(index);
        setIsAnimating(false);
      }, 150);
    }
  };

  const handleNext = async () => {
    const allAnswered = answers.every(answer => answer > 0);
    if (allAnswered) {
      await onNext();
    }
  };

  // ============================================================================
  // CÁLCULOS E VALIDAÇÕES
  // ============================================================================

  const progress = (answers.filter(answer => answer > 0).length / NEUROTICISM_QUESTIONS.length) * 100;
  const isComplete = answers.every(answer => answer > 0);
  const canProceed = isComplete;

  // Calcular score de neuroticismo (com questões reversas)
  const calculateNeuroticismScore = () => {
    if (!isComplete) return 0;
    
    let totalScore = 0;
    answers.forEach((answer, index) => {
      const question = NEUROTICISM_QUESTIONS[index];
      const score = question.reversed ? (6 - answer) : answer;
      totalScore += score;
    });
    
    // Converter para escala 0-100
    return Math.round((totalScore / 40) * 100);
  };

  const neuroticismScore = calculateNeuroticismScore();

  // Interpretação do score (invertida: menor score = maior estabilidade)
  const getScoreInterpretation = (score: number) => {
    if (score >= 80) return { 
      level: "Alta Sensibilidade", 
      desc: "Emocionalmente muito sensível e reativo", 
      color: "red",
      type: "ALTAMENTE SENSÍVEL",
      stability: "Baixa Estabilidade"
    };
    if (score >= 65) return { 
      level: "Sensibilidade Moderada", 
      desc: "Reações emocionais intensas ocasionais", 
      color: "orange",
      type: "MODERADAMENTE SENSÍVEL",
      stability: "Estabilidade Moderada"
    };
    if (score >= 50) return { 
      level: "Equilibrio Emocional", 
      desc: "Balanço entre sensibilidade e estabilidade", 
      color: "yellow",
      type: "EQUILIBRADO",
      stability: "Estabilidade Balanceada"
    };
    if (score >= 35) return { 
      level: "Boa Estabilidade", 
      desc: "Geralmente calmo e resiliente", 
      color: "green",
      type: "ESTÁVEL",
      stability: "Boa Estabilidade"
    };
    return { 
      level: "Alta Estabilidade", 
      desc: "Extremamente calmo e emocionalmente estável", 
      color: "emerald",
      type: "MUITO ESTÁVEL",
      stability: "Estabilidade Excelente"
    };
  };

  const interpretation = getScoreInterpretation(neuroticismScore);

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="space-y-6">
      {/* Header do Step */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-full p-3">
            <Zap className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">
          Neuroticismo
        </h2>
        <p className="text-slate-300 text-lg max-w-2xl mx-auto">
          Como você lida com estresse, emoções intensas e adversidades?
        </p>
        
        {/* Barra de Progresso */}
        <div className="mt-6 max-w-md mx-auto">
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-400 text-sm">Progresso do Step</span>
            <span className="text-slate-400 text-sm">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-red-500 to-pink-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Score atual (se completo) */}
        {isComplete && (
          <div className="mt-4 p-4 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-xl border border-red-500/30">
            <div className="flex items-center justify-center space-x-3 mb-2">
              <Brain className="w-5 h-5 text-red-400" />
              <span className="text-white font-medium">
                Seu Score de Neuroticismo: <span className="text-2xl font-bold text-red-300">{neuroticismScore}</span>/100
              </span>
              <Shield className="w-5 h-5 text-pink-400" />
            </div>
            <div className={`text-${interpretation.color}-400 text-sm font-medium`}>
              {interpretation.level}: {interpretation.desc}
            </div>
            <div className="mt-2 text-slate-300 text-xs">
              Perfil: <span className={`font-bold text-${interpretation.color}-300`}>{interpretation.type}</span>
            </div>
            <div className="mt-1 text-slate-400 text-xs">
              {interpretation.stability}
            </div>
          </div>
        )}
      </div>

      {/* Navegação entre questões */}
      <div className="flex items-center justify-center space-x-2 mb-6">
        {NEUROTICISM_QUESTIONS.map((_, index) => (
          <button
            key={index}
            onClick={() => goToQuestion(index)}
            className={`
              w-8 h-8 rounded-full text-sm font-medium transition-all duration-300
              ${index === currentQuestion
                ? 'bg-red-500 text-white scale-110'
                : answers[index] > 0
                ? 'bg-green-500 text-white'
                : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
              }
            `}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Questão Atual */}
      <div className={`transition-opacity duration-150 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
        <QuestionCardWithScale
          questionNumber={currentQuestion + 1}
          questionText={NEUROTICISM_QUESTIONS[currentQuestion].text}
          category="Neuroticismo"
          scaleType="agreement"
          selectedValue={answers[currentQuestion]}
          onValueChange={(value) => handleAnswerChange(currentQuestion, value)}
          hint={NEUROTICISM_QUESTIONS[currentQuestion].hint}
        />
      </div>

      {/* Perfil de estabilidade emocional (se completo) */}
      {isComplete && (
        <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
          <h3 className="text-white font-medium mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 text-red-400 mr-2" />
            Perfil de Estabilidade Emocional
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {interpretation.type === "MUITO ESTÁVEL" && (
              <>
                <div className="flex items-center text-emerald-400">
                  <Shield className="w-4 h-4 mr-2" />
                  <span className="text-sm">Resiliência excepcional</span>
                </div>
                <div className="flex items-center text-green-400">
                  <Brain className="w-4 h-4 mr-2" />
                  <span className="text-sm">Controle emocional alto</span>
                </div>
                <div className="flex items-center text-emerald-400">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  <span className="text-sm">Recuperação rápida</span>
                </div>
                <div className="flex items-center text-green-400">
                  <Zap className="w-4 h-4 mr-2" />
                  <span className="text-sm">Baixa reatividade</span>
                </div>
              </>
            )}
            {interpretation.type === "ESTÁVEL" && (
              <>
                <div className="flex items-center text-green-400">
                  <Shield className="w-4 h-4 mr-2" />
                  <span className="text-sm">Boa resiliência</span>
                </div>
                <div className="flex items-center text-green-400">
                  <Brain className="w-4 h-4 mr-2" />
                  <span className="text-sm">Autocontrole desenvolvido</span>
                </div>
                <div className="flex items-center text-green-400">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  <span className="text-sm">Otimismo natural</span>
                </div>
                <div className="flex items-center text-green-400">
                  <Zap className="w-4 h-4 mr-2" />
                  <span className="text-sm">Calma sob pressão</span>
                </div>
              </>
            )}
            {interpretation.type === "EQUILIBRADO" && (
              <>
                <div className="flex items-center text-yellow-400">
                  <Shield className="w-4 h-4 mr-2" />
                  <span className="text-sm">Resiliência situacional</span>
                </div>
                <div className="flex items-center text-yellow-400">
                  <Brain className="w-4 h-4 mr-2" />
                  <span className="text-sm">Sensibilidade balanceada</span>
                </div>
                <div className="flex items-center text-yellow-400">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  <span className="text-sm">Reações proporcionais</span>
                </div>
                <div className="flex items-center text-yellow-400">
                  <Zap className="w-4 h-4 mr-2" />
                  <span className="text-sm">Adaptabilidade emocional</span>
                </div>
              </>
            )}
            {(interpretation.type === "MODERADAMENTE SENSÍVEL" || interpretation.type === "ALTAMENTE SENSÍVEL") && (
              <>
                <div className="flex items-center text-orange-400">
                  <Shield className="w-4 h-4 mr-2" />
                  <span className="text-sm">Sensibilidade elevada</span>
                </div>
                <div className="flex items-center text-red-400">
                  <Brain className="w-4 h-4 mr-2" />
                  <span className="text-sm">Reações emocionais intensas</span>
                </div>
                <div className="flex items-center text-orange-400">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  <span className="text-sm">Empatia profunda</span>
                </div>
                <div className="flex items-center text-red-400">
                  <Zap className="w-4 h-4 mr-2" />
                  <span className="text-sm">Alta reatividade</span>
                </div>
              </>
            )}
          </div>
          
          {/* Dicas de desenvolvimento */}
          <div className="mt-4 p-3 bg-slate-700/30 rounded-lg">
            <h4 className="text-slate-300 text-sm font-medium mb-2">💡 Insights para Desenvolvimento:</h4>
            <div className="text-slate-400 text-xs">
              {neuroticismScore >= 65 && "Considere técnicas de mindfulness, respiração e terapia para maior equilíbrio emocional."}
              {neuroticismScore >= 50 && neuroticismScore < 65 && "Seu equilíbrio emocional é bom. Continue desenvolvendo estratégias de autorregulação."}
              {neuroticismScore < 50 && "Sua estabilidade emocional é um ponto forte. Use-a para apoiar outros em momentos difíceis."}
            </div>
          </div>
        </div>
      )}

      {/* Navegação entre questões */}
      <div className="flex items-center justify-between pt-6">
        <button
          onClick={() => goToQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
          className={`
            flex items-center px-4 py-2 rounded-lg transition-colors
            ${currentQuestion === 0
              ? 'text-slate-500 cursor-not-allowed'
              : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }
          `}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Questão Anterior
        </button>

        <div className="text-slate-400 text-sm">
          Questão {currentQuestion + 1} de {NEUROTICISM_QUESTIONS.length}
        </div>

        <button
          onClick={() => goToQuestion(Math.min(NEUROTICISM_QUESTIONS.length - 1, currentQuestion + 1))}
          disabled={currentQuestion === NEUROTICISM_QUESTIONS.length - 1}
          className={`
            flex items-center px-4 py-2 rounded-lg transition-colors
            ${currentQuestion === NEUROTICISM_QUESTIONS.length - 1
              ? 'text-slate-500 cursor-not-allowed'
              : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }
          `}
        >
          Próxima Questão
          <ChevronRight className="w-4 h-4 ml-2" />
        </button>
      </div>

      {/* Botões de navegação do step */}
      <div className="flex items-center justify-between pt-8 border-t border-slate-700">
        <button
          onClick={onPrevious}
          className="flex items-center px-6 py-3 text-slate-300 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Step Anterior
        </button>

        <div className="text-center">
          <div className="text-slate-400 text-sm mb-1">
            {answers.filter(a => a > 0).length} de {NEUROTICISM_QUESTIONS.length} questões respondidas
          </div>
          {!canProceed && (
            <div className="text-amber-400 text-xs">
              ⚠️ Responda todas as questões para continuar
            </div>
          )}
          {isComplete && (
            <div className="text-green-400 text-xs">
              🎉 Big Five completo! Próximo: DISC + VARK
            </div>
          )}
        </div>

        <button
          onClick={handleNext}
          disabled={!canProceed}
          className={`
            flex items-center px-6 py-3 rounded-lg font-medium transition-all
            ${canProceed
              ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:shadow-lg hover:scale-105'
              : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            }
          `}
        >
          Próximo Step
          <ChevronRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default Step5_Neuroticism;