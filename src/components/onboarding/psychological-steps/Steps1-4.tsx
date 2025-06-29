// ============================================================================
// STEP COMPONENTS PARTE 1: Steps 1-4 (Big Five)
// ============================================================================
// Arquivo: src/components/onboarding/psychological-steps/Steps1-4.tsx
// ============================================================================

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { CheckCircle, ArrowRight, ArrowLeft, Lightbulb, Focus, Users, Heart } from 'lucide-react';
import { useScrollToTop } from '@/hooks/useScrollToTop';

// ============================================================================
// INTERFACES COMPARTILHADAS
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
  category?: string;
}

// ============================================================================
// COMPONENTE: Question Card Reutilizável
// ============================================================================

const QuestionCard: React.FC<{
  question: Question;
  answer: number;
  onAnswerChange: (value: number) => void;
  questionNumber: number;
}> = ({ question, answer, onAnswerChange, questionNumber }) => {
  const scales = [
    { value: 1, label: 'Discordo Totalmente', color: 'from-red-500 to-red-600' },
    { value: 2, label: 'Discordo Parcialmente', color: 'from-orange-500 to-orange-600' },
    { value: 3, label: 'Neutro', color: 'from-yellow-500 to-yellow-600' },
    { value: 4, label: 'Concordo Parcialmente', color: 'from-blue-500 to-blue-600' },
    { value: 5, label: 'Concordo Totalmente', color: 'from-green-500 to-green-600' }
  ];

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/70 transition-all duration-300">
      <div className="flex items-start gap-4 mb-6">
        <div className="bg-purple-500/20 rounded-lg p-2 flex-shrink-0">
          <span className="text-purple-300 font-bold text-sm">{questionNumber}</span>
        </div>
        <h3 className="text-white text-lg font-medium leading-relaxed">
          {question.text}
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {scales.map((scale) => (
          <button
            key={scale.value}
            onClick={() => onAnswerChange(scale.value)}
            className={`
              relative p-4 rounded-xl border-2 transition-all duration-300 text-center
              ${answer === scale.value
                ? `bg-gradient-to-br ${scale.color} border-white/30 shadow-lg scale-105`
                : 'bg-slate-900/50 border-slate-600/50 hover:border-slate-500 hover:bg-slate-800/70'
              }
            `}
          >
            <div className="text-white font-bold text-lg mb-1">{scale.value}</div>
            <div className={`text-xs ${answer === scale.value ? 'text-white' : 'text-slate-400'}`}>
              {scale.label}
            </div>
            
            {answer === scale.value && (
              <CheckCircle className="w-5 h-5 text-white absolute -top-2 -right-2 bg-green-500 rounded-full" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// COMPONENTE: Step Header
// ============================================================================

const StepHeader: React.FC<{
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  progress: number;
  stepNumber: number;
}> = ({ icon, title, subtitle, progress, stepNumber }) => (
  <div className="text-center mb-12">
    <div className="bg-gradient-to-br from-purple-500 to-indigo-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
      {icon}
    </div>
    <h1 className="text-4xl font-bold text-white mb-4">
      Step {stepNumber}: {title}
    </h1>
    <p className="text-slate-300 text-lg mb-6">
      {subtitle}
    </p>
    
    {/* Progress Bar */}
    <div className="max-w-md mx-auto mb-8">
      <div className="flex justify-between text-sm text-slate-400 mb-2">
        <span>Progresso do Step</span>
        <span>{progress}%</span>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-3">
        <div 
          className="bg-gradient-to-r from-purple-500 to-indigo-500 h-3 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  </div>
);

// ============================================================================
// COMPONENTE: Navigation Buttons
// ============================================================================

const NavigationButtons: React.FC<{
  onPrevious: () => void;
  onNext: () => void;
  canProceed: boolean;
  isLastStep?: boolean;
  autoAdvanceIn?: number;
}> = ({ onPrevious, onNext, canProceed, isLastStep = false, autoAdvanceIn }) => (
  <div className="flex justify-between items-center pt-8 border-t border-slate-700/50">
    <button
      onClick={onPrevious}
      className="flex items-center gap-2 px-6 py-3 bg-slate-700/50 hover:bg-slate-600/50 text-white rounded-xl transition-all duration-300"
    >
      <ArrowLeft className="w-5 h-5" />
      Anterior
    </button>

    <div className="text-center">
      {autoAdvanceIn && autoAdvanceIn > 0 && (
        <p className="text-slate-400 text-sm mb-2">
          Avançando automaticamente em {autoAdvanceIn}s...
        </p>
      )}
    </div>

    <button
      onClick={onNext}
      disabled={!canProceed}
      className={`
        flex items-center gap-2 px-8 py-3 rounded-xl font-medium transition-all duration-300
        ${canProceed
          ? 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-lg'
          : 'bg-slate-700/50 text-slate-400 cursor-not-allowed'
        }
      `}
    >
      {isLastStep ? 'Finalizar' : 'Próximo'}
      <ArrowRight className="w-5 h-5" />
    </button>
  </div>
);

// ============================================================================
// STEP 1: ABERTURA À EXPERIÊNCIA
// ============================================================================

export const Step1_Openness: React.FC<StepProps> = ({
  data = [],
  onDataChange,
  onNext,
  onPrevious,
  onStepComplete
}) => {
  const [answers, setAnswers] = useState<number[]>(() => {
    return data && data.length === 8 ? data : new Array(8).fill(0);
  });

  const [autoAdvanceIn, setAutoAdvanceIn] = useState<number>(0);

  useScrollToTop(true);

  useEffect(() => {
    if (onDataChange && typeof onDataChange === 'function') {
      onDataChange(answers);
    }
  }, [answers]);

  const handleAnswerChange = useCallback((questionIndex: number, value: number) => {
    try {
      setAnswers(prevAnswers => {
        const newAnswers = [...prevAnswers];
        newAnswers[questionIndex] = value;
        return newAnswers;
      });
    } catch (error) {
      console.error('Error updating answer:', error);
    }
  }, []);

  const completionPercentage = useMemo(() => {
    try {
      const completed = answers.filter(answer => answer > 0).length;
      return Math.round((completed / 8) * 100);
    } catch (error) {
      console.error('Error calculating completion:', error);
      return 0;
    }
  }, [answers]);

  const allQuestionsAnswered = useMemo(() => {
    return answers.every(answer => answer > 0);
  }, [answers]);

  useEffect(() => {
    if (allQuestionsAnswered && autoAdvanceIn === 0) {
      setAutoAdvanceIn(3);
      onStepComplete?.();
      
      const countdown = setInterval(() => {
        setAutoAdvanceIn(prev => {
          if (prev <= 1) {
            clearInterval(countdown);
            onNext();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdown);
    } else if (!allQuestionsAnswered && autoAdvanceIn > 0) {
      setAutoAdvanceIn(0);
    }
  }, [allQuestionsAnswered, autoAdvanceIn, onNext, onStepComplete]);

  const questions: Question[] = [
    { id: 1, text: "Eu tenho uma imaginação muito ativa e fantasiosa." },
    { id: 2, text: "Eu me interesso por diferentes tipos de arte e cultura." },
    { id: 3, text: "Eu gosto de experimentar novas atividades e experiências." },
    { id: 4, text: "Eu questiono tradições e convenções sociais." },
    { id: 5, text: "Eu aprecio beleza em coisas que outros podem não notar." },
    { id: 6, text: "Eu gosto de explorar ideias filosóficas e abstratas." },
    { id: 7, text: "Eu sou curioso(a) sobre como as coisas funcionam." },
    { id: 8, text: "Eu me emociono facilmente com música, arte ou poesia." }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <StepHeader
          icon={<Lightbulb className="w-10 h-10 text-white" />}
          title="Abertura à Experiência"
          subtitle="Como você se relaciona com ideias e experiências novas?"
          progress={completionPercentage}
          stepNumber={1}
        />

        <div className="space-y-6">
          {questions.map((question, index) => (
            <QuestionCard
              key={question.id}
              question={question}
              answer={answers[index] || 0}
              onAnswerChange={(value) => handleAnswerChange(index, value)}
              questionNumber={index + 1}
            />
          ))}
        </div>

        <NavigationButtons
          onPrevious={onPrevious}
          onNext={onNext}
          canProceed={allQuestionsAnswered}
          autoAdvanceIn={autoAdvanceIn}
        />
      </div>
    </div>
  );
};

// ============================================================================
// STEP 2: CONSCIENCIOSIDADE
// ============================================================================

export const Step2_Conscientiousness: React.FC<StepProps> = ({
  data = [],
  onDataChange,
  onNext,
  onPrevious,
  onStepComplete
}) => {
  const [answers, setAnswers] = useState<number[]>(() => {
    return data && data.length === 8 ? data : new Array(8).fill(0);
  });

  const [autoAdvanceIn, setAutoAdvanceIn] = useState<number>(0);
  
  useScrollToTop(true);

  useEffect(() => {
    if (onDataChange && typeof onDataChange === 'function') {
      onDataChange(answers);
    }
  }, [answers]);

  const handleAnswerChange = useCallback((questionIndex: number, value: number) => {
    try {
      setAnswers(prevAnswers => {
        const newAnswers = [...prevAnswers];
        newAnswers[questionIndex] = value;
        return newAnswers;
      });
    } catch (error) {
      console.error('Error updating answer:', error);
    }
  }, []);

  const completionPercentage = useMemo(() => {
    try {
      const completed = answers.filter(answer => answer > 0).length;
      return Math.round((completed / 8) * 100);
    } catch (error) {
      console.error('Error calculating completion:', error);
      return 0;
    }
  }, [answers]);

  const allQuestionsAnswered = useMemo(() => {
    return answers.every(answer => answer > 0);
  }, [answers]);

  useEffect(() => {
    if (allQuestionsAnswered && autoAdvanceIn === 0) {
      setAutoAdvanceIn(3);
      onStepComplete?.();
      
      const countdown = setInterval(() => {
        setAutoAdvanceIn(prev => {
          if (prev <= 1) {
            clearInterval(countdown);
            onNext();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdown);
    } else if (!allQuestionsAnswered && autoAdvanceIn > 0) {
      setAutoAdvanceIn(0);
    }
  }, [allQuestionsAnswered, autoAdvanceIn, onNext, onStepComplete]);

  const questions: Question[] = [
    { id: 1, text: "Eu sempre termino o que começo." },
    { id: 2, text: "Eu sou muito organizado(a) em minha vida." },
    { id: 3, text: "Eu trabalho duro para alcançar meus objetivos." },
    { id: 4, text: "Eu planejo as coisas com antecedência." },
    { id: 5, text: "Eu presto atenção aos detalhes." },
    { id: 6, text: "Eu tenho autodisciplina forte." },
    { id: 7, text: "Eu sou pontual e cumpro prazos." },
    { id: 8, text: "Eu tenho controle sobre meus impulsos." }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <StepHeader
          icon={<Focus className="w-10 h-10 text-white" />}
          title="Conscienciosidade"
          subtitle="Como você se organiza e se disciplina para alcançar objetivos?"
          progress={completionPercentage}
          stepNumber={2}
        />

        <div className="space-y-6">
          {questions.map((question, index) => (
            <QuestionCard
              key={question.id}
              question={question}
              answer={answers[index] || 0}
              onAnswerChange={(value) => handleAnswerChange(index, value)}
              questionNumber={index + 1}
            />
          ))}
        </div>

        <NavigationButtons
          onPrevious={onPrevious}
          onNext={onNext}
          canProceed={allQuestionsAnswered}
          autoAdvanceIn={autoAdvanceIn}
        />
      </div>
    </div>
  );
};

// ============================================================================
// STEP 3: EXTROVERSÃO
// ============================================================================

export const Step3_Extraversion: React.FC<StepProps> = ({
  data = [],
  onDataChange,
  onNext,
  onPrevious,
  onStepComplete
}) => {
  const [answers, setAnswers] = useState<number[]>(() => {
    return data && data.length === 8 ? data : new Array(8).fill(0);
  });

  const [autoAdvanceIn, setAutoAdvanceIn] = useState<number>(0);
  
  useScrollToTop(true);

  useEffect(() => {
    if (onDataChange && typeof onDataChange === 'function') {
      onDataChange(answers);
    }
  }, [answers]);

  const handleAnswerChange = useCallback((questionIndex: number, value: number) => {
    try {
      setAnswers(prevAnswers => {
        const newAnswers = [...prevAnswers];
        newAnswers[questionIndex] = value;
        return newAnswers;
      });
    } catch (error) {
      console.error('Error updating answer:', error);
    }
  }, []);

  const completionPercentage = useMemo(() => {
    try {
      const completed = answers.filter(answer => answer > 0).length;
      return Math.round((completed / 8) * 100);
    } catch (error) {
      console.error('Error calculating completion:', error);
      return 0;
    }
  }, [answers]);

  const allQuestionsAnswered = useMemo(() => {
    return answers.every(answer => answer > 0);
  }, [answers]);

  useEffect(() => {
    if (allQuestionsAnswered && autoAdvanceIn === 0) {
      setAutoAdvanceIn(3);
      onStepComplete?.();
      
      const countdown = setInterval(() => {
        setAutoAdvanceIn(prev => {
          if (prev <= 1) {
            clearInterval(countdown);
            onNext();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdown);
    } else if (!allQuestionsAnswered && autoAdvanceIn > 0) {
      setAutoAdvanceIn(0);
    }
  }, [allQuestionsAnswered, autoAdvanceIn, onNext, onStepComplete]);

  const questions: Question[] = [
    { id: 1, text: "Eu me sinto confortável sendo o centro das atenções." },
    { id: 2, text: "Eu gosto de estar rodeado(a) de pessoas." },
    { id: 3, text: "Eu inicio conversas facilmente com estranhos." },
    { id: 4, text: "Eu tenho muita energia e entusiasmo." },
    { id: 5, text: "Eu gosto de festas e eventos sociais." },
    { id: 6, text: "Eu me expresso de forma assertiva e confiante." },
    { id: 7, text: "Eu procuro situações excitantes e estimulantes." },
    { id: 8, text: "Eu me sinto revigorado(a) após interações sociais." }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900/20 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <StepHeader
          icon={<Users className="w-10 h-10 text-white" />}
          title="Extroversão"
          subtitle="Como você interage com o mundo ao seu redor?"
          progress={completionPercentage}
          stepNumber={3}
        />

        <div className="space-y-6">
          {questions.map((question, index) => (
            <QuestionCard
              key={question.id}
              question={question}
              answer={answers[index] || 0}
              onAnswerChange={(value) => handleAnswerChange(index, value)}
              questionNumber={index + 1}
            />
          ))}
        </div>

        <NavigationButtons
          onPrevious={onPrevious}
          onNext={onNext}
          canProceed={allQuestionsAnswered}
          autoAdvanceIn={autoAdvanceIn}
        />
      </div>
    </div>
  );
};

// ============================================================================
// STEP 4: AMABILIDADE
// ============================================================================

export const Step4_Agreeableness: React.FC<StepProps> = ({
  data = [],
  onDataChange,
  onNext,
  onPrevious,
  onStepComplete
}) => {
  const [answers, setAnswers] = useState<number[]>(() => {
    return data && data.length === 8 ? data : new Array(8).fill(0);
  });

  const [autoAdvanceIn, setAutoAdvanceIn] = useState<number>(0);
  
  useScrollToTop(true);

  useEffect(() => {
    if (onDataChange && typeof onDataChange === 'function') {
      onDataChange(answers);
    }
  }, [answers]);

  const handleAnswerChange = useCallback((questionIndex: number, value: number) => {
    try {
      setAnswers(prevAnswers => {
        const newAnswers = [...prevAnswers];
        newAnswers[questionIndex] = value;
        return newAnswers;
      });
    } catch (error) {
      console.error('Error updating answer:', error);
    }
  }, []);

  const completionPercentage = useMemo(() => {
    try {
      const completed = answers.filter(answer => answer > 0).length;
      return Math.round((completed / 8) * 100);
    } catch (error) {
      console.error('Error calculating completion:', error);
      return 0;
    }
  }, [answers]);

  const allQuestionsAnswered = useMemo(() => {
    return answers.every(answer => answer > 0);
  }, [answers]);

  useEffect(() => {
    if (allQuestionsAnswered && autoAdvanceIn === 0) {
      setAutoAdvanceIn(3);
      onStepComplete?.();
      
      const countdown = setInterval(() => {
        setAutoAdvanceIn(prev => {
          if (prev <= 1) {
            clearInterval(countdown);
            onNext();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdown);
    } else if (!allQuestionsAnswered && autoAdvanceIn > 0) {
      setAutoAdvanceIn(0);
    }
  }, [allQuestionsAnswered, autoAdvanceIn, onNext, onStepComplete]);

  const questions: Question[] = [
    { id: 1, text: "Eu confio nas pessoas facilmente." },
    { id: 2, text: "Eu sou naturalmente empático(a) e compreensivo(a)." },
    { id: 3, text: "Eu prefiro cooperar a competir." },
    { id: 4, text: "Eu perdoo facilmente quando sou magoado(a)." },
    { id: 5, text: "Eu me preocupo genuinamente com o bem-estar dos outros." },
    { id: 6, text: "Eu evito conflitos e busco harmonia." },
    { id: 7, text: "Eu acredito que a maioria das pessoas tem boas intenções." },
    { id: 8, text: "Eu me esforço para ajudar outros sempre que possível." }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900/20 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <StepHeader
          icon={<Heart className="w-10 h-10 text-white" />}
          title="Amabilidade"
          subtitle="Como você se relaciona e confia nas pessoas?"
          progress={completionPercentage}
          stepNumber={4}
        />

        <div className="space-y-6">
          {questions.map((question, index) => (
            <QuestionCard
              key={question.id}
              question={question}
              answer={answers[index] || 0}
              onAnswerChange={(value) => handleAnswerChange(index, value)}
              questionNumber={index + 1}
            />
          ))}
        </div>

        <NavigationButtons
          onPrevious={onPrevious}
          onNext={onNext}
          canProceed={allQuestionsAnswered}
          autoAdvanceIn={autoAdvanceIn}
        />
      </div>
    </div>
  );
};