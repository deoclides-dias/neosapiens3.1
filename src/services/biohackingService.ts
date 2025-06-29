// src/services/biohackingService.ts - Serviço de Integração com Supabase
import { supabase } from '../lib/supabase';
import { BiohackingData, BiohackingAnalysis } from '../types/biohacking';

export interface BiohackingServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export class BiohackingService {
  
  // 💾 SALVAR DADOS DE BIOHACKING
  static async saveBiohackingData(
    userId: string, 
    data: BiohackingData
  ): Promise<BiohackingServiceResponse<BiohackingData>> {
    try {
      console.log('🧬 Salvando dados de biohacking para usuário:', userId);
      
      // Preparar dados para salvar
      const biohackingRecord = {
        user_id: userId,
        biohacking_data: data,
        biohacking_data_complete: true,
        updated_at: new Date().toISOString()
      };

      // Verificar se já existe registro
      const { data: existingRecord, error: fetchError } = await supabase
        .from('onboarding_progress')
        .select('id, biohacking_data')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (fetchError) {
        console.error('Erro ao buscar registro existente:', fetchError);
        return { success: false, error: fetchError.message };
      }

      let result;
      
      if (existingRecord && existingRecord.length > 0) {
        // Atualizar registro existente
        const { data: updatedData, error: updateError } = await supabase
          .from('onboarding_progress')
          .update(biohackingRecord)
          .eq('id', existingRecord[0].id)
          .select();

        if (updateError) {
          console.error('Erro ao atualizar dados:', updateError);
          return { success: false, error: updateError.message };
        }

        result = updatedData;
        console.log('✅ Dados de biohacking atualizados com sucesso');
      } else {
        // Criar novo registro
        const { data: newData, error: insertError } = await supabase
          .from('onboarding_progress')
          .insert(biohackingRecord)
          .select();

        if (insertError) {
          console.error('Erro ao inserir dados:', insertError);
          return { success: false, error: insertError.message };
        }

        result = newData;
        console.log('✅ Dados de biohacking salvos com sucesso');
      }

      return { 
        success: true, 
        data: data 
      };

    } catch (error) {
      console.error('Erro inesperado ao salvar dados de biohacking:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      };
    }
  }

  // 📊 BUSCAR DADOS DE BIOHACKING
  static async getBiohackingData(userId: string): Promise<BiohackingServiceResponse<BiohackingData>> {
    try {
      console.log('🔍 Buscando dados de biohacking para usuário:', userId);

      const { data, error } = await supabase
        .from('onboarding_progress')
        .select('biohacking_data, biohacking_data_complete, updated_at')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Erro ao buscar dados de biohacking:', error);
        return { success: false, error: error.message };
      }

      if (!data || data.length === 0) {
        console.log('📭 Nenhum dado de biohacking encontrado para o usuário');
        return { success: true, data: undefined };
      }

      const record = data[0];
      
      if (!record.biohacking_data_complete || !record.biohacking_data) {
        console.log('📝 Dados de biohacking incompletos encontrados');
        return { success: true, data: undefined };
      }

      console.log('✅ Dados de biohacking encontrados');
      return { 
        success: true, 
        data: record.biohacking_data as BiohackingData 
      };

    } catch (error) {
      console.error('Erro inesperado ao buscar dados de biohacking:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      };
    }
  }

  // 🔬 GERAR ANÁLISE DE BIOHACKING
  static async generateBiohackingAnalysis(
    userId: string, 
    data: BiohackingData
  ): Promise<BiohackingServiceResponse<BiohackingAnalysis>> {
    try {
      console.log('🔬 Gerando análise de biohacking para usuário:', userId);

      // Calcular scores de diferentes categorias
      const anthropometricScore = this.calculateAnthropometricScore(data.anthropometric);
      const sleepQualityScore = this.calculateSleepScore(data.sleep);
      const nutritionScore = this.calculateNutritionScore(data.nutrition);
      const fitnessScore = this.calculateFitnessScore(data.physicalActivity);
      const healthScore = this.calculateHealthScore(data.healthStatus);
      const tcmBalance = this.calculateTCMBalance(data.functionalMedicine);

      // Score geral de bem-estar
      const overallWellness = Math.round(
        (anthropometricScore + sleepQualityScore + nutritionScore + fitnessScore + healthScore) / 5
      );

      // Gerar recomendações personalizadas
      const recommendations = this.generateRecommendations(data);
      const priorities = this.identifyPriorities(data);

      const analysis: BiohackingAnalysis = {
        userId,
        data,
        analysis: {
          anthropometricScore,
          sleepQualityScore,
          nutritionScore,
          fitnessScore,
          healthScore,
          tcmBalance,
          overallWellness,
          recommendations,
          priorities
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Salvar análise no banco
      const { error: saveError } = await supabase
        .from('biohacking_analysis')
        .upsert({
          user_id: userId,
          analysis_data: analysis.analysis,
          overall_score: overallWellness,
          created_at: analysis.createdAt,
          updated_at: analysis.updatedAt
        });

      if (saveError) {
        console.warn('Erro ao salvar análise:', saveError);
        // Continua mesmo com erro de salvamento
      }

      console.log('✅ Análise de biohacking gerada com sucesso');
      return { success: true, data: analysis };

    } catch (error) {
      console.error('Erro ao gerar análise de biohacking:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      };
    }
  }

  // 📊 CÁLCULOS DE SCORES

  private static calculateAnthropometricScore(data: BiohackingData['anthropometric']): number {
    let score = 50; // Score base

    // Verificar se tem dados básicos
    if (data.height > 0 && data.currentWeight > 0) {
      // Calcular IMC
      const heightInMeters = data.height / 100;
      const bmi = data.currentWeight / (heightInMeters * heightInMeters);
      
      // Score baseado no IMC (18.5-24.9 = ideal)
      if (bmi >= 18.5 && bmi <= 24.9) {
        score += 30;
      } else if (bmi >= 25 && bmi <= 29.9) {
        score += 15; // Sobrepeso leve
      } else if (bmi >= 17 && bmi <= 18.4) {
        score += 20; // Abaixo do peso leve
      } else {
        score += 5; // Muito fora do ideal
      }

      // Bonus se peso desejado está próximo do atual
      if (data.desiredWeight > 0) {
        const weightDifference = Math.abs(data.currentWeight - data.desiredWeight);
        if (weightDifference <= 5) {
          score += 20; // Satisfeito com peso atual
        } else if (weightDifference <= 10) {
          score += 10;
        }
      }
    }

    return Math.min(100, Math.max(0, score));
  }

  private static calculateSleepScore(data: BiohackingData['sleep']): number {
    let score = 0;

    // Score baseado na qualidade do sono (40% do total)
    score += (data.sleepQuality / 10) * 40;

    // Score baseado nas horas de sono (30% do total)
    if (data.effectiveSleepHours >= 7 && data.effectiveSleepHours <= 9) {
      score += 30;
    } else if (data.effectiveSleepHours >= 6 && data.effectiveSleepHours <= 10) {
      score += 20;
    } else {
      score += 10;
    }

    // Score baseado no tempo para adormecer (15% do total)
    if (data.fallAsleepTime <= 15) {
      score += 15;
    } else if (data.fallAsleepTime <= 30) {
      score += 10;
    } else {
      score += 5;
    }

    // Penalidade por distúrbios do sono (15% do total)
    const disorderCount = Object.values(data.sleepDisorders).filter(Boolean).length;
    if (disorderCount === 0) {
      score += 15;
    } else if (disorderCount <= 2) {
      score += 10;
    } else {
      score += 5;
    }

    return Math.min(100, Math.max(0, Math.round(score)));
  }

  private static calculateNutritionScore(data: BiohackingData['nutrition']): number {
    let score = 20; // Score base

    // Hidratação (25 pontos)
    if (data.waterIntake >= 2.5) {
      score += 25;
    } else if (data.waterIntake >= 2) {
      score += 20;
    } else if (data.waterIntake >= 1.5) {
      score += 15;
    } else {
      score += 10;
    }

    // Frequência de refeições (20 pontos)
    if (data.mealsPerDay >= 3 && data.mealsPerDay <= 5) {
      score += 20;
    } else {
      score += 10;
    }

    // Consumo de cafeína (15 pontos)
    if (data.caffeineConsumption.amount <= 200) {
      score += 15;
    } else if (data.caffeineConsumption.amount <= 400) {
      score += 10;
    } else {
      score += 5;
    }

    // Álcool (15 pontos)
    if (data.alcoholConsumption.frequency === 'never') {
      score += 15;
    } else if (data.alcoholConsumption.frequency === 'rarely') {
      score += 12;
    } else if (data.alcoholConsumption.frequency === 'weekly') {
      score += 8;
    } else {
      score += 3;
    }

    // Sintomas digestivos (25 pontos - penalidade)
    const symptomCount = Object.values(data.digestiveSymptoms).filter(Boolean).length - 
                        data.digestiveSymptoms.foodIntolerances.length;
    if (symptomCount === 0) {
      score += 25;
    } else if (symptomCount <= 2) {
      score += 15;
    } else if (symptomCount <= 4) {
      score += 10;
    } else {
      score += 5;
    }

    return Math.min(100, Math.max(0, score));
  }

  private static calculateFitnessScore(data: BiohackingData['physicalActivity']): number {
    let score = 10; // Score base

    // Frequência de exercício (40 pontos)
    if (data.exerciseFrequency >= 5) {
      score += 40;
    } else if (data.exerciseFrequency >= 3) {
      score += 30;
    } else if (data.exerciseFrequency >= 1) {
      score += 20;
    } else {
      score += 5;
    }

    // Nível de fitness auto-avaliado (25 pontos)
    score += (data.fitnessLevel / 10) * 25;

    // Capacidade funcional (25 pontos)
    const functionalTests = Object.values(data.functionalCapacity).filter(Boolean).length;
    score += (functionalTests / 6) * 25;

    // Limitações físicas (10 pontos - penalidade)
    if (data.physicalLimitations.length === 0) {
      score += 10;
    } else if (data.physicalLimitations.length <= 2) {
      score += 5;
    }

    return Math.min(100, Math.max(0, Math.round(score)));
  }

  private static calculateHealthScore(data: BiohackingData['healthStatus']): number {
    let score = 30; // Score base

    // Condições crônicas (30 pontos - penalidade)
    if (data.chronicConditions.length === 0) {
      score += 30;
    } else if (data.chronicConditions.length <= 2) {
      score += 15;
    } else {
      score += 5;
    }

    // Medicamentos (15 pontos)
    if (data.currentMedications.length === 0) {
      score += 15;
    } else if (data.currentMedications.length <= 2) {
      score += 10;
    } else {
      score += 5;
    }

    // Sintomas de deficiências (15 pontos)
    const deficiencyCount = Object.values(data.deficiencySymptoms).filter(Boolean).length;
    if (deficiencyCount === 0) {
      score += 15;
    } else if (deficiencyCount <= 3) {
      score += 10;
    } else {
      score += 5;
    }

    // Saúde mental (40 pontos)
    const avgMentalHealth = (11 - data.mentalHealth.stressLevel + 11 - data.mentalHealth.anxietyLevel) / 2;
    score += (avgMentalHealth / 10) * 20;

    // Bonus por não ter sintomas graves
    if (!data.mentalHealth.depressionSymptoms && !data.mentalHealth.panicAttacks) {
      score += 20;
    } else if (!data.mentalHealth.depressionSymptoms || !data.mentalHealth.panicAttacks) {
      score += 10;
    }

    return Math.min(100, Math.max(0, Math.round(score)));
  }

  private static calculateTCMBalance(data: BiohackingData['functionalMedicine']): BiohackingAnalysis['analysis']['tcmBalance'] {
    const calculateElementScore = (element: any): number => {
      const values = Object.values(element) as number[];
      const average = values.reduce((sum, val) => sum + (typeof val === 'number' ? val : 5), 0) / values.length;
      return Math.round((average / 10) * 100);
    };

    return {
      wood: calculateElementScore(data.wood),
      fire: calculateElementScore(data.fire),
      earth: calculateElementScore(data.earth),
      metal: calculateElementScore(data.metal),
      water: calculateElementScore(data.water)
    };
  }

  // 💡 GERAÇÃO DE RECOMENDAÇÕES
  private static generateRecommendations(data: BiohackingData): string[] {
    const recommendations: string[] = [];

    // Recomendações baseadas no sono
    if (data.sleep.sleepQuality < 6) {
      recommendations.push('Melhorar qualidade do sono com higiene do sono e ambiente adequado');
    }
    if (data.sleep.effectiveSleepHours < 7) {
      recommendations.push('Aumentar duração do sono para pelo menos 7-8 horas por noite');
    }
    if (data.sleep.fallAsleepTime > 30) {
      recommendations.push('Implementar técnicas de relaxamento para adormecer mais rapidamente');
    }

    // Recomendações nutricionais
    if (data.nutrition.waterIntake < 2) {
      recommendations.push('Aumentar consumo de água para pelo menos 2 litros por dia');
    }
    if (data.nutrition.caffeineConsumption.amount > 400) {
      recommendations.push('Reduzir consumo de cafeína para menos de 400mg por dia');
    }

    // Recomendações de exercício
    if (data.physicalActivity.exerciseFrequency < 3) {
      recommendations.push('Aumentar s para pelo menos 3 vezes por semana');
    }
    if (data.physicalActivity.fitnessLevel < 5) {
      recommendations.push('Começar programa de condicionamento físico gradual');
    }

    // Recomendações de saúde mental
    if (data.healthStatus.mentalHealth.stressLevel > 7) {
      recommendations.push('Implementar técnicas de gerenciamento de stress como meditação ou yoga');
    }

    return recommendations.slice(0, 6); // Máximo 6 recomendações
  }

  // 🎯 IDENTIFICAÇÃO DE PRIORIDADES
  private static identifyPriorities(data: BiohackingData): string[] {
    const priorities: string[] = [];

    // Prioridades baseadas em scores baixos
    const sleepScore = this.calculateSleepScore(data.sleep);
    const nutritionScore = this.calculateNutritionScore(data.nutrition);
    const fitnessScore = this.calculateFitnessScore(data.physicalActivity);
    const healthScore = this.calculateHealthScore(data.healthStatus);

    const scoreMap = [
      { area: 'Qualidade do Sono', score: sleepScore },
      { area: 'Nutrição', score: nutritionScore },
      { area: 'Condicionamento Físico', score: fitnessScore },
      { area: 'Saúde Geral', score: healthScore }
    ];

    // Ordenar por score (menor primeiro = maior prioridade)
    scoreMap
      .sort((a, b) => a.score - b.score)
      .slice(0, 3) // Top 3 prioridades
      .forEach(item => {
        if (item.score < 70) {
          priorities.push(item.area);
        }
      });

    return priorities;
  }

  // 🔄 ATUALIZAR PROGRESSO
  static async updateProgress(
    userId: string, 
    step: number, 
    stepData: Partial<BiohackingData>
  ): Promise<BiohackingServiceResponse> {
    try {
      const { error } = await supabase
        .from('onboarding_progress')
        .upsert({
          user_id: userId,
          step: step,
          biohacking_data: stepData,
          updated_at: new Date().toISOString()
        });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      };
    }
  }

  // 📊 BUSCAR ANÁLISE EXISTENTE
  static async getExistingAnalysis(userId: string): Promise<BiohackingServiceResponse<BiohackingAnalysis['analysis']>> {
    try {
      const { data, error } = await supabase
        .from('biohacking_analysis')
        .select('analysis_data, overall_score, created_at, updated_at')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(1);

      if (error) {
        return { success: false, error: error.message };
      }

      if (!data || data.length === 0) {
        return { success: true, data: undefined };
      }

      return { success: true, data: data[0].analysis_data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      };
    }
  }
}

export default BiohackingService;