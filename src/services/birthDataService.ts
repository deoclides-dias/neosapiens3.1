// src/services/birthDataService.ts
import { supabase } from '../lib/supabase';

interface BirthDataPayload {
  birth_data: {
    birthDate: string;
    birthTime?: string;
    birthPlace: string;
    latitude: number;
    longitude: number;
    timezone: string;
    hasExactTime: boolean;
  };
  birth_data_complete: boolean;
}

interface OnboardingProgress {
  user_id: string;
  step: number;
  personal_data?: any;
  birth_data?: any;
  biohacking_data?: any;
  cognitive_data?: any;
  personal_data_complete?: boolean;
  birth_data_complete?: boolean;
  biohacking_data_complete?: boolean;
  cognitive_data_complete?: boolean;
  created_at?: string;
  updated_at?: string;
}

export class BirthDataService {
  /**
   * Salva ou atualiza os dados de nascimento do usuário
   */
  static async saveBirthData(userId: string, data: BirthDataPayload): Promise<{ success: boolean; error?: string }> {
    try {
      // Verificar se já existe um registro para este usuário
      const { data: existingProgress, error: fetchError } = await supabase
        .from('onboarding_progress')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle(); // Usa maybeSingle() ao invés de single() para evitar erro se não existir

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Erro ao buscar progresso:', fetchError);
        return { success: false, error: fetchError.message };
      }

      // Preparar dados para salvar
      const onboardingData: Partial<OnboardingProgress> = {
        user_id: userId,
        birth_data: data.birth_data,
        birth_data_complete: data.birth_data_complete,
        step: Math.max(existingProgress?.step || 1, 2), // Avançar para pelo menos step 2
        updated_at: new Date().toISOString()
      };

      let result;

      if (existingProgress) {
        // Atualizar registro existente
        const { data: updateData, error: updateError } = await supabase
          .from('onboarding_progress')
          .update(onboardingData)
          .eq('user_id', userId)
          .select()
          .single();

        if (updateError) {
          console.error('Erro ao atualizar dados de nascimento:', updateError);
          return { success: false, error: updateError.message };
        }

        result = updateData;
      } else {
        // Criar novo registro
        onboardingData.created_at = new Date().toISOString();
        
        const { data: insertData, error: insertError } = await supabase
          .from('onboarding_progress')
          .insert([onboardingData])
          .select()
          .single();

        if (insertError) {
          console.error('Erro ao inserir dados de nascimento:', insertError);
          return { success: false, error: insertError.message };
        }

        result = insertData;
      }

      console.log('Dados de nascimento salvos com sucesso:', result);
      return { success: true };

    } catch (error) {
      console.error('Erro inesperado ao salvar dados de nascimento:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      };
    }
  }

  /**
   * Busca os dados de nascimento do usuário
   */
  static async getBirthData(userId: string): Promise<{ data: any; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('onboarding_progress')
        .select('birth_data, birth_data_complete')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Erro ao buscar dados de nascimento:', error);
        return { data: null, error: error.message };
      }

      return { data: data?.birth_data || null };

    } catch (error) {
      console.error('Erro inesperado ao buscar dados de nascimento:', error);
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      };
    }
  }

  /**
   * Valida se os dados de nascimento estão completos para análise
   */
  static validateBirthData(data: any): { isValid: boolean; missingFields: string[] } {
    const missingFields: string[] = [];

    if (!data) {
      return { isValid: false, missingFields: ['Todos os dados'] };
    }

    // Campos obrigatórios
    if (!data.birthDate) missingFields.push('Data de nascimento');
    if (!data.birthPlace) missingFields.push('Local de nascimento');
    if (data.latitude === undefined || data.latitude === null) missingFields.push('Latitude');
    if (data.longitude === undefined || data.longitude === null) missingFields.push('Longitude');
    if (!data.timezone) missingFields.push('Fuso horário');

    // Validações adicionais
    if (data.birthDate) {
      const date = new Date(data.birthDate);
      if (isNaN(date.getTime())) {
        missingFields.push('Data de nascimento inválida');
      }
    }

    if (data.latitude !== undefined && (data.latitude < -90 || data.latitude > 90)) {
      missingFields.push('Latitude inválida');
    }

    if (data.longitude !== undefined && (data.longitude < -180 || data.longitude > 180)) {
      missingFields.push('Longitude inválida');
    }

    return {
      isValid: missingFields.length === 0,
      missingFields
    };
  }

  /**
   * Prepara os dados para os módulos de análise
   */
  static formatForAnalysis(birthData: any): any {
    if (!birthData) return null;

    return {
      // Formato esperado pelos módulos de análise
      birthDate: birthData.birthDate,
      birthTime: birthData.hasExactTime ? birthData.birthTime : null,
      birthPlace: {
        name: birthData.birthPlace,
        latitude: birthData.latitude,
        longitude: birthData.longitude
      },
      timezone: birthData.timezone,
      // Adicionar outros campos que os módulos possam precisar
      hasExactTime: birthData.hasExactTime || false
    };
  }
}