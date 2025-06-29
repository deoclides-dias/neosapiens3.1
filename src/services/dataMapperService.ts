// src/services/dataMapperService.ts
import { supabase } from '../lib/supabase';

// 🎯 INTERFACES PARA OS DADOS (simplificadas para usar só onboarding_progress)
interface SupabaseOnboardingData {
  id: string;
  user_id: string;
  step: number;
  personal_data: any;
  birth_data: any;
  biohacking_data: any;
  cognitive_data: any;
  personal_data_complete: boolean;
  birth_data_complete: boolean;
  biohacking_data_complete: boolean;
  cognitive_data_complete: boolean;
  created_at: string;
  updated_at: string;
}

// 🎯 INTERFACE PARA NOSSOS COMPONENTES DE ANÁLISE
interface AnalysisUserData {
  id: string;
  name: string;
  birthDate: string;
  birthTime?: string;
  birthPlace?: {
    name: string;
    latitude: number;
    longitude: number;
  };
  timezone?: string;
}

// 🔧 CLASSE PRINCIPAL DO MAPEADOR (SIMPLIFICADA)
class DataMapperService {
  
  /**
   * Busca dados do usuário APENAS da tabela onboarding_progress
   */
  async getUserDataForAnalysis(userId: string): Promise<AnalysisUserData | null> {
    try {
      console.log(`🔍 Buscando dados do usuário ${userId} no onboarding_progress...`);
      
      // Buscar APENAS na tabela onboarding_progress
      const { data: onboardingData, error } = await supabase
        .from('onboarding_progress')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error) {
        console.error('❌ Erro ao buscar dados de onboarding:', error);
        return null;
      }
      
      if (!onboardingData) {
        console.warn('⚠️ Nenhum dado de onboarding encontrado');
        return null;
      }
      
      console.log('✅ Dados de onboarding encontrados:', onboardingData);
      
      // Mapear dados do onboarding para formato de análise
      const mappedData: AnalysisUserData = {
        id: userId,
        name: onboardingData.personal_data?.nome || 
              onboardingData.personal_data?.name || 
              'Neo-Navegante',
        birthDate: onboardingData.birth_data?.birthDate || '1990-01-15',
        birthTime: onboardingData.birth_data?.birthTime || '14:30',
        birthPlace: onboardingData.birth_data?.birthPlace ? {
          name: onboardingData.birth_data.birthPlace,
          latitude: onboardingData.birth_data.latitude || -23.5505,
          longitude: onboardingData.birth_data.longitude || -46.6333
        } : {
          name: 'São Paulo, SP, Brasil',
          latitude: -23.5505,
          longitude: -46.6333
        },
        timezone: onboardingData.birth_data?.timezone || 'America/Sao_Paulo'
      };
      
      console.log('🔄 Dados mapeados para análise:', mappedData);
      return mappedData;
      
    } catch (error) {
      console.error('💥 Erro no mapeamento de dados:', error);
      return null;
    }
  }

  /**
   * Versão que busca dados do usuário logado automaticamente
   */
  async getCurrentUserDataForAnalysis(): Promise<AnalysisUserData | null> {
    try {
      console.log('👤 Verificando usuário logado...');
      
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        console.error('❌ Usuário não logado:', error);
        return null;
      }
      
      console.log('👤 Usuário logado detectado:', user.id);
      return this.getUserDataForAnalysis(user.id);
      
    } catch (error) {
      console.error('💥 Erro ao verificar usuário logado:', error);
      return null;
    }
  }

  /**
   * Verifica quais dados estão disponíveis para análises
   */
  async getAnalysisAvailability(userId?: string): Promise<{
    hasPersonalData: boolean;
    hasBirthData: boolean;
    hasBiohackingData: boolean;
    hasCognitiveData: boolean;
    canRunWesternAstrology: boolean;
    canRunChineseAstrology: boolean;
    canRunNumerology: boolean;
    dataCompleteness: number;
    westernAstrology: any;
    chineseAstrology: any;
    numerology: any;
  }> {
    try {
      const targetUserId = userId || (await supabase.auth.getUser()).data.user?.id;
      
      if (!targetUserId) {
        return {
          hasPersonalData: false,
          hasBirthData: false,
          hasBiohackingData: false,
          hasCognitiveData: false,
          canRunWesternAstrology: false,
          canRunChineseAstrology: false,
          canRunNumerology: false,
          dataCompleteness: 0,
          westernAstrology: { available: false, data: null },
          chineseAstrology: { available: false, data: null },
          numerology: { available: false, data: null }
        };
      }

      const { data: onboardingData, error } = await supabase
        .from('onboarding_progress')
        .select('*')
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error || !onboardingData) {
        console.log('⚠️ Nenhum dado de onboarding para análise de disponibilidade');
        return {
          hasPersonalData: false,
          hasBirthData: false,
          hasBiohackingData: false,
          hasCognitiveData: false,
          canRunWesternAstrology: false,
          canRunChineseAstrology: false,
          canRunNumerology: false,
          dataCompleteness: 0,
          westernAstrology: { available: false, data: null },
          chineseAstrology: { available: false, data: null },
          numerology: { available: false, data: null }
        };
      }

      const hasPersonalData = onboardingData.personal_data_complete || false;
      const hasBirthData = onboardingData.birth_data_complete || false;
      const hasBiohackingData = onboardingData.biohacking_data_complete || false;
      const hasCognitiveData = onboardingData.cognitive_data_complete || false;

      // Para análises, precisamos pelo menos de dados pessoais e de nascimento
      const canRunWesternAstrology = hasPersonalData && hasBirthData;
      const canRunChineseAstrology = hasPersonalData && hasBirthData;
      const canRunNumerology = hasPersonalData && hasBirthData;

      const completedSections = [hasPersonalData, hasBirthData, hasBiohackingData, hasCognitiveData].filter(Boolean).length;
      const dataCompleteness = (completedSections / 4) * 100;

      // Buscar análises já processadas (query corrigida para múltiplas linhas)
      console.log('🔍 Buscando análises na traditions_analysis...');
      
      const { data: cachedAnalyses, error: analysisError } = await supabase
        .from('traditions_analysis')
        .select('western_astrology, chinese_astrology, numerology')
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false })
        .limit(1); // Pegar só a mais recente, SEM .single()

      if (analysisError) {
        console.log('⚠️ Erro ao buscar análises:', analysisError.message);
      } else {
        console.log('✅ Análises encontradas:', cachedAnalyses);
      }

      // Pegar a primeira linha (mais recente)
      const latestAnalysis = cachedAnalyses?.[0] || null;

      // Estrutura que o Dashboard espera: { available: boolean, data: any }
      // CORREÇÃO: Os dados já vêm como objeto, não como string JSON!
      const westernAstrology = {
        available: canRunWesternAstrology,
        data: latestAnalysis?.western_astrology || null // SEM JSON.parse()!
      };

      const chineseAstrology = {
        available: canRunChineseAstrology,
        data: latestAnalysis?.chinese_astrology || null // SEM JSON.parse()!
      };

      const numerology = {
        available: canRunNumerology,
        data: latestAnalysis?.numerology || null // SEM JSON.parse()!
      };

      return {
        hasPersonalData,
        hasBirthData,
        hasBiohackingData,
        hasCognitiveData,
        canRunWesternAstrology,
        canRunChineseAstrology,
        canRunNumerology,
        dataCompleteness,
        westernAstrology,
        chineseAstrology,
        numerology
      };

    } catch (error) {
      console.error('💥 Erro ao verificar disponibilidade de análises:', error);
      return {
        hasPersonalData: false,
        hasBirthData: false,
        hasBiohackingData: false,
        hasCognitiveData: false,
        canRunWesternAstrology: false,
        canRunChineseAstrology: false,
        canRunNumerology: false,
        dataCompleteness: 0,
        westernAstrology: { available: false, data: null },
        chineseAstrology: { available: false, data: null },
        numerology: { available: false, data: null }
      };
    }
  }

  /**
   * Salva resultado de análise no Supabase (usando a tabela traditions_analysis)
   */
  async saveAnalysisResult(
    userId: string, 
    analysisType: 'western-astrology' | 'chinese-astrology' | 'numerology',
    results: any
  ): Promise<boolean> {
    try {
      console.log(`💾 Salvando resultado de análise ${analysisType} para usuário ${userId}...`);
      
      const { error } = await supabase
        .from('traditions_analysis')
        .upsert({
          user_id: userId,
          analysis_type: analysisType,
          results: results,
          status: 'completed',
          completed_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,analysis_type'
        });
      
      if (error) {
        console.error('❌ Erro ao salvar resultado da análise:', error);
        return false;
      }
      
      console.log('✅ Resultado da análise salvo com sucesso');
      return true;
      
    } catch (error) {
      console.error('💥 Erro ao salvar resultado da análise:', error);
      return false;
    }
  }

  /**
   * Busca resultado de análise salvo (cache)
   */
  async getCachedAnalysisResult(
    userId: string,
    analysisType: 'western-astrology' | 'chinese-astrology' | 'numerology'
  ): Promise<any | null> {
    try {
      console.log(`🔍 Buscando resultado em cache para ${analysisType}...`);
      
      const { data, error } = await supabase
        .from('traditions_analysis')
        .select('results, created_at')
        .eq('user_id', userId)
        .eq('analysis_type', analysisType)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error || !data) {
        console.log('📭 Nenhum resultado em cache encontrado');
        return null;
      }
      
      // Verificar se o cache não está muito antigo (ex: 7 dias)
      const cacheAge = Date.now() - new Date(data.created_at).getTime();
      const maxCacheAge = 7 * 24 * 60 * 60 * 1000; // 7 dias em ms
      
      if (cacheAge > maxCacheAge) {
        console.log('⏰ Cache muito antigo, ignorando...');
        return null;
      }
      
      console.log('✅ Resultado em cache encontrado e válido');
      return data.results;
      
    } catch (error) {
      console.error('💥 Erro ao buscar cache:', error);
      return null;
    }
  }
}

