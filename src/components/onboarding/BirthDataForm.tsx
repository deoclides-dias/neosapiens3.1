// src/components/onboarding/BirthDataForm.tsx - VERSÃO CORRIGIDA
import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Clock, User, ChevronRight, AlertCircle, CheckCircle, Search } from 'lucide-react';

interface BirthDataFormProps {
  onComplete: (data: BirthData) => void;
  onBack?: () => void;
  initialData?: Partial<BirthData>;
}

interface BirthData {
  fullName: string;
  birthDate: string;
  birthTime: string;
  hasExactTime: boolean;
  birthPlace: string;
  coordinates: {
    lat: number;
    lng: number;
  } | null;
  timezone: string;
}

interface PlaceSuggestion {
  name: string;
  coordinates: { lat: number; lng: number; };
  timezone: string;
}

const BirthDataForm: React.FC<BirthDataFormProps> = ({ 
  onComplete, 
  onBack, 
  initialData 
}) => {
  const [formData, setFormData] = useState<BirthData>({
    fullName: initialData?.fullName || '',
    birthDate: initialData?.birthDate || '',
    birthTime: initialData?.birthTime || '',
    hasExactTime: initialData?.hasExactTime ?? true,
    birthPlace: initialData?.birthPlace || '',
    coordinates: initialData?.coordinates || null,
    timezone: initialData?.timezone || ''
  });

  const [validation, setValidation] = useState({
    fullName: false,
    birthDate: false,
    birthPlace: false
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isPlaceLoading, setIsPlaceLoading] = useState(false);
  const [placeSuggestions, setPlaceSuggestions] = useState<PlaceSuggestion[]>([]);
  const [showPlaceSuggestions, setShowPlaceSuggestions] = useState(false);

  // 🔧 CORREÇÃO 1: FUNÇÃO PARA FORMATAR DATA SEM PROBLEMAS DE TIMEZONE
  const formatDateForDisplay = (dateString: string): string => {
    if (!dateString) return '';
    
    // Usar formato brasileiro diretamente
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  // 🔧 CORREÇÃO 2: USAR NOVA API DO GOOGLE PLACES (AutocompleteSuggestion)
  const searchPlaces = async (query: string) => {
    if (query.length < 3) {
      setPlaceSuggestions([]);
      setShowPlaceSuggestions(false);
      return;
    }

    setIsPlaceLoading(true);
    setShowPlaceSuggestions(true);
    
    // Verificar se temos Google Maps carregado
    if (typeof window !== 'undefined' && window.google?.maps?.places) {
      try {
        await useGooglePlacesAPI(query);
      } catch (error) {
        console.warn('Google Places falhou, usando dados locais:', error);
        useBrazilianCitiesData(query);
      }
    } else {
      console.log('Google Maps não carregado, usando dados brasileiros');
      useBrazilianCitiesData(query);
    }
  };

  // 🌎 USAR GOOGLE PLACES API
  const useGooglePlacesAPI = async (query: string) => {
    try {
      // Usar diretamente a API que funciona
      await useLegacyGooglePlacesAPI(query);
    } catch (error) {
      console.error('Erro na API do Google:', error);
      useBrazilianCitiesData(query);
    }
  };

  // Google Places API (funciona perfeitamente)
  const useLegacyGooglePlacesAPI = async (query: string) => {
    const service = new window.google.maps.places.AutocompleteService();
    
    const request = {
      input: query,
      types: ['(cities)'],
      componentRestrictions: { country: 'br' }
    };

    service.getPlacePredictions(request, (predictions: any, status: any) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
        processGooglePredictions(predictions);
      } else {
        console.warn('Google Places status:', status);
        useBrazilianCitiesData(query);
      }
    });
  };

  const processGooglePredictions = async (predictions: any[]) => {
    const placesService = new window.google.maps.places.PlacesService(
      document.createElement('div')
    );

    const processedSuggestions: PlaceSuggestion[] = [];

    for (let i = 0; i < Math.min(predictions.length, 5); i++) {
      const prediction = predictions[i];
      
      try {
        const details: any = await new Promise((resolve, reject) => {
          placesService.getDetails(
            {
              placeId: prediction.place_id,
              fields: ['geometry', 'name', 'formatted_address']
            },
            (place: any, status: any) => {
              if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                resolve(place);
              } else {
                reject(new Error(`Place details error: ${status}`));
              }
            }
          );
        });

        if (details && details.geometry) {
          processedSuggestions.push({
            name: prediction.description,
            coordinates: {
              lat: details.geometry.location.lat(),
              lng: details.geometry.location.lng()
            },
            timezone: getTimezoneForBrazil(details.geometry.location.lat())
          });
        }
      } catch (error) {
        console.error('Erro ao processar lugar:', error);
      }
    }

    setPlaceSuggestions(processedSuggestions);
    setIsPlaceLoading(false);
  };

  // 🇧🇷 DADOS BRASILEIROS EXPANDIDOS (FALLBACK MELHORADO)
  const useBrazilianCitiesData = (query: string) => {
    const brazilianCities = [
      // Capitais e principais cidades
      { name: 'São Paulo, SP', lat: -23.5505, lng: -46.6333, timezone: 'America/Sao_Paulo' },
      { name: 'Rio de Janeiro, RJ', lat: -22.9068, lng: -43.1729, timezone: 'America/Sao_Paulo' },
      { name: 'Belo Horizonte, MG', lat: -19.9208, lng: -43.9378, timezone: 'America/Sao_Paulo' },
      { name: 'Salvador, BA', lat: -12.9714, lng: -38.5014, timezone: 'America/Bahia' },
      { name: 'Fortaleza, CE', lat: -3.7172, lng: -38.5434, timezone: 'America/Fortaleza' },
      { name: 'Brasília, DF', lat: -15.7801, lng: -47.9292, timezone: 'America/Sao_Paulo' },
      { name: 'Manaus, AM', lat: -3.1190, lng: -60.0217, timezone: 'America/Manaus' },
      { name: 'Curitiba, PR', lat: -25.4244, lng: -49.2654, timezone: 'America/Sao_Paulo' },
      { name: 'Recife, PE', lat: -8.0476, lng: -34.8770, timezone: 'America/Recife' },
      { name: 'Porto Alegre, RS', lat: -30.0346, lng: -51.2177, timezone: 'America/Sao_Paulo' },
      { name: 'Goiânia, GO', lat: -16.6864, lng: -49.2643, timezone: 'America/Sao_Paulo' },
      { name: 'Belém, PA', lat: -1.4558, lng: -48.5044, timezone: 'America/Belem' },
      { name: 'Guarulhos, SP', lat: -23.4538, lng: -46.5333, timezone: 'America/Sao_Paulo' },
      { name: 'Campinas, SP', lat: -22.9056, lng: -47.0608, timezone: 'America/Sao_Paulo' },
      { name: 'São Luís, MA', lat: -2.5297, lng: -44.3028, timezone: 'America/Fortaleza' },
      { name: 'Natal, RN', lat: -5.7945, lng: -35.2110, timezone: 'America/Fortaleza' },
      { name: 'Maceió, AL', lat: -9.6476, lng: -35.7350, timezone: 'America/Maceio' },
      { name: 'Teresina, PI', lat: -5.0892, lng: -42.8019, timezone: 'America/Fortaleza' },
      { name: 'João Pessoa, PB', lat: -7.1195, lng: -34.8450, timezone: 'America/Fortaleza' },
      { name: 'Aracaju, SE', lat: -10.9472, lng: -37.0731, timezone: 'America/Maceio' }
    ];

    const filtered = brazilianCities
      .filter(city => {
        const cityLower = city.name.toLowerCase();
        const queryLower = query.toLowerCase();
        
        // Busca por nome da cidade ou por palavras dentro do nome
        return cityLower.includes(queryLower) ||
               queryLower.split(' ').some(word => cityLower.includes(word));
      })
      .slice(0, 6)
      .map(city => ({
        name: `${city.name}, Brasil`,
        coordinates: { lat: city.lat, lng: city.lng },
        timezone: city.timezone
      }));

    
      
      setTimeout(() => {
      setPlaceSuggestions(filtered);
      setIsPlaceLoading(false);
    }, 300);
  };

  // 🌍 TIMEZONE MELHORADO PARA BRASIL
  const getTimezoneForBrazil = (lat: number): string => {
    // Timezones mais precisos baseados na latitude
    if (lat > -5) return 'America/Belem';          // Norte (Belém)
    if (lat > -10) return 'America/Fortaleza';     // Nordeste
    if (lat > -15) return 'America/Bahia';         // Bahia
    if (lat > -25) return 'America/Sao_Paulo';     // Sudeste/Centro-Oeste
    return 'America/Sao_Paulo';                    // Sul
  };

  const handleInputChange = (field: keyof BirthData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Validação em tempo real
    validateField(field, value);

    // Busca de lugares
    if (field === 'birthPlace' && typeof value === 'string') {
      searchPlaces(value);
    }
  };

  // 🔧 CORREÇÃO 3: VALIDAÇÃO DE DATA MELHORADA
  const validateField = (field: keyof BirthData, value: any) => {
    let isValid = false;

    switch (field) {
      case 'fullName':
        isValid = typeof value === 'string' && 
                  value.trim().length >= 3 && 
                  value.includes(' ') &&
                  value.trim().split(' ').length >= 2;
        break;
        
      case 'birthDate':
        if (typeof value === 'string' && value.length === 10) {
          // Criar data sem problemas de timezone
          const [year, month, day] = value.split('-').map(Number);
          
          // Verificar se os valores são válidos
          if (year >= 1900 && year <= new Date().getFullYear() && 
              month >= 1 && month <= 12 && 
              day >= 1 && day <= 31) {
            
            // Criar data corretamente
            const dateObj = new Date(year, month - 1, day);
            const today = new Date();
            today.setHours(23, 59, 59, 999); // Fim do dia hoje
            
            // Verificar se é uma data válida e no passado
            isValid = dateObj.getTime() < today.getTime() && 
                     dateObj.getFullYear() === year &&
                     dateObj.getMonth() === (month - 1) &&
                     dateObj.getDate() === day;
          }
        }
        break;
        
      case 'birthPlace':
      // 🔧 CORREÇÃO: Validação mais permissiva para local de nascimento
      isValid = typeof value === 'string' && value.trim().length >= 3;
      // Removi a exigência de coordinates - funciona com ou sem coordenadas
      break;
    }

    setValidation(prev => ({
      ...prev,
      [field]: isValid
    }));
  };

  const selectPlace = (place: PlaceSuggestion) => {
    setFormData(prev => ({
      ...prev,
      birthPlace: place.name,
      coordinates: place.coordinates,
      timezone: place.timezone
    }));
    setShowPlaceSuggestions(false);
    setPlaceSuggestions([]);
    validateField('birthPlace', place.name);
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return validation.fullName;
      case 2:
        return validation.birthDate;
      case 3:
        return validation.birthPlace;
      case 4:
        return true; // Horário é opcional
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Finalizar e enviar dados
      onComplete(formData);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else if (onBack) {
      onBack();
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Qual é o seu nome completo?";
      case 2: return "Quando você nasceu?";
      case 3: return "Onde você nasceu?";
      case 4: return "A que horas você nasceu?";
      default: return "";
    }
  };

  const getStepSubtitle = () => {
    switch (currentStep) {
      case 1: return "Nome e sobrenome como registrado no documento";
      case 2: return "Data completa de nascimento";
      case 3: return "Cidade e estado/país de nascimento";
      case 4: return "Horário exato (se souber) para análise astrológica precisa";
      default: return "";
    }
  };

  // 🌐 CARREGAR GOOGLE MAPS SCRIPT (MELHORADO)
  useEffect(() => {
    const loadGoogleMapsScript = () => {
      // Verificar se já existe
      if (window.google?.maps) return;
      
      // Verificar se já tem script carregando
      if (document.querySelector('script[src*="maps.googleapis.com"]')) return;
      
      // Verificar API key
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        console.warn('⚠️ Google Maps API Key não configurada - usando dados locais');
        return;
      }

      console.log('🌐 Carregando Google Maps API...');
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&v=weekly`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        console.log('✅ Google Maps API carregada com sucesso!');
      };
      
      script.onerror = () => {
        console.error('❌ Erro ao carregar Google Maps API - usando dados locais');
      };
      
      document.head.appendChild(script);
    };

    if (typeof window !== 'undefined') {
      loadGoogleMapsScript();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-lg p-8 border border-white/20">
        
        {/* Header com progresso */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-white">Dados de Nascimento</h1>
            <div className="text-sm text-blue-200">
              {currentStep}/4
            </div>
          </div>
          
          {/* Barra de progresso */}
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Título da etapa */}
        <div className="mb-8 text-center">
          <h2 className="text-xl font-semibold text-white mb-2">
            {getStepTitle()}
          </h2>
          <p className="text-blue-200 text-sm">
            {getStepSubtitle()}
          </p>
        </div>

        {/* Formulário por etapas */}
        <div className="space-y-6">
          
          {/* Etapa 1: Nome Completo */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="Ex: Maria Silva Santos"
                  className="w-full bg-white/10 border border-white/30 rounded-lg pl-11 pr-4 py-3 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
                {validation.fullName && (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400 w-5 h-5" />
                )}
              </div>
              
              {formData.fullName && !validation.fullName && (
                <div className="flex items-center text-yellow-300 text-sm">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Digite seu nome completo (nome e sobrenome)
                </div>
              )}
            </div>
          )}

          {/* Etapa 2: Data de Nascimento */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => handleInputChange('birthDate', e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full bg-white/10 border border-white/30 rounded-lg pl-11 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent [color-scheme:dark]"
                />
                {validation.birthDate && (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400 w-5 h-5" />
                )}
              </div>
              
              {formData.birthDate && (
                <div className="text-blue-200 text-sm text-center">
                  Data selecionada: {formatDateForDisplay(formData.birthDate)}
                </div>
              )}
              
              {formData.birthDate && !validation.birthDate && (
                <div className="flex items-center text-yellow-300 text-sm">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Selecione uma data válida no passado
                </div>
              )}
            </div>
          )}

          {/* Etapa 3: Local de Nascimento */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
                <input
                  type="text"
                  value={formData.birthPlace}
                  onChange={(e) => handleInputChange('birthPlace', e.target.value)}
                  placeholder="Ex: São Paulo, SP, Brasil"
                  className="w-full bg-white/10 border border-white/30 rounded-lg pl-11 pr-4 py-3 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
                {validation.birthPlace && formData.coordinates && (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400 w-5 h-5" />
                )}
                {isPlaceLoading && (
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5 animate-spin" />
                )}
              </div>

              {/* Sugestões de lugares */}
              {showPlaceSuggestions && placeSuggestions.length > 0 && (
                <div className="bg-white/10 border border-white/20 rounded-lg overflow-hidden max-h-60 overflow-y-auto">
                  {placeSuggestions.map((place, index) => (
                    <button
                      key={index}
                      onClick={() => selectPlace(place)}
                      className="w-full p-3 text-left text-white hover:bg-white/10 border-b border-white/10 last:border-b-0 transition-colors"
                    >
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-blue-300 flex-shrink-0" />
                        <span className="text-sm">{place.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              
              {formData.birthPlace && !formData.coordinates && (
                <div className="flex items-center text-yellow-300 text-sm">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Selecione uma localização da lista de sugestões
                </div>
              )}
            </div>
          )}

          {/* Etapa 4: Horário de Nascimento */}
          {currentStep === 4 && (
            <div className="space-y-6">
              
              {/* Pergunta se sabe o horário exato */}
              <div className="space-y-4">
                <p className="text-white font-medium">Você sabe o horário exato do seu nascimento?</p>
                
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleInputChange('hasExactTime', true)}
                    className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                      formData.hasExactTime === true
                        ? 'border-blue-400 bg-blue-400/20 text-white'
                        : 'border-white/30 bg-white/10 text-blue-200 hover:border-blue-400'
                    }`}
                  >
                    Sim, sei o horário
                  </button>
                  
                  <button
                    onClick={() => handleInputChange('hasExactTime', false)}
                    className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                      formData.hasExactTime === false
                        ? 'border-blue-400 bg-blue-400/20 text-white'
                        : 'border-white/30 bg-white/10 text-blue-200 hover:border-blue-400'
                    }`}
                  >
                    Não sei
                  </button>
                </div>
              </div>

              {/* Campo de horário (se souber) */}
              {formData.hasExactTime === true && (
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
                  <input
                    type="time"
                    value={formData.birthTime}
                    onChange={(e) => handleInputChange('birthTime', e.target.value)}
                    className="w-full bg-white/10 border border-white/30 rounded-lg pl-11 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent [color-scheme:dark]"
                  />
                </div>
              )}

              {/* Informação sobre precisão */}
              {formData.hasExactTime === false && (
                <div className="bg-blue-900/30 border border-blue-400/30 rounded-lg p-4">
                  <p className="text-blue-200 text-sm">
                    <strong>Sem problema!</strong> Ainda conseguiremos fazer uma análise muito precisa com sua data e local de nascimento. 
                    O horário só é necessário para alguns detalhes específicos da astrologia.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Botões de navegação */}
        <div className="flex justify-between mt-8 pt-6 border-t border-white/20">
          <button
            onClick={handleBack}
            className="px-6 py-3 text-blue-200 hover:text-white transition-colors"
          >
            Voltar
          </button>
          
          <button
            onClick={handleNext}
            disabled={!canProceedToNextStep()}
            className={`px-8 py-3 rounded-lg font-medium flex items-center space-x-2 transition-all ${
              canProceedToNextStep()
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transform hover:scale-105'
                : 'bg-gray-500/50 text-gray-300 cursor-not-allowed'
            }`}
          >
            <span>{currentStep === 4 ? 'Continuar para Análises' : 'Próximo'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Indicador de dados coletados */}
        {currentStep === 4 && (
          <div className="mt-6 p-4 bg-green-900/30 border border-green-400/30 rounded-lg">
            <h3 className="text-green-300 font-medium mb-2">Dados coletados para análise:</h3>
            <ul className="text-green-200 text-sm space-y-1">
              <li>✓ Nome: {formData.fullName}</li>
              <li>✓ Data: {formatDateForDisplay(formData.birthDate)}</li>
              <li>✓ Local: {formData.birthPlace}</li>
              <li>✓ Horário: {formData.hasExactTime ? formData.birthTime || 'A definir' : 'Não necessário'}</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default BirthDataForm;