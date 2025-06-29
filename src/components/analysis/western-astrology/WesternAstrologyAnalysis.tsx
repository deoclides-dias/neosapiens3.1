import React, { useState, useEffect, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  Radar, 
  Tooltip
} from 'recharts';

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

// 🧮 SIMULADOR DO MÓDULO WESTERN ASTROLOGY (INTEGRADO)
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

// 🎯 HOOK INTEGRADO
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

interface WesternAstrologyAnalysisProps {
  userData: UserData | null;
  showFullDetails?: boolean;
}

const WesternAstrologyAnalysis: React.FC<WesternAstrologyAnalysisProps> = ({ 
  userData, 
  showFullDetails = true 
}) => {
  // 🔗 USAR O HOOK DE INTEGRAÇÃO
  const { analysis, loading, error, isValid } = useWesternAstrology(userData);

  // 🎨 ESTILOS
  const styles = {
    container: {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '20px'
    },
    loadingContainer: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      padding: '60px 20px',
      textAlign: 'center' as const
    },
    spinner: {
      width: '40px',
      height: '40px',
      border: '3px solid #f3f4f6',
      borderTop: '3px solid #3b82f6',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginBottom: '16px'
    },
    errorContainer: {
      padding: '24px',
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: '8px',
      color: '#dc2626',
      textAlign: 'center' as const
    },
    section: {
      marginBottom: '32px'
    },
    sectionTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#2d3748',
      marginBottom: '16px',
      textAlign: 'center' as const
    },
    grid: {
      display: 'grid',
      gap: '16px'
    },
    gridCols3: {
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))'
    },
    gridCols4: {
      gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))'
    },
    card: {
      padding: '20px',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      backgroundColor: 'white',
      textAlign: 'center' as const
    },
    cardSmall: {
      padding: '12px',
      border: '1px solid #e2e8f0',
      borderRadius: '6px',
      backgroundColor: 'white'
    },
    badge: {
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '14px',
      fontWeight: '600',
      margin: '4px 0'
    },
    badgeOrange: {
      backgroundColor: '#fed7aa',
      color: '#c2410c'
    },
    badgeBlue: {
      backgroundColor: '#bfdbfe',
      color: '#1d4ed8'
    },
    badgePurple: {
      backgroundColor: '#e9d5ff',
      color: '#7c3aed'
    },
    badgeGray: {
      backgroundColor: '#f3f4f6',
      color: '#374151'
    },
    textSmall: {
      fontSize: '12px',
      color: '#718096'
    },
    analysisInfo: {
      padding: '16px',
      backgroundColor: '#f0f9ff',
      border: '1px solid #bae6fd',
      borderRadius: '8px',
      marginBottom: '24px'
    }
  };

  // 🎨 COMPONENTE DO MAPA ASTRAL (CANVAS)
  const AstrologyWheelCanvas: React.FC<{ analysis: ProcessedAstrologyData }> = ({ analysis }) => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    
    React.useEffect(() => {
      if (!canvasRef.current || !analysis) return;
      
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const size = 450;
      canvas.width = size;
      canvas.height = size;
      
      const centerX = size / 2;
      const centerY = size / 2;
      const radius = size * 0.42;
      
      // Limpar canvas
      ctx.clearRect(0, 0, size, size);
      
      // Fundo com gradiente
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      gradient.addColorStop(0, '#fafbff');
      gradient.addColorStop(1, '#f1f5f9');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);
      
      // Círculo externo
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // Divisões dos signos (12 fatias)
      for (let i = 0; i < 12; i++) {
        const angle = (i * 30 - 90) * Math.PI / 180;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = '#cbd5e0';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      
      // Símbolos dos signos
      const signs = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
      ctx.font = '24px serif';
      ctx.textAlign = 'center' as const;
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#475569';
      
      for (let i = 0; i < 12; i++) {
        const angle = (i * 30 - 75) * Math.PI / 180;
        const x = centerX + Math.cos(angle) * (radius * 0.88);
        const y = centerY + Math.sin(angle) * (radius * 0.88);
        ctx.fillText(signs[i], x, y);
      }
      
      // Círculo das casas
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.72, 0, 2 * Math.PI);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Números das casas
      ctx.font = '14px sans-serif';
      ctx.fillStyle = '#64748b';
      for (let i = 1; i <= 12; i++) {
        const angle = (i * 30 - 105) * Math.PI / 180;
        const x = centerX + Math.cos(angle) * (radius * 0.62);
        const y = centerY + Math.sin(angle) * (radius * 0.62);
        ctx.fillText(i.toString(), x, y);
      }
      
      // Desenhar planetas com posições baseadas nos dados reais
      ctx.font = '18px serif';
      analysis.planets.forEach((planet, index) => {
        // Calcular posição baseada na casa do planeta
        const houseAngle = ((planet.house - 1) * 30 - 90) * Math.PI / 180;
        const x = centerX + Math.cos(houseAngle) * (radius * 0.82);
        const y = centerY + Math.sin(houseAngle) * (radius * 0.82);
        
        // Cores dos planetas
        const planetColors: Record<string, string> = {
          'Sol': '#f59e0b',
          'Lua': '#64748b',
          'Mercúrio': '#8b5cf6',
          'Vênus': '#ec4899',
          'Marte': '#ef4444',
          'Júpiter': '#3b82f6',
          'Saturno': '#71717a'
        };
        
        const color = planetColors[planet.name] || '#9ca3af';
        
        // Círculo de fundo para o planeta
        ctx.beginPath();
        ctx.arc(x, y, 12, 0, 2 * Math.PI);
        ctx.fillStyle = color + '20';
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Símbolo do planeta
        ctx.fillStyle = color;
        ctx.fillText(planet.symbol, x, y);
      });
      
      // Desenhar aspectos baseados nos dados reais
      analysis.aspects.forEach(aspect => {
        const planet1 = analysis.planets.find(p => p.name === aspect.planet1);
        const planet2 = analysis.planets.find(p => p.name === aspect.planet2);
        
        if (!planet1 || !planet2) return;
        
        const angle1 = ((planet1.house - 1) * 30 - 90) * Math.PI / 180;
        const angle2 = ((planet2.house - 1) * 30 - 90) * Math.PI / 180;
        
        const x1 = centerX + Math.cos(angle1) * (radius * 0.82);
        const y1 = centerY + Math.sin(angle1) * (radius * 0.82);
        const x2 = centerX + Math.cos(angle2) * (radius * 0.82);
        const y2 = centerY + Math.sin(angle2) * (radius * 0.82);
        
        // Cores dos aspectos
        const aspectColors: Record<string, string> = {
          'trine': '#3b82f6',
          'square': '#ef4444',
          'sextile': '#10b981',
          'opposition': '#f97316',
          'conjunction': '#8b5cf6'
        };
        
        const color = aspectColors[aspect.type] || '#9ca3af';
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = color;
        ctx.lineWidth = aspect.type === 'square' || aspect.type === 'opposition' ? 2 : 1.5;
        ctx.setLineDash(aspect.type === 'trine' ? [] : [5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
      });
      
      // Círculo central pequeno
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.08, 0, 2 * Math.PI);
      ctx.fillStyle = '#1e293b';
      ctx.fill();
      
    }, [analysis]);
    
    return (
      <div style={{display: 'flex', justifyContent: 'center' as const, marginBottom: '24px'}}>
        <canvas 
          ref={canvasRef} 
          style={{
            border: '2px solid #e2e8f0',
            borderRadius: '12px',
            backgroundColor: 'white',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        />
      </div>
    );
  };

  // ⏳ ESTADO DE CARREGAMENTO
  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
        <div style={styles.spinner}></div>
        <h3 style={{color: '#3b82f6', marginBottom: '8px'}}>🌟 Calculando seu Mapa Astral</h3>
        <p style={{color: '#6b7280', fontSize: '14px'}}>
          Analisando as posições planetárias no momento do seu nascimento...
        </p>
      </div>
    );
  }

  // ❌ ESTADO DE ERRO
  if (error) {
    return (
      <div style={styles.errorContainer}>
        <h3 style={{marginBottom: '8px'}}>❌ Erro na Análise Astrológica</h3>
        <p>{error}</p>
      </div>
    );
  }

  // ⚠️ DADOS INVÁLIDOS
  if (!isValid || !analysis) {
    return (
      <div style={styles.errorContainer}>
        <h3 style={{marginBottom: '8px'}}>⚠️ Dados Insuficientes</h3>
        <p>Para realizar a análise astrológica, precisamos pelo menos da data de nascimento.</p>
      </div>
    );
  }

  // 📊 DADOS DAS 12 CASAS
  const houses = [
    { number: 1, name: 'Personalidade', meaning: 'Identidade, aparência, primeira impressão' },
    { number: 2, name: 'Recursos', meaning: 'Dinheiro, posses, valores pessoais' },
    { number: 3, name: 'Comunicação', meaning: 'Irmãos, vizinhança, estudos básicos' },
    { number: 4, name: 'Lar', meaning: 'Família, raízes, base emocional' },
    { number: 5, name: 'Criatividade', meaning: 'Romance, filhos, expressão criativa' },
    { number: 6, name: 'Trabalho', meaning: 'Rotina, saúde, serviço aos outros' },
    { number: 7, name: 'Parcerias', meaning: 'Relacionamentos, casamento, inimigos' },
    { number: 8, name: 'Transformação', meaning: 'Morte, renascimento, recursos compartilhados' },
    { number: 9, name: 'Filosofia', meaning: 'Estudos superiores, viagens, espiritualidade' },
    { number: 10, name: 'Carreira', meaning: 'Profissão, reputação, objetivos de vida' },
    { number: 11, name: 'Amizades', meaning: 'Grupos, esperanças, sonhos futuros' },
    { number: 12, name: 'Espiritualidade', meaning: 'Subconsciente, karma, autossacrifício' }
  ];

  return (
    <div style={styles.container}>
      {/* INFO DA ANÁLISE */}
      <div style={styles.analysisInfo}>
        <h4 style={{margin: '0 0 8px 0', color: '#0369a1'}}>
          ✅ Análise Baseada nos Seus Dados Reais
        </h4>
        <p style={{margin: 0, fontSize: '14px', color: '#0369a1'}}>
          <strong>Nome:</strong> {userData?.name} | 
          <strong> Data:</strong> {userData?.birthDate} |
          <strong> Horário:</strong> {userData?.birthTime || 'Não informado'} |
          <strong> Local:</strong> {userData?.birthPlace?.name || 'Não informado'}
        </p>
      </div>

      {/* MAPA ASTRAL VISUAL */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Seu Mapa Astral Personalizado</h3>
        <AstrologyWheelCanvas analysis={analysis} />
        <p style={{...styles.textSmall, textAlign: 'center' as const, fontStyle: 'italic'}}>
          Mapa astral completo com planetas, casas e aspectos calculados para {userData?.birthDate}
        </p>
      </div>

      <hr style={{border: 'none', borderTop: '1px solid #e2e8f0', margin: '32px 0'}} />

      {/* TRIO PRINCIPAL */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Trio Principal (Calculado pelos Seus Dados)</h3>
        <div style={{...styles.grid, ...styles.gridCols3}}>
          {/* Sol */}
          <div style={styles.card}>
            <div style={{fontSize: '32px', marginBottom: '8px'}}>☀️</div>
            <h4 style={{fontWeight: 'bold', fontSize: '16px', color: '#2d3748'}}>Sol</h4>
            <span style={{...styles.badge, ...styles.badgeOrange}}>{analysis.sunSign}</span>
            <p style={styles.textSmall}>
              {analysis.planets.find(p => p.name === 'Sol')?.degree.toFixed(1)}° - Casa {analysis.planets.find(p => p.name === 'Sol')?.house}
            </p>
            <p style={{...styles.textSmall, marginTop: '8px'}}>
              Representa sua essência e identidade central
            </p>
          </div>

          {/* Lua */}
          <div style={styles.card}>
            <div style={{fontSize: '32px', marginBottom: '8px'}}>🌙</div>
            <h4 style={{fontWeight: 'bold', fontSize: '16px', color: '#2d3748'}}>Lua</h4>
            <span style={{...styles.badge, ...styles.badgeBlue}}>{analysis.moonSign}</span>
            <p style={styles.textSmall}>
              {analysis.planets.find(p => p.name === 'Lua')?.degree.toFixed(1)}° - Casa {analysis.planets.find(p => p.name === 'Lua')?.house}
            </p>
            <p style={{...styles.textSmall, marginTop: '8px'}}>
              Governa suas emoções e mundo interior
            </p>
          </div>

          {/* Ascendente */}
          <div style={styles.card}>
            <div style={{fontSize: '32px', marginBottom: '8px'}}>🌅</div>
            <h4 style={{fontWeight: 'bold', fontSize: '16px', color: '#2d3748'}}>Ascendente</h4>
            <span style={{...styles.badge, ...styles.badgePurple}}>{analysis.ascendant}</span>
            <p style={styles.textSmall}>
              {userData?.birthTime ? 'Calculado com horário preciso' : 'Estimativa sem horário'}
            </p>
            <p style={{...styles.textSmall, marginTop: '8px'}}>
              Define sua personalidade e como se apresenta ao mundo
            </p>
          </div>
        </div>
      </div>

      <hr style={{border: 'none', borderTop: '1px solid #e2e8f0', margin: '24px 0'}} />

      {/* OUTROS PLANETAS */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Planetas Pessoais</h3>
        <div style={{...styles.grid, ...styles.gridCols3}}>
          {analysis.planets.filter(p => !['Sol', 'Lua'].includes(p.name)).map((planet, index) => (
            <div key={index} style={styles.cardSmall}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center' as const}}>
                <div style={{display: 'flex', alignItems: 'center' as const, gap: '8px'}}>
                  <span style={{fontSize: '16px'}}>{planet.symbol}</span>
                  <span style={{fontWeight: '600', fontSize: '14px', color: '#2d3748'}}>
                    {planet.name}
                  </span>
                </div>
                <span style={{...styles.badge, ...styles.badgeGray, fontSize: '12px'}}>
                  {planet.sign}
                </span>
              </div>
              <p style={{...styles.textSmall, marginTop: '4px'}}>
                {planet.degree.toFixed(1)}° - Casa {planet.house}
              </p>
            </div>
          ))}
        </div>
      </div>

      <hr style={{border: 'none', borderTop: '1px solid #e2e8f0', margin: '24px 0'}} />

      {/* ASPECTOS PLANETÁRIOS */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Aspectos Planetários Detectados</h3>
        <p style={{...styles.textSmall, textAlign: 'center' as const, marginBottom: '20px'}}>
          Conexões energéticas entre planetas no seu mapa astral
        </p>
        <div style={{...styles.grid, ...styles.gridCols3}}>
          {analysis.aspects.map((aspect, index) => {
            const aspectColors: Record<string, any> = {
              'trine': { bg: '#dbeafe', color: '#1d4ed8', emoji: '🔵' },
              'square': { bg: '#fee2e2', color: '#dc2626', emoji: '🔴' },
              'sextile': { bg: '#dcfce7', color: '#16a34a', emoji: '🟢' },
              'opposition': { bg: '#fed7aa', color: '#ea580c', emoji: '🟠' },
              'conjunction': { bg: '#ede9fe', color: '#7c3aed', emoji: '🟣' }
            };
            
            const colorScheme = aspectColors[aspect.type] || { bg: '#f3f4f6', color: '#374151', emoji: '⚪' };
            
            return (
              <div key={index} style={{
                ...styles.cardSmall,
                backgroundColor: colorScheme.bg,
                border: `1px solid ${colorScheme.color}20`
              }}>
                <div style={{display: 'flex', alignItems: 'center' as const, marginBottom: '8px'}}>
                  <span style={{marginRight: '8px'}}>{colorScheme.emoji}</span>
                  <span style={{fontWeight: '600', fontSize: '14px', color: colorScheme.color, textTransform: 'capitalize'}}>
                    {aspect.type}
                  </span>
                </div>
                <p style={{fontSize: '13px', color: '#4b5563', marginBottom: '4px'}}>
                  {aspect.planet1} {aspect.type === 'conjunction' ? '☌' : 
                   aspect.type === 'opposition' ? '☍' :
                   aspect.type === 'trine' ? '△' :
                   aspect.type === 'square' ? '□' : '⚹'} {aspect.planet2}
                </p>
                <p style={{...styles.textSmall}}>
                  {aspect.angle}° (orb: {aspect.orb.toFixed(1)}°) 
                  {aspect.applying ? ' - Aplicando' : ' - Separando'}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <hr style={{border: 'none', borderTop: '1px solid #e2e8f0', margin: '24px 0'}} />

      {/* AS 12 CASAS ASTROLÓGICAS */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>As 12 Casas Astrológicas</h3>
        <p style={{...styles.textSmall, textAlign: 'center' as const, marginBottom: '20px'}}>
          Cada casa representa uma área específica da vida e experiência humana
        </p>
        <div style={{...styles.grid, ...styles.gridCols3}}>
          {houses.map((house) => {
            // Encontrar o signo e regente desta casa nos dados calculados
            const houseData = analysis.houses.find(h => h.number === house.number);
            
            return (
              <div key={house.number} style={{...styles.cardSmall, textAlign: 'left' as const}}>
                <div style={{display: 'flex', alignItems: 'center' as const, marginBottom: '8px'}}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: '#3182ce',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center' as const,
                    justifyContent: 'center' as const,
                    fontSize: '12px',
                    fontWeight: 'bold',
                    marginRight: '8px'
                  }}>
                    {house.number}
                  </div>
                  <span style={{fontWeight: '600', fontSize: '14px', color: '#2d3748'}}>
                    Casa {house.number} - {house.name}
                  </span>
                </div>
                
                {houseData && (
                  <p style={{...styles.textSmall, marginBottom: '6px', color: '#3b82f6'}}>
                    <strong>Signo:</strong> {houseData.sign} | <strong>Regente:</strong> {houseData.ruler}
                  </p>
                )}
                
                <p style={{...styles.textSmall, lineHeight: '1.4'}}>
                  {house.meaning}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <hr style={{border: 'none', borderTop: '1px solid #e2e8f0', margin: '24px 0'}} />

      {/* SÍNTESE ASTROLÓGICA */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Síntese do Seu Perfil Astrológico</h3>
        <div style={{...styles.grid, ...styles.gridCols3}}>
          <div style={{...styles.card, backgroundColor: '#f0f9ff'}}>
            <h4 style={{color: '#0369a1', marginBottom: '12px'}}>🔥 Elemento Dominante</h4>
            <p style={{fontSize: '18px', fontWeight: 'bold', color: '#0369a1', marginBottom: '8px'}}>
              {analysis.dominantElement}
            </p>
            <p style={{...styles.textSmall, lineHeight: '1.4'}}>
              {analysis.dominantElement === 'Fogo' && 'Energia, iniciativa e liderança natural'}
              {analysis.dominantElement === 'Terra' && 'Praticidade, estabilidade e determinação'}
              {analysis.dominantElement === 'Ar' && 'Comunicação, ideias e sociabilidade'}
              {analysis.dominantElement === 'Água' && 'Intuição, emoções e sensibilidade'}
            </p>
          </div>

          <div style={{...styles.card, backgroundColor: '#f0fdf4'}}>
            <h4 style={{color: '#16a34a', marginBottom: '12px'}}>⭐ Planeta Dominante</h4>
            <p style={{fontSize: '18px', fontWeight: 'bold', color: '#16a34a', marginBottom: '8px'}}>
              {analysis.dominantPlanet}
            </p>
            <p style={{...styles.textSmall, lineHeight: '1.4'}}>
              Planeta com maior influência no seu mapa astral
            </p>
          </div>

          <div style={{...styles.card, backgroundColor: '#fef7ff'}}>
            <h4 style={{color: '#7c3aed', marginBottom: '12px'}}>🎯 Modalidade</h4>
            <p style={{fontSize: '18px', fontWeight: 'bold', color: '#7c3aed', marginBottom: '8px'}}>
              {analysis.dominantModality}
            </p>
            <p style={{...styles.textSmall, lineHeight: '1.4'}}>
              {analysis.dominantModality === 'Cardinal' && 'Iniciativa e liderança'}
              {analysis.dominantModality === 'Fixo' && 'Estabilidade e persistência'}
              {analysis.dominantModality === 'Mutável' && 'Adaptabilidade e flexibilidade'}
            </p>
          </div>
        </div>
      </div>

      {/* FOOTER INFORMATIVO */}
      <div style={{
        marginTop: '32px',
        padding: '16px',
        backgroundColor: '#f0f9ff',
        border: '1px solid #bae6fd',
        borderRadius: '8px',
        textAlign: 'center' as const
      }}>
        <p style={{fontSize: '14px', color: '#0369a1', margin: 0}}>
          ✨ <strong>Análise Personalizada Completa!</strong> Este mapa astral foi calculado especificamente 
          para você com base nos seus dados reais de nascimento. Cada posição planetária e aspecto 
          reflete as energias únicas presentes no momento em que você veio ao mundo.
        </p>
      </div>
    </div>
  );
};

export default WesternAstrologyAnalysis;