// 🚀 INSTÂNCIA SINGLETON DO SERVIÇO
export const dataMapper = new DataMapperService();

// 🎯 HOOK REACT PARA FACILITAR O USO NOS COMPONENTES
import { useState, useEffect } from 'react';

export const useUserDataForAnalysis = (userId?: string) => {
  const [userData, setUserData] = useState<AnalysisUserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availability, setAvailability] = useState({
    hasPersonalData: false,
    hasBirthData: false,
    hasBiohackingData: false,
    hasCognitiveData: false,
    canRunWesternAstrology: false,
    canRunChineseAstrology: false,
    canRunNumerology: false,
    dataCompleteness: 0,
    westernAstrology: { available: false, data: null },
    chineseAstrology: { available: false, data: null },
    numerology: { available: false, data: null }
  });

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Buscar dados do usuário
      const data = userId 
        ? await dataMapper.getUserDataForAnalysis(userId)
        : await dataMapper.getCurrentUserDataForAnalysis();

      setUserData(data);

      // Buscar disponibilidade de análises
      const availabilityData = await dataMapper.getAnalysisAvailability(userId);
      setAvailability(availabilityData);

      if (!data) {
        setError('Dados do usuário não encontrados');
      }

    } catch (err) {
      console.error('💥 Erro no hook useUserDataForAnalysis:', err);
      setError('Erro ao carregar dados do usuário');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  return {
    userData,
    loading,
    error,
    availability,
    refresh: fetchUserData
  };
};