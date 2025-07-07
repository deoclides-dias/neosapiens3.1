// src/components/results/traditions/TraditionsResultsDashboard.tsx

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  ArrowLeft, 
  Calendar, 
  Star, 
  Zap, 
  Download,
  Share2,
  RefreshCw,
  Info,
  TrendingUp,
  BarChart3
} from 'lucide-react';

// Importar componentes de abas específicas
import { 
  WesternAstrologyTab, 
  ChineseAstrologyTab, 
  NumerologyTab, 
  InsightsTab 
} from './TraditionsTabs';

// Importar componentes de visualização existentes
// TODO: Ajustar imports conforme estrutura real do projeto
// import AstrologyWheel from '@/components/traditions/AstrologyWheel';
// import ChineseAstrologyPentagon from '@/components/traditions/ChineseAstrologyPentagon';
// import NumerologyRadar from '@/components/traditions/NumerologyRadar';

interface TraditionsResultsDashboardProps {
  onBack: () => void;
}

const TraditionsResultsDashboard: React.FC<TraditionsResultsDashboardProps> = ({ onBack }) => {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'western' | 'chinese' | 'numerology' | 'insights'>('overview');
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Verificar usuário autenticado
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  // Dados mock para demonstração (substituir por dados reais do Supabase)
  const mockData = {
    western: {
      sun: { sign: 'Leão', house: 5, degree: 15.5 },
      moon: { sign: 'Câncer', house: 4, degree: 22.3 },
      ascendant: { sign: 'Áries', degree: 8.7 },
      planets: [
        { name: 'Sol', sign: 'Leão', house: 5, degree: 15.5 },
        { name: 'Lua', sign: 'Câncer', house: 4, degree: 22.3 },
        { name: 'Mercúrio', sign: 'Virgem', house: 6, degree: 3.1 },
        { name: 'Vênus', sign: 'Câncer', house: 4, degree: 28.9 },
        { name: 'Marte', sign: 'Gêmeos', house: 3, degree: 12.7 }
      ],
      houses: Array.from({ length: 12 }, (_, i) => ({
        number: i + 1,
        sign: ['Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem', 'Libra', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes'][i],
        degree: Math.random() * 30
      })),
      aspects: [
        { planet1: 'Sol', planet2: 'Lua', type: 'sextile', degree: 60 },
        { planet1: 'Mercúrio', planet2: 'Vênus', type: 'conjunction', degree: 8 }
      ]
    },
    chinese: {
      profile: {
        animalSign: 'Dragão',
        element: 'Madeira',
        polarity: 'Yang',
        year: 1988
      },
      elements: {
        balance: {
          wood: 25,
          fire: 30,
          earth: 15,
          metal: 10,
          water: 20
        },
        dominant: 'fire',
        weak: 'metal'
      },
      lifeCycles: [
        { period: 'Juventude', element: 'Madeira', years: '0-16', description: 'Período de crescimento' },
        { period: 'Adulto', element: 'Fogo', years: '17-32', description: 'Período de expansão' },
        { period: 'Maturidade', element: 'Terra', years: '33-48', description: 'Período de estabilização' }
      ]
    },
    numerology: {
      lifePathNumber: 7,
      destinyNumber: 3,
      soulUrgeNumber: 9,
      personalityNumber: 6,
      birthdayNumber: 15,
      maturityNumber: 1,
      challenges: [4, 2, 6],
      pinnacles: [8, 5, 3, 8],
      personalCycles: {
        current: { number: 5, theme: 'Liberdade e Mudança', year: 2025 },
        next: { number: 6, theme: 'Responsabilidade e Família', year: 2026 }
      }
    },
    integrated: {
      dominantThemes: ['Liderança', 'Criatividade', 'Intuição'],
      compatibility: {
        western: 85,
        chinese: 78,
        numerology: 92
      },
      personalityInsights: [
        'Forte conexão com elementos de fogo, indicando paixão e energia',
        'Número 7 sugere natureza introspectiva e busca por conhecimento',
        'Sol em Leão reforça qualidades de liderança natural'
      ],
      recommendations: [
        'Desenvolver práticas meditativas para equilibrar a energia de fogo',
        'Explorar atividades criativas que utilizem sua natureza leonina',
        'Buscar períodos de solitude para honrar seu caminho de vida 7'
      ]
    }
  };

  useEffect(() => {
    loadAnalysisData();
  }, [user]);

  const loadAnalysisData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      // TODO: Implementar busca real dos dados
      // const { data } = await supabase
      //   .from('traditions_analysis')
      //   .select('*')
      //   .eq('user_id', user.id)
      //   .single();
      
      // Simulação com dados mock
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAnalysisData(mockData);
    } catch (error) {
      console.error('Erro ao carregar análises:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAnalysisData();
    setRefreshing(false);
  };

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
    { id: 'western', label: 'Astrologia Ocidental', icon: Star },
    { id: 'chinese', label: 'Astrologia Chinesa', icon: Calendar },
    { id: 'numerology', label: 'Numerologia', icon: Zap },
    { id: 'insights', label: 'Insights Integrados', icon: TrendingUp },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Carregando análises das tradições...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center text-purple-600 hover:text-purple-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Voltar ao Hub
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Análise de Tradições</h1>
                <p className="text-gray-600">Astrologia Ocidental, Chinesa e Numerologia</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors
                  ${activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && <OverviewTab data={analysisData} />}
        {activeTab === 'western' && analysisData?.western && <WesternAstrologyTab data={analysisData.western} />}
        {activeTab === 'chinese' && analysisData?.chinese && <ChineseAstrologyTab data={analysisData.chinese} />}
        {activeTab === 'numerology' && analysisData?.numerology && <NumerologyTab data={analysisData.numerology} />}
        {activeTab === 'insights' && analysisData?.integrated && <InsightsTab data={analysisData.integrated} />}
        
        {/* Fallbacks quando não há dados */}
        {activeTab === 'western' && !analysisData?.western && (
          <div className="text-center py-12">
            <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-lg text-gray-600">Dados de Astrologia Ocidental não disponíveis</p>
          </div>
        )}
        {activeTab === 'chinese' && !analysisData?.chinese && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-lg text-gray-600">Dados de Astrologia Chinesa não disponíveis</p>
          </div>
        )}
        {activeTab === 'numerology' && !analysisData?.numerology && (
          <div className="text-center py-12">
            <Zap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-lg text-gray-600">Dados Numerológicos não disponíveis</p>
          </div>
        )}
        {activeTab === 'insights' && !analysisData?.integrated && (
          <div className="text-center py-12">
            <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-lg text-gray-600">Insights Integrados não disponíveis</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Componente de Visão Geral
const OverviewTab: React.FC<{ data: any }> = ({ data }) => {
  if (!data) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">📊</div>
        <p className="text-lg text-gray-600">Dados de análises não disponíveis</p>
        <p className="text-sm text-gray-500 mt-2">Complete suas análises para ver os resultados aqui</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Astrologia Ocidental</h3>
            <Star className="w-6 h-6 text-yellow-500" />
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Sol em {data.western?.sun?.sign}</p>
            <p className="text-sm text-gray-600">Lua em {data.western?.moon?.sign}</p>
            <p className="text-sm text-gray-600">Ascendente em {data.western?.ascendant?.sign}</p>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            Análise completa
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Astrologia Chinesa</h3>
            <Calendar className="w-6 h-6 text-red-500" />
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Animal: {data.chinese?.profile?.animalSign}</p>
            <p className="text-sm text-gray-600">Elemento: {data.chinese?.profile?.element}</p>
            <p className="text-sm text-gray-600">Polaridade: {data.chinese?.profile?.polarity}</p>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            Análise completa
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Numerologia</h3>
            <Zap className="w-6 h-6 text-blue-500" />
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Caminho de Vida: {data.numerology?.lifePathNumber}</p>
            <p className="text-sm text-gray-600">Destino: {data.numerology?.destinyNumber}</p>
            <p className="text-sm text-gray-600">Alma: {data.numerology?.soulUrgeNumber}</p>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            Análise completa
          </div>
        </div>
      </div>

      {/* Quick Insights */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Insights Principais</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Temas Dominantes</h4>
            <div className="space-y-2">
              {data.integrated?.dominantThemes && Array.isArray(data.integrated.dominantThemes) ? 
                data.integrated.dominantThemes.map((theme: string, index: number) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">{theme}</span>
                  </div>
                ))
                : (
                  <p className="text-gray-500 text-sm">Nenhum tema dominante identificado</p>
                )
              }
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Compatibilidade das Análises</h4>
            <div className="space-y-3">
              {data.integrated?.compatibility && typeof data.integrated.compatibility === 'object' ? 
                Object.entries(data.integrated.compatibility).map(([tradition, score]) => {
                  const scoreValue = typeof score === 'number' ? score : 0;
                  return (
                    <div key={tradition}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize text-gray-600">{tradition}</span>
                        <span className="font-medium">{scoreValue}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600"
                          style={{ width: `${scoreValue}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })
                : (
                  <p className="text-gray-500 text-sm">Dados de compatibilidade não disponíveis</p>
                )
              }
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-8 text-white">
        <h3 className="text-xl font-semibold mb-4">Explore Cada Tradição</h3>
        <p className="text-purple-100 mb-6">
          Cada tradição oferece uma perspectiva única sobre sua personalidade e potencial. 
          Navegue pelas abas acima para descobrir insights detalhados de cada sistema.
        </p>
        <div className="flex space-x-4">
          <button className="bg-white text-purple-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
            Começar Exploração
          </button>
          <button className="border border-white text-white px-6 py-2 rounded-lg font-medium hover:bg-white/10 transition-colors">
            Baixar Relatório
          </button>
        </div>
      </div>
    </div>
  );
};

export default TraditionsResultsDashboard;