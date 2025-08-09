// src/components/results/traditions/TraditionsTabs.tsx

import React from 'react';
import { Star, Calendar, Zap, Info, TrendingUp } from 'lucide-react';

// Componente de Astrologia Ocidental
export const WesternAstrologyTab: React.FC<{ data: any }> = ({ data }) => {
  if (!data) {
    return (
      <div className="text-center py-8 text-gray-500">
        Dados de astrologia ocidental não disponíveis
      </div>
    );
  }

  const { sun, moon, ascendant, planets, houses, aspects } = data;

  return (
    <div className="space-y-8">
      {/* Header com informações principais */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Star className="w-6 h-6 mr-3 text-yellow-500" />
          Seu Mapa Astral Ocidental
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg">
            <div className="text-3xl mb-2">☉</div>
            <h3 className="font-semibold text-gray-900">Sol</h3>
            <p className="text-lg font-medium text-yellow-600">{sun.sign}</p>
            <p className="text-sm text-gray-600">Casa {sun.house} • {sun.degree.toFixed(1)}°</p>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
            <div className="text-3xl mb-2">☽</div>
            <h3 className="font-semibold text-gray-900">Lua</h3>
            <p className="text-lg font-medium text-blue-600">{moon.sign}</p>
            <p className="text-sm text-gray-600">Casa {moon.house} • {moon.degree.toFixed(1)}°</p>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
            <div className="text-3xl mb-2">↗</div>
            <h3 className="font-semibold text-gray-900">Ascendente</h3>
            <p className="text-lg font-medium text-green-600">{ascendant.sign}</p>
            <p className="text-sm text-gray-600">{ascendant.degree.toFixed(1)}°</p>
          </div>
        </div>
      </div>

      {/* Mapa Astral Visual */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Mapa Astral Visual</h3>
        <div className="flex justify-center">
          <div className="w-96 h-96 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center border-4 border-purple-200">
            <div className="text-center">
              <Star className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <p className="text-purple-600 font-medium">Mapa Astral Interativo</p>
              <p className="text-sm text-purple-500">Componente será integrado aqui</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente de Astrologia Chinesa
export const ChineseAstrologyTab: React.FC<{ data: any }> = ({ data }) => {
  if (!data) {
    return (
      <div className="text-center py-8 text-gray-500">
        Dados de astrologia chinesa não disponíveis
      </div>
    );
  }

  const { profile, elements, lifeCycles } = data;

  return (
    <div className="space-y-8">
      {/* Perfil Principal */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Calendar className="w-6 h-6 mr-3 text-red-500" />
          Seu Perfil na Astrologia Chinesa
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-red-50 to-pink-50 rounded-lg">
            <div className="text-4xl mb-3">🐉</div>
            <h3 className="font-semibold text-gray-900">Animal</h3>
            <p className="text-xl font-medium text-red-600">{profile.animalSign}</p>
            <p className="text-sm text-gray-600">Ano {profile.year}</p>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
            <div className="text-4xl mb-3">🌳</div>
            <h3 className="font-semibold text-gray-900">Elemento</h3>
            <p className="text-xl font-medium text-green-600">{profile.element}</p>
            <p className="text-sm text-gray-600">Elemento do ano</p>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg">
            <div className="text-4xl mb-3">☯</div>
            <h3 className="font-semibold text-gray-900">Polaridade</h3>
            <p className="text-xl font-medium text-yellow-600">{profile.polarity}</p>
            <p className="text-sm text-gray-600">Energia dominante</p>
          </div>
        </div>
      </div>

      {/* Pentagon dos Elementos */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Pentagon dos Cinco Elementos</h3>
        <div className="flex justify-center">
          <div className="w-96 h-96 bg-gradient-to-br from-red-100 to-yellow-100 rounded-lg flex items-center justify-center border-2 border-red-200">
            <div className="text-center">
              <Calendar className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <p className="text-red-600 font-medium">Pentagon Elemental</p>
              <p className="text-sm text-red-500">Componente será integrado aqui</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente de Numerologia
export const NumerologyTab: React.FC<{ data: any }> = ({ data }) => {
  if (!data) {
    return (
      <div className="text-center py-8 text-gray-500">
        Dados numerológicos não disponíveis
      </div>
    );
  }

  const { 
    lifePathNumber, 
    destinyNumber, 
    soulUrgeNumber, 
    personalityNumber,
    personalCycles
  } = data;

  return (
    <div className="space-y-8">
      {/* Números Principais */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Zap className="w-6 h-6 mr-3 text-blue-500" />
          Seus Números Numerológicos
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600 mb-2">{lifePathNumber}</div>
            <h3 className="font-semibold text-gray-900">Caminho de Vida</h3>
            <p className="text-sm text-gray-600">Seu propósito principal</p>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
            <div className="text-3xl font-bold text-purple-600 mb-2">{destinyNumber}</div>
            <h3 className="font-semibold text-gray-900">Destino</h3>
            <p className="text-sm text-gray-600">Sua missão de vida</p>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600 mb-2">{soulUrgeNumber}</div>
            <h3 className="font-semibold text-gray-900">Alma</h3>
            <p className="text-sm text-gray-600">Seus desejos internos</p>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg">
            <div className="text-3xl font-bold text-yellow-600 mb-2">{personalityNumber}</div>
            <h3 className="font-semibold text-gray-900">Personalidade</h3>
            <p className="text-sm text-gray-600">Como outros te veem</p>
          </div>
        </div>
      </div>

      {/* Radar Numerológico */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Radar Numerológico</h3>
        <div className="flex justify-center">
          <div className="w-96 h-96 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center border-2 border-blue-200">
            <div className="text-center">
              <Zap className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <p className="text-blue-600 font-medium">Radar Numerológico</p>
              <p className="text-sm text-blue-500">Componente será integrado aqui</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente de Insights Integrados
export const InsightsTab: React.FC<{ data: any }> = ({ data }) => {
  if (!data) {
    return (
      <div className="text-center py-8 text-gray-500">
        Dados de insights integrados não disponíveis
      </div>
    );
  }

  const { dominantThemes, compatibility, personalityInsights, recommendations } = data;

  return (
    <div className="space-y-8">
      {/* Temas Dominantes */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <TrendingUp className="w-6 h-6 mr-3 text-green-500" />
          Insights Integrados das Tradições
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {dominantThemes && Array.isArray(dominantThemes) && dominantThemes.map((theme: string, index: number) => (
            <div key={index} className="text-center p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Tema {index + 1}</h3>
              <p className="text-lg font-medium text-indigo-600">{theme}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Compatibilidade entre Tradições */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Compatibilidade entre Análises</h3>
        <div className="space-y-6">
          {compatibility && Object.entries(compatibility).map(([tradition, score]) => {
            const scoreValue = typeof score === 'number' ? score : 0;
            return (
              <div key={tradition}>
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">
                      {tradition === 'western' ? '⭐' : tradition === 'chinese' ? '🐉' : '🔢'}
                    </span>
                    <span className="font-medium text-gray-900 capitalize">
                      {tradition === 'western' ? 'Astrologia Ocidental' :
                       tradition === 'chinese' ? 'Astrologia Chinesa' : 'Numerologia'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-gray-900">{scoreValue}%</span>
                    <p className="text-sm text-gray-500">compatibilidade</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      scoreValue >= 90 ? 'bg-green-500' :
                      scoreValue >= 80 ? 'bg-yellow-500' :
                      scoreValue >= 70 ? 'bg-orange-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${scoreValue}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Insights de Personalidade */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Insights de Personalidade</h3>
        <div className="space-y-4">
          {personalityInsights && Array.isArray(personalityInsights) && personalityInsights.map((insight: string, index: number) => (
            <div key={index} className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Info className="w-4 h-4 text-white" />
              </div>
              <p className="text-gray-700">{insight}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recomendações */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Recomendações Personalizadas</h3>
        <div className="space-y-4">
          {recommendations && Array.isArray(recommendations) && recommendations.map((recommendation: string, index: number) => (
            <div key={index} className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm font-bold">{index + 1}</span>
              </div>
              <div>
                <p className="text-gray-700 mb-2">{recommendation}</p>
                <button className="text-sm text-green-600 hover:text-green-800 font-medium">
                  Saiba mais →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};