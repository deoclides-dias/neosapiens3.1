// src/services/cognitiveService.ts

import { supabase } from '../lib/supabase';

// =============================================================================
// INTERFACES E TIPOS
// =============================================================================

export interface CognitiveData {
  // ESTILOS DE APRENDIZAGEM (16 questões)
  visual_learning: number[];
  auditory_learning: number[];
  reading_learning: number[];
  kinesthetic_learning: number[];
  
  // PROCESSAMENTO COGNITIVO (12 questões)
  sequential_processing: number[];
  holistic_processing: number[];
  analytical_thinking: number[];
  intuitive_thinking: number[];
  
  // CRIATIVIDADE & INOVAÇÃO (8 questões)
  creative_thinking: number[];
  problem_solving: number[];
  
  // TOMADA DE DECISÃO (12 questões)
  rational_decisions: number[];
  emotional_decisions: number[];
  quick_decisions: number[];
  deliberative_decisions: number[];
  
  // FUNÇÕES EXECUTIVAS (9 questões)
  planning_organization: number[];
  focus_attention: number[];
  cognitive_flexibility: number[];
  
  // CAPACIDADES COGNITIVAS (12 questões)
  memory_span: number[];
  pattern_recognition: number[];
  processing_speed: number[];
  working_memory: number[];
}

export interface CognitiveScores {
  // ESTILOS DE APRENDIZAGEM
  visual_score: number;
  auditory_score: number;
  reading_score: number;
  kinesthetic_score: number;
  dominant_learning_style: string;
  
  // PROCESSAMENTO COGNITIVO
  sequential_score: number;
  holistic_score: number;
  analytical_score: number;
  intuitive_score: number;
  processing_style: string;
  
  // CRIATIVIDADE & INOVAÇÃO
  creativity_score: number;
  innovation_score: number;
  problem_solving_score: number;
  creative_type: string;
  
  // TOMADA DE DECISÃO
  rational_decision_score: number;
  emotional_decision_score: number;
  decision_speed_score: number;
  decision_style: string;
  
  // FUNÇÕES EXECUTIVAS
  planning_score: number;
  focus_score: number;
  flexibility_score: number;
  executive_functioning: string;
  
  // CAPACIDADES COGNITIVAS
  memory_span_score: number;
  pattern_recognition_score: number;
  processing_speed_score: number;
  working_memory_score: number;
  cognitive_capacity_level: string;
  
  // PERFIL GERAL
  cognitive_profile: any;
  learning_recommendations: any;
  strengths: string[];
  improvement_areas: string[];
  
  // ESTATÍSTICAS
  completion_percentage: number;
  completion_date?: Date;
}

export interface CognitiveProgress {
  currentStep: number;
  completedSteps: number[];
  overallProgress: number;
  isComplete: boolean;
  data: Partial<CognitiveData>;
}

// =============================================================================
// CLASSE PRINCIPAL DO SERVIÇO
// =============================================================================

export class CognitiveService {
  
  // ===========================================================================
  // MÉTODO 1: OBTER PROGRESSO COGNITIVO
  // ===========================================================================
  
  static async getCognitiveProgress(userId: string): Promise<{
    success: boolean;
    progress?: CognitiveProgress;
    error?: string;
  }> {
    try {
      console.log('🔍 Buscando progresso cognitivo para usuário:', userId);

      const { data, error } = await supabase
        .from('onboarding_progress')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(1);

      if (error) {
        throw error;
      }

      if (!data || data.length === 0) {
        return {
          success: true,
          progress: {
            currentStep: 1,
            completedSteps: [],
            overallProgress: 0,
            isComplete: false,
            data: {}
          }
        };
      }

      const record = data[0];
      const cognitiveData = record.cognitive_data || {};
      
      // Calcular progresso baseado nos dados existentes
      const completedSteps = this.calculateCompletedSteps(cognitiveData);
      const overallProgress = Math.round((completedSteps.length / 6) * 100);

      return {
        success: true,
        progress: {
          currentStep: record.step || 1,
          completedSteps,
          overallProgress,
          isComplete: completedSteps.length === 6,
          data: cognitiveData
        }
      };

    } catch (error) {
      console.error('❌ Erro ao buscar progresso cognitivo:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  // ===========================================================================
  // MÉTODO 2: SALVAR PROGRESSO COGNITIVO
  // ===========================================================================
  
  static async saveCognitiveProgress(
    userId: string,
    data: Partial<CognitiveData>,
    currentStep: number,
    completedSteps: number[]
  ): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('💾 Salvando progresso cognitivo...', { userId, currentStep });

      // Buscar registro existente
      const { data: existingData, error: fetchError } = await supabase
        .from('onboarding_progress')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(1);

      if (fetchError) {
        throw fetchError;
      }

      const updateData = {
        step: Math.max(currentStep, 3), // Mínimo step 3 para cognitive
        cognitive_data: data,
        cognitive_data_complete: completedSteps.length === 6,
        updated_at: new Date().toISOString()
      };

      let result;

      if (existingData && existingData.length > 0) {
        // Atualizar registro existente
        result = await supabase
          .from('onboarding_progress')
          .update(updateData)
          .eq('id', existingData[0].id);
      } else {
        // Criar novo registro
        result = await supabase
          .from('onboarding_progress')
          .insert({
            user_id: userId,
            ...updateData
          });
      }

      if (result.error) {
        throw result.error;
      }

      console.log('✅ Progresso cognitivo salvo com sucesso!');
      return { success: true };

    } catch (error) {
      console.error('❌ Erro ao salvar progresso cognitivo:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  // ===========================================================================
  // MÉTODO 3: VALIDAR DADOS COGNITIVOS
  // ===========================================================================
  
  static validateCognitiveData(data: Partial<CognitiveData>): boolean {
    try {
      const required = [
        'visual_learning', 'auditory_learning', 'reading_learning', 'kinesthetic_learning',
        'sequential_processing', 'holistic_processing', 'analytical_thinking', 'intuitive_thinking',
        'creative_thinking', 'problem_solving',
        'rational_decisions', 'emotional_decisions', 'quick_decisions', 'deliberative_decisions',
        'planning_organization', 'focus_attention', 'cognitive_flexibility',
        'memory_span', 'pattern_recognition', 'processing_speed', 'working_memory'
      ];

      for (const field of required) {
        const fieldData = data[field as keyof CognitiveData];
        if (!fieldData || !Array.isArray(fieldData)) {
          return false;
        }
        
        // Verificar se todas as respostas foram preenchidas (> 0)
        if (fieldData.some(answer => answer <= 0)) {
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Erro na validação cognitiva:', error);
      return false;
    }
  }

  // ===========================================================================
  // MÉTODO 4: CALCULAR PROGRESSO GERAL
  // ===========================================================================
  
  static calculateOverallProgress(): number {
    // Este método agora é mais simples - só retorna um valor base
    // O progresso real é calculado baseado nos steps completados
    return 0;
  }

  // ===========================================================================
  // MÉTODO 5: CALCULAR STEPS COMPLETADOS
  // ===========================================================================
  
  private static calculateCompletedSteps(data: Partial<CognitiveData>): number[] {
    const completed: number[] = [];
    
    const stepConfig = [
      { id: 1, fields: ['visual_learning', 'auditory_learning', 'reading_learning', 'kinesthetic_learning'] },
      { id: 2, fields: ['sequential_processing', 'holistic_processing', 'analytical_thinking', 'intuitive_thinking'] },
      { id: 3, fields: ['creative_thinking', 'problem_solving'] },
      { id: 4, fields: ['rational_decisions', 'emotional_decisions', 'quick_decisions', 'deliberative_decisions'] },
      { id: 5, fields: ['planning_organization', 'focus_attention', 'cognitive_flexibility'] },
      { id: 6, fields: ['memory_span', 'pattern_recognition', 'processing_speed', 'working_memory'] }
    ];

    stepConfig.forEach(step => {
      const isStepComplete = step.fields.every(field => {
        const fieldData = data[field as keyof CognitiveData];
        return fieldData && Array.isArray(fieldData) && fieldData.length > 0 && fieldData.every(answer => answer > 0);
      });
      
      if (isStepComplete) {
        completed.push(step.id);
      }
    });
    
    return completed;
  }

  // ===========================================================================
  // MÉTODO 6: CALCULAR E SALVAR SCORES FINAIS
  // ===========================================================================
  
  static async calculateAndSaveScores(
    userId: string,
    data: CognitiveData
  ): Promise<{
    success: boolean;
    scores?: CognitiveScores;
    error?: string;
  }> {
    try {
      console.log('🧮 Calculando scores cognitivos finais...');

      // Calcular scores para cada categoria
      const scores: CognitiveScores = {
        // ESTILOS DE APRENDIZAGEM
        visual_score: this.calculateArrayAverage(data.visual_learning),
        auditory_score: this.calculateArrayAverage(data.auditory_learning),
        reading_score: this.calculateArrayAverage(data.reading_learning),
        kinesthetic_score: this.calculateArrayAverage(data.kinesthetic_learning),
        dominant_learning_style: this.getDominantLearningStyle(data),
        
        // PROCESSAMENTO COGNITIVO
        sequential_score: this.calculateArrayAverage(data.sequential_processing),
        holistic_score: this.calculateArrayAverage(data.holistic_processing),
        analytical_score: this.calculateArrayAverage(data.analytical_thinking),
        intuitive_score: this.calculateArrayAverage(data.intuitive_thinking),
        processing_style: this.getProcessingStyle(data),
        
        // CRIATIVIDADE
        creativity_score: this.calculateArrayAverage(data.creative_thinking),
        innovation_score: this.calculateArrayAverage(data.problem_solving),
        problem_solving_score: this.calculateArrayAverage([...data.creative_thinking, ...data.problem_solving]),
        creative_type: this.getCreativeType(data),
        
        // TOMADA DE DECISÃO
        rational_decision_score: this.calculateArrayAverage(data.rational_decisions),
        emotional_decision_score: this.calculateArrayAverage(data.emotional_decisions),
        decision_speed_score: this.calculateArrayAverage([...data.quick_decisions, ...data.deliberative_decisions]),
        decision_style: this.getDecisionStyle(data),
        
        // FUNÇÕES EXECUTIVAS
        planning_score: this.calculateArrayAverage(data.planning_organization),
        focus_score: this.calculateArrayAverage(data.focus_attention),
        flexibility_score: this.calculateArrayAverage(data.cognitive_flexibility),
        executive_functioning: this.getExecutiveFunctioning(data),
        
        // CAPACIDADES COGNITIVAS
        memory_span_score: this.calculateArrayAverage(data.memory_span),
        pattern_recognition_score: this.calculateArrayAverage(data.pattern_recognition),
        processing_speed_score: this.calculateArrayAverage(data.processing_speed),
        working_memory_score: this.calculateArrayAverage(data.working_memory),
        cognitive_capacity_level: this.getCognitiveCapacityLevel(data),
        
        // PERFIL GERAL
        cognitive_profile: this.generateCognitiveProfile(data),
        learning_recommendations: this.generateLearningRecommendations(data),
        strengths: this.identifyStrengths(data),
        improvement_areas: this.identifyImprovementAreas(data),
        
        // ESTATÍSTICAS
        completion_percentage: 100,
        completion_date: new Date()
      };

      // Salvar scores no banco
      const { error } = await supabase
        .from('cognitive_scores')
        .upsert({
          user_id: userId,
          ...scores,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) {
        throw error;
      }

      // Marcar como completo no onboarding_progress
      await supabase
        .from('onboarding_progress')
        .update({
          cognitive_data_complete: true,
          step: 4, // Próximo step após cognitivo
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      console.log('✅ Scores cognitivos calculados e salvos!');
      return { success: true, scores };

    } catch (error) {
      console.error('❌ Erro ao calcular scores:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro no cálculo'
      };
    }
  }

  // ===========================================================================
  // MÉTODOS AUXILIARES DE CÁLCULO
  // ===========================================================================

  private static calculateArrayAverage(array: number[]): number {
    if (!array || array.length === 0) return 0;
    return Math.round((array.reduce((sum, val) => sum + val, 0) / array.length) * 10) / 10;
  }

  private static getDominantLearningStyle(data: CognitiveData): string {
    const scores = {
      visual: this.calculateArrayAverage(data.visual_learning),
      auditory: this.calculateArrayAverage(data.auditory_learning),
      reading: this.calculateArrayAverage(data.reading_learning),
      kinesthetic: this.calculateArrayAverage(data.kinesthetic_learning)
    };

    const maxScore = Math.max(...Object.values(scores));
    const dominant = Object.entries(scores).find(([_, score]) => score === maxScore);
    
    return dominant ? dominant[0] : 'balanced';
  }

  private static getProcessingStyle(data: CognitiveData): string {
    const sequential = this.calculateArrayAverage(data.sequential_processing);
    const holistic = this.calculateArrayAverage(data.holistic_processing);
    const analytical = this.calculateArrayAverage(data.analytical_thinking);
    const intuitive = this.calculateArrayAverage(data.intuitive_thinking);

    if (sequential > holistic && analytical > intuitive) return 'sequential-analytical';
    if (sequential > holistic && intuitive > analytical) return 'sequential-intuitive';
    if (holistic > sequential && analytical > intuitive) return 'holistic-analytical';
    if (holistic > sequential && intuitive > analytical) return 'holistic-intuitive';
    return 'balanced';
  }

  private static getCreativeType(data: CognitiveData): string {
    const creativity = this.calculateArrayAverage(data.creative_thinking);
    const problemSolving = this.calculateArrayAverage(data.problem_solving);

    if (creativity >= 4 && problemSolving >= 4) return 'innovator';
    if (creativity >= 4 && problemSolving < 4) return 'artist';
    if (creativity < 4 && problemSolving >= 4) return 'solver';
    return 'developing';
  }

  private static getDecisionStyle(data: CognitiveData): string {
    const rational = this.calculateArrayAverage(data.rational_decisions);
    const emotional = this.calculateArrayAverage(data.emotional_decisions);
    const quick = this.calculateArrayAverage(data.quick_decisions);
    const deliberative = this.calculateArrayAverage(data.deliberative_decisions);

    if (rational > emotional && quick > deliberative) return 'rational-quick';
    if (rational > emotional && deliberative > quick) return 'rational-deliberative';
    if (emotional > rational && quick > deliberative) return 'emotional-quick';
    if (emotional > rational && deliberative > quick) return 'emotional-deliberative';
    return 'balanced';
  }

  private static getExecutiveFunctioning(data: CognitiveData): string {
    const planning = this.calculateArrayAverage(data.planning_organization);
    const focus = this.calculateArrayAverage(data.focus_attention);
    const flexibility = this.calculateArrayAverage(data.cognitive_flexibility);
    
    const average = (planning + focus + flexibility) / 3;
    
    if (average >= 4.5) return 'excellent';
    if (average >= 3.5) return 'good';
    if (average >= 2.5) return 'average';
    return 'needs_improvement';
  }

  private static getCognitiveCapacityLevel(data: CognitiveData): string {
    const memory = this.calculateArrayAverage(data.memory_span);
    const patterns = this.calculateArrayAverage(data.pattern_recognition);
    const speed = this.calculateArrayAverage(data.processing_speed);
    const working = this.calculateArrayAverage(data.working_memory);
    
    const average = (memory + patterns + speed + working) / 4;
    
    if (average >= 4.5) return 'superior';
    if (average >= 3.5) return 'above_average';
    if (average >= 2.5) return 'average';
    return 'below_average';
  }

  private static generateCognitiveProfile(data: CognitiveData): any {
    return {
      learningStyle: this.getDominantLearningStyle(data),
      processingStyle: this.getProcessingStyle(data),
      creativeType: this.getCreativeType(data),
      decisionStyle: this.getDecisionStyle(data),
      executiveLevel: this.getExecutiveFunctioning(data),
      cognitiveLevel: this.getCognitiveCapacityLevel(data),
      summary: this.generateProfileSummary(data)
    };
  }

  private static generateProfileSummary(data: CognitiveData): string {
    const learningStyle = this.getDominantLearningStyle(data);
    const processingStyle = this.getProcessingStyle(data);
    const creativeType = this.getCreativeType(data);
    
    return `Perfil cognitivo ${learningStyle} com processamento ${processingStyle} e tendência ${creativeType}.`;
  }

  private static generateLearningRecommendations(data: CognitiveData): any {
    const learningStyle = this.getDominantLearningStyle(data);
    const processingStyle = this.getProcessingStyle(data);
    
    return {
      primaryStrategy: this.getLearningStrategy(learningStyle),
      processingTips: this.getProcessingTips(processingStyle),
      studyMethods: this.getStudyMethods(learningStyle),
      environmentTips: this.getEnvironmentTips(learningStyle)
    };
  }

  private static getLearningStrategy(style: string): string[] {
    const strategies: { [key: string]: string[] } = {
      visual: [
        'Use mapas mentais e diagramas',
        'Prefira materiais com gráficos e imagens',
        'Organize informações visualmente',
        'Use cores para categorizar conteúdo'
      ],
      auditory: [
        'Grave e ouça suas anotações',
        'Participe de discussões em grupo',
        'Use música ou sons para memorização',
        'Explique conteúdo em voz alta'
      ],
      reading: [
        'Leia e releia materiais importantes',
        'Faça resumos escritos detalhados',
        'Use flashcards com texto',
        'Prefira livros e artigos escritos'
      ],
      kinesthetic: [
        'Inclua movimento no aprendizado',
        'Use objetos físicos e manipulativos',
        'Faça pausas frequentes para movimento',
        'Aprenda fazendo e praticando'
      ]
    };
    return strategies[style] || strategies.visual;
  }

  private static getProcessingTips(style: string): string[] {
    const tips: { [key: string]: string[] } = {
      'sequential-analytical': [
        'Organize informações em sequência lógica',
        'Quebre problemas complexos em partes',
        'Use listas e checklists detalhados',
        'Siga procedimentos passo a passo'
      ],
      'holistic-intuitive': [
        'Veja o panorama geral primeiro',
        'Confie em suas intuições iniciais',
        'Conecte ideias de forma criativa',
        'Use brainstorming e associação livre'
      ],
      balanced: [
        'Alterne entre análise e intuição',
        'Use diferentes abordagens conforme a situação',
        'Desenvolva flexibilidade no pensamento',
        'Pratique tanto lógica quanto criatividade'
      ]
    };
    return tips[style] || tips.balanced;
  }

  private static getStudyMethods(style: string): string[] {
    const methods: { [key: string]: string[] } = {
      visual: ['Mapas mentais', 'Diagramas', 'Gráficos', 'Infográficos'],
      auditory: ['Podcasts', 'Discussões', 'Explicações verbais', 'Música'],
      reading: ['Livros', 'Artigos', 'Resumos', 'Texto escrito'],
      kinesthetic: ['Experimentos', 'Simulações', 'Atividades práticas', 'Movimento']
    };
    return methods[style] || methods.visual;
  }

  private static getEnvironmentTips(style: string): string[] {
    const tips: { [key: string]: string[] } = {
      visual: [
        'Ambiente bem iluminado',
        'Materiais visuais organizados',
        'Espaço limpo e arrumado',
        'Cores que estimulem foco'
      ],
      auditory: [
        'Ambiente silencioso ou com música adequada',
        'Elimine ruídos distraidores',
        'Use ferramentas de áudio',
        'Permita-se falar durante estudo'
      ],
      reading: [
        'Boa iluminação para leitura',
        'Biblioteca ou espaço de leitura',
        'Minimize distrações visuais',
        'Tenha materiais de escrita à mão'
      ],
      kinesthetic: [
        'Espaço para movimento',
        'Objetos para manipulação',
        'Ambiente flexível',
        'Permita mudanças de posição'
      ]
    };
    return tips[style] || tips.visual;
  }

  private static identifyStrengths(data: CognitiveData): string[] {
    const strengths: string[] = [];
    
    // Verificar pontos fortes baseados nos scores
    if (this.calculateArrayAverage(data.creative_thinking) >= 4) {
      strengths.push('Alta criatividade');
    }
    if (this.calculateArrayAverage(data.problem_solving) >= 4) {
      strengths.push('Excelente resolução de problemas');
    }
    if (this.calculateArrayAverage(data.focus_attention) >= 4) {
      strengths.push('Foco e concentração superiores');
    }
    if (this.calculateArrayAverage(data.cognitive_flexibility) >= 4) {
      strengths.push('Alta flexibilidade cognitiva');
    }
    
    return strengths.length > 0 ? strengths : ['Perfil equilibrado'];
  }

  private static identifyImprovementAreas(data: CognitiveData): string[] {
    const improvements: string[] = [];
    
    // Identificar áreas que precisam de desenvolvimento
    if (this.calculateArrayAverage(data.planning_organization) < 3) {
      improvements.push('Planejamento e organização');
    }
    if (this.calculateArrayAverage(data.working_memory) < 3) {
      improvements.push('Memória de trabalho');
    }
    if (this.calculateArrayAverage(data.processing_speed) < 3) {
      improvements.push('Velocidade de processamento');
    }
    
    return improvements.length > 0 ? improvements : ['Nenhuma área crítica identificada'];
  }
}

// Export default da classe para import direto
export default CognitiveService;