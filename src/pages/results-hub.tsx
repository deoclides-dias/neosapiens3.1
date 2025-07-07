// src/pages/results.tsx

import React from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';
import useResultsProgress from '../hooks/useResultsProgress';
import { 
  Star, 
  Activity, 
  Brain, 
  Zap, 
  Target, 
  ArrowLeft, 
  Lock,
  CheckCircle,
  Clock,
  TrendingUp
} from 'lucide-react';

interface ResultCard {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  gradient: string;
  bgGradient: string;
  isAvailable: boolean;
  isCompleted: boolean;
  estimatedReadTime: string;
}

const Results: React.FC = () => {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { 
    progress, 
    loading: resultsLoading, 
    isResultAvailable,
    getNextRecommendedResult 
  } = useResultsProgress();

  // Configuração dos cards de resultados
  const resultCards: ResultCard[] = [
    {
      id: 'astrology',
      title: 'Análise Astrológica',
      subtitle: 'Tradições Ancestrais',
      description: 'Mapa astral completo integrando Astrologia Ocidental, Chinesa e Numerologia.',
      icon: Star,
      color: 'yellow',
      gradient: 'from-yellow-500 to-orange-600',
      bgGradient: 'from-yellow-50 to-orange-50',
      isAvailable: isResultAvailable('astrology'),
      isCompleted: progress.astrologyComplete,
      estimatedReadTime: '8-12 min'
    },
    {
      id: 'biohacking',
      title: 'Relatório Biohacking',
      subtitle: 'Otimização Corporal',
      description: 'Análise personalizada de sistemas corporais e estratégias de biohacking.',
      icon: Activity,
      color: 'red',
      gradient: 'from-red-500 to-pink-600',
      bgGradient: 'from-red-50 to-pink-50',
      isAvailable: isResultAvailable('biohacking'),
      isCompleted: progress.biohackingComplete,
      estimatedReadTime: '6-10 min'
    },
    {
      id: 'psychological',
      title: 'Perfil Psicológico',
      subtitle: 'Análise Científica',
      description: 'Big Five, DISC, VARK e análise dos elementos da Medicina Tradicional Chinesa.',
      icon: Brain,
      color: 'purple',
      gradient: 'from-purple-500 to-indigo-600',
      bgGradient: 'from-purple-50 to-indigo-50',
      isAvailable: isResultAvailable('psychological'),
      isCompleted: progress.psychologicalComplete,
      estimatedReadTime: '10-15 min'
    },
    {
      id: 'cognitive',
      title: 'Análise Cognitiva',
      subtitle: 'Performance Mental',
      description: 'Avaliação de velocidade de processamento, memória, atenção e estratégias de aprendizado.',
      icon: Zap,
      color: 'blue',
      gradient: 'from-blue-500 to-cyan-600',
      bgGradient: 'from-blue-50 to-cyan-50',
      isAvailable: isResultAvailable('cognitive'),
      isCompleted: progress.cognitiveComplete,
      estimatedReadTime: '7-12 min'
    },
    {
      id: 'integrated',
      title: 'Análise Integrada',
      subtitle: 'Síntese Completa',
      description: 'Combinação inteligente de todas as dimensões com insights únicos e plano personalizado.',
      icon: Target,
      color: 'green',
      gradient: 'from-green-500 to-emerald-600',
      bgGradient: 'from-green-50 to-emerald-50',
      isAvailable: isResultAvailable('integrated'),
      isCompleted: progress.integratedComplete,
      estimatedReadTime: '15-20 min'
    }
  ];

  const handleCardClick = (cardId: string, isAvailable: boolean) => {
    if (!isAvailable) {
      // Mostrar feedback explicando como desbloquear
      alert(`Para acessar ${cardId}, complete as análises necessárias primeiro.`);
      return;
    }

    // Navegar para a página específica do resultado
    router.push(`/results/${cardId}`);
  };

  const getCardStatus = (card: ResultCard) => {
    if (!card.isAvailable) {
      return {
        icon: <Lock className="w-5 h-5" />,
        text: 'Bloqueado',
        color: 'text-gray-400'
      };
    }
    
    if (card.isCompleted) {
      return {
        icon: <CheckCircle className="w-5 h-5" />,
        text: 'Visualizado',
        color: 'text-green-500'
      };
    }
    
    return {
      icon: <Clock className="w-5 h-5" />,
      text: 'Novo',
      color: 'text-blue-500'
    };
  };

  const nextRecommended = getNextRecommendedResult();

  if (authLoading || resultsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Carregando seus resultados...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Acesso Restrito</h1>
          <p className="text-purple-200 mb-6">Faça login para acessar seus resultados</p>
          <button
            onClick={() => router.push('/auth/login')}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Fazer Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.push('/analysis')}
            className="text-white hover:text-purple-200 transition-colors p-2 rounded-lg hover:bg-white/10"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              📈 Central de Resultados
            </h1>
            <p className="text-purple-200 text-lg">
              Explore suas análises e insights personalizados
            </p>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Progresso Geral</h2>
            <div className="flex items-center gap-2 text-blue-300">
              <TrendingUp className="w-5 h-5" />
              <span className="font-semibold">{progress.overallProgress}% Completo</span>
            </div>
          </div>
          
          <div className="w-full bg-white/20 rounded-full h-3 mb-4">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress.overallProgress}%` }}
            ></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            {resultCards.map(card => {
              const status = getCardStatus(card);
              return (
                <div key={card.id} className="text-center">
                  <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${
                    card.isAvailable ? 'bg-green-500/20' : 'bg-gray-500/20'
                  }`}>
                    {status.icon}
                  </div>
                  <p className="text-white font-medium">{card.title.split(' ')[0]}</p>
                  <p className={`text-xs ${status.color}`}>{status.text}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recommended Next */}
        {nextRecommended && (
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-lg p-6 border border-blue-400/30 mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Recomendado para Você</h3>
                <p className="text-blue-200">Sua próxima análise prioritária</p>
              </div>
            </div>
            <button
              onClick={() => handleCardClick(nextRecommended, true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Ver {resultCards.find(c => c.id === nextRecommended)?.title} →
            </button>
          </div>
        )}

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {resultCards.map((card) => {
            const status = getCardStatus(card);
            const IconComponent = card.icon;
            
            return (
              <div
                key={card.id}
                className={`relative bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 transition-all duration-200 cursor-pointer group ${
                  card.isAvailable
                    ? 'hover:bg-white/15 hover:border-white/30 hover:scale-105'
                    : 'opacity-60 cursor-not-allowed'
                }`}
                onClick={() => handleCardClick(card.id, card.isAvailable)}
              >
                {/* Status Badge */}
                <div className={`absolute top-4 right-4 flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                  card.isAvailable 
                    ? card.isCompleted 
                      ? 'bg-green-500/20 text-green-300' 
                      : 'bg-blue-500/20 text-blue-300'
                    : 'bg-gray-500/20 text-gray-400'
                }`}>
                  {status.icon}
                  {status.text}
                </div>

                {/* Icon */}
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${card.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-white mb-2">
                  {card.title}
                </h3>
                <p className="text-purple-200 text-sm mb-3">
                  {card.subtitle}
                </p>
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                  {card.description}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">
                    📖 {card.estimatedReadTime}
                  </span>
                  {card.isAvailable && (
                    <span className="text-blue-300 group-hover:text-blue-200">
                      Visualizar →
                    </span>
                  )}
                </div>

                {/* Blocked Overlay */}
                {!card.isAvailable && (
                  <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-300 text-sm">
                        Complete as análises<br />necessárias primeiro
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* No Results Available */}
        {progress.availableResults.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Nenhum Resultado Disponível
            </h3>
            <p className="text-gray-300 mb-6 max-w-md mx-auto">
              Complete pelo menos uma análise para desbloquear seus primeiros insights personalizados.
            </p>
            <button
              onClick={() => router.push('/analysis')}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
            >
              Iniciar Análises
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-purple-300 text-sm">
            💡 Seus resultados são atualizados automaticamente conforme você completa novas análises
          </p>
        </div>
      </div>
    </div>
  );
};

export default Results;