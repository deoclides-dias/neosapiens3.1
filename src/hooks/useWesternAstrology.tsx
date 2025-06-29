// src/hooks/useWesternAstrology.tsx
import { useState, useEffect, useMemo } from 'react';

// 🎯 INTERFACES E TIPOS
interface UserData {
  id: string;
  name: string;
  birthDate: string;          // YYYY-MM-DD
  birthTime?: string;         // HH:MM
  birthPlace?: {
    name: string;
    latitude: number;
    longitude: number;
  };
}

interface ProcessedAstrologyData {
  sunSign: string;
  moonSign: string;
  ascendant: string;
  planets: PlanetPosition[];
  houses: House[];
  aspects: Aspect[];
  dominantPlanet: string;
  dominantElement: string;
  dominantModality: string;
}

interface PlanetPosition {
  name: string;
  sign: string;
  degree: number;
  house: number;
  symbol: string;
}

interface House {
  number: number;
  sign: string;
  degree: number;
  ruler: string;
}

interface Aspect {
  planet1: string;
  planet2: string;
  type: string;
  angle: number;
  orb: number;
  applying: boolean;
}

interface AstrologyHookResult {
  analysis: ProcessedAstrologyData | null;
  loading: boolean;
  error: string | null;
  isValid: boolean;
}

// 🧮 SIMULADOR DO MÓDULO WESTERN ASTROLOGY
const simulateWesternAstrologyModule = async (userData: UserData): Promise<ProcessedAstrologyData> => {
  // Simular delay de processamento
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // 🎲 CÁLCULOS BASEADOS NOS DADOS REAIS DO USUÁRIO
  const birthDate = new Date(userData.birthDate);
  const birthMonth = birthDate.getMonth() + 1;
  const birthDay = birthDate.getDate();
  const birthYear = birthDate.getFullYear();
  
  // 🌟 CALCULAR SIGNO SOLAR BASEADO NA DATA
  const getSunSign = (month: number, day: number): string => {
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Áries';
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Touro';
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gêmeos';
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Câncer';
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leão';
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgem';
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Escorpião';
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagitário';
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricórnio';
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquário';
    return 'Peixes';
  };
  
  // 🌙 CALCULAR LUA (simplificado - baseado em dia + offset)
  const getMoonSign = (day: number): string => {
    const signs = ['Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem', 'Libra', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes'];
    return signs[(day + 15) % 12];
  };
  
  // 🌅 CALCULAR ASCENDENTE (baseado na hora se disponível)
  const getAscendant = (time?: string): string => {
    if (!time) {
      const signs = ['Aquário', 'Peixes', 'Áries', 'Touro', 'Gêmeos', 'Câncer'];
      return signs[Math.floor(Math.random() * signs.length)];
    }
    
    const [hours] = time.split(':').map(Number);
    const signs = ['Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem', 'Libra', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes'];
    return signs[Math.floor(hours / 2) % 12];
  };
  
  const sunSign = getSunSign(birthMonth, birthDay);
  const moonSign = getMoonSign(birthDay);
  const ascendant = getAscendant(userData.birthTime);
  
  // 🪐 POSIÇÕES PLANETÁRIAS CALCULADAS
  const planets: PlanetPosition[] = [
    {
      name: 'Sol',
      sign: sunSign,
      degree: 15 + (birthDay % 15),
      house: 7,
      symbol: '☉'
    },
    {
      name: 'Lua', 
      sign: moonSign,
      degree: 28 + (birthDay % 15),
      house: 2,
      symbol: '☽'
    },
    {
      name: 'Mercúrio',
      sign: 'Câncer',
      degree: 22 + (birthDay % 10),
      house: 6,
      symbol: '☿'
    },
    {
      name: 'Vênus',
      sign: 'Virgem', 
      degree: 8 + (birthDay % 20),
      house: 8,
      symbol: '♀'
    },
    {
      name: 'Marte',
      sign: 'Escorpião',
      degree: 13 + (birthDay % 12),
      house: 10,
      symbol: '♂'
    },
    {
      name: 'Júpiter',
      sign: 'Sagitário',
      degree: 5 + (birthYear % 20),
      house: 11,
      symbol: '♃'
    },
    {
      name: 'Saturno',
      sign: 'Capricórnio',
      degree: 18 + (birthYear % 15),
      house: 12,
      symbol: '♄'
    }
  ];
  
  // 🏠 CASAS ASTROLÓGICAS
  const houses: House[] = Array.from({ length: 12 }, (_, i) => ({
    number: i + 1,
    sign: ['Aquário', 'Peixes', 'Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem', 'Libra', 'Escorpião', 'Sagitário', 'Capricórnio'][i],
    degree: (i * 30) + (birthDay % 30),
    ruler: ['Urano', 'Netuno', 'Marte', 'Vênus', 'Mercúrio', 'Lua', 'Sol', 'Mercúrio', 'Vênus', 'Marte', 'Júpiter', 'Saturno'][i]
  }));
  
  // 🔗 ASPECTOS PLANETÁRIOS
  const aspects: Aspect[] = [
    {
      planet1: 'Sol',
      planet2: 'Lua',
      type: 'square',
      angle: 90,
      orb: 2.5,
      applying: true
    },
    {
      planet1: 'Sol', 
      planet2: 'Marte',
      type: 'trine',
      angle: 120,
      orb: 3.2,
      applying: false
    },
    {
      planet1: 'Lua',
      planet2: 'Mercúrio', 
      type: 'trine',
      angle: 120,
      orb: 1.8,
      applying: true
    },
    {
      planet1: 'Vênus',
      planet2: 'Júpiter',
      type: 'square', 
      angle: 90,
      orb: 4.1,
      applying: false
    },
    {
      planet1: 'Mercúrio',
      planet2: 'Vênus',
      type: 'sextile',
      angle: 60,
      orb: 2.3,
      applying: true
    },
    {
      planet1: 'Marte',
      planet2: 'Saturno',
      type: 'opposition',
      angle: 180,
      orb: 3.7,
      applying: false
    }
  ];
  
  // 🎯 ELEMENTOS E MODALIDADES DOMINANTES
  const getDominantElement = (planets: PlanetPosition[]): string => {
    const elements = { Fogo: 0, Terra: 0, Ar: 0, Água: 0 };
    const elementMap: Record<string, string> = {
      'Áries': 'Fogo', 'Leão': 'Fogo', 'Sagitário': 'Fogo',
      'Touro': 'Terra', 'Virgem': 'Terra', 'Capricórnio': 'Terra',
      'Gêmeos': 'Ar', 'Libra': 'Ar', 'Aquário': 'Ar',
      'Câncer': 'Água', 'Escorpião': 'Água', 'Peixes': 'Água'
    };
    
    planets.forEach(planet => {
      const element = elementMap[planet.sign];
      if (element) elements[element as keyof typeof elements]++;
    });
    
    return Object.entries(elements).reduce((a, b) => elements[a[0] as keyof typeof elements] > elements[b[0] as keyof typeof elements] ? a : b)[0];
  };
  
  return {
    sunSign,
    moonSign,
    ascendant,
    planets,
    houses,
    aspects,
    dominantPlanet: planets[0].name,
    dominantElement: getDominantElement(planets),
    dominantModality: 'Cardinal'
  };
};

// 🎯 HOOK PRINCIPAL
const useWesternAstrology = (userData: UserData | null): AstrologyHookResult => {
  const [analysis, setAnalysis] = useState<ProcessedAstrologyData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // ✅ VALIDAR DADOS DE ENTRADA
  const isValid = useMemo(() => {
    if (!userData) return false;
    
    const hasRequiredData = !!(
      userData.id &&
      userData.name &&
      userData.birthDate
    );
    
    const hasValidDate = userData.birthDate && 
      /^\d{4}-\d{2}-\d{2}$/.test(userData.birthDate);
    
    return hasRequiredData && hasValidDate;
  }, [userData]);
  
  // 🔄 PROCESSAR ANÁLISE
  useEffect(() => {
    if (!isValid || !userData) {
      setAnalysis(null);
      setError(null);
      return;
    }
    
    let isCancelled = false;
    
    const processAnalysis = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('🌟 Iniciando análise astrológica para:', userData.name);
        console.log('📅 Data de nascimento:', userData.birthDate);
        console.log('⏰ Horário:', userData.birthTime || 'Não informado');
        console.log('📍 Local:', userData.birthPlace?.name || 'Não informado');
        
        const result = await simulateWesternAstrologyModule(userData);
        
        if (!isCancelled) {
          setAnalysis(result);
          console.log('✅ Análise astrológica concluída:', result);
        }
      } catch (err) {
        if (!isCancelled) {
          const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido na análise astrológica';
          setError(errorMessage);
          console.error('❌ Erro na análise astrológica:', err);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };
    
    processAnalysis();
    
    return () => {
      isCancelled = true;
    };
  }, [userData, isValid]);
  
  return {
    analysis,
    loading,
    error,
    isValid
  };
};

export default useWesternAstrology;
export type { UserData, ProcessedAstrologyData, PlanetPosition, House, Aspect, AstrologyHookResult };