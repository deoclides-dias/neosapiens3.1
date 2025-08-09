// src/services/dataMapperService.ts - CORREÇÃO DO EXPORT

import { useState, useEffect } from 'react';
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

// Dados formatados para análise
interface UserAnalysisData {
  personal: {
    name?: string;
    email?: string;
    age?: number;
  };
  birth: {
    date?: string;
    time?: string;
    place?: string;
    latitude?: number;
    longitude?: number;
    timezone?: string;
  };
  biohacking?: any;
  cognitive?: any;
}

// Disponibilidade de análises
interface AnalysisAvailability {
  traditions: boolean;
  biohacking: boolean;
  psychological: boolean;
  cognitive: boolean;
}

// =============================================================================
// HOOK PRINCIPAL: useUserDataForAnalysis
// =============================================================================

function useUserDataForAnalysis() {
  const [userData, setUserData] = useState<UserAnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availability, setAvailability] = useState<AnalysisAvailability>({
    traditions: false,
    biohacking: false,
    psychological: false,
    cognitive: false
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Obter usuário atual
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      console.log('🔍 Buscando dados para usuário:', user.id);

      // Buscar dados no onboarding_progress
      const { data: onboardingData, error } = await supabase
        .from('onboarding_progress')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1);

      if (error) {
        throw error;
      }

      console.log('📊 Dados encontrados:', onboardingData);

      if (!onboardingData || onboardingData.length === 0) {
        console.log('⚠️ Nenhum dado encontrado para o usuário');
        setUserData(null);
        setAvailability({
          traditions: false,
          biohacking: false,
          psychological: false,
          cognitive: false
        });
        setLoading(false);
        return;
      }

      const record = onboardingData[0];

      // Mapear dados para formato de análise
      const mappedData: UserAnalysisData = {
        personal: {
          name: record.personal_data?.name || record.personal_data?.fullName,
          email: record.personal_data?.email,
          age: record.personal_data?.age
        },
        birth: {
          date: record.birth_data?.birthDate,
          time: record.birth_data?.birthTime,
          place: record.birth_data?.birthPlace,
          latitude: record.birth_data?.latitude,
          longitude: record.birth_data?.longitude,
          timezone: record.birth_data?.timezone
        },
        biohacking: record.biohacking_data,
        cognitive: record.cognitive_data
      };

      // Calcular disponibilidade de análises
      const analysisAvailability: AnalysisAvailability = {
        traditions: !!(record.birth_data?.birthDate), // Precisa de data de nascimento
        biohacking: record.biohacking_data_complete || false,
        psychological: !!(record.cognitive_data), // Assumindo que dados psicológicos ficam em cognitive_data
        cognitive: record.cognitive_data_complete || false
      };

      console.log('✅ Dados mapeados:', mappedData);
      console.log('📊 Disponibilidade:', analysisAvailability);

      setUserData(mappedData);
      setAvailability(analysisAvailability);
      setError(null);

    } catch (err) {
      console.error('❌ Erro ao carregar dados do usuário:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      setUserData(null);
      setAvailability({
        traditions: false,
        biohacking: false,
        psychological: false,
        cognitive: false
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    loadUserData();
  };

  return {
    userData,
    loading,
    error,
    availability,
    refreshData
  };
}

// =============================================================================
// EXPORTS - CORRIGINDO O PROBLEMA DE BUILD
// =============================================================================

// Export DEFAULT (para import default)
export default useUserDataForAnalysis;

// Export NAMED também (para import named)
export { useUserDataForAnalysis };

// Export dos tipos
export type { UserAnalysisData, AnalysisAvailability };