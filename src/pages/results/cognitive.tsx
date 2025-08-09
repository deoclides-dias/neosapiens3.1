// src/pages/results/cognitive.tsx
import React from 'react';
import { Brain, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/router';

const CognitiveResultsPage = () => {
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
            Análise Cognitiva
          </h1>
          <p className="text-gray-300 mb-6">
            Sua análise cognitiva detalhada será implementada em breve.
          </p>
          <div className="bg-gray-700 rounded-lg p-6">
            <p className="text-gray-400">
              Este módulo incluirá insights sobre seus estilos de aprendizagem, 
              processamento cognitivo e capacidades mentais.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CognitiveResultsPage;