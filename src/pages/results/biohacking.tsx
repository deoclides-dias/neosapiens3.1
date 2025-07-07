// src/pages/results/biohacking.tsx
import React from 'react';
import { Activity, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/router';

const BiohackingResultsPage = () => {
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
          <Activity className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-4">
            Análise Biohacking
          </h1>
          <p className="text-gray-300 mb-6">
            Seus protocolos personalizados de biohacking serão implementados em breve.
          </p>
          <div className="bg-gray-700 rounded-lg p-6">
            <p className="text-gray-400">
              Este módulo incluirá recomendações sobre sono, nutrição, exercícios 
              e otimização da medicina funcional baseada nos 5 elementos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiohackingResultsPage;