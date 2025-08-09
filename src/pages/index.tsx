// src/pages/index.tsx - BÁSICO PARA TESTAR
import React from 'react';
import { useRouter } from 'next/router';

const HomePage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-6">
      <div className="max-w-4xl mx-auto text-center">
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-6xl font-bold text-white mb-4">
            🌟 NeoSapiens
          </h1>
          <p className="text-2xl text-purple-200 mb-8">
            Sua jornada de autodescoberta aguarda
          </p>
          <p className="text-lg text-purple-300 max-w-2xl mx-auto">
            Descubra suas três dimensões através de análises científicas e tradições ancestrais. 
            Corpo, Mente e Propósito integrados em uma plataforma revolucionária.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 mb-12">
          <button
            onClick={() => router.push('/auth/login')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg text-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-xl block w-full max-w-md mx-auto"
          >
            🚀 Iniciar Jornada
          </button>
          
          <button
            onClick={() => router.push('/analysis')}
            className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg text-xl font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20 block w-full max-w-md mx-auto"
          >
            📊 Hub de Análises
          </button>
          
          <button
            onClick={() => router.push('/results')}
            className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg text-xl font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20 block w-full max-w-md mx-auto"
          >
            📈 Ver Resultados
          </button>
          
          <button
            onClick={() => router.push('/test-integration')}
            className="bg-green-600 text-white px-8 py-4 rounded-lg text-xl font-semibold hover:bg-green-700 transition-all duration-300 block w-full max-w-md mx-auto"
          >
            🧪 Testar Integração
          </button>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-3xl mb-3">🌟</div>
            <h3 className="text-xl font-bold text-white mb-2">Tradições Ancestrais</h3>
            <p className="text-purple-200 text-sm">Astrologia Ocidental, Chinesa e Numerologia</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-3xl mb-3">🧬</div>
            <h3 className="text-xl font-bold text-white mb-2">Ciência Moderna</h3>
            <p className="text-purple-200 text-sm">Big Five, Biohacking e Análise Cognitiva</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="text-xl font-bold text-white mb-2">Análise Integrada</h3>
            <p className="text-purple-200 text-sm">Síntese das três dimensões do ser</p>
          </div>
        </div>

        {/* Debug Info */}
        <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-bold text-white mb-4">🔧 Status do Sistema</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="text-left">
              <p className="text-green-400">✅ Landing Page: Funcionando</p>
              <p className="text-green-400">✅ Autenticação: Integrada</p>
              <p className="text-green-400">✅ Módulos: Implementados</p>
            </div>
            <div className="text-left">
              <p className="text-yellow-400">🔄 Hub Analysis: Novo sistema</p>
              <p className="text-yellow-400">🔄 Results: Em integração</p>
              <p className="text-blue-400">🧪 Test Integration: Disponível</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-purple-300 text-sm">
            🚀 NeoSapiens Platform - Sua evolução começa aqui
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;