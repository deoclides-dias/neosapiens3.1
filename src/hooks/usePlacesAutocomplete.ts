// src/hooks/usePlacesAutocomplete.ts - VERSÃO REAL COM GOOGLE PLACES

import { useState, useCallback } from 'react';

interface PlaceSuggestion {
  name: string;
  coordinates: { lat: number; lng: number; };
  timezone: string;
  placeId: string;
}

export const usePlacesAutocomplete = () => {
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchPlaces = useCallback(async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);

    try {
      // Verificar se Google Maps está carregado
      if (typeof window.google === 'undefined') {
        console.warn('Google Maps não carregado, usando dados mock');
        return useMockData(query);
      }

      // Usar Google Places Autocomplete
      const service = new window.google.maps.places.AutocompleteService();
      
      const request = {
        input: query,
        types: ['(cities)'], // Apenas cidades
        componentRestrictions: { country: 'br' }, // Focar no Brasil primeiro
      };

      service.getPlacePredictions(request, (predictions, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
          // Processar cada predição para obter coordenadas
          processPlacePredictions(predictions);
        } else {
          console.warn('Places API error:', status);
          useMockData(query);
        }
      });

    } catch (error) {
      console.error('Erro ao buscar lugares:', error);
      useMockData(query);
    }
  }, []);

  const processPlacePredictions = async (predictions: any[]) => {
    const placesService = new window.google.maps.places.PlacesService(
      document.createElement('div')
    );

    const processedSuggestions: PlaceSuggestion[] = [];

    // Processar até 5 sugestões
    for (let i = 0; i < Math.min(predictions.length, 5); i++) {
      const prediction = predictions[i];
      
      try {
        const details = await getPlaceDetails(placesService, prediction.place_id);
        if (details) {
          processedSuggestions.push({
            name: prediction.description,
            coordinates: {
              lat: details.geometry.location.lat(),
              lng: details.geometry.location.lng()
            },
            timezone: await getTimezone(details.geometry.location),
            placeId: prediction.place_id
          });
        }
      } catch (error) {
        console.error('Erro ao processar lugar:', error);
      }
    }

    setSuggestions(processedSuggestions);
    setIsLoading(false);
  };

  const getPlaceDetails = (service: any, placeId: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      service.getDetails(
        {
          placeId: placeId,
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
  };

  const getTimezone = async (location: any): Promise<string> => {
    try {
      // Usar Google Timezone API
      const timestamp = Math.floor(Date.now() / 1000);
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/timezone/json?location=${location.lat()},${location.lng()}&timestamp=${timestamp}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );
      
      if (response.ok) {
        const data = await response.json();
        return data.timeZoneId || 'America/Sao_Paulo';
      }
    } catch (error) {
      console.error('Erro ao obter timezone:', error);
    }
    
    return 'America/Sao_Paulo'; // Fallback
  };

  const useMockData = (query: string) => {
    // Dados mock melhorados baseados na query
    const mockSuggestions: PlaceSuggestion[] = [
      {
        name: `${query}, São Paulo, SP, Brasil`,
        coordinates: { lat: -23.5505, lng: -46.6333 },
        timezone: 'America/Sao_Paulo',
        placeId: 'mock_sp'
      },
      {
        name: `${query}, Rio de Janeiro, RJ, Brasil`,
        coordinates: { lat: -22.9068, lng: -43.1729 },
        timezone: 'America/Sao_Paulo',
        placeId: 'mock_rj'
      },
      {
        name: `${query}, Belo Horizonte, MG, Brasil`,
        coordinates: { lat: -19.9208, lng: -43.9378 },
        timezone: 'America/Sao_Paulo',
        placeId: 'mock_bh'
      },
      {
        name: `${query}, Salvador, BA, Brasil`,
        coordinates: { lat: -12.9714, lng: -38.5014 },
        timezone: 'America/Bahia',
        placeId: 'mock_ssa'
      },
      {
        name: `${query}, Fortaleza, CE, Brasil`,
        coordinates: { lat: -3.7172, lng: -38.5434 },
        timezone: 'America/Fortaleza',
        placeId: 'mock_for'
      }
    ].filter(place => 
      place.name.toLowerCase().includes(query.toLowerCase())
    );

    setSuggestions(mockSuggestions);
    setIsLoading(false);
  };

  return {
    suggestions,
    isLoading,
    searchPlaces
  };
};

// Adicionar ao _document.tsx ou _app.tsx
export const loadGoogleMapsScript = () => {
  return new Promise<void>((resolve, reject) => {
    if (typeof window.google !== 'undefined') {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Maps'));
    
    document.head.appendChild(script);
  });
};

// Atualizar .env.local
/*
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=sua_chave_aqui
*/