// src/pages/analysis/biohacking.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, Activity } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import BiohackingForm from '../../components/onboarding/BiohackingForm';

// Interface para os dados do biohacking (simplificada para a página)
interface BiohackingPageData {
  anthropometric: {
    height: number;
    currentWeight: number;
    desiredWeight: number;
    bodyType: string;
  };
  sleep: {
    bedtime: string;
    wakeupTime: string;
    sleepQuality: number;
    chronotype: string;
  };
  // Adicionar outros campos conforme necessário
}

const BiohackingAnalysisPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleComplete = async (data: any) => {
    if (!user?.id) {
      alert('Usuário não autenticado. Faça login novamente.');
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('📊 Salvando dados do Biohacking:', data);
      
      // 1. SALVAR OS DADOS NO SUPABASE
      const { data: existingData, error: fetchError } = await supabase
        .from('onboarding_progress')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1);

      if (fetchError) {
        console.error('❌ Erro ao buscar dados existentes:', fetchError);
        throw fetchError;
      }

      const updateData = {
        biohacking_data: data,
        biohacking_data_complete: true,
        updated_at: new Date().toISOString()
      };

      let saveResult;
      
      if (existingData && existingData.length > 0) {
        // Atualizar registro existente
        const { error: updateError } = await supabase
          .from('onboarding_progress')
          .update(updateData)
          .eq('user_id', user.id);
          
        if (updateError) {
          console.error('❌ Erro ao atualizar:', updateError);
          throw updateError;
        }
        console.log('✅ Dados atualizados com sucesso');
      } else {
        // Criar novo registro
        const { error: insertError } = await supabase
          .from('onboarding_progress')
          .insert({
            user_id: user.id,
            step: 2,
            ...updateData,
            created_at: new Date().toISOString()
          });
          
        if (insertError) {
          console.error('❌ Erro ao inserir:', insertError);
          throw insertError;
        }
        console.log('✅ Novo registro criado com sucesso');
      }

      console.log('🎉 Biohacking salvo com sucesso!');
      
      // 2. REDIRECIONAR DE VOLTA PARA O HUB
      router.push('/analysis');
      
    } catch (error) {
      console.error('❌ Erro ao salvar dados de biohacking:', error);
      alert('Erro ao salvar dados. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/analysis');
  };

  // Verificar autenticação
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Acesso Restrito
          </h2>
          <p className="text-gray-600 mb-4">
            Você precisa estar logado para acessar esta página.
          </p>
          <button
            onClick={() => router.push('/auth/login')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Fazer Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={handleBack}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Hub
            </button>
            
            <div className="flex items-center space-x-3">
              <Activity className="w-6 h-6 text-green-600" />
              <h1 className="text-xl font-semibold text-gray-900">
                Avaliação Biohacking
              </h1>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>👤 {user.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="py-8">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Salvando seus dados no Supabase...</p>
            </div>
          </div>
        ) : (
          <BiohackingForm
            onComplete={handleComplete}
            onBack={handleBack}
          />
        )}
      </div>
    </div>
  );
};

export default BiohackingAnalysisPage;