// src/pages/api/places/autocomplete.ts
import { NextApiRequest, NextApiResponse } from 'next';

interface PlacePrediction {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

interface PlaceDetails {
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  timezone: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { input } = req.query;
  const apiKey = process.env.GOOGLE_MAPS_API_KEY; // Server-side key

  if (!input || typeof input !== 'string') {
    return res.status(400).json({ error: 'Input parameter is required' });
  }

  if (!apiKey) {
    console.error('Google Maps API key not configured');
    // Retornar sugestões mockadas se não houver API key
    return res.status(200).json({
      predictions: getMockPredictions(input)
    });
  }

  try {
    // 1. Buscar sugestões de lugares
    const autocompleteUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
      input
    )}&types=(cities)&language=pt-BR&key=${apiKey}`;

    const autocompleteResponse = await fetch(autocompleteUrl);
    const autocompleteData = await autocompleteResponse.json();

    if (autocompleteData.status !== 'OK' && autocompleteData.status !== 'ZERO_RESULTS') {
      console.error('Google Places API error:', autocompleteData.status);
      return res.status(200).json({
        predictions: getMockPredictions(input)
      });
    }

    // 2. Para cada predição, buscar detalhes (coordenadas)
    const predictionsWithDetails = await Promise.all(
      autocompleteData.predictions.slice(0, 5).map(async (prediction: PlacePrediction) => {
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${prediction.place_id}&fields=geometry,utc_offset_minutes&key=${apiKey}`;
        
        try {
          const detailsResponse = await fetch(detailsUrl);
          const detailsData = await detailsResponse.json();

          if (detailsData.status === 'OK' && detailsData.result) {
            const { geometry, utc_offset_minutes } = detailsData.result;
            
            // Converter offset UTC para timezone
            const hours = Math.floor(Math.abs(utc_offset_minutes) / 60);
            const minutes = Math.abs(utc_offset_minutes) % 60;
            const sign = utc_offset_minutes >= 0 ? '+' : '-';
            const timezone = `UTC${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

            return {
              name: prediction.description,
              coordinates: {
                lat: geometry.location.lat,
                lng: geometry.location.lng
              },
              timezone: getTimezoneFromOffset(utc_offset_minutes)
            };
          }
        } catch (error) {
          console.error('Error fetching place details:', error);
        }

        // Fallback se não conseguir detalhes
        return {
          name: prediction.description,
          coordinates: null,
          timezone: 'America/Sao_Paulo'
        };
      })
    );

    // Filtrar apenas resultados com coordenadas
    const validPredictions = predictionsWithDetails.filter(p => p.coordinates !== null);

    res.status(200).json({ predictions: validPredictions });
  } catch (error) {
    console.error('Error in places autocomplete:', error);
    res.status(200).json({
      predictions: getMockPredictions(input)
    });
  }
}

// Função auxiliar para converter offset UTC em timezone name
function getTimezoneFromOffset(offsetMinutes: number): string {
  // Mapeamento simplificado para timezones brasileiras
  const brazilianTimezones: { [key: number]: string } = {
    [-180]: 'America/Sao_Paulo',      // UTC-3
    [-240]: 'America/Manaus',         // UTC-4
    [-300]: 'America/Rio_Branco',     // UTC-5
    [-120]: 'America/Noronha'         // UTC-2
  };

  return brazilianTimezones[offsetMinutes] || 'America/Sao_Paulo';
}

// Função para retornar sugestões mockadas
function getMockPredictions(input: string): PlaceDetails[] {
  const allCities = [
    {
      name: "São Paulo, SP, Brasil",
      coordinates: { lat: -23.5505, lng: -46.6333 },
      timezone: "America/Sao_Paulo"
    },
    {
      name: "Rio de Janeiro, RJ, Brasil",
      coordinates: { lat: -22.9068, lng: -43.1729 },
      timezone: "America/Sao_Paulo"
    },
    {
      name: "Brasília, DF, Brasil",
      coordinates: { lat: -15.8267, lng: -47.9218 },
      timezone: "America/Sao_Paulo"
    },
    {
      name: "Salvador, BA, Brasil",
      coordinates: { lat: -12.9714, lng: -38.5014 },
      timezone: "America/Sao_Paulo"
    },
    {
      name: "Fortaleza, CE, Brasil",
      coordinates: { lat: -3.7319, lng: -38.5267 },
      timezone: "America/Fortaleza"
    },
    {
      name: "Belo Horizonte, MG, Brasil",
      coordinates: { lat: -19.9245, lng: -43.9352 },
      timezone: "America/Sao_Paulo"
    },
    {
      name: "Manaus, AM, Brasil",
      coordinates: { lat: -3.1190, lng: -60.0217 },
      timezone: "America/Manaus"
    },
    {
      name: "Curitiba, PR, Brasil",
      coordinates: { lat: -25.4284, lng: -49.2733 },
      timezone: "America/Sao_Paulo"
    },
    {
      name: "Recife, PE, Brasil",
      coordinates: { lat: -8.0476, lng: -34.8770 },
      timezone: "America/Recife"
    },
    {
      name: "Porto Alegre, RS, Brasil",
      coordinates: { lat: -30.0346, lng: -51.2177 },
      timezone: "America/Sao_Paulo"
    }
  ];

  // Filtrar cidades baseado no input
  const filtered = allCities.filter(city => 
    city.name.toLowerCase().includes(input.toLowerCase())
  );

  return filtered.slice(0, 5);
}