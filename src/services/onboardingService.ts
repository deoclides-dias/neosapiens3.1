// src/services/onboardingService.ts
import { supabase } from '../lib/supabase';

// Types
interface PersonalData {
  fullName: string;
  email: string;
  age?: number;
  gender?: string;
}

interface BirthData {
  fullName: string;
  birthDate: string;
  birthTime: string;
  hasExactTime: boolean;
  birthPlace: string;
  coordinates: {
    lat: number;
    lng: number;
  } | null;
  timezone: string;
}

interface BiohackingData {
  sleepQuality: number;
  energyLevel: number;
  exerciseFrequency: string;
  dietType: string;
  stressLevel: number;
  supplements: string[];
}

interface CognitiveData {
  learningStyle: string;
  focusLevel: number;
  creativityScore: number;
  memoryQuality: number;
  problemSolvingStyle: string;
}

interface OnboardingProgress {
  currentStep: number;
  completedSteps: string[];
  personalDataComplete: boolean;
  birthDataComplete: boolean;
  biohackingDataComplete: boolean;
  cognitiveDataComplete: boolean;
}

export class OnboardingService {
  
  // ===== PERSONAL DATA =====
  static async savePersonalData(userId: string, personalData: PersonalData) {
    try {
      console.log('💾 Salvando dados de nascimento para usuário:', userId);
      
        const { data, error } = await supabase
        .from('personal_data')
        .upsert({
          user_id: userId,
          full_name: personalData.fullName,
          email: personalData.email,
          age: personalData.age,
          gender: personalData.gender,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      
      // Update progress
      await this.updateProgress(userId, 'personal_data');
      
      return { success: true, data };
      
    } catch (error) {
      console.error('Erro ao salvar dados pessoais:', error);
      return { success: false, error: error.message };
    }
  }

  static async getPersonalData(userId: string): Promise<PersonalData | null> {
    try {
      const { data, error } = await supabase
        .from('personal_data')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (!data) return null;

      return {
        fullName: data.full_name,
        email: data.email,
        age: data.age,
        gender: data.gender
      };
      
    } catch (error) {
      console.error('Erro ao carregar dados pessoais:', error);
      return null;
    }
  }

  // ===== BIRTH DATA =====
  static async saveBirthData(userId: string, birthData: BirthData) {
    try {
      const { data, error } = await supabase
        .from('birth_data')
        .upsert({
          user_id: userId,
          full_name: birthData.fullName,
          birth_date: birthData.birthDate,
          birth_time: birthData.birthTime && birthData.birthTime.trim() !== '' ? birthData.birthTime : null, // 🔧 CORREÇÃO
          has_exact_time: birthData.hasExactTime,
          birth_place: birthData.birthPlace,
          coordinates: birthData.coordinates,
          timezone: birthData.timezone,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id',           // 🔧 CORREÇÃO: Especificar a coluna de conflito
          ignoreDuplicates: false          // 🔧 CORREÇÃO: Não ignorar, mas atualizar
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Erro do Supabase:', error);
        throw error;
      }
      
      console.log('✅ Dados salvos com sucesso:', data);
      
      // Update progress
      await this.updateProgress(userId, 'birth_data');
      
      return { success: true, data };
      
    } catch (error) {
      console.error('❌ Erro ao salvar dados de nascimento:', error);
      return { success: false, error: error.message };
    }
  }
  static async getBirthData(userId: string): Promise<BirthData | null> {
    try {
      const { data, error } = await supabase
        .from('birth_data')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (!data) return null;

      return {
        fullName: data.full_name,
        birthDate: data.birth_date,
        birthTime: data.birth_time || '',
        hasExactTime: data.has_exact_time,
        birthPlace: data.birth_place,
        coordinates: data.coordinates,
        timezone: data.timezone
      };
      
    } catch (error) {
      console.error('Erro ao carregar dados de nascimento:', error);
      return null;
    }
  }

  // ===== BIOHACKING DATA =====
  static async saveBiohackingData(userId: string, biohackingData: BiohackingData) {
    try {
      const { data, error } = await supabase
        .from('biohacking_data')
        .upsert({
          user_id: userId,
          sleep_quality: biohackingData.sleepQuality,
          energy_level: biohackingData.energyLevel,
          exercise_frequency: biohackingData.exerciseFrequency,
          diet_type: biohackingData.dietType,
          stress_level: biohackingData.stressLevel,
          supplements: biohackingData.supplements,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      
      // Update progress
      await this.updateProgress(userId, 'biohacking_data');
      
      return { success: true, data };
      
    } catch (error) {
      console.error('Erro ao salvar dados de biohacking:', error);
      return { success: false, error: error.message };
    }
  }

  static async getBiohackingData(userId: string): Promise<BiohackingData | null> {
    try {
      const { data, error } = await supabase
        .from('biohacking_data')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (!data) return null;

      return {
        sleepQuality: data.sleep_quality,
        energyLevel: data.energy_level,
        exerciseFrequency: data.exercise_frequency,
        dietType: data.diet_type,
        stressLevel: data.stress_level,
        supplements: data.supplements || []
      };
      
    } catch (error) {
      console.error('Erro ao carregar dados de biohacking:', error);
      return null;
    }
  }

  // ===== COGNITIVE DATA =====
  static async saveCognitiveData(userId: string, cognitiveData: CognitiveData) {
    try {
      const { data, error } = await supabase
        .from('cognitive_data')
        .upsert({
          user_id: userId,
          learning_style: cognitiveData.learningStyle,
          focus_level: cognitiveData.focusLevel,
          creativity_score: cognitiveData.creativityScore,
          memory_quality: cognitiveData.memoryQuality,
          problem_solving_style: cognitiveData.problemSolvingStyle,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      
      // Update progress
      await this.updateProgress(userId, 'cognitive_data');
      
      return { success: true, data };
      
    } catch (error) {
      console.error('Erro ao salvar dados cognitivos:', error);
      return { success: false, error: error.message };
    }
  }

  static async getCognitiveData(userId: string): Promise<CognitiveData | null> {
    try {
      const { data, error } = await supabase
        .from('cognitive_data')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (!data) return null;

      return {
        learningStyle: data.learning_style,
        focusLevel: data.focus_level,
        creativityScore: data.creativity_score,
        memoryQuality: data.memory_quality,
        problemSolvingStyle: data.problem_solving_style
      };
      
    } catch (error) {
      console.error('Erro ao carregar dados cognitivos:', error);
      return null;
    }
  }

  // ===== PROGRESS TRACKING =====
  static async updateProgress(userId: string, stepCompleted: string) {
    try {
      // Get current progress
      const currentProgress = await this.getProgress(userId);
      
      const completedSteps = currentProgress?.completedSteps || [];
      if (!completedSteps.includes(stepCompleted)) {
        completedSteps.push(stepCompleted);
      }

      const progressData = {
        user_id: userId,
        current_step: completedSteps.length,
        completed_steps: completedSteps,
        personal_data_complete: completedSteps.includes('personal_data'),
        birth_data_complete: completedSteps.includes('birth_data'),
        biohacking_data_complete: completedSteps.includes('biohacking_data'),
        cognitive_data_complete: completedSteps.includes('cognitive_data'),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('onboarding_progress')
        .upsert(progressData)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
      
    } catch (error) {
      console.error('Erro ao atualizar progresso:', error);
      return { success: false, error: error.message };
    }
  }

  static async getProgress(userId: string): Promise<OnboardingProgress | null> {
    try {
      const { data, error } = await supabase
        .from('onboarding_progress')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (!data) return null;

      return {
        currentStep: data.current_step,
        completedSteps: data.completed_steps || [],
        personalDataComplete: data.personal_data_complete,
        birthDataComplete: data.birth_data_complete,
        biohackingDataComplete: data.biohacking_data_complete,
        cognitiveDataComplete: data.cognitive_data_complete
      };
      
    } catch (error) {
      console.error('Erro ao carregar progresso:', error);
      return null;
    }
  }

  // ===== COMPLETE ONBOARDING =====
  static async completeOnboarding(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          onboarding_completed: true,
          onboarding_completed_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
      
    } catch (error) {
      console.error('Erro ao completar onboarding:', error);
      return { success: false, error: error.message };
    }
  }

  // ===== UTILITY METHODS =====
  static async isOnboardingComplete(userId: string): Promise<boolean> {
    try {
      const progress = await this.getProgress(userId);
      if (!progress) return false;

      return progress.personalDataComplete && 
             progress.birthDataComplete && 
             progress.biohackingDataComplete && 
             progress.cognitiveDataComplete;
      
    } catch (error) {
      console.error('Erro ao verificar se onboarding está completo:', error);
      return false;
    }
  }

  static async getAllUserData(userId: string) {
    try {
      const [personalData, birthData, biohackingData, cognitiveData, progress] = await Promise.all([
        this.getPersonalData(userId),
        this.getBirthData(userId),
        this.getBiohackingData(userId),
        this.getCognitiveData(userId),
        this.getProgress(userId)
      ]);

      return {
        personalData,
        birthData,
        biohackingData,
        cognitiveData,
        progress,
        isComplete: await this.isOnboardingComplete(userId)
      };
      
    } catch (error) {
      console.error('Erro ao carregar todos os dados do usuário:', error);
      return null;
    }
  }

  // ===== DELETE USER DATA =====
  static async deleteAllUserData(userId: string) {
    try {
      const tables = ['personal_data', 'birth_data', 'biohacking_data', 'cognitive_data', 'onboarding_progress'];
      
      const deletePromises = tables.map(table => 
        supabase.from(table).delete().eq('user_id', userId)
      );

      await Promise.all(deletePromises);
      
      return { success: true };
      
    } catch (error) {
      console.error('Erro ao deletar dados do usuário:', error);
      return { success: false, error: error.message };
    }
  }
}

// Export types for use in components
export type {
  PersonalData,
  BirthData,
  BiohackingData,
  CognitiveData,
  OnboardingProgress
};