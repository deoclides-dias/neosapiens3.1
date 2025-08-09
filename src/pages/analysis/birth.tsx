import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, Calendar, Clock, MapPin, Save } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
// IMPORT DIRETO - teste para ver se funciona
import useAnalysisProgress from '../../hooks/useAnalysisProgress';

interface BirthData {
  fullName: string;
  birthDate: string;
  birthTime: string;
  birthPlace: {
    city: string;
    state: string;
    country: string;
    latitude?: number;
    longitude?: number;
  };
}

const BirthAnalysis = () => {
  const router = useRouter();
  const { markAnalysisComplete } = useAnalysisProgress();

  const [formData, setFormData] = useState<BirthData>({
    fullName: '',
    birthDate: '',
    birthTime: '',
    birthPlace: {
      city: '',
      state: '',
      country: 'Brasil'
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log('💾 Salvando dados de nascimento:', formData);
      
      const success = await markAnalysisComplete('birth', formData);
      
      if (success) {
        console.log('✅ Dados salvos com sucesso');
        router.push('/analysis'); // Voltar para o hub
      } else {
        setError('Erro ao salvar dados. Tente novamente.');
      }
    } catch (err) {
      console.error('❌ Erro ao salvar:', err);
      setError('Erro interno. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePlaceChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      birthPlace: {
        ...prev.birthPlace,
        [field]: value
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.push('/analysis')}
            className="text-white hover:text-purple-200 transition-colors p-2 rounded-lg hover:bg-white/10"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              🌟 Dados de Nascimento
            </h1>
            <p className="text-purple-200">
              Informações para análise astrológica e numerológica
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Informações Pessoais
            </h2>

            {/* Nome Completo */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-purple-200 mb-2">
                Nome Completo
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Seu nome completo"
                required
              />
            </div>

            {/* Data de Nascimento */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-purple-200 mb-2">
                Data de Nascimento
              </label>
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => handleInputChange('birthDate', e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            {/* Horário de Nascimento */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-purple-200 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Horário de Nascimento
              </label>
              <input
                type="time"
                value={formData.birthTime}
                onChange={(e) => handleInputChange('birthTime', e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              <p className="text-xs text-purple-300 mt-1">
                Procure no documento de nascimento ou pergunte aos familiares
              </p>
            </div>
          </div>

          {/* Local de Nascimento */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Local de Nascimento
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Cidade
                </label>
                <input
                  type="text"
                  value={formData.birthPlace.city}
                  onChange={(e) => handlePlaceChange('city', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Ex: São Paulo"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Estado/Região
                </label>
                <input
                  type="text"
                  value={formData.birthPlace.state}
                  onChange={(e) => handlePlaceChange('state', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Ex: SP"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  País
                </label>
                <input
                  type="text"
                  value={formData.birthPlace.country}
                  onChange={(e) => handlePlaceChange('country', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Brasil"
                  required
                />
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-900/30 border border-red-400 rounded-lg p-4">
              <p className="text-red-300">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Salvar e Continuar
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-purple-300 text-sm">
            💡 Suas informações são usadas apenas para cálculos precisos de análise
          </p>
        </div>
      </div>
    </div>
  );
};

export default BirthAnalysis;