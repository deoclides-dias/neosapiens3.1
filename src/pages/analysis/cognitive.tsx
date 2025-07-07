// =============================================================================
// COGNITIVE ANALYSIS PAGE - IMPORT CORRETO
// =============================================================================

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Brain, Zap, Target } from 'lucide-react';
import { useRouter } from 'next/router';
import CognitiveForm from '../../components/forms/CognitiveForm'; // ← CORRETO (PascalCase)
import useAnalysisProgress from '../../hooks/useAnalysisProgress';

const CognitivePage: React.FC = () => {
  const router = useRouter();
  const { progress } = useAnalysisProgress();

  // Verificar se pode acessar esta análise
  const canAccess = progress.birth.completed && progress.biohacking.completed && progress.psychological.completed;

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
            onClick={() => router.push('/analysis')}
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
              <h3 className="font-semibold text-white">Testes Práticos</h3>
            </div>
            <p className="text-white/70 text-sm">
              Mensure suas capacidades através de testes cognitivos interativos
            </p>
          </div>
        </motion.div>
      </div>

      {/* FORMULÁRIO PRINCIPAL */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <CognitiveForm />
      </motion.div>
    </div>
  );
};

export default CognitivePage;