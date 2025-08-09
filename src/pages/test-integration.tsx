// src/pages/test-integration.tsx

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';
import useResultsProgress from '../hooks/useResultsProgress';
import useAnalysisProgress from '../hooks/useAnalysisProgress';

interface TestResult {
  test: string;
  status: 'success' | 'error' | 'pending';
  message: string;
  timestamp: Date;
}

const TestIntegration: React.FC = () => {
  const router = useRouter();
  
  // Hooks com todas as funcionalidades necessárias
  const { 
    user, 
    loading: authLoading, 
    signInWithGoogle, 
    signOut 
  } = useAuth();
  
  const { 
    progress: analysisProgress, 
    loading: analysisLoading, 
    markAnalysisComplete,
    loadProgress 
  } = useAnalysisProgress();
  
  const { 
    progress: resultsProgress, 
    loading: resultsLoading,
    loadResultsProgress 
  } = useResultsProgress();

  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);

  const addTestResult = (test: string, status: 'success' | 'error' | 'pending', message: string) => {
    const newResult: TestResult = {
      test,
      status,
      message,
      timestamp: new Date()
    };
    setTestResults(prev => [...prev, newResult]);
  };

  const clearTestResults = () => {
    setTestResults([]);
  };

  const runAuthTests = async () => {
    addTestResult('🔐 Auth Status', 'pending', 'Verificando status de autenticação...');
    
    if (authLoading) {
      addTestResult('🔐 Auth Status', 'pending', 'Carregando dados de autenticação...');
      return;
    }

    if (!user) {
      addTestResult('🔐 Auth Status', 'error', 'Usuário não autenticado');
      addTestResult('🔑 Login Google', 'pending', 'Tentando login automático...');
      
      try {
        await signInWithGoogle();
        addTestResult('🔑 Login Google', 'success', 'Login realizado com sucesso');
      } catch (error) {
        addTestResult('🔑 Login Google', 'error', `Erro no login: ${error}`);
      }
    } else {
      addTestResult('🔐 Auth Status', 'success', `Usuário logado: ${user.email}`);
    }
  };

  const runProgressTests = async () => {
    addTestResult('📊 Analysis Progress', 'pending', 'Carregando progresso das análises...');
    
    try {
      await loadProgress();
      addTestResult('📊 Analysis Progress', 'success', 
        `Progresso carregado: ${analysisProgress.overallProgress}% completo`);
      
      addTestResult('📋 Progress Details', 'success', 
        `Birth: ${analysisProgress.birth.completed ? '✅' : '❌'}, ` +
        `Biohacking: ${analysisProgress.biohacking.completed ? '✅' : '❌'}, ` +
        `Psychological: ${analysisProgress.psychological.completed ? '✅' : '❌'}, ` +
        `Cognitive: ${analysisProgress.cognitive.completed ? '✅' : '❌'}`
      );
    } catch (error) {
      addTestResult('📊 Analysis Progress', 'error', `Erro ao carregar progresso: ${error}`);
    }
  };

  const runResultsTests = async () => {
    addTestResult('📈 Results Progress', 'pending', 'Carregando progresso dos resultados...');
    
    try {
      await loadResultsProgress();
      addTestResult('📈 Results Progress', 'success', 
        `Resultados disponíveis: ${resultsProgress.availableResults.length}`);
      
      addTestResult('🎯 Available Results', 'success', 
        `Disponíveis: ${resultsProgress.availableResults.join(', ') || 'Nenhum'}`);
    } catch (error) {
      addTestResult('📈 Results Progress', 'error', `Erro ao carregar resultados: ${error}`);
    }
  };

  const testDataSaving = async () => {
    if (!user) {
      addTestResult('💾 Data Saving', 'error', 'Usuário não logado para teste');
      return;
    }

    addTestResult('💾 Data Saving', 'pending', 'Testando salvamento de dados...');
    
    try {
      const testData = {
        date: '1990-01-01',
        time: '12:00',
        location: 'São Paulo, SP',
        test: true
      };

      const success = await markAnalysisComplete('birth', testData);
      
      if (success) {
        addTestResult('💾 Data Saving', 'success', 'Dados salvos com sucesso no Supabase');
      } else {
        addTestResult('💾 Data Saving', 'error', 'Falha ao salvar dados');
      }
    } catch (error) {
      addTestResult('💾 Data Saving', 'error', `Erro no salvamento: ${error}`);
    }
  };

  const runAllTests = async () => {
    setIsRunningTests(true);
    clearTestResults();
    
    addTestResult('🧪 Test Suite', 'pending', 'Iniciando bateria de testes...');
    
    await runAuthTests();
    await new Promise(resolve => setTimeout(resolve, 1000)); // Aguardar 1s
    
    await runProgressTests();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await runResultsTests();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await testDataSaving();
    
    addTestResult('🧪 Test Suite', 'success', 'Todos os testes concluídos!');
    setIsRunningTests(false);
  };

  const simulateCompleteAnalysis = async (analysisType: 'birth' | 'biohacking' | 'psychological' | 'cognitive') => {
    const mockData = {
      birth: { date: '1990-01-01', time: '12:00', location: 'São Paulo, SP' },
      biohacking: { completed: true, timestamp: new Date().toISOString() },
      psychological: { completed: true, timestamp: new Date().toISOString() },
      cognitive: { completed: true, timestamp: new Date().toISOString() }
    };

    try {
      const success = await markAnalysisComplete(analysisType, mockData[analysisType]);
      if (success) {
        addTestResult(`🎭 Simulate ${analysisType}`, 'success', `${analysisType} marcado como completo`);
      } else {
        addTestResult(`🎭 Simulate ${analysisType}`, 'error', `Falha ao marcar ${analysisType} como completo`);
      }
    } catch (error) {
      addTestResult(`🎭 Simulate ${analysisType}`, 'error', `Erro: ${error}`);
    }
  };

  const navigateToHub = (hubType: 'analysis' | 'results') => {
    router.push(`/${hubType}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            🧪 Sistema de Testes - NeoSapiens
          </h1>
          <p className="text-purple-200 text-lg">
            Validação completa da integração entre hooks, Supabase e navegação
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Auth Status */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
              🔐 Autenticação
            </h3>
            {authLoading ? (
              <p className="text-yellow-300">🔄 Carregando...</p>
            ) : user ? (
              <div>
                <p className="text-green-300">✅ Logado</p>
                <p className="text-sm text-purple-200">{user.email}</p>
              </div>
            ) : (
              <p className="text-red-300">❌ Não logado</p>
            )}
          </div>

          {/* Analysis Progress */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h3 className="text-white font-semibold mb-2">📊 Análises</h3>
            {analysisLoading ? (
              <p className="text-yellow-300">🔄 Carregando...</p>
            ) : (
              <div>
                <p className="text-blue-300">{analysisProgress.overallProgress}% Completo</p>
                <div className="text-sm text-purple-200 mt-2">
                  <div>Birth: {analysisProgress.birth.completed ? '✅' : '❌'}</div>
                  <div>Bio: {analysisProgress.biohacking.completed ? '✅' : '❌'}</div>
                  <div>Psy: {analysisProgress.psychological.completed ? '✅' : '❌'}</div>
                  <div>Cog: {analysisProgress.cognitive.completed ? '✅' : '❌'}</div>
                </div>
              </div>
            )}
          </div>

          {/* Results Progress */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h3 className="text-white font-semibold mb-2">📈 Resultados</h3>
            {resultsLoading ? (
              <p className="text-yellow-300">🔄 Carregando...</p>
            ) : (
              <div>
                <p className="text-green-300">{resultsProgress.availableResults.length} Disponíveis</p>
                <div className="text-sm text-purple-200 mt-2">
                  {resultsProgress.availableResults.length > 0 ? (
                    resultsProgress.availableResults.map(result => (
                      <div key={result}>✅ {result}</div>
                    ))
                  ) : (
                    <div>❌ Nenhum resultado</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Test Controls */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 mb-8">
          <h3 className="text-white font-semibold mb-4">🎮 Controles de Teste</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <button
              onClick={runAllTests}
              disabled={isRunningTests}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isRunningTests ? '🔄 Testando...' : '🚀 Executar Todos'}
            </button>
            
            <button
              onClick={clearTestResults}
              className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
            >
              🧹 Limpar
            </button>
            
            <button
              onClick={() => navigateToHub('analysis')}
              className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
            >
              📊 Analysis Hub
            </button>
            
            <button
              onClick={() => navigateToHub('results')}
              className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              📈 Results Hub
            </button>
          </div>

          {/* Simulation Controls */}
          <div className="border-t border-white/20 pt-4">
            <h4 className="text-white font-medium mb-3">🎭 Simulações</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button
                onClick={() => simulateCompleteAnalysis('birth')}
                className="bg-yellow-600 text-white py-2 px-3 rounded text-sm hover:bg-yellow-700 transition-colors"
              >
                🌟 Birth
              </button>
              <button
                onClick={() => simulateCompleteAnalysis('biohacking')}
                className="bg-orange-600 text-white py-2 px-3 rounded text-sm hover:bg-orange-700 transition-colors"
              >
                💪 Bio
              </button>
              <button
                onClick={() => simulateCompleteAnalysis('psychological')}
                className="bg-pink-600 text-white py-2 px-3 rounded text-sm hover:bg-pink-700 transition-colors"
              >
                🧠 Psy
              </button>
              <button
                onClick={() => simulateCompleteAnalysis('cognitive')}
                className="bg-indigo-600 text-white py-2 px-3 rounded text-sm hover:bg-indigo-700 transition-colors"
              >
                ⚡ Cog
              </button>
            </div>
          </div>
        </div>

        {/* Test Results */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h3 className="text-white font-semibold mb-4">📋 Resultados dos Testes</h3>
          
          {testResults.length === 0 ? (
            <p className="text-purple-200">Nenhum teste executado ainda. Clique em "Executar Todos" para começar.</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border-l-4 ${
                    result.status === 'success'
                      ? 'bg-green-900/30 border-green-400'
                      : result.status === 'error'
                      ? 'bg-red-900/30 border-red-400'
                      : 'bg-yellow-900/30 border-yellow-400'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-white">
                        {result.test}
                      </h4>
                      <p className="text-sm text-gray-300 mt-1">{result.message}</p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {result.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-purple-300 text-sm">
            🧪 Sistema de testes para validação completa da integração NeoSapiens
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestIntegration;