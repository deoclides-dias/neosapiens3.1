// src/config/resultsConfig.ts

import { 
  Calendar, 
  Activity, 
  Brain, 
  Zap, 
  Target,
  Star,
  Compass,
  TrendingUp,
  BarChart3,
  Heart,
  Lightbulb,
  Users
} from 'lucide-react';

export interface ResultsConfigItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  icon: React.ElementType;
  color: string;
  gradient: string;
  bgGradient: string;
  category: 'traditions' | 'biohacking' | 'psychological' | 'cognitive' | 'integrated';
  dependencies: string[];
  estimatedTime: string;
  insights: string[];
  benefits: string[];
  components: string[];
  dataRequirements: string[];
  featured?: boolean;
}

export const resultsConfig: ResultsConfigItem[] = [
  {
    id: 'traditions',
    title: 'Análise de Tradições',
    subtitle: 'Astrologia & Numerologia',
    description: 'Mapa astral, Pentagon elemental e Radar numerológico integrados',
    longDescription: 'Explore sua essência através de três tradições milenares: Astrologia Ocidental revela sua personalidade através dos astros, Astrologia Chinesa mostra seu equilíbrio elemental, e a Numerologia decifra os padrões do seu destino através dos números.',
    icon: Calendar,
    color: 'purple',
    gradient: 'from-purple-500 to-indigo-600',
    bgGradient: 'from-purple-50 to-indigo-50',
    category: 'traditions',
    dependencies: ['birth_data'],
    estimatedTime: '15-20 min',
    insights: [
      'Mapa astral personalizado com planetas e aspectos',
      'Pentagon dos cinco elementos chineses',
      'Radar numerológico com números pessoais',
      'Síntese integrada das três tradições',
      'Compatibilidade entre sistemas',
      'Recomendações baseadas em convergências'
    ],
    benefits: [
      'Autoconhecimento profundo através de múltiplas perspectivas',
      'Compreensão de padrões de personalidade',
      'Insights sobre potenciais e desafios',
      'Orientação para desenvolvimento pessoal',
      'Base sólida para outras análises'
    ],
    components: [
      'AstrologyWheel - Mapa astral interativo',
      'ChineseAstrologyPentagon - Pentagon dos elementos',
      'NumerologyRadar - Radar numerológico',
      'TraditionsIntegration - Síntese integrada'
    ],
    dataRequirements: [
      'Data de nascimento completa',
      'Hora exata de nascimento',
      'Local de nascimento com coordenadas',
      'Nome completo'
    ],
    featured: true
  },
  {
    id: 'biohacking',
    title: 'Perfil Biológico',
    subtitle: 'Biohacking & Saúde',
    description: 'Dashboard completo de sono, nutrição, energia e exercícios',
    longDescription: 'Otimize sua biologia através de análises científicas de sono, nutrição, exercícios e biomarcadores. Descubra como seu corpo responde a diferentes estímulos e receba recomendações personalizadas para melhorar sua performance e bem-estar.',
    icon: Activity,
    color: 'green',
    gradient: 'from-green-500 to-emerald-600',
    bgGradient: 'from-green-50 to-emerald-50',
    category: 'biohacking',
    dependencies: ['biohacking_data'],
    estimatedTime: '25-30 min',
    insights: [
      'Análise de padrões de sono e recuperação',
      'Perfil nutricional e metabolismo',
      'Capacidade cardiovascular e muscular',
      'Níveis de energia ao longo do dia',
      'Resposta ao estresse e recuperação',
      'Recomendações de otimização biológica'
    ],
    benefits: [
      'Melhoria da qualidade do sono',
      'Otimização da nutrição pessoal',
      'Aumento dos níveis de energia',
      'Performance física aprimorada',
      'Longevidade e bem-estar geral'
    ],
    components: [
      'SleepAnalysisDashboard - Análise do sono',
      'NutritionProfileChart - Perfil nutricional',
      'EnergyLevelsTracker - Rastreamento de energia',
      'BiohackingRecommendations - Recomendações'
    ],
    dataRequirements: [
      'Dados de sono (duração, qualidade)',
      'Padrões alimentares e preferências',
      'Atividade física e exercícios',
      'Níveis de energia e humor',
      'Biomarcadores básicos (opcional)'
    ]
  },
  {
    id: 'psychological',
    title: 'Perfil Psicológico',
    subtitle: 'Personalidade & Comportamento',
    description: 'Análise Big Five, DISC, VARK e Multiple Intelligence',
    longDescription: 'Compreenda profundamente sua psique através de múltiplos modelos psicológicos validados cientificamente. Descubra seus traços de personalidade, estilos de comportamento, preferências de aprendizado e tipos de inteligência.',
    icon: Brain,
    color: 'blue',
    gradient: 'from-blue-500 to-cyan-600',
    bgGradient: 'from-blue-50 to-cyan-50',
    category: 'psychological',
    dependencies: ['psychological_data'],
    estimatedTime: '35-40 min',
    insights: [
      'Perfil Big Five detalhado (OCEAN)',
      'Análise DISC comportamental',
      'Estilo de aprendizado VARK',
      'Múltiplas inteligências de Gardner',
      'Padrões de tomada de decisão',
      'Compatibilidade interpessoal'
    ],
    benefits: [
      'Autoconhecimento psicológico profundo',
      'Melhoria em relacionamentos',
      'Otimização do aprendizado',
      'Desenvolvimento de soft skills',
      'Escolhas de carreira mais assertivas'
    ],
    components: [
      'BigFiveRadarChart - Análise Big Five',
      'DISCBehaviorMatrix - Matriz DISC',
      'VARKLearningStyles - Estilos de aprendizado',
      'MultipleIntelligences - Inteligências múltiplas'
    ],
    dataRequirements: [
      'Questionário Big Five (104 questões)',
      'Avaliação DISC comportamental',
      'Teste de estilos de aprendizado VARK',
      'Avaliação de inteligências múltiplas',
      'Situações de tomada de decisão'
    ]
  },
  {
    id: 'cognitive',
    title: 'Perfil Cognitivo',
    subtitle: 'Aprendizado & Processamento',
    description: 'Dashboard de estilos de aprendizado e capacidades cognitivas',
    longDescription: 'Mapeie suas capacidades cognitivas e otimize seu potencial intelectual. Analise velocidade de processamento, memória, atenção, flexibilidade mental e estratégias de aprendizado mais eficazes.',
    icon: Zap,
    color: 'yellow',
    gradient: 'from-yellow-500 to-orange-600',
    bgGradient: 'from-yellow-50 to-orange-50',
    category: 'cognitive',
    dependencies: ['cognitive_data'],
    estimatedTime: '30-35 min',
    insights: [
      'Velocidade de processamento cognitivo',
      'Capacidade de memória (curta e longa)',
      'Níveis de atenção e concentração',
      'Flexibilidade e adaptabilidade mental',
      'Estratégias ótimas de aprendizado',
      'Potencial de desenvolvimento cognitivo'
    ],
    benefits: [
      'Aprendizado mais eficiente',
      'Melhoria da produtividade mental',
      'Desenvolvimento de estratégias cognitivas',
      'Otimização da performance intelectual',
      'Prevenção de declínio cognitivo'
    ],
    components: [
      'ProcessingSpeedTest - Velocidade de processamento',
      'MemoryAssessment - Avaliação de memória',
      'AttentionAnalysis - Análise de atenção',
      'CognitiveFlex - Flexibilidade mental'
    ],
    dataRequirements: [
      'Testes de velocidade de processamento',
      'Avaliações de memória',
      'Exercícios de atenção sustentada',
      'Testes de flexibilidade cognitiva',
      'Preferências de aprendizado'
    ]
  },
  {
    id: 'integrated',
    title: 'Análise Integrada',
    subtitle: 'Síntese Completa',
    description: 'Algoritmo que combina todas as dimensões em insights únicos',
    longDescription: 'A síntese definitiva de todas suas análises através de algoritmos avançados de inteligência artificial. Descubra padrões ocultos, correlações entre dimensões e receba um plano de desenvolvimento verdadeiramente personalizado.',
    icon: Target,
    color: 'red',
    gradient: 'from-red-500 to-pink-600',
    bgGradient: 'from-red-50 to-pink-50',
    category: 'integrated',
    dependencies: ['traditions', 'biohacking', 'psychological', 'cognitive'],
    estimatedTime: '20-25 min',
    insights: [
      'Correlações entre todas as dimensões',
      'Padrões únicos de personalidade',
      'Potenciais inexplorados identificados',
      'Pontos de alavancagem para crescimento',
      'Plano de desenvolvimento integrado',
      'Previsões de evolução pessoal'
    ],
    benefits: [
      'Visão holística completa de si mesmo',
      'Plano de desenvolvimento personalizado',
      'Identificação de potenciais únicos',
      'Estratégias de crescimento otimizadas',
      'Direcionamento claro de vida'
    ],
    components: [
      'IntegratedMatrix - Matriz de correlações',
      'PersonalityUnique - Padrão único',
      'GrowthPathway - Caminho de crescimento',
      'LifeDirection - Direcionamento de vida'
    ],
    dataRequirements: [
      'Todas as análises anteriores completas',
      'Dados de qualidade validados',
      'Preferências de desenvolvimento',
      'Objetivos de longo prazo'
    ],
    featured: true
  }
];

