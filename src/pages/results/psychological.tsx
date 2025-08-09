// src/pages/results/psychological.tsx
import React from 'react';
import { Brain, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/router';

const PsychologicalResultsPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.push('/results')}
          className="flex items-center text-gray-300 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para Resultados
        </button>

        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <Brain className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-4">
            Perfil Psicológico
          </h1>
          <p className="text-gray-300 mb-6">
            Sua análise psicológica completa será implementada em breve.
          </p>
          <div className="bg-gray-700 rounded-lg p-6">
            <p className="text-gray-400">
              Este módulo incluirá seu perfil Big Five, análise DISC, 
              estilos de aprendizagem VARK e mapeamento dos 5 elementos da MTC.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PsychologicalResultsPage;