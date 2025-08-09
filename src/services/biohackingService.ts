// src/services/biohackingService.ts - VERSÃO CORRIGIDA

import { supabase } from '../lib/supabase';

// ============================================================================
// TIPOS LOCAIS (para evitar problemas de import)
// ============================================================================

interface BiohackingData {
  anthropometric: {
    height: number;
    currentWeight: number;
    desiredWeight: number;
    bodyType: string;
    weightHistory: {
      maxWeight: number;
      minAdultWeight: number;
      recentWeightChanges: string;
      easyWeightChange: string;
      weightConcerns: string[];
    };
  };
  sleep: {
    averageSleepDuration: number;
    bedtime: string;
    wakeTime: string;
    sleepQuality: number;
    chronotype: string;
    sleepIssues: string[];
    energyLevels: {
      morning: number;
      afternoon: number;
      evening: number;
    };
    sleepAids: {
      naturalSupplements: string[];
      prescriptionMeds: string[];
      other: string[];
    };
  };
  nutrition: any;
  physicalActivity: any;
  healthStatus: any;
  functionalMedicine: any;
  cognitive: any;
}

interface BiohackingAnalysis {
  id: string;
  userId: string;
  scores: {
    anthropometric: {
      bmi: number;
      bodyTypeMatch: number;
      weightGoalRealistic: boolean;
    };
    sleep: {
      sleepEfficiency: number;
      chronotypeMatch: number;
      energyConsistency: number;
    };
    nutrition: any;
    fitness: any;
    health: any;
    functionalMedicine: any;
  };
  recommendations: {
    nutrition: any;
    exercise: any;
    sleep: any;
    stress: any;
    functionalMedicine: any;
  };
  tracking: {
    keyMetrics: string[];
    frequency: string;
    targets: Record<string, number>;
    timeline: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface BiohackingServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// ============================================================================
// CLASSE DE SERVIÇO
// ============================================================================

export class BiohackingService {

  // 💾 SALVAR DADOS DE BIOHACKING
  static async saveBiohackingData(
    userId: string,
    data: BiohackingData
  ): Promise<BiohackingServiceResponse<BiohackingData>> {
    try {
      console.log('💾 Salvando dados biohacking para usuário:', userId);

      const { data: savedData, error } = await supabase
        .from('onboarding_progress')
        .upsert({
          user_id: userId,
          biohacking_data: data,
          biohacking_data_complete: true,
          step: Math.max(2, 3), // Pelo menos step 2-3 para biohacking
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      console.log('✅ Dados biohacking salvos com sucesso!');
      return {
        success: true,
        data: data
      };

    } catch (error) {
      console.error('❌ Erro ao salvar dados biohacking:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  // 📥 CARREGAR DADOS DE BIOHACKING
  static async loadBiohackingData(
    userId: string
  ): Promise<BiohackingServiceResponse<BiohackingData>> {
    try {
      console.log('📥 Carregando dados biohacking para usuário:', userId);

      const { data, error } = await supabase
        .from('onboarding_progress')
        .select('biohacking_data')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(1);

      if (error) {
        throw error;
      }

      if (!data || data.length === 0) {
        return {
          success: true,
          data: undefined
        };
      }

      const biohackingData = data[0].biohacking_data as BiohackingData;

      return {
        success: true,
        data: biohackingData
      };

    } catch (error) {
      console.error('❌ Erro ao carregar dados biohacking:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  // 🔍 VALIDAR DADOS DE BIOHACKING
  static validateBiohackingData(data: Partial<BiohackingData>): boolean {
    try {
      // Validação básica dos dados antropométricos
      if (!data.anthropometric) return false;
      if (!data.anthropometric.height || data.anthropometric.height <= 0) return false;
      if (!data.anthropometric.currentWeight || data.anthropometric.currentWeight <= 0) return false;
      if (!data.anthropometric.desiredWeight || data.anthropometric.desiredWeight <= 0) return false;

      // Validação básica dos dados de sono (se fornecidos)
      if (data.sleep) {
        if (data.sleep.averageSleepDuration && data.sleep.averageSleepDuration <= 0) return false;
        if (data.sleep.sleepQuality && (data.sleep.sleepQuality < 1 || data.sleep.sleepQuality > 5)) return false;
      }

      return true;
    } catch (error) {
      console.error('Erro na validação biohacking:', error);
      return false;
    }
  }

  // 📊 CALCULAR ANÁLISE BÁSICA
  static async calculateBasicAnalysis(
    userId: string,
    data: BiohackingData
  ): Promise<BiohackingServiceResponse<BiohackingAnalysis>> {
    try {
      console.log('📊 Calculando análise básica para usuário:', userId);

      // Cálculos básicos
      const bmi = data.anthropometric.currentWeight / Math.pow(data.anthropometric.height / 100, 2);
      const sleepEfficiency = data.sleep?.averageSleepDuration ? (data.sleep.averageSleepDuration / 8) * 100 : 0;

      const analysis: BiohackingAnalysis = {
        id: `analysis_${userId}_${Date.now()}`,
        userId,
        scores: {
          anthropometric: {
            bmi: Math.round(bmi * 10) / 10,
            bodyTypeMatch: 75, // Placeholder
            weightGoalRealistic: Math.abs(data.anthropometric.currentWeight - data.anthropometric.desiredWeight) <= 10
          },
          sleep: {
            sleepEfficiency: Math.min(sleepEfficiency, 100),
            chronotypeMatch: 80, // Placeholder
            energyConsistency: 75 // Placeholder
          },
          nutrition: {},
          fitness: {},
          health: {},
          functionalMedicine: {}
        },
        recommendations: {
          nutrition: {
            message: 'Recomendações nutricionais serão implementadas em breve'
          },
          exercise: {
            message: 'Recomendações de exercícios serão implementadas em breve'
          },
          sleep: {
            message: 'Recomendações de sono serão implementadas em breve'
          },
          stress: {
            message: 'Recomendações de gestão de stress serão implementadas em breve'
          },
          functionalMedicine: {
            message: 'Recomendações de medicina funcional serão implementadas em breve'
          }
        },
        tracking: {
          keyMetrics: ['weight', 'sleep_duration', 'energy_levels'],
          frequency: 'weekly',
          targets: {
            weight: data.anthropometric.desiredWeight,
            sleep: data.sleep?.averageSleepDuration || 8
          },
          timeline: '3_months'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Salvar análise no banco (opcional)
      const { error } = await supabase
        .from('biohacking_analysis')
        .upsert({
          id: analysis.id,
          user_id: userId,
          analysis_data: analysis,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.warn('⚠️ Erro ao salvar análise (não crítico):', error);
      }

      return {
        success: true,
        data: analysis
      };

    } catch (error) {
      console.error('❌ Erro ao calcular análise:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro no cálculo'
      };
    }
  }

  // 🗑️ DELETAR DADOS DE BIOHACKING
  static async deleteBiohackingData(userId: string): Promise<BiohackingServiceResponse<boolean>> {
    try {
      console.log('🗑️ Deletando dados biohacking para usuário:', userId);

      const { error } = await supabase
        .from('onboarding_progress')
        .update({
          biohacking_data: null,
          biohacking_data_complete: false,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) {
        throw error;
      }

      return {
        success: true,
        data: true
      };

    } catch (error) {
      console.error('❌ Erro ao deletar dados biohacking:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao deletar'
      };
    }
  }
}

export default BiohackingService;