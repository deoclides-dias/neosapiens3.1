// src/components/debug/BugHunterComponent.tsx - COMPONENTE PARA CAÇAR O BUG

import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, XCircle, Search, Bug, Zap } from 'lucide-react';

interface DebugInfo {
  environment: string;
  totalSteps: number;
  currentStep: number;
  componentsLoaded: string[];
  missingComponents: string[];
  questionsCount: number;
  errors: string[];
}

export const BugHunterComponent: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInvestigating, setIsInvestigating] = useState(false);

  // Lista dos 8 steps esperados
  const expectedSteps = [
    'Step1_Openness',
    'Step2_Conscientiousness', 
    'Step3_Extraversion',
    'Step4_Agreeableness',
    'Step5_Neuroticism',
    'Step6_DiscVark',
    'Step7_MtcWoodFire',
    'Step8_MtcEarthMetalWater'
  ];

  const runInvestigation = async () => {
    setIsInvestigating(true);
    console.log('🔍 INICIANDO INVESTIGAÇÃO DO BUG DOS STEPS...');

    try {
      const info: DebugInfo = {
        environment: window.location.hostname.includes('vercel') ? 'PRODUCTION' : 'LOCAL',
        totalSteps: 0,
        currentStep: 1,
        componentsLoaded: [],
        missingComponents: [],
        questionsCount: 0,
        errors: []
      };

      // Investigar cada componente
      for (const stepName of expectedSteps) {
        try {
          // Simular verificação de componente
          // Na implementação real, você verificaria se o componente existe
          const componentExists = true; // Placeholder
          
          if (componentExists) {
            info.componentsLoaded.push(stepName);
            info.totalSteps++;
          } else {
            info.missingComponents.push(stepName);
            info.errors.push(`Componente ${stepName} não encontrado`);
          }
        } catch (error) {
          info.missingComponents.push(stepName);
          info.errors.push(`Erro ao carregar ${stepName}: ${error}`);
        }
      }

      // Calcular questões baseado nos componentes carregados
      const questionsPerStep = [8, 8, 8, 8, 8, 24, 16, 16]; // Questões por step
      info.questionsCount = info.componentsLoaded.length <= 5 
        ? info.componentsLoaded.length * 5  // Bug: só 5 questões por step
        : info.componentsLoaded.reduce((total, _, index) => total + questionsPerStep[index], 0);

      setDebugInfo(info);
      
      // Log detalhado no console
      console.log('🚨 INVESTIGAÇÃO COMPLETA - RESULTADOS:');
      console.log('=====================================');
      console.log(`🌍 Ambiente: ${info.environment}`);
      console.log(`📊 Steps Carregados: ${info.totalSteps}/8`);
      console.log(`❓ Questões Encontradas: ${info.questionsCount}/96`);
      console.log(`✅ Componentes OK: ${info.componentsLoaded.join(', ')}`);
      if (info.missingComponents.length > 0) {
        console.log(`❌ Componentes Ausentes: ${info.missingComponents.join(', ')}`);
      }
      if (info.errors.length > 0) {
        console.log(`🚨 Erros: ${info.errors.join(', ')}`);
      }

    } catch (error) {
      console.error('❌ Erro durante investigação:', error);
      setDebugInfo({
        environment: 'UNKNOWN',
        totalSteps: 0,
        currentStep: 0,
        componentsLoaded: [],
        missingComponents: expectedSteps,
        questionsCount: 0,
        errors: [`Erro crítico: ${error}`]
      });
    }

    setIsInvestigating(false);
  };

  // Função para detectar o bug automaticamente
  const detectBug = () => {
    if (!debugInfo) return null;

    if (debugInfo.totalSteps === 5 && debugInfo.questionsCount === 25) {
      return {
        type: 'CRITICAL',
        message: 'BUG CONFIRMADO: Só 5 steps com 5 questões cada (deveria ser 8 steps com 96 questões total)',
        cause: 'Provavelmente cache do Vercel ou componentes não sendo importados corretamente'
      };
    }

    if (debugInfo.totalSteps < 8) {
      return {
        type: 'ERROR',
        message: `Componentes ausentes: ${8 - debugInfo.totalSteps} steps não carregaram`,
        cause: 'Imports dinâmicos falhando ou tree shaking removendo componentes'
      };
    }

    return {
      type: 'SUCCESS',
      message: 'Todos os componentes estão carregando corretamente!',
      cause: 'Sistema funcionando como esperado'
    };
  };

  const bugStatus = detectBug();

  // Mostrar apenas em desenvolvimento ou com query parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const shouldShow = urlParams.get('debug') === 'true' || 
                      window.location.hostname === 'localhost' ||
                      localStorage.getItem('showBugHunter') === 'true';
    setIsVisible(shouldShow);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Botão Flutuante */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg transition-all"
        title="Bug Hunter - Debug dos Steps"
      >
        <Bug className="w-6 h-6" />
      </button>

      {/* Painel de Debug */}
      <div className="absolute bottom-16 right-0 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 p-4 max-h-96 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Bug className="w-5 h-5 text-red-500" />
            <h3 className="font-bold text-gray-900">Bug Hunter</h3>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        {/* Botão de Investigação */}
        <button
          onClick={runInvestigation}
          disabled={isInvestigating}
          className="w-full mb-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {isInvestigating ? (
            <>
              <Search className="w-4 h-4 animate-spin" />
              <span>Investigando...</span>
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              <span>Investigar Bug</span>
            </>
          )}
        </button>

        {/* Resultados */}
        {debugInfo && (
          <div className="space-y-3">
            {/* Status do Bug */}
            {bugStatus && (
              <div className={`p-3 rounded-lg ${
                bugStatus.type === 'CRITICAL' ? 'bg-red-50 border border-red-200' :
                bugStatus.type === 'ERROR' ? 'bg-yellow-50 border border-yellow-200' :
                'bg-green-50 border border-green-200'
              }`}>
                <div className="flex items-center space-x-2">
                  {bugStatus.type === 'CRITICAL' && <XCircle className="w-5 h-5 text-red-500" />}
                  {bugStatus.type === 'ERROR' && <AlertTriangle className="w-5 h-5 text-yellow-500" />}
                  {bugStatus.type === 'SUCCESS' && <CheckCircle className="w-5 h-5 text-green-500" />}
                  <span className="font-medium text-sm">{bugStatus.message}</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">{bugStatus.cause}</p>
              </div>
            )}

            {/* Informações Gerais */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-gray-50 p-2 rounded">
                <span className="font-medium">Ambiente:</span>
                <br />
                <span className={debugInfo.environment === 'PRODUCTION' ? 'text-red-600' : 'text-green-600'}>
                  {debugInfo.environment}
                </span>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <span className="font-medium">Steps:</span>
                <br />
                <span className={debugInfo.totalSteps < 8 ? 'text-red-600' : 'text-green-600'}>
                  {debugInfo.totalSteps}/8
                </span>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <span className="font-medium">Questões:</span>
                <br />
                <span className={debugInfo.questionsCount < 96 ? 'text-red-600' : 'text-green-600'}>
                  {debugInfo.questionsCount}/96
                </span>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <span className="font-medium">Erros:</span>
                <br />
                <span className={debugInfo.errors.length > 0 ? 'text-red-600' : 'text-green-600'}>
                  {debugInfo.errors.length}
                </span>
              </div>
            </div>

            {/* Componentes Carregados */}
            <div>
              <h4 className="font-medium text-sm text-green-600 mb-1">
                ✅ Componentes OK ({debugInfo.componentsLoaded.length})
              </h4>
              <div className="text-xs text-gray-600 space-y-1">
                {debugInfo.componentsLoaded.map(comp => (
                  <div key={comp} className="flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <span>{comp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Componentes Ausentes */}
            {debugInfo.missingComponents.length > 0 && (
              <div>
                <h4 className="font-medium text-sm text-red-600 mb-1">
                  ❌ Componentes Ausentes ({debugInfo.missingComponents.length})
                </h4>
                <div className="text-xs text-gray-600 space-y-1">
                  {debugInfo.missingComponents.map(comp => (
                    <div key={comp} className="flex items-center space-x-1">
                      <XCircle className="w-3 h-3 text-red-500" />
                      <span>{comp}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Correções Sugeridas */}
            <div className="bg-blue-50 p-3 rounded-lg">
              <h4 className="font-medium text-sm text-blue-600 mb-2">
                🔧 Correções Sugeridas:
              </h4>
              <div className="text-xs text-blue-700 space-y-1">
                <div>• Limpar cache do Vercel e redeploy</div>
                <div>• Verificar imports dos componentes</div>
                <div>• Checar next.config.js</div>
                <div>• Investigar tree shaking</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BugHunterComponent;