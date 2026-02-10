// src/pages/analysis/index.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ArrowRight, Calendar, Activity, Brain, Zap, Clock, CheckCircle, Lock, TrendingUp, AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import useAnalysisProgress from '../../hooks/useAnalysisProgress';

interface AnalysisModule {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: any;
  color: string;
  estimatedTime: string;
  href: string;
  status: 'available' | 'completed' | 'locked';
  requiredFor?: string[];
  dependsOn?: string;
}

const AnalysisHub = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { progress, loading, error, refreshProgress } = useAnalysisProgress();

  // ============================================================================
  // LÓGICA DE DESBLOQUEIO PROGRESSIVO
  // ============================================================================
  
  const isModuleAvailable = (moduleId: string): boolean => {
    switch (moduleId) {
      case 'birth':
        return true; // Sempre disponível
      case 'biohacking':
        return progress.birth.completed && progress.birth.savedToSupabase;
      case 'psychological':
        return progress.biohacking.completed && progress.biohacking.savedToSupabase;
      case 'cognitive':
        return progress.psychological.completed && progress.psychological.savedToSupabase;
      default:
        return false;
    }
  };

  const getModuleStatus = (moduleId: string): 'available' | 'completed' | 'locked' => {
    if (progress[moduleId]?.completed) return 'completed';
    if (isModuleAvailable(moduleId)) return 'available';
    return 'locked';
  };

  // ============================================================================
  // CONFIGURAÇÃO DOS MÓDULOS
  // ============================================================================

  const analysisModules: AnalysisModule[] = [
    {
      id: 'birth',
      title: 'Dados de Nascimento',
      subtitle: 'Astrologia & Numerologia',
      description: 'Descubra sua essência através das tradições ancestrais. Análise astrológica ocidental, chinesa e numerológica baseada em seus dados de nascimento.',
      icon: Calendar,
      color: 'indigo',
      estimatedTime: '8-12 min',
      href: '/analysis/birth',
      status: getModuleStatus('birth')
    },
    {
      id: 'biohacking',
      title: 'Perfil Biológico',
      subtitle: 'Corpo & Energia',
      description: 'Otimize sua biologia através de dados científicos sobre sono, alimentação, exercícios e padrões energéticos para máxima performance.',
      icon: Activity,
      color: 'green',
      estimatedTime: '10-15 min',
      href: '/analysis/biohacking',
      status: getModuleStatus('biohacking'),
      dependsOn: 'birth'
    },
    {
      id: 'psychological',
      title: 'Perfil Psicológico',
      subtitle: 'Mente & Comportamento',
      description: 'Entenda seus padrões mentais através de avaliações científicas: Big Five, DISC, VARK, Yin-Yang e 5 Elementos da MTC.',
      icon: Brain,
      color: 'blue',
      estimatedTime: '15-20 min',
      href: '/analysis/psychological',
      status: getModuleStatus('psychological'),
      dependsOn: 'biohacking'
    },
    {
      id: 'cognitive',
      title: 'Perfil Cognitivo',
      subtitle: 'Aprendizado & Performance',
      description: 'Descubra seu estilo de aprendizagem, capacidade de foco e estratégias de desenvolvimento cognitivo personalizadas.',
      icon: Zap,
      color: 'purple',
      estimatedTime: '12-18 min',
      href: '/analysis/cognitive',
      status: getModuleStatus('cognitive'),
      dependsOn: 'psychological'
    }
  ];

  // ============================================================================
  // VERIFICAÇÃO PARA RESULTADOS
  // ============================================================================

  const canAccessResults = (): boolean => {
    return analysisModules.every(module => 
      progress[module.id]?.completed && 
      progress[module.id]?.savedToSupabase
    );
  };

  const completedCount = analysisModules.filter(module => 
    progress[module.id]?.completed
  ).length;

  // ============================================================================
  // HANDLERS DE NAVEGAÇÃO
  // ============================================================================

  const handleModuleClick = (module: AnalysisModule) => {
    if (module.status === 'locked') {
      // Mostrar toast ou modal explicando o bloqueio
      alert(`🔒 Complete a análise "${module.dependsOn}" primeiro para desbloquear esta seção.`);
      return;
    }
    
    router.push(module.href);
  };

  const handleResultsClick = () => {
    if (!canAccessResults()) {
      alert(`🔒 Complete todas as ${4 - completedCount} análises restantes para acessar os resultados completos.`);
      return;
    }
    
    router.push('/results');
  };

  // ============================================================================
  // REFRESH AUTOMÁTICO
  // ============================================================================

  useEffect(() => {
    // Refresh do progresso ao voltar para esta página
    refreshProgress();
  }, [refreshProgress]);

  // ============================================================================
  // LOADING E ERROR STATES
  // ============================================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Carregando progresso...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Erro ao carregar</h2>
          <p className="text-slate-300 mb-6">{error}</p>
          <button 
            onClick={refreshProgress}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            🎯 Central de Análises
          </h1>
          <p className="text-slate-300 text-lg max-w-3xl mx-auto">
            Sua jornada personalizada de autoconhecimento através de análises científicas e tradições ancestrais
          </p>
          
          {/* Progress Bar */}
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-slate-400">Progresso Geral</span>
              <span className="text-sm text-slate-400">
                {completedCount}/4 completas
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-purple-500 to-indigo-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(completedCount / 4) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Analysis Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {analysisModules.map((module, index) => {
            const isAvailable = module.status === 'available';
            const isCompleted = module.status === 'completed';
            const isLocked = module.status === 'locked';

            return (
              <div 
                key={module.id}
                className={`
                  group relative bg-white/10 backdrop-blur-sm rounded-xl p-6 border
                  transition-all duration-300 cursor-pointer
                  ${isAvailable ? `border-${module.color}-500/30 hover:border-${module.color}-400 hover:bg-white/15 hover:scale-105` : ''}
                  ${isCompleted ? 'border-green-500/30 bg-green-500/5' : ''}
                  ${isLocked ? 'border-slate-600 opacity-60 cursor-not-allowed' : ''}
                `}
                onClick={() => handleModuleClick(module)}
              >
                
                {/* Status Icon */}
                <div className="absolute top-4 right-4">
                  {isCompleted && <CheckCircle className="w-6 h-6 text-green-500" />}
                  {isLocked && <Lock className="w-6 h-6 text-slate-500" />}
                </div>

                {/* Module Content */}
                <div className="mb-4">
                  <module.icon className={`w-12 h-12 mb-4 ${
                    isCompleted ? 'text-green-500' : 
                    isAvailable ? `text-${module.color}-400` : 'text-slate-500'
                  }`} />
                  
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {module.title}
                  </h3>
                  
                  <p className={`text-sm font-semibold mb-3 ${
                    isCompleted ? 'text-green-400' : 
                    isAvailable ? `text-${module.color}-300` : 'text-slate-400'
                  }`}>
                    {module.subtitle}
                  </p>
                  
                  <p className="text-slate-300 text-sm leading-relaxed mb-4">
                    {module.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-slate-400 text-sm">
                      <Clock className="w-4 h-4 mr-1" />
                      {module.estimatedTime}
                    </div>
                    
                    <div className="flex items-center">
                      {isCompleted ? (
                        <span className="text-green-600 font-medium flex items-center">
                          ✅ Revisar Análise
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </span>
                      ) : isAvailable ? (
                        <span className={`text-${module.color}-600 font-medium flex items-center`}>
                          Começar Agora
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </span>
                      ) : (
                        <span className="text-slate-400 font-medium flex items-center">
                          <Lock className="w-4 h-4 mr-2" />
                          Complete análise anterior
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Dependency Indicator */}
                {module.dependsOn && isLocked && (
                  <div className="mt-4 p-3 bg-slate-800/50 rounded-lg border border-slate-600">
                    <p className="text-xs text-slate-400">
                      📋 Requer: <span className="font-semibold">{
                        analysisModules.find(m => m.id === module.dependsOn)?.title
                      }</span>
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Results Hub Access */}
        <div className={`
          bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-8 text-white
          ${canAccessResults() ? 'cursor-pointer hover:shadow-2xl transform hover:scale-105' : 'opacity-60'}
          transition-all duration-300
        `}
        onClick={handleResultsClick}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">📈 Hub de Resultados</h2>
              <p className="text-indigo-100 mb-4">
                {canAccessResults() 
                  ? 'Acesse suas análises completas e insights personalizados'
                  : `Complete as ${4 - completedCount} análises restantes para desbloquear`
                }
              </p>
              
              {canAccessResults() ? (
                <div className="flex items-center text-white font-medium">
                  <span>Ver Meus Resultados</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </div>
              ) : (
                <div className="text-indigo-200">
                  <span>🔒 {4 - completedCount} análises restantes</span>
                </div>
              )}
            </div>
            
            <div className="hidden md:block">
              <TrendingUp className="w-16 h-16 text-white opacity-80" />
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <h3 className="text-lg font-bold text-white mb-3">
              🌟 Por que fazer todas as análises?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-300">
              <div>
                <strong>🎯 Análise Integrada:</strong> Correlações únicas entre suas dimensões
              </div>
              <div>
                <strong>📊 Insights Personalizados:</strong> Recomendações baseadas em múltiplas fontes
              </div>
              <div>
                <strong>🚀 Plano Completo:</strong> Desenvolvimento direcionado e científico
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AnalysisHub;
