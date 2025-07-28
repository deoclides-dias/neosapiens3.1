// src/components/onboarding/CognitiveForm.tsx

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Brain, Zap, Target, Lightbulb, Clock, Palette } from 'lucide-react';

// ============================================================================
// INTERFACES E TIPOS
// ============================================================================

interface CognitiveFormData {
  // Step 1: Estilo de Aprendizagem (12 questões)
  learningStyle: {
    visualLearning: number;
    auditoryLearning: number;
    kinestheticLearning: number;
    readingWriting: number;
    socialLearning: number;
    solitaryLearning: number;
    logicalLearning: number;
    verbalLearning: number;
    practicalLearning: number;
    theoreticalLearning: number;
    sequentialLearning: number;
    globalLearning: number;
  };
  
  // Step 2: Processamento de Informações (10 questões)
  informationProcessing: {
    processingSpeed: number;
    attentionToDetail: number;
    bigPictureThinking: number;
    multitasking: number;
    deepFocus: number;
    informationRetention: number;
    patternRecognition: number;
    analyticalThinking: number;
    intuitiveThinking: number;
    structuredThinking: number;
  };
  
  // Step 3: Criatividade & Inovação (8 questões)
  creativity: {
    originalThinking: number;
    ideaGeneration: number;
    artisticExpression: number;
    problemSolving: number;
    flexibility: number;
    risktaking: number;
    curiosity: number;
    imagination: number;
  };
  
  // Step 4: Resolução de Problemas (10 questões)
  problemSolving: {
    logicalReasoning: number;
    criticalThinking: number;
    decisionMaking: number;
    strategicPlanning: number;
    troubleshooting: number;
    resourcefulness: number;
    persistence: number;
    adaptability: number;
    systemsThinking: number;
    prioritization: number;
  };
  
  // Step 5: Velocidade Cognitiva (8 questões)
  cognitiveSpeed: {
    processingSpeed: number;
    reactionTime: number;
    mentalAgility: number;
    taskSwitching: number;
    quickDecisions: number;
    verbalFluency: number;
    numericalSpeed: number;
    visualProcessing: number;
  };
  
  // Step 6: Inteligências Múltiplas (12 questões)
  multipleIntelligences: {
    linguistic: number;
    mathematicalLogical: number;
    spatial: number;
    bodilyKinesthetic: number;
    musical: number;
    interpersonal: number;
    intrapersonal: number;
    naturalistic: number;
    existential: number;
    creative: number;
    practical: number;
    emotional: number;
  };
}

interface CognitiveFormProps {
  onComplete: (data: CognitiveFormData) => void;
  onBack: () => void;
  initialData?: Partial<CognitiveFormData>;
}

// ============================================================================
// CONFIGURAÇÃO DOS STEPS
// ============================================================================

const COGNITIVE_STEPS = [
  {
    id: 1,
    title: "Estilo de Aprendizagem",
    subtitle: "Como você prefere absorver e processar informações?",
    icon: Brain,
    color: "purple",
    questionsCount: 12
  },
  {
    id: 2,
    title: "Processamento de Informações",
    subtitle: "Como sua mente organiza e processa dados?",
    icon: Zap,
    color: "blue",
    questionsCount: 10
  },
  {
    id: 3,
    title: "Criatividade & Inovação",
    subtitle: "Como você gera ideias e soluções criativas?",
    icon: Lightbulb,
    color: "yellow",
    questionsCount: 8
  },
  {
    id: 4,
    title: "Resolução de Problemas",
    subtitle: "Como você aborda desafios e toma decisões?",
    icon: Target,
    color: "green",
    questionsCount: 10
  },
  {
    id: 5,
    title: "Velocidade Cognitiva",
    subtitle: "Qual a rapidez do seu processamento mental?",
    icon: Clock,
    color: "orange",
    questionsCount: 8
  },
  {
    id: 6,
    title: "Inteligências Múltiplas",
    subtitle: "Quais são suas forças cognitivas naturais?",
    icon: Palette,
    color: "pink",
    questionsCount: 12
  }
];

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

const CognitiveForm: React.FC<CognitiveFormProps> = ({
  onComplete,
  onBack,
  initialData
}) => {
  // ============================================================================
  // ESTADOS
  // ============================================================================
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // Dados do formulário com valores padrão no meio (5)
  const [formData, setFormData] = useState<CognitiveFormData>(() => ({
    learningStyle: {
      visualLearning: 5,
      auditoryLearning: 5,
      kinestheticLearning: 5,
      readingWriting: 5,
      socialLearning: 5,
      solitaryLearning: 5,
      logicalLearning: 5,
      verbalLearning: 5,
      practicalLearning: 5,
      theoreticalLearning: 5,
      sequentialLearning: 5,
      globalLearning: 5
    },
    informationProcessing: {
      processingSpeed: 5,
      attentionToDetail: 5,
      bigPictureThinking: 5,
      multitasking: 5,
      deepFocus: 5,
      informationRetention: 5,
      patternRecognition: 5,
      analyticalThinking: 5,
      intuitiveThinking: 5,
      structuredThinking: 5
    },
    creativity: {
      originalThinking: 5,
      ideaGeneration: 5,
      artisticExpression: 5,
      problemSolving: 5,
      flexibility: 5,
      risktaking: 5,
      curiosity: 5,
      imagination: 5
    },
    problemSolving: {
      logicalReasoning: 5,
      criticalThinking: 5,
      decisionMaking: 5,
      strategicPlanning: 5,
      troubleshooting: 5,
      resourcefulness: 5,
      persistence: 5,
      adaptability: 5,
      systemsThinking: 5,
      prioritization: 5
    },
    cognitiveSpeed: {
      processingSpeed: 5,
      reactionTime: 5,
      mentalAgility: 5,
      taskSwitching: 5,
      quickDecisions: 5,
      verbalFluency: 5,
      numericalSpeed: 5,
      visualProcessing: 5
    },
    multipleIntelligences: {
      linguistic: 5,
      mathematicalLogical: 5,
      spatial: 5,
      bodilyKinesthetic: 5,
      musical: 5,
      interpersonal: 5,
      intrapersonal: 5,
      naturalistic: 5,
      existential: 5,
      creative: 5,
      practical: 5,
      emotional: 5
    },
    ...initialData
  }));

  // ============================================================================
  // FUNÇÕES AUXILIARES
  // ============================================================================

  const updateField = (field: string, value: number) => {
    setFormData(prev => {
      const newData = { ...prev };
      const keys = field.split('.');
      let current: any = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const nextStep = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    } else {
      // Formulário completo - enviar dados
      onComplete(formData);
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  const currentStepData = COGNITIVE_STEPS[currentStep - 1];
  const IconComponent = currentStepData.icon;

  // ============================================================================
  // COMPONENTE DE SLIDER
  // ============================================================================

  const SliderField: React.FC<{
    label: string;
    value: number;
    field: string;
    leftLabel: string;
    rightLabel: string;
  }> = ({ label, value, field, leftLabel, rightLabel }) => (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className={`font-bold text-${currentStepData.color}-600`}>{value}/10</span>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-xs text-gray-500 min-w-[80px] text-left">{leftLabel}</span>
        <input
          type="range"
          min="1"
          max="10"
          value={value}
          onChange={(e) => updateField(field, Number(e.target.value))}
          className={`flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-${currentStepData.color}`}
        />
        <span className="text-xs text-gray-500 min-w-[80px] text-right">{rightLabel}</span>
      </div>
    </div>
  );

  // ============================================================================
  // RENDER DOS STEPS
  // ============================================================================

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className={`bg-${currentStepData.color}-50 p-6 rounded-lg border-l-4 border-${currentStepData.color}-400`}>
            <h3 className={`text-xl font-bold text-${currentStepData.color}-800 mb-4 flex items-center`}>
              <IconComponent className="w-6 h-6 mr-2" />
              Estilo de Aprendizagem
            </h3>
            
            <div className="space-y-6">
              <SliderField 
                label="Aprendizagem Visual (imagens, gráficos, diagramas)"
                value={formData.learningStyle.visualLearning}
                field="learningStyle.visualLearning"
                leftLabel="Pouco visual"
                rightLabel="Muito visual"
              />
              
              <SliderField 
                label="Aprendizagem Auditiva (palestras, discussões, música)"
                value={formData.learningStyle.auditoryLearning}
                field="learningStyle.auditoryLearning"
                leftLabel="Pouco auditivo"
                rightLabel="Muito auditivo"
              />
              
              <SliderField 
                label="Aprendizagem Cinestésica (prática, movimento, toque)"
                value={formData.learningStyle.kinestheticLearning}
                field="learningStyle.kinestheticLearning"
                leftLabel="Pouco prático"
                rightLabel="Muito prático"
              />
              
              <SliderField 
                label="Leitura e Escrita (textos, anotações, listas)"
                value={formData.learningStyle.readingWriting}
                field="learningStyle.readingWriting"
                leftLabel="Pouco textual"
                rightLabel="Muito textual"
              />
              
              <SliderField 
                label="Aprendizagem Social (grupos, discussões, colaboração)"
                value={formData.learningStyle.socialLearning}
                field="learningStyle.socialLearning"
                leftLabel="Prefiro sozinho"
                rightLabel="Prefiro grupos"
              />
              
              <SliderField 
                label="Aprendizagem Solitária (estudo individual, reflexão)"
                value={formData.learningStyle.solitaryLearning}
                field="learningStyle.solitaryLearning"
                leftLabel="Prefiro grupos"
                rightLabel="Prefiro sozinho"
              />
              
              <SliderField 
                label="Pensamento Lógico (estruturas, sequências, causas)"
                value={formData.learningStyle.logicalLearning}
                field="learningStyle.logicalLearning"
                leftLabel="Menos lógico"
                rightLabel="Muito lógico"
              />
              
              <SliderField 
                label="Aprendizagem Verbal (palavras, linguagem, comunicação)"
                value={formData.learningStyle.verbalLearning}
                field="learningStyle.verbalLearning"
                leftLabel="Menos verbal"
                rightLabel="Muito verbal"
              />
              
              <SliderField 
                label="Aprendizagem Prática (aplicação, experiência, fazer)"
                value={formData.learningStyle.practicalLearning}
                field="learningStyle.practicalLearning"
                leftLabel="Mais teórico"
                rightLabel="Mais prático"
              />
              
              <SliderField 
                label="Aprendizagem Teórica (conceitos, modelos, abstrações)"
                value={formData.learningStyle.theoreticalLearning}
                field="learningStyle.theoreticalLearning"
                leftLabel="Mais prático"
                rightLabel="Mais teórico"
              />
              
              <SliderField 
                label="Aprendizagem Sequencial (passo a passo, linear)"
                value={formData.learningStyle.sequentialLearning}
                field="learningStyle.sequentialLearning"
                leftLabel="Não linear"
                rightLabel="Muito linear"
              />
              
              <SliderField 
                label="Aprendizagem Global (visão geral, conexões, holístico)"
                value={formData.learningStyle.globalLearning}
                field="learningStyle.globalLearning"
                leftLabel="Mais detalhes"
                rightLabel="Visão geral"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className={`bg-${currentStepData.color}-50 p-6 rounded-lg border-l-4 border-${currentStepData.color}-400`}>
            <h3 className={`text-xl font-bold text-${currentStepData.color}-800 mb-4 flex items-center`}>
              <IconComponent className="w-6 h-6 mr-2" />
              Processamento de Informações
            </h3>
            
            <div className="space-y-6">
              <SliderField 
                label="Velocidade de Processamento (rapidez para entender)"
                value={formData.informationProcessing.processingSpeed}
                field="informationProcessing.processingSpeed"
                leftLabel="Mais devagar"
                rightLabel="Muito rápido"
              />
              
              <SliderField 
                label="Atenção aos Detalhes (precisão, minúcias)"
                value={formData.informationProcessing.attentionToDetail}
                field="informationProcessing.attentionToDetail"
                leftLabel="Visão geral"
                rightLabel="Muito detalhista"
              />
              
              <SliderField 
                label="Pensamento Big Picture (visão geral, contexto amplo)"
                value={formData.informationProcessing.bigPictureThinking}
                field="informationProcessing.bigPictureThinking"
                leftLabel="Mais detalhes"
                rightLabel="Visão ampla"
              />
              
              <SliderField 
                label="Multitasking (múltiplas tarefas simultâneas)"
                value={formData.informationProcessing.multitasking}
                field="informationProcessing.multitasking"
                leftLabel="Uma por vez"
                rightLabel="Multitarefas"
              />
              
              <SliderField 
                label="Foco Profundo (concentração prolongada)"
                value={formData.informationProcessing.deepFocus}
                field="informationProcessing.deepFocus"
                leftLabel="Disperso"
                rightLabel="Foco laser"
              />
              
              <SliderField 
                label="Retenção de Informações (memória, recordação)"
                value={formData.informationProcessing.informationRetention}
                field="informationProcessing.informationRetention"
                leftLabel="Esqueço fácil"
                rightLabel="Boa memória"
              />
              
              <SliderField 
                label="Reconhecimento de Padrões (tendências, conexões)"
                value={formData.informationProcessing.patternRecognition}
                field="informationProcessing.patternRecognition"
                leftLabel="Menos padrões"
                rightLabel="Vejo padrões"
              />
              
              <SliderField 
                label="Pensamento Analítico (lógica, decomposição)"
                value={formData.informationProcessing.analyticalThinking}
                field="informationProcessing.analyticalThinking"
                leftLabel="Mais intuitivo"
                rightLabel="Muito analítico"
              />
              
              <SliderField 
                label="Pensamento Intuitivo (feeling, insights rápidos)"
                value={formData.informationProcessing.intuitiveThinking}
                field="informationProcessing.intuitiveThinking"
                leftLabel="Mais analítico"
                rightLabel="Muito intuitivo"
              />
              
              <SliderField 
                label="Pensamento Estruturado (organização, metodologia)"
                value={formData.informationProcessing.structuredThinking}
                field="informationProcessing.structuredThinking"
                leftLabel="Mais flexível"
                rightLabel="Muito estruturado"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className={`bg-${currentStepData.color}-50 p-6 rounded-lg border-l-4 border-${currentStepData.color}-400`}>
            <h3 className={`text-xl font-bold text-${currentStepData.color}-800 mb-4 flex items-center`}>
              <IconComponent className="w-6 h-6 mr-2" />
              Criatividade & Inovação
            </h3>
            
            <div className="space-y-6">
              <SliderField 
                label="Pensamento Original (ideias únicas, não convencionais)"
                value={formData.creativity.originalThinking}
                field="creativity.originalThinking"
                leftLabel="Mais convencional"
                rightLabel="Muito original"
              />
              
              <SliderField 
                label="Geração de Ideias (brainstorming, quantidade de ideias)"
                value={formData.creativity.ideaGeneration}
                field="creativity.ideaGeneration"
                leftLabel="Poucas ideias"
                rightLabel="Muitas ideias"
              />
              
              <SliderField 
                label="Expressão Artística (arte, design, estética)"
                value={formData.creativity.artisticExpression}
                field="creativity.artisticExpression"
                leftLabel="Menos artístico"
                rightLabel="Muito artístico"
              />
              
              <SliderField 
                label="Solução Criativa de Problemas (abordagens inovadoras)"
                value={formData.creativity.problemSolving}
                field="creativity.problemSolving"
                leftLabel="Convencional"
                rightLabel="Muito criativo"
              />
              
              <SliderField 
                label="Flexibilidade Mental (adaptação, mudança de perspectiva)"
                value={formData.creativity.flexibility}
                field="creativity.flexibility"
                leftLabel="Mais rígido"
                rightLabel="Muito flexível"
              />
              
              <SliderField 
                label="Tolerância ao Risco (experimentação, tentativas)"
                value={formData.creativity.risktaking}
                field="creativity.risktaking"
                leftLabel="Mais conservador"
                rightLabel="Aceito riscos"
              />
              
              <SliderField 
                label="Curiosidade (exploração, questionamento)"
                value={formData.creativity.curiosity}
                field="creativity.curiosity"
                leftLabel="Menos curioso"
                rightLabel="Muito curioso"
              />
              
              <SliderField 
                label="Imaginação (visualização, fantasias, cenários)"
                value={formData.creativity.imagination}
                field="creativity.imagination"
                leftLabel="Mais concreto"
                rightLabel="Muito imaginativo"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className={`bg-${currentStepData.color}-50 p-6 rounded-lg border-l-4 border-${currentStepData.color}-400`}>
            <h3 className={`text-xl font-bold text-${currentStepData.color}-800 mb-4 flex items-center`}>
              <IconComponent className="w-6 h-6 mr-2" />
              Resolução de Problemas
            </h3>
            
            <div className="space-y-6">
              <SliderField 
                label="Raciocínio Lógico (dedução, premissas, conclusões)"
                value={formData.problemSolving.logicalReasoning}
                field="problemSolving.logicalReasoning"
                leftLabel="Mais intuitivo"
                rightLabel="Muito lógico"
              />
              
              <SliderField 
                label="Pensamento Crítico (análise, avaliação, questionamento)"
                value={formData.problemSolving.criticalThinking}
                field="problemSolving.criticalThinking"
                leftLabel="Aceito fácil"
                rightLabel="Muito crítico"
              />
              
              <SliderField 
                label="Tomada de Decisão (escolhas, julgamentos, firmeza)"
                value={formData.problemSolving.decisionMaking}
                field="problemSolving.decisionMaking"
                leftLabel="Indeciso"
                rightLabel="Decido rápido"
              />
              
              <SliderField 
                label="Planejamento Estratégico (visão, etapas, execução)"
                value={formData.problemSolving.strategicPlanning}
                field="problemSolving.strategicPlanning"
                leftLabel="Mais espontâneo"
                rightLabel="Muito planejador"
              />
              
              <SliderField 
                label="Troubleshooting (diagnóstico, identificação de falhas)"
                value={formData.problemSolving.troubleshooting}
                field="problemSolving.troubleshooting"
                leftLabel="Dificuldade"
                rightLabel="Muito eficaz"
              />
              
              <SliderField 
                label="Desenvoltura (uso de recursos, improvisação)"
                value={formData.problemSolving.resourcefulness}
                field="problemSolving.resourcefulness"
                leftLabel="Preciso de ajuda"
                rightLabel="Muito desenvolto"
              />
              
              <SliderField 
                label="Persistência (continuidade, não desistir)"
                value={formData.problemSolving.persistence}
                field="problemSolving.persistence"
                leftLabel="Desisto fácil"
                rightLabel="Muito persistente"
              />
              
              <SliderField 
                label="Adaptabilidade (ajuste a mudanças, flexibilidade)"
                value={formData.problemSolving.adaptability}
                field="problemSolving.adaptability"
                leftLabel="Mais rígido"
                rightLabel="Muito adaptável"
              />
              
              <SliderField 
                label="Pensamento Sistêmico (interconexões, sistemas complexos)"
                value={formData.problemSolving.systemsThinking}
                field="problemSolving.systemsThinking"
                leftLabel="Mais linear"
                rightLabel="Sistêmico"
              />
              
              <SliderField 
                label="Priorização (importância, urgência, ordem)"
                value={formData.problemSolving.prioritization}
                field="problemSolving.prioritization"
                leftLabel="Dificuldade"
                rightLabel="Ótima priorização"
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className={`bg-${currentStepData.color}-50 p-6 rounded-lg border-l-4 border-${currentStepData.color}-400`}>
            <h3 className={`text-xl font-bold text-${currentStepData.color}-800 mb-4 flex items-center`}>
              <IconComponent className="w-6 h-6 mr-2" />
              Velocidade Cognitiva
            </h3>
            
            <div className="space-y-6">
              <SliderField 
                label="Velocidade de Processamento (rapidez mental geral)"
                value={formData.cognitiveSpeed.processingSpeed}
                field="cognitiveSpeed.processingSpeed"
                leftLabel="Mais devagar"
                rightLabel="Muito rápido"
              />
              
              <SliderField 
                label="Tempo de Reação (respostas rápidas, reflexos)"
                value={formData.cognitiveSpeed.reactionTime}
                field="cognitiveSpeed.reactionTime"
                leftLabel="Reação lenta"
                rightLabel="Reação rápida"
              />
              
              <SliderField 
                label="Agilidade Mental (mudanças rápidas de foco)"
                value={formData.cognitiveSpeed.mentalAgility}
                field="cognitiveSpeed.mentalAgility"
                leftLabel="Menos ágil"
                rightLabel="Muito ágil"
              />
              
              <SliderField 
                label="Alternância de Tarefas (task switching, flexibilidade)"
                value={formData.cognitiveSpeed.taskSwitching}
                field="cognitiveSpeed.taskSwitching"
                leftLabel="Dificuldade"
                rightLabel="Muito fácil"
              />
              
              <SliderField 
                label="Decisões Rápidas (escolhas sob pressão de tempo)"
                value={formData.cognitiveSpeed.quickDecisions}
                field="cognitiveSpeed.quickDecisions"
                leftLabel="Preciso tempo"
                rightLabel="Decido rápido"
              />
              
              <SliderField 
                label="Fluência Verbal (falar, encontrar palavras rapidamente)"
                value={formData.cognitiveSpeed.verbalFluency}
                field="cognitiveSpeed.verbalFluency"
                leftLabel="Menos fluente"
                rightLabel="Muito fluente"
              />
              
              <SliderField 
                label="Velocidade Numérica (cálculos, matemática rápida)"
                value={formData.cognitiveSpeed.numericalSpeed}
                field="cognitiveSpeed.numericalSpeed"
                leftLabel="Mais devagar"
                rightLabel="Muito rápido"
              />
              
              <SliderField 
                label="Processamento Visual (imagens, padrões visuais)"
                value={formData.cognitiveSpeed.visualProcessing}
                field="cognitiveSpeed.visualProcessing"
                leftLabel="Mais lento"
                rightLabel="Muito rápido"
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className={`bg-${currentStepData.color}-50 p-6 rounded-lg border-l-4 border-${currentStepData.color}-400`}>
            <h3 className={`text-xl font-bold text-${currentStepData.color}-800 mb-4 flex items-center`}>
              <IconComponent className="w-6 h-6 mr-2" />
              Inteligências Múltiplas
            </h3>
            
            <div className="space-y-6">
              <SliderField 
                label="Inteligência Linguística (palavras, escrita, comunicação)"
                value={formData.multipleIntelligences.linguistic}
                field="multipleIntelligences.linguistic"
                leftLabel="Dificuldade"
                rightLabel="Muito forte"
              />
              
              <SliderField 
                label="Inteligência Lógico-Matemática (números, lógica, análise)"
                value={formData.multipleIntelligences.mathematicalLogical}
                field="multipleIntelligences.mathematicalLogical"
                leftLabel="Dificuldade"
                rightLabel="Muito forte"
              />
              
              <SliderField 
                label="Inteligência Espacial (visualização, 3D, orientação)"
                value={formData.multipleIntelligences.spatial}
                field="multipleIntelligences.spatial"
                leftLabel="Dificuldade"
                rightLabel="Muito forte"
              />
              
              <SliderField 
                label="Inteligência Corporal-Cinestésica (movimento, coordenação)"
                value={formData.multipleIntelligences.bodilyKinesthetic}
                field="multipleIntelligences.bodilyKinesthetic"
                leftLabel="Dificuldade"
                rightLabel="Muito forte"
              />
              
              <SliderField 
                label="Inteligência Musical (ritmo, melodia, sons)"
                value={formData.multipleIntelligences.musical}
                field="multipleIntelligences.musical"
                leftLabel="Dificuldade"
                rightLabel="Muito forte"
              />
              
              <SliderField 
                label="Inteligência Interpessoal (relacionamentos, liderança)"
                value={formData.multipleIntelligences.interpersonal}
                field="multipleIntelligences.interpersonal"
                leftLabel="Dificuldade"
                rightLabel="Muito forte"
              />
              
              <SliderField 
                label="Inteligência Intrapessoal (autoconhecimento, reflexão)"
                value={formData.multipleIntelligences.intrapersonal}
                field="multipleIntelligences.intrapersonal"
                leftLabel="Dificuldade"
                rightLabel="Muito forte"
              />
              
              <SliderField 
                label="Inteligência Naturalística (natureza, categorização)"
                value={formData.multipleIntelligences.naturalistic}
                field="multipleIntelligences.naturalistic"
                leftLabel="Dificuldade"
                rightLabel="Muito forte"
              />
              
              <SliderField 
                label="Inteligência Existencial (propósito, significado, filosofia)"
                value={formData.multipleIntelligences.existential}
                field="multipleIntelligences.existential"
                leftLabel="Dificuldade"
                rightLabel="Muito forte"
              />
              
              <SliderField 
                label="Inteligência Criativa (inovação, originalidade)"
                value={formData.multipleIntelligences.creative}
                field="multipleIntelligences.creative"
                leftLabel="Dificuldade"
                rightLabel="Muito forte"
              />
              
              <SliderField 
                label="Inteligência Prática (aplicação, experiência de vida)"
                value={formData.multipleIntelligences.practical}
                field="multipleIntelligences.practical"
                leftLabel="Dificuldade"
                rightLabel="Muito forte"
              />
              
              <SliderField 
                label="Inteligência Emocional (emoções próprias e dos outros)"
                value={formData.multipleIntelligences.emotional}
                field="multipleIntelligences.emotional"
                leftLabel="Dificuldade"
                rightLabel="Muito forte"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // ============================================================================
  // RENDER PRINCIPAL
  // ============================================================================

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* HEADER COM PROGRESSO */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-full bg-${currentStepData.color}-100`}>
              <IconComponent className={`w-8 h-8 text-${currentStepData.color}-600`} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {currentStepData.title}
              </h2>
              <p className="text-gray-600">{currentStepData.subtitle}</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-500 mb-1">
              Step {currentStep} de 6
            </div>
            <div className="text-sm text-gray-500">
              {currentStepData.questionsCount} questões
            </div>
          </div>
        </div>
        
        {/* BARRA DE PROGRESSO */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`bg-${currentStepData.color}-500 h-2 rounded-full transition-all duration-300`}
            style={{ width: `${(currentStep / 6) * 100}%` }}
          />
        </div>
        
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>Início</span>
          <span>{Math.round((currentStep / 6) * 100)}% completo</span>
          <span>Conclusão</span>
        </div>
      </div>

      {/* CONTEÚDO DO STEP ATUAL */}
      <div className="mb-8">
        {renderStep()}
      </div>

      {/* BOTÕES DE NAVEGAÇÃO */}
      <div className="flex justify-between items-center">
        <button
          onClick={previousStep}
          className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Anterior</span>
        </button>

        <div className="flex space-x-2">
          {COGNITIVE_STEPS.map((step) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(step.id)}
              className={`w-3 h-3 rounded-full transition-colors ${
                step.id === currentStep
                  ? `bg-${currentStepData.color}-500`
                  : step.id < currentStep
                  ? `bg-${currentStepData.color}-300`
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextStep}
          disabled={isLoading}
          className={`flex items-center space-x-2 px-6 py-3 bg-${currentStepData.color}-500 text-white rounded-lg hover:bg-${currentStepData.color}-600 transition-colors disabled:opacity-50`}
        >
          <span>{currentStep === 6 ? 'Finalizar' : 'Próximo'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* RESUMO DO PROGRESSO */}
      <div className="mt-8 bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex space-x-6">
            <span>📊 Estilo de Aprendizagem: {currentStep > 1 ? '✅' : '⏳'}</span>
            <span>⚡ Processamento: {currentStep > 2 ? '✅' : currentStep === 2 ? '⏳' : '⭕'}</span>
            <span>💡 Criatividade: {currentStep > 3 ? '✅' : currentStep === 3 ? '⏳' : '⭕'}</span>
          </div>
          <div className="flex space-x-6">
            <span>🎯 Problemas: {currentStep > 4 ? '✅' : currentStep === 4 ? '⏳' : '⭕'}</span>
            <span>⚡ Velocidade: {currentStep > 5 ? '✅' : currentStep === 5 ? '⏳' : '⭕'}</span>
            <span>🎨 Inteligências: {currentStep === 6 ? '⏳' : '⭕'}</span>
          </div>
        </div>
      </div>

      {/* LOADING STATE */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Processando dados cognitivos...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CognitiveForm;