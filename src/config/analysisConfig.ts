// config/analysisConfig.ts
import { Calendar, Activity, Brain, Zap } from 'lucide-react';

export type AnalysisType = 'birth' | 'biohacking' | 'psychological' | 'cognitive';

export interface AnalysisConfig {
  id: AnalysisType;
  title: string;
  subtitle: string;
  emoji: string;
  estimatedTime: string;
  icon: any;
  description: string;
  route: string;
  detailedDescription: string;
  benefits: string[];
  scientificBasis: string;
  dependencies: AnalysisType[]; // Quais análises são pré-requisitos
  dataStructure: Record<string, any>; // Estrutura esperada dos dados
}

export const ANALYSIS_CONFIGS: Record<AnalysisType, AnalysisConfig> = {
  birth: {
    id: 'birth',
    title: 'Dados de Nascimento',
    subtitle: 'Astrologia & Numerologia',
    emoji: '🌟',
    estimatedTime: '2 min',
    icon: Calendar,
    description: 'Descubra os padrões ancestrais que moldam sua essência através da sabedoria astrológica e numerológica milenar.',
    route: '/analysis/birth',
    detailedDescription: `
      Esta análise utiliza seus dados de nascimento para mapear características fundamentais 
      da sua personalidade através de sistemas ancestrais de conhecimento. Combinamos:
      
      • Astrologia Ocidental: Posições planetárias e aspectos no momento do nascimento
      • Numerologia: Padrões numerológicos derivados do nome e data de nascimento
      • Astrologia Chinesa: Animal do ano e elementos associados
      
      Estes sistemas oferecem insights sobre tendências naturais, potenciais, desafios 
      e oportunidades de crescimento únicos para você.
    `,
    benefits: [
      'Compreensão profunda da sua essência natural',
      'Identificação de talentos e potenciais inatos',
      'Insights sobre padrões comportamentais',
      'Orientação para tomada de decisões importantes',
      'Base para todas as outras análises'
    ],
    scientificBasis: 'Sistemas ancestrais de conhecimento validados por milhares de anos de aplicação prática',
    dependencies: [],
    dataStructure: {
      nome: 'string',
      data_nascimento: 'date',
      hora_nascimento: 'time',
      local_nascimento: 'string',
      latitude: 'number',
      longitude: 'number'
    }
  },

  biohacking: {
    id: 'biohacking',
    title: 'Perfil Biológico',
    subtitle: 'Sono, Nutrição & Energia',
    emoji: '💪',
    estimatedTime: '10-15 min',
    icon: Activity,
    description: 'Otimize seu corpo através de dados científicos sobre sono, alimentação, exercícios e padrões biológicos únicos.',
    route: '/analysis/biohacking',
    detailedDescription: `
      Análise científica dos seus padrões biológicos e hábitos de saúde para otimização 
      da performance física e mental. Avaliamos:
      
      • Cronótipo e padrões de sono
      • Preferências nutricionais e digestão
      • Resposta ao exercício e recuperação
      • Níveis de energia ao longo do dia
      • Marcadores de stress e bem-estar
      
      Esta análise fornece a base biológica para personalizar todas as outras 
      recomendações do sistema.
    `,
    benefits: [
      'Otimização dos padrões de sono e energia',
      'Estratégias nutricionais personalizadas',
      'Protocolos de exercício adequados ao seu tipo',
      'Métodos de recuperação e gestão de stress',
      'Aumento da vitalidade e performance geral'
    ],
    scientificBasis: 'Medicina funcional, cronobiologia, nutrição personalizada e ciência do exercício',
    dependencies: ['birth'],
    dataStructure: {
      cronótipo: 'string',
      qualidade_sono: 'number',
      energia_manhã: 'number',
      exercicio_frequencia: 'string',
      alimentacao_padroes: 'object',
      stress_nivel: 'number',
      suplementos: 'array'
    }
  },

  psychological: {
    id: 'psychological',
    title: 'Perfil Psicológico',
    subtitle: 'Big Five & Padrões Mentais',
    emoji: '🧠',
    estimatedTime: '15-20 min',
    icon: Brain,
    description: 'Explore sua personalidade profunda com avaliações científicas que revelam seus padrões comportamentais e motivações.',
    route: '/analysis/psychological',
    detailedDescription: `
      Avaliação psicológica científica baseada nos modelos mais validados da psicologia 
      moderna. Inclui:
      
      • Big Five: Os cinco grandes fatores de personalidade
      • DISC: Estilos comportamentais em diferentes contextos
      • Inteligência Emocional: Capacidades emocionais e sociais
      • Padrões de Motivação: O que realmente te move
      • Estilos de Comunicação: Como você se relaciona com outros
      
      Esta análise revela as estruturas profundas da sua mente e comportamento.
    `,
    benefits: [
      'Autoconhecimento profundo e científico',
      'Compreensão dos seus padrões relacionais',
      'Estratégias para desenvolvimento pessoal',
      'Melhoria da comunicação e liderança',
      'Base para escolhas de carreira e relacionamentos'
    ],
    scientificBasis: 'Psicologia científica: Big Five, DISC, teorias de motivação e inteligência emocional',
    dependencies: ['birth', 'biohacking'],
    dataStructure: {
      big_five_scores: 'object',
      disc_profile: 'object',
      emotional_intelligence: 'object',
      motivation_patterns: 'object',
      communication_style: 'string'
    }
  },

  cognitive: {
    id: 'cognitive',
    title: 'Perfil Cognitivo',
    subtitle: 'Aprendizado & Processamento',
    emoji: '⚡',
    estimatedTime: '12-18 min',
    icon: Zap,
    description: 'Entenda como sua mente processa informações e otimize suas estratégias de aprendizado e criatividade.',
    route: '/analysis/cognitive',
    detailedDescription: `
      Análise das suas capacidades cognitivas e estilos de processamento mental. 
      Avaliamos:
      
      • Estilos de Aprendizagem: Como você melhor absorve informação
      • Processamento Cognitivo: Sequencial vs. holístico
      • Criatividade: Padrões de pensamento inovador
      • Tomada de Decisão: Como você processa escolhas
      • Capacidades Executivas: Planejamento, foco e organização
      
      Esta análise completa o mapeamento das suas capacidades mentais únicas.
    `,
    benefits: [
      'Estratégias de aprendizado otimizadas',
      'Métodos de estudo mais eficazes',
      'Desenvolvimento da criatividade',
      'Melhoria na tomada de decisões',
      'Aumento da produtividade mental'
    ],
    scientificBasis: 'Neurociência cognitiva, psicologia da aprendizagem e teorias de inteligência múltipla',
    dependencies: ['birth', 'biohacking', 'psychological'],
    dataStructure: {
      learning_styles: 'object',
      processing_preferences: 'object',
      creativity_patterns: 'object',
      decision_making_style: 'string',
      executive_functions: 'object'
    }
  }
};

// Helper functions
export const getAnalysisConfig = (analysisType: AnalysisType): AnalysisConfig => {
  return ANALYSIS_CONFIGS[analysisType];
};

export const getAllAnalysisConfigs = (): AnalysisConfig[] => {
  return Object.values(ANALYSIS_CONFIGS);
};

export const getAnalysisOrder = (): AnalysisType[] => {
  return ['birth', 'biohacking', 'psychological', 'cognitive'];
};

export const getNextAnalysis = (currentAnalysis: AnalysisType): AnalysisType | null => {
  const order = getAnalysisOrder();
  const currentIndex = order.indexOf(currentAnalysis);
  return currentIndex < order.length - 1 ? order[currentIndex + 1] : null;
};

export const getPreviousAnalysis = (currentAnalysis: AnalysisType): AnalysisType | null => {
  const order = getAnalysisOrder();
  const currentIndex = order.indexOf(currentAnalysis);
  return currentIndex > 0 ? order[currentIndex - 1] : null;
};

export const canAccessAnalysis = (
  analysisType: AnalysisType, 
  completedAnalyses: AnalysisType[]
): boolean => {
  const config = getAnalysisConfig(analysisType);
  return config.dependencies.every(dep => completedAnalyses.includes(dep));
};

export const getAnalysisProgress = (completedAnalyses: AnalysisType[]): number => {
  return Math.round((completedAnalyses.length / 4) * 100);
};

export const getAnalysisStats = (completedAnalyses: AnalysisType[]) => {
  const total = 4;
  const completed = completedAnalyses.length;
  const remaining = total - completed;
  const progress = getAnalysisProgress(completedAnalyses);
  const canAccessResults = completed === total;
  
  return {
    total,
    completed,
    remaining,
    progress,
    canAccessResults
  };
};