// Utilitários para trabalhar com a configuração
export const getResultById = (id: string): ResultsConfigItem | undefined => {
  return resultsConfig.find(result => result.id === id);
};

export const getResultsByCategory = (category: ResultsConfigItem['category']): ResultsConfigItem[] => {
  return resultsConfig.filter(result => result.category === category);
};

export const getFeaturedResults = (): ResultsConfigItem[] => {
  return resultsConfig.filter(result => result.featured);
};

export const getAvailableResults = (completedAnalyses: string[]): ResultsConfigItem[] => {
  return resultsConfig.filter(result => 
    result.dependencies.every(dep => completedAnalyses.includes(dep))
  );
};

export const getResultStatus = (
  result: ResultsConfigItem, 
  completedAnalyses: string[], 
  availableAnalyses: string[]
): 'available' | 'completed' | 'locked' | 'processing' => {
  
  if (completedAnalyses.includes(result.id)) {
    return 'completed';
  }
  
  if (availableAnalyses.includes(result.id)) {
    return 'processing';
  }
  
  const hasAllDependencies = result.dependencies.every(dep => 
    completedAnalyses.includes(dep) || availableAnalyses.includes(dep)
  );
  
  if (hasAllDependencies) {
    return 'available';
  }
  
  return 'locked';
};

// Dados para estatísticas e métricas
export interface ResultsMetrics {
  totalResults: number;
  averageCompletionTime: string;
  totalInsights: number;
  userSatisfaction: number;
  accuracyRate: number;
}

export const resultsMetrics: ResultsMetrics = {
  totalResults: resultsConfig.length,
  averageCompletionTime: '2h 15min',
  totalInsights: 127,
  userSatisfaction: 4.8,
  accuracyRate: 94
};

// Mapeamento de cores para classes CSS
export const colorMap = {
  purple: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-600',
    button: 'bg-purple-600 hover:bg-purple-700'
  },
  green: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-600',
    button: 'bg-green-600 hover:bg-green-700'
  },
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-600',
    button: 'bg-blue-600 hover:bg-blue-700'
  },
  yellow: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-600',
    button: 'bg-yellow-600 hover:bg-yellow-700'
  },
  red: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-600',
    button: 'bg-red-600 hover:bg-red-700'
  }
};

export default resultsConfig;