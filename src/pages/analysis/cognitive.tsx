// src/pages/analysis/cognitive.tsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Brain, Zap, Target, CheckCircle, Loader } from 'lucide-react';
import { useRouter } from 'next/router';
import CognitiveForm from '../../components/onboarding/CognitiveForm'; // ← IMPORT CORRETO!
import useAnalysisProgress from '../../hooks/useAnalysisProgress';

const CognitivePage: React.FC = () => {
  const router = useRouter();
  const { progress, markAnalysisComplete } = useAnalysisProgress();
  const [isCompleting, setIsCompleting] = useState(false);
  const [completed, setCompleted] = useState(false);

  // Verificar se pode acessar esta análise
  const canAccess = progress.birth.completed && progress.biohacking.completed && progress.psychological.completed;

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleCognitiveComplete = async (cognitiveData: any) => {
    setIsCompleting(true);
    
    try {
      console.log('💾 Salvando dados cognitivos:', cognitiveData);
      
      // Salvar no Supabase via hook
      const success = await markAnalysisComplete('cognitive', cognitiveData);
      
      if (success) {
        setCompleted(true);
        
        // Mostrar mensagem de sucesso por 2 segundos
        setTimeout(() => {
          router.push('/analysis'); // Voltar para o hub
        }, 2000);
      } else {
        alert('❌ Erro ao salvar dados cognitivos. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao completar análise cognitiva:', error);
      alert('❌ Erro inesperado. Tente novamente.');
    } finally {
      setIsCompleting(false);
    }
  };

  const handleBack = () => {
    router.push('/analysis');
  };

  // ============================================================================
  // TELA DE ACESSO BLOQUEADO
  // ============================================================================

  if (!canAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto p-8"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <Zap className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-4">
              🔒 Análise Cognitiva Bloqueada
            </h1>
            <p className="text-white/70 mb-6">
              Complete as análises anteriores para desbloquear a avaliação cognitiva:
            </p>
            <div className="space-y-2 mb-6">
              <div className={`flex items-center gap-2 ${progress.birth.completed ? 'text-green-400' : 'text-red-400'}`}>
                <div className={`w-2 h-2 rounded-full ${progress.birth.completed ? 'bg-green-400' : 'bg-red-400'}`} />
                Dados de Nascimento
              </div>
              <div className={`flex items-center gap-2 ${progress.biohacking.completed ? 'text-green-400' : 'text-red-400'}`}>
                <div className={`w-2 h-2 rounded-full ${progress.biohacking.completed ? 'bg-green-400' : 'bg-red-400'}`} />
                Avaliação Biohacking
              </div>
              <div className={`flex items-center gap-2 ${progress.psychological.completed ? 'text-green-400' : 'text-red-400'}`}>
                <div className={`w-2 h-2 rounded-full ${progress.psychological.completed ? 'bg-green-400' : 'bg-red-400'}`} />
                Avaliação Psicológica
              </div>
            </div>
            <button
              onClick={() => router.push('/analysis')}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar ao Hub de Análises
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ============================================================================
  // TELA DE CONCLUSÃO
  // ============================================================================

  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto p-8"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-4">
              🎉 Análise Cognitiva Completa!
            </h1>
            <p className="text-white/70 mb-6">
              Seus dados cognitivos foram salvos com sucesso. Redirecionando...
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400 mx-auto"></div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ============================================================================
  // TELA DE LOADING
  // ============================================================================

  if (isCompleting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center max-w-md mx-auto p-8"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <Loader className="w-16 h-16 text-blue-400 mx-auto mb-4 animate-spin" />
            <h1 className="text-2xl font-bold text-white mb-4">
              💾 Processando Análise Cognitiva
            </h1>
            <p className="text-white/70 mb-6">
              Salvando seus dados e gerando insights personalizados...
            </p>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div className="bg-blue-400 h-2 rounded-full animate-pulse" style={{width: '75%'}}></div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ============================================================================
  // TELA PRINCIPAL
  // ============================================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* HEADER */}
      <div className="container mx-auto px-4 pt-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar ao Hub
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Análise Cognitiva</h1>
              <p className="text-white/70 text-sm">Mapeamento das suas capacidades mentais</p>
            </div>
          </div>
        </motion.div>

        {/* OVERVIEW CARDS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <Brain className="w-6 h-6 text-blue-400" />
              <h3 className="font-semibold text-white">Processamento Mental</h3>
            </div>
            <p className="text-white/70 text-sm">
              Descubra como sua mente organiza e processa informações de forma única
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <Target className="w-6 h-6 text-green-400" />
              <h3 className="font-semibold text-white">Capacidades Executivas</h3>
            </div>
            <p className="text-white/70 text-sm">
              Avalie suas habilidades de planejamento, foco e flexibilidade cognitiva
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <Zap className="w-6 h-6 text-purple-400" />
              <h3 className="font-semibold text-white">Estilos de Aprendizagem</h3>
            </div>
            <p className="text-white/70 text-sm">
              Identifique seus métodos de aprendizagem mais eficazes e naturais
            </p>
          </div>
        </motion.div>
      </div>

      {/* FORMULÁRIO PRINCIPAL */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="container mx-auto px-4 pb-8"
      >
        <div className="bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 overflow-hidden">
          <CognitiveForm
            onComplete={handleCognitiveComplete}
            onBack={handleBack}
            initialData={progress.cognitive.data} // Pré-carregar dados se existirem
          />
        </div>
      </motion.div>
    </div>
  );
};

export default CognitivePage;