// src/components/onboarding/steps/BiohackingStep6.tsx - Medicina Funcional + Cognitivo

import React, { useState, useEffect } from 'react';
import { 
  Leaf, 
  Flame, 
  Mountain, 
  Gem, 
  Waves, 
  Brain, 
  Zap, 
  Eye,
  Heart,
  Shield,
  TrendingUp,
  Info,
  AlertCircle
} from 'lucide-react';
import { BiohackingData } from '../../../types/biohacking';

interface BiohackingStep6Props {
  data: BiohackingData;
  onUpdate: (updates: Partial<BiohackingData>) => void;
  onValidationChange: (isValid: boolean) => void;
}

const BiohackingStep6: React.FC<BiohackingStep6Props> = ({
  data,
  onUpdate,
  onValidationChange
}) => {
  const [activeTab, setActiveTab] = useState<'elements' | 'cognitive'>('elements');
  const [insights, setInsights] = useState<{
    dominantElement?: string;
    cognitiveProfile?: string;
    elementBalance?: string;
    recommendations?: string[];
  }>({});

  // 🎯 CONFIGURAÇÃO DOS 5 ELEMENTOS
const elements = [
  {
    key: 'wood',
    name: 'Madeira (木)',
    icon: Leaf,
    color: 'green',
    description: 'Fígado, vesícula biliar, olhos, músculos, criatividade',
    attributes: [
      { key: 'liverHealth', label: 'Saúde hepática', description: 'Função do fígado e vesícula' },
      { key: 'angerManagement', label: 'Controle da raiva', description: 'Gestão de emoções intensas' },
      { key: 'flexibility', label: 'Flexibilidade física', description: 'Mobilidade articular e muscular' },
      { key: 'visionHealth', label: 'Saúde dos olhos', description: 'Visão e saúde ocular' },
      { key: 'decisionMaking', label: 'Tomada de decisões', description: 'Capacidade de planejamento' },
      { key: 'planningAbility', label: 'Capacidade de planejamento', description: 'Organização e estratégia' },
      { key: 'muscleStrength', label: 'Força muscular', description: 'Força e tônus muscular' },
      { key: 'creativity', label: 'Criatividade', description: 'Pensamento criativo e inovador' },
      { key: 'adaptability', label: 'Adaptabilidade', description: 'Flexibilidade às mudanças' }
    ]
  },
  {
    key: 'fire',
    name: 'Fogo (火)',
    icon: Flame,
    color: 'red',
    description: 'Coração, intestino delgado, língua, circulação, alegria',
    attributes: [
      { key: 'heartFunction', label: 'Função cardíaca', description: 'Saúde cardiovascular' },
      { key: 'socialWarmth', label: 'Calor social', description: 'Conexão e comunicação' },
      { key: 'joyExpression', label: 'Expressão da alegria', description: 'Capacidade de sentir prazer' },
      { key: 'communicationSkills', label: 'Habilidades de comunicação', description: 'Expressão verbal' },
      { key: 'enthusiasm', label: 'Entusiasmo', description: 'Energia vital e motivação' },
      { key: 'sleepIssues', label: 'Problemas de sono', description: 'Qualidade do descanso' },
      { key: 'emotionalStability', label: 'Estabilidade emocional', description: 'Equilíbrio das emoções' },
      { key: 'circulation', label: 'Circulação', description: 'Fluxo sanguíneo' },
      { key: 'speechClarity', label: 'Clareza da fala', description: 'Articulação verbal' }
    ]
  },
  {
    key: 'earth',
    name: 'Terra (土)',
    icon: Mountain,
    color: 'yellow',
    description: 'Baço, estômago, boca, digestão, pensamento',
    attributes: [
      { key: 'digestiveStrength', label: 'Força digestiva', description: 'Capacidade digestiva' },
      { key: 'overthinking', label: 'Pensamento excessivo', description: 'Ruminação mental' },
      { key: 'worry', label: 'Preocupação', description: 'Tendência à ansiedade' },
      { key: 'sweetCravings', label: 'Desejo por doces', description: 'Compulsão por açúcar' },
      { key: 'bloating', label: 'Inchaço digestivo', description: 'Desconforto após refeições' },
      { key: 'concentration', label: 'Concentração', description: 'Capacidade de foco' },
      { key: 'empathy', label: 'Empatia', description: 'Compreensão dos outros' },
      { key: 'stability', label: 'Estabilidade', description: 'Centramento emocional' },
      { key: 'nurturing', label: 'Capacidade de cuidar', description: 'Habilidade maternal/paternal' }
    ]
  },
  {
    key: 'metal',
    name: 'Metal (金)',
    icon: Gem,
    color: 'gray',
    description: 'Pulmões, intestino grosso, nariz, pele, organização',
    attributes: [
      { key: 'lungFunction', label: 'Função pulmonar', description: 'Saúde respiratória' },
      { key: 'skinHealth', label: 'Saúde da pele', description: 'Aparência e vitalidade da pele' },
      { key: 'griefProcessing', label: 'Processamento do luto', description: 'Lidar com perdas' },
      { key: 'eliminationFunction', label: 'Função de eliminação', description: 'Desintoxicação' },
      { key: 'immunity', label: 'Imunidade', description: 'Resistência a infecções' },
      { key: 'breathingQuality', label: 'Qualidade respiratória', description: 'Padrões respiratórios' },
      { key: 'organization', label: 'Organização', description: 'Ordem e estrutura' },
      { key: 'attention', label: 'Atenção aos detalhes', description: 'Precisão e cuidado' },
      { key: 'boundaries', label: 'Estabelecer limites', description: 'Fronteiras pessoais' }
    ]
  },
  {
    key: 'water',
    name: 'Água (水)',
    icon: Waves,
    color: 'blue',
    description: 'Rins, bexiga, ouvidos, ossos, vontade',
    attributes: [
      { key: 'kidneyFunction', label: 'Função renal', description: 'Saúde dos rins' },
      { key: 'fearLevels', label: 'Níveis de medo', description: 'Gestão da ansiedade' },
      { key: 'sexualVitality', label: 'Vitalidade sexual', description: 'Energia reprodutiva' },
      { key: 'boneHealth', label: 'Saúde óssea', description: 'Densidade óssea' },
      { key: 'willpower', label: 'Força de vontade', description: 'Determinação' },
      { key: 'coldTolerance', label: 'Tolerância ao frio', description: 'Adaptação térmica' },
      { key: 'hearingHealth', label: 'Saúde auditiva', description: 'Função auditiva' },
      { key: 'memoryFunction', label: 'Função da memória', description: 'Capacidade de memorização' },
      { key: 'ambition', label: 'Ambição', description: 'Impulso para objetivos' }
    ]
  }
];

  // 🎯 ESTILOS DE APRENDIZAGEM
  const learningStyles = [
    { value: 'visual', label: 'Visual', description: 'Aprende melhor com imagens, gráficos e diagramas' },
    { value: 'auditory', label: 'Auditivo', description: 'Aprende melhor ouvindo e discutindo' },
    { value: 'kinesthetic', label: 'Cinestésico', description: 'Aprende melhor através da prática e movimento' },
    { value: 'reading', label: 'Leitura/Escrita', description: 'Aprende melhor lendo e escrevendo' }
  ];

  // 🎯 SINTOMAS COGNITIVOS
  const cognitiveSymptoms = [
    { key: 'brainFog', label: 'Névoa mental', description: 'Sensação de mente confusa' },
    { key: 'concentrationDifficulty', label: 'Dificuldade de concentração', description: 'Problemas para manter foco' },
    { key: 'memoryLapses', label: 'Lapsos de memória', description: 'Esquecimentos frequentes' },
    { key: 'mentalFatigue', label: 'Fadiga mental', description: 'Cansaço cognitivo' },
    { key: 'decisionFatigue', label: 'Fadiga de decisão', description: 'Dificuldade para tomar decisões' },
    { key: 'wordFinding', label: 'Dificuldade para encontrar palavras', description: 'Problema de fluência verbal' },
    { key: 'multitaskingDifficulty', label: 'Dificuldade multitarefa', description: 'Problemas para fazer múltiplas atividades' }
  ];

  // 🎯 TRIGGERS DE ESTRESSE
  const stressTriggers = [
    'Sobrecarga de trabalho', 'Problemas financeiros', 'Conflitos relacionais',
    'Problemas de saúde', 'Mudanças na vida', 'Responsabilidades familiares',
    'Pressão social', 'Perfeccionismo', 'Incerteza do futuro', 'Tecnologia/mídia'
  ];

  // 🎯 MECANISMOS DE ENFRENTAMENTO
  const copingMechanisms = [
    'Meditação', 'Exercício físico', 'Respiração profunda', 'Yoga',
    'Caminhadas na natureza', 'Música', 'Leitura', 'Conversar com amigos',
    'Hobbies criativos', 'Terapia', 'Diário/escrita', 'Sono adequado'
  ];

  // 🔧 FUNÇÕES UTILITÁRIAS
const calculateElementScore = (elementData: any): number => {
  const values = Object.values(elementData) as number[];
  const numericValues = values.filter(v => typeof v === 'number');
  if (numericValues.length === 0) return 3; // valor médio
  return Math.round(numericValues.reduce((sum, val) => sum + val, 0) / numericValues.length);
};

const determineDominantElement = (): string => {
  const scores = {
    wood: calculateElementScore(data.functionalMedicine.fiveElements.wood),
    fire: calculateElementScore(data.functionalMedicine.fiveElements.fire), 
    earth: calculateElementScore(data.functionalMedicine.fiveElements.earth),
    metal: calculateElementScore(data.functionalMedicine.fiveElements.metal),
    water: calculateElementScore(data.functionalMedicine.fiveElements.water)
  };
  
  const maxScore = Math.max(...Object.values(scores));
  const dominantKey = Object.keys(scores).find(key => scores[key as keyof typeof scores] === maxScore);
  const element = elements.find(e => e.key === dominantKey);
  return element?.name || 'Equilibrado';
};

const assessElementBalance = (): string => {
  const scores = [
    calculateElementScore(data.functionalMedicine.fiveElements.wood),
    calculateElementScore(data.functionalMedicine.fiveElements.fire),
    calculateElementScore(data.functionalMedicine.fiveElements.earth), 
    calculateElementScore(data.functionalMedicine.fiveElements.metal),
    calculateElementScore(data.functionalMedicine.fiveElements.water)
  ];
  
  const max = Math.max(...scores);
  const min = Math.min(...scores);
  const difference = max - min;
  
  if (difference <= 1) return 'Elementos bem equilibrados';
  if (difference <= 2) return 'Desequilíbrio leve entre elementos';
  if (difference <= 3) return 'Desequilíbrio moderado - focar no elemento mais fraco';
  return 'Desequilíbrio significativo - requer harmonização';
};

const updateElementAttribute = (element: string, attribute: string, value: number) => {
  onUpdate({
    functionalMedicine: {
      ...data.functionalMedicine,
      fiveElements: {
        ...data.functionalMedicine.fiveElements,
        [element]: {
          ...data.functionalMedicine.fiveElements[element as keyof typeof data.functionalMedicine.fiveElements],
          [attribute]: value
        }
      }
    }
  });
};

  const updateCognitive = (field: string, value: any) => {
    onUpdate({
      cognitive: {
        ...data.cognitive,
        [field]: value
      }
    });
  };

  const updateCognitiveSymptom = (symptom: string, value: boolean) => {
    onUpdate({
      cognitive: {
        ...data.cognitive,
        cognitiveSymptoms: {
          ...data.cognitive.cognitiveSymptoms,
          [symptom]: value
        }
      }
    });
  };

  const updateStressResponse = (field: string, value: any) => {
    onUpdate({
      cognitive: {
        ...data.cognitive,
        stressResponse: {
          ...data.cognitive.stressResponse,
          [field]: value
        }
      }
    });
  };

  const toggleArrayItem = (field: string, item: string, category: 'stress' | 'coping') => {
    const currentArray = category === 'stress' 
      ? data.cognitive.stressResponse.stressTriggers 
      : data.cognitive.stressResponse.copingMechanisms;
      
    const newArray = currentArray.includes(item)
      ? currentArray.filter(i => i !== item)
      : [...currentArray, item];
    
    updateStressResponse(field, newArray);
  };

  return (
    <div className="space-y-8">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('elements')}
          className={`px-6 py-3 font-medium text-sm transition-colors ${
            activeTab === 'elements'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4" />
            5 Elementos MTC
          </div>
        </button>
        <button
          onClick={() => setActiveTab('cognitive')}
          className={`px-6 py-3 font-medium text-sm transition-colors ${
            activeTab === 'cognitive'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Capacidades Cognitivas
          </div>
        </button>
      </div>

      {/* Conteúdo dos 5 Elementos */}
      {activeTab === 'elements' && (
        <div className="space-y-8">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Medicina Tradicional Chinesa - 5 Elementos</h3>
            <p className="text-sm text-gray-600">
              Avalie cada aspecto numa escala de 1-10, onde 1 = muito desequilibrado/problemático e 10 = muito equilibrado/saudável.
            </p>
          </div>

          {elements.map((element) => {
            const ElementIcon = element.icon;
            const elementData = data.functionalMedicine.fiveElements[element.key as keyof typeof data.functionalMedicine.fiveElements];
            const elementScore = calculateElementScore(elementData);
            
            return (
              <div key={element.key} className="border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg bg-${element.color}-100`}>
                    <ElementIcon className={`w-6 h-6 text-${element.color}-600`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{element.name}</h3>
                    <p className="text-sm text-gray-600">{element.description}</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold text-${element.color}-600`}>
                      {elementScore}/10
                    </div>
                    <div className="text-xs text-gray-500">Score médio</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {element.attributes.map((attr) => (
                    <div key={attr.key} className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        {attr.label}
                      </label>
                      <p className="text-xs text-gray-500">{attr.description}</p>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                          <button
                            key={value}
                            onClick={() => updateElementAttribute(element.key, attr.key, value)}
                            className={`w-8 h-8 rounded text-xs font-medium transition-all ${
                              elementData[attr.key as keyof typeof elementData] === value
                                ? `bg-${element.color}-500 text-white`
                                : `border border-${element.color}-300 hover:bg-${element.color}-100`
                            }`}
                          >
                            {value}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Conteúdo Cognitivo */}
      {activeTab === 'cognitive' && (
        <div className="space-y-8">
          {/* Capacidades Cognitivas Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { key: 'focusQuality', label: 'Qualidade do Foco', icon: Eye },
              { key: 'memoryQuality', label: 'Qualidade da Memória', icon: Brain },
              { key: 'mentalClarity', label: 'Clareza Mental', icon: Zap },
              { key: 'creativityLevel', label: 'Nível de Criatividade', icon: Heart },
              { key: 'learningSpeed', label: 'Velocidade de Aprendizado', icon: TrendingUp }
            ].map((capacity) => {
              const CapacityIcon = capacity.icon;
              return (
                <div key={capacity.key} className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <CapacityIcon className="w-4 h-4" />
                    {capacity.label}
                  </label>
                  <div className="grid grid-cols-5 gap-1">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        onClick={() => updateCognitive(capacity.key, value)}
                        className={`p-3 rounded border text-sm font-medium transition-all ${
                          data.cognitive[capacity.key as keyof typeof data.cognitive] === value
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                  <div className="text-xs text-gray-500 grid grid-cols-5 gap-1">
                    <span>Muito baixo</span>
                    <span>Baixo</span>
                    <span>Médio</span>
                    <span>Alto</span>
                    <span>Muito alto</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Estilo de Aprendizagem */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-3 block">
              Seu estilo de aprendizagem preferido
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {learningStyles.map((style) => (
                <div
                  key={style.value}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    data.cognitive.preferredLearningStyle === style.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => updateCognitive('preferredLearningStyle', style.value)}
                >
                  <h4 className="font-medium text-gray-900 mb-1">{style.label}</h4>
                  <p className="text-sm text-gray-600">{style.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Span de Atenção */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Span de atenção sustentada (minutos)
            </label>
            <input
              type="number"
              value={data.cognitive.attentionSpan || ''}
              onChange={(e) => updateCognitive('attentionSpan', parseInt(e.target.value) || 0)}
              className="w-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="30"
              min="1"
              max="240"
            />
            <p className="mt-1 text-xs text-gray-500">
              Por quanto tempo você consegue manter foco numa tarefa sem interrupções?
            </p>
          </div>

          {/* Sintomas Cognitivos */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
              <AlertCircle className="w-4 h-4" />
              Sintomas cognitivos que você experimenta (selecione todos que se aplicam)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {cognitiveSymptoms.map((symptom) => (
                <label
                  key={symptom.key}
                  className="flex items-start gap-3 p-3 rounded hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={data.cognitive.cognitiveSymptoms[symptom.key as keyof typeof data.cognitive.cognitiveSymptoms]}
                    onChange={(e) => updateCognitiveSymptom(symptom.key, e.target.checked)}
                    className="mt-1 rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">{symptom.label}</span>
                    <p className="text-xs text-gray-500">{symptom.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Resposta ao Estresse */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Resposta ao Estresse
            </h3>
            
            <div className="space-y-6">
              {/* Gatilhos de Estresse */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Principais gatilhos de estresse (selecione todos que se aplicam)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {stressTriggers.map((trigger) => (
                    <label
                      key={trigger}
                      className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={data.cognitive.stressResponse.stressTriggers.includes(trigger)}
                        onChange={() => toggleArrayItem('stressTriggers', trigger, 'stress')}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-sm text-gray-700">{trigger}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Mecanismos de Enfrentamento */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Mecanismos de enfrentamento que você usa (selecione todos que se aplicam)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {copingMechanisms.map((mechanism) => (
                    <label
                      key={mechanism}
                      className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={data.cognitive.stressResponse.copingMechanisms.includes(mechanism)}
                        onChange={() => toggleArrayItem('copingMechanisms', mechanism, 'coping')}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700">{mechanism}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Recuperação do Estresse */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-3 block">
                  Velocidade de recuperação do estresse
                </label>
                <div className="flex items-center gap-4">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      onClick={() => updateStressResponse('stressRecovery', value)}
                      className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all ${
                        data.cognitive.stressResponse.stressRecovery === value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-lg font-semibold">{value}</span>
                      <span className="text-xs text-center">
                        {value === 1 && 'Muito lenta'}
                        {value === 2 && 'Lenta'}
                        {value === 3 && 'Moderada'}
                        {value === 4 && 'Rápida'}
                        {value === 5 && 'Muito rápida'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Insights Integrados */}
      {insights.dominantElement && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="font-medium text-blue-900">Análise Integrada - Medicina Funcional & Cognitivo</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Perfil MTC */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Perfil de Medicina Tradicional Chinesa</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-blue-700">Elemento dominante:</span>
                  <span className="ml-2 font-medium">{insights.dominantElement}</span>
                </div>
                <div>
                  <span className="text-blue-700">Equilíbrio dos elementos:</span>
                  <span className="ml-2 font-medium">{insights.elementBalance}</span>
                </div>
              </div>
            </div>

            {/* Perfil Cognitivo */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Perfil Cognitivo</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-blue-700">Avaliação geral:</span>
                  <span className="ml-2 font-medium">{insights.cognitiveProfile}</span>
                </div>
                <div>
                  <span className="text-blue-700">Estilo de aprendizagem:</span>
                  <span className="ml-2 font-medium">
                    {learningStyles.find(s => s.value === data.cognitive.preferredLearningStyle)?.label || 'Não definido'}
                  </span>
                </div>
                <div>
                  <span className="text-blue-700">Span de atenção:</span>
                  <span className="ml-2 font-medium">{data.cognitive.attentionSpan} minutos</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recomendações */}
          {insights.recommendations && insights.recommendations.length > 0 && (
            <div className="mt-4 pt-4 border-t border-blue-200">
              <span className="text-blue-700 font-medium">Recomendações personalizadas:</span>
              <ul className="mt-2 space-y-1">
                {insights.recommendations.map((rec, index) => (
                  <li key={index} className="text-blue-600 text-sm flex items-center gap-1">
                    <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Informações Científicas */}
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-blue-900 mb-2">Medicina Funcional Integrativa</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>5 Elementos MTC:</strong> Sistema holístico que conecta órgãos, emoções e funções</li>
              <li>• <strong>Medicina funcional:</strong> Abordagem que busca as causas raiz dos desequilíbrios</li>
              <li>• <strong>Neuroplasticidade:</strong> Capacidade do cérebro de se reorganizar e adaptar</li>
              <li>• <strong>Conexão mente-corpo:</strong> Influência mútua entre saúde física e mental</li>
              <li>• <strong>Personalização:</strong> Tratamentos baseados no perfil individual único</li>
              <li>• <strong>Prevenção ativa:</strong> Otimização contínua em vez de apenas tratamento de doenças</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiohackingStep6;