import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  Radar, 
  Tooltip
} from 'recharts';

/**
 * Componente para exibir os resultados da primeira rodada de análises
 * Mostra apenas os dados brutos sem interpretações ou insights
 */
const FirstAnalysisResults = ({ analysisData }) => {
  const [activeTab, setActiveTab] = useState(0);
  
  // Dados mock para demonstração (em produção virão da prop analysisData)
  const mockData = {
    westernAstrology: {
      sun: { sign: 'Leão', degree: 15.23, house: 7 },
      moon: { sign: 'Peixes', degree: 28.45, house: 2 },
      ascendant: { sign: 'Aquário', degree: 5.12 },
      planets: [
        { name: 'Mercúrio', sign: 'Câncer', degree: 22.10, house: 6 },
        { name: 'Vênus', sign: 'Virgem', degree: 8.33, house: 8 },
        { name: 'Marte', sign: 'Escorpião', degree: 13.55, house: 10 }
      ]
    },
    chineseAstrology: {
      zodiacSign: 'Dragão',
      element: 'Madeira',
      polarity: 'Yang',
      lifeCycle: 'Crescimento',
      elements: {
        wood: 25,
        fire: 15,
        earth: 20,
        metal: 10,
        water: 30
      }
    },
    numerology: {
      lifePath: 7,
      expression: 3,
      soulUrge: 1,
      personality: 5,
      birthday: 23,
      radarData: [
        { category: 'Liderança', value: 8.5 },
        { category: 'Criatividade', value: 9.2 },
        { category: 'Comunicação', value: 7.8 },
        { category: 'Intuição', value: 8.9 },
        { category: 'Análise', value: 9.5 },
        { category: 'Cooperação', value: 6.7 }
      ]
    }
  };

  const data = analysisData || mockData;

  // Estilos para tema claro
  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '24px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    header: {
      textAlign: 'center' as const,
      marginBottom: '32px'
    },
    title: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#2d3748',
      marginBottom: '16px'
    },
    subtitle: {
      color: '#718096',
      maxWidth: '600px',
      margin: '0 auto',
      lineHeight: '1.5'
    },
    tabContainer: {
      marginBottom: '32px'
    },
    tabList: {
      display: 'flex',
      justifyContent: 'center' as const,
      marginBottom: '24px',
      borderBottom: '2px solid #e2e8f0',
      gap: '8px'
    },
    tab: {
      padding: '12px 24px',
      cursor: 'pointer',
      borderRadius: '8px 8px 0 0',
      border: 'none',
      backgroundColor: 'transparent',
      fontSize: '16px',
      fontWeight: '500',
      transition: 'all 0.2s ease'
    },
    tabActive: {
      backgroundColor: '#3182ce',
      color: 'white'
    },
    tabInactive: {
      backgroundColor: '#f7fafc',
      color: '#4a5568'
    },
    section: {
      marginBottom: '32px'
    },
    sectionTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#2d3748',
      marginBottom: '16px'
    },
    grid: {
      display: 'grid',
      gap: '16px'
    },
    gridCols1: {
      gridTemplateColumns: '1fr'
    },
    gridCols2: {
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
    },
    gridCols3: {
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))'
    },
    gridCols5: {
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
    badgeRed: {
      backgroundColor: '#fecaca',
      color: '#dc2626'
    },
    badgeGreen: {
      backgroundColor: '#bbf7d0',
      color: '#16a34a'
    },
    badgeYellow: {
      backgroundColor: '#fef3c7',
      color: '#d97706'
    },
    badgeGray: {
      backgroundColor: '#f3f4f6',
      color: '#374151'
    },
    icon: {
      fontSize: '32px',
      marginBottom: '8px'
    },
    numberLarge: {
      fontSize: '32px',
      fontWeight: 'bold',
      margin: '8px 0'
    },
    textSmall: {
      fontSize: '12px',
      color: '#718096'
    },
    infoBox: {
      padding: '16px',
      border: '1px solid #bee3f8',
      borderRadius: '8px',
      backgroundColor: '#ebf8ff',
      textAlign: 'center' as const,
      marginTop: '32px'
    },
    radarContainer: {
      height: '400px',
      marginTop: '16px'
    },
    pentagonContainer: {
      height: '300px'
    }
  };

  // Componente do Mapa Astral
  const AstrologyWheel = () => {
    const canvasRef = React.useRef(null);
    
    React.useEffect(() => {
      if (!canvasRef.current) return;
      
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const size = 450;
      canvas.width = size;
      canvas.height = size;
      
      const centerX = size / 2;
      const centerY = size / 2;
      const radius = size * 0.42;
      
      // Limpar canvas
      ctx.clearRect(0, 0, size, size);
      
      // Fundo com gradiente sutil
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
      
      // Todos os planetas com posições mais realistas
      const planetData = [
        { symbol: '☉', angle: 135, color: '#f59e0b', name: 'Sol' }, // Leão
        { symbol: '☽', angle: 330, color: '#64748b', name: 'Lua' }, // Peixes
        { symbol: '☿', angle: 110, color: '#8b5cf6', name: 'Mercúrio' }, // Câncer
        { symbol: '♀', angle: 240, color: '#ec4899', name: 'Vênus' }, // Virgem
        { symbol: '♂', angle: 210, color: '#ef4444', name: 'Marte' }, // Escorpião
        { symbol: '♃', angle: 45, color: '#3b82f6', name: 'Júpiter' }, // Touro
        { symbol: '♄', angle: 300, color: '#71717a', name: 'Saturno' }, // Aquário
      ];
      
      // Desenhar planetas
      ctx.font = '18px serif';
      planetData.forEach(planet => {
        const angle = (planet.angle - 90) * Math.PI / 180;
        const x = centerX + Math.cos(angle) * (radius * 0.82);
        const y = centerY + Math.sin(angle) * (radius * 0.82);
        
        // Círculo de fundo para o planeta
        ctx.beginPath();
        ctx.arc(x, y, 12, 0, 2 * Math.PI);
        ctx.fillStyle = planet.color + '20';
        ctx.fill();
        ctx.strokeStyle = planet.color;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Símbolo do planeta
        ctx.fillStyle = planet.color;
        ctx.fillText(planet.symbol, x, y);
      });
      
      // ASPECTOS - Linhas de influência
      const aspects = [
        // Trígonos (harmônicos) - linhas azuis
        { from: planetData[0], to: planetData[4], type: 'trine', color: '#3b82f6' }, // Sol-Marte
        { from: planetData[1], to: planetData[2], type: 'trine', color: '#3b82f6' }, // Lua-Mercúrio
        
        // Quadraturas (tensão) - linhas vermelhas
        { from: planetData[0], to: planetData[1], type: 'square', color: '#ef4444' }, // Sol-Lua
        { from: planetData[3], to: planetData[5], type: 'square', color: '#ef4444' }, // Vênus-Júpiter
        
        // Sextis (oportunidade) - linhas verdes
        { from: planetData[2], to: planetData[3], type: 'sextile', color: '#10b981' }, // Mercúrio-Vênus
        
        // Oposições (polaridade) - linhas laranjas
        { from: planetData[4], to: planetData[6], type: 'opposition', color: '#f97316' }, // Marte-Saturno
      ];
      
      // Desenhar aspectos
      aspects.forEach(aspect => {
        const fromAngle = (aspect.from.angle - 90) * Math.PI / 180;
        const toAngle = (aspect.to.angle - 90) * Math.PI / 180;
        
        const fromX = centerX + Math.cos(fromAngle) * (radius * 0.82);
        const fromY = centerY + Math.sin(fromAngle) * (radius * 0.82);
        const toX = centerX + Math.cos(toAngle) * (radius * 0.82);
        const toY = centerY + Math.sin(toAngle) * (radius * 0.82);
        
        // Linha do aspecto
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.strokeStyle = aspect.color;
        ctx.lineWidth = aspect.type === 'square' || aspect.type === 'opposition' ? 2 : 1.5;
        ctx.setLineDash(aspect.type === 'trine' ? [] : [5, 5]);
        ctx.stroke();
        ctx.setLineDash([]); // Reset dash
      });
      
      // Círculo central pequeno
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.08, 0, 2 * Math.PI);
      ctx.fillStyle = '#1e293b';
      ctx.fill();
      
    }, []);
    
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

  // Componente do Horóscopo Ocidental
  const WesternAstrologyTab = () => {
    const { sun, moon, ascendant, planets } = data.westernAstrology;
    
    // Dados das 12 casas astrológicas
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
      <div>
        {/* Mapa Astral Visual */}
        <div style={styles.section}>
          <h3 style={{...styles.sectionTitle, textAlign: 'center' as const}}>Seu Mapa Astral</h3>
          <AstrologyWheel />
          <p style={{...styles.textSmall, textAlign: 'center'as const, fontStyle: 'italic'}}>
            Representação visual completa com planetas, casas e aspectos astrológicos
          </p>
        </div>

        <hr style={{border: 'none', borderTop: '1px solid #e2e8f0', margin: '32px 0'}} />

        {/* Trio Principal */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Trio Principal</h3>
          <div style={{...styles.grid, ...styles.gridCols3}}>
            {/* Sol */}
            <div style={styles.card}>
              <div style={{...styles.icon, color: '#f97316'}}>☀️</div>
              <h4 style={{fontWeight: 'bold', fontSize: '16px', color: '#2d3748'}}>Sol</h4>
              <span style={{...styles.badge, ...styles.badgeOrange}}>{sun.sign}</span>
              <p style={styles.textSmall}>{sun.degree}° - Casa {sun.house}</p>
              <p style={{...styles.textSmall, marginTop: '8px'}}>
                Representa sua essência e identidade central
              </p>
            </div>

            {/* Lua */}
            <div style={styles.card}>
              <div style={{...styles.icon, color: '#3b82f6'}}>🌙</div>
              <h4 style={{fontWeight: 'bold', fontSize: '16px', color: '#2d3748'}}>Lua</h4>
              <span style={{...styles.badge, ...styles.badgeBlue}}>{moon.sign}</span>
              <p style={styles.textSmall}>{moon.degree}° - Casa {moon.house}</p>
              <p style={{...styles.textSmall, marginTop: '8px'}}>
                Governa suas emoções e mundo interior
              </p>
            </div>

            {/* Ascendente */}
            <div style={styles.card}>
              <div style={{...styles.icon, color: '#8b5cf6'}}>🌅</div>
              <h4 style={{fontWeight: 'bold', fontSize: '16px', color: '#2d3748'}}>Ascendente</h4>
              <span style={{...styles.badge, ...styles.badgePurple}}>{ascendant.sign}</span>
              <p style={styles.textSmall}>{ascendant.degree}°</p>
              <p style={{...styles.textSmall, marginTop: '8px'}}>
                Define sua personalidade e como se apresenta ao mundo
              </p>
            </div>
          </div>
        </div>

        <hr style={{border: 'none', borderTop: '1px solid #e2e8f0', margin: '24px 0'}} />

        {/* Outros Planetas */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Planetas Pessoais</h3>
          <div style={{...styles.grid, ...styles.gridCols3}}>
            {planets.map((planet, index) => (
              <div key={index} style={styles.cardSmall}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'as const}}>
                  <span style={{fontWeight: '600', fontSize: '14px', color: '#2d3748'}}>
                    {planet.name}
                  </span>
                  <span style={{...styles.badge, ...styles.badgeGray, fontSize: '12px'}}>
                    {planet.sign}
                  </span>
                </div>
                <p style={{...styles.textSmall, marginTop: '4px'}}>
                  {planet.degree}° - Casa {planet.house}
                </p>
              </div>
            ))}
          </div>
        </div>

        <hr style={{border: 'none', borderTop: '1px solid #e2e8f0', margin: '24px 0'}} />

        {/* As 12 Casas Astrológicas */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>As 12 Casas Astrológicas</h3>
          <p style={{...styles.textSmall, textAlign: 'center' as const, marginBottom: '20px'}}>
            Cada casa representa uma área específica da vida e experiência humana
          </p>
          <div style={{...styles.grid, ...styles.gridCols3}}>
            {houses.map((house) => (
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
                <p style={{...styles.textSmall, lineHeight: '1.4'}}>
                  {house.meaning}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Componente da Astrologia Chinesa
  const ChineseAstrologyTab = () => {
    const { zodiacSign, element, polarity, lifeCycle, elements } = data.chineseAstrology;
    
    const elementIcons = {
      Madeira: '🌳',
      Fogo: '🔥',
      Terra: '🏔️',
      Metal: '⚡',
      Água: '💧'
    };

    const elementColors = {
      Madeira: styles.badgeGreen,
      Fogo: styles.badgeRed,
      Terra: styles.badgeYellow,
      Metal: styles.badgeGray,
      Água: styles.badgeBlue
    };

    const pentagonData = Object.entries(elements).map(([key, value]) => {
      const elementNames = {
        wood: 'Madeira',
        fire: 'Fogo', 
        earth: 'Terra',
        metal: 'Metal',
        water: 'Água'
      };
      return {
        element: elementNames[key] || key,
        value: value,
        fullMark: 100
      };
    });

    return (
      <div>
        {/* Pentagon dos Elementos - MOVIDO PARA O TOPO */}
        <div style={styles.section}>
          <h3 style={{...styles.sectionTitle, textAlign: 'center' as const}}>
            Pentágono Elemental
          </h3>
          <div style={{display: 'flex', justifyContent: 'center' as const, marginBottom: '24px'}}>
            <div style={{...styles.pentagonContainer, width: '400px'}}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={pentagonData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="element" />
                  <Radar
                    dataKey="value"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.3}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <p style={{...styles.textSmall, textAlign: 'center' as const, fontStyle: 'italic'}}>
            Distribuição dos cinco elementos na sua constituição energética
          </p>
        </div>

        <hr style={{border: 'none', borderTop: '1px solid #e2e8f0', margin: '32px 0'}} />

        <div style={{...styles.grid, ...styles.gridCols2}}>
          <div>
            <div style={styles.card}>
              <h3 style={{fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: '#2d3748'}}>
                Perfil Astrológico Chinês
              </h3>
              
              <div style={{display: 'flex', flexDirection: 'column' as const , gap: '16px'}}>
                <div>
                  <p style={styles.textSmall}>Signo</p>
                  <div style={{display: 'flex', alignItems: 'center' as const, justifyContent: 'center' as const, gap: '8px', marginBottom: '8px'}}>
                    <span style={{fontSize: '24px'}}>🐉</span>
                    <span style={{...styles.badge, ...styles.badgeRed, fontSize: '18px'}}>
                      {zodiacSign}
                    </span>
                  </div>
                </div>

                <div>
                  <p style={styles.textSmall}>Elemento Predominante</p>
                  <div style={{display: 'flex', alignItems: 'center' as const, justifyContent: 'center' as const, gap: '8px'}}>
                    <span style={{fontSize: '20px'}}>{elementIcons[element]}</span>
                    <span style={{...styles.badge, ...elementColors[element], fontSize: '16px'}}>
                      {element}
                    </span>
                  </div>
                </div>

                <div>
                  <p style={styles.textSmall}>Polaridade</p>
                  <span style={{
                    ...styles.badge, 
                    ...(polarity === 'Yang' ? styles.badgeOrange : styles.badgeBlue), 
                    fontSize: '16px'
                  }}>
                    {polarity}
                  </span>
                </div>

                <div>
                  <p style={styles.textSmall}>Ciclo da Vida</p>
                  <p style={{fontSize: '16px', fontWeight: '600', color: '#2d3748'}}>
                    {lifeCycle}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Descrições dos elementos */}
          <div style={{...styles.card, textAlign: 'left' as const}}>
            <h4 style={{fontSize: '16px', fontWeight: 'bold', marginBottom: '12px', color: '#2d3748'}}>
              Características dos Elementos
            </h4>
            <div style={{display: 'flex', flexDirection: 'column' as const, gap: '8px', fontSize: '12px'}}>
              <p><strong>Signo:</strong> Representa sua personalidade base e características inatas</p>
              <p><strong>Elemento:</strong> Define sua energia predominante e forma de agir</p>
              <p><strong>Polaridade:</strong> Yang (ativo, expressivo) ou Yin (receptivo, introspectivo)</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Componente da Numerologia
  const NumerologyTab = () => {
    const { lifePath, expression, soulUrge, personality, birthday, radarData } = data.numerology;
    
    const numberCards = [
      { icon: '🧭', label: 'Caminho da Vida', value: lifePath, color: styles.badgePurple },
      { icon: '❤️', label: 'Expressão', value: expression, color: styles.badgeRed },
      { icon: '🧠', label: 'Impulso da Alma', value: soulUrge, color: styles.badgeBlue },
      { icon: '🎭', label: 'Personalidade', value: personality, color: styles.badgeGreen },
      { icon: '🎂', label: 'Aniversário', value: birthday, color: styles.badgeOrange }
    ];
    
    return (
      <div>
        {/* Radar Numerológico - MOVIDO PARA O TOPO */}
        <div style={styles.section}>
          <h3 style={{...styles.sectionTitle, textAlign: 'center' as const}}>
            Radar Numerológico - Aspectos da Personalidade
          </h3>
          <div style={{display: 'flex', justifyContent: 'center' as const, marginBottom: '24px'}}>
            <div style={{...styles.radarContainer, width: '400px'}}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="category" />
                  <Radar
                    dataKey="value"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.3}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <p style={{...styles.textSmall, textAlign: 'center' as const, fontStyle: 'italic'}}>
            Perfil de competências e características baseado nos seus números pessoais
          </p>
        </div>

        <hr style={{border: 'none', borderTop: '1px solid #e2e8f0', margin: '32px 0'}} />

        {/* Números Principais */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Números Principais</h3>
          <div style={{...styles.grid, ...styles.gridCols5}}>
            {numberCards.map((card, index) => (
              <div key={index} style={styles.card}>
                <div style={{...styles.icon, fontSize: '24px'}}>{card.icon}</div>
                <p style={{...styles.textSmall, marginBottom: '8px'}}>{card.label}</p>
                <div style={{...styles.numberLarge, color: card.color.color}}>
                  {card.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Significados dos Números */}
        <div style={{...styles.card, textAlign: 'left' as const, marginBottom: '24px'}}>
          <h4 style={{fontSize: '16px', fontWeight: 'bold', marginBottom: '12px', color: '#2d3748'}}>
            Significado dos Números
          </h4>
          <div style={{display: 'flex', flexDirection: 'column' as const, gap: '8px', fontSize: '12px'}}>
            <p><strong>Caminho da Vida:</strong> Sua missão principal e direção de vida</p>
            <p><strong>Expressão:</strong> Como você se manifesta no mundo e seus talentos</p>
            <p><strong>Impulso da Alma:</strong> Suas motivações internas e desejos profundos</p>
            <p><strong>Personalidade:</strong> Como outros te percebem inicialmente</p>
            <p><strong>Aniversário:</strong> Dons especiais relacionados ao dia de nascimento</p>
          </div>
        </div>
      </div>
    );
  };

  const tabs = [
    { label: '🌟 Horóscopo Ocidental', component: WesternAstrologyTab },
    { label: '🐉 Astrologia Chinesa', component: ChineseAstrologyTab },
    { label: '🔢 Numerologia', component: NumerologyTab }
  ];

  const ActiveComponent = tabs[activeTab].component;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>
          🔍 Primeira Rodada de Análises
        </h1>
        <p style={styles.subtitle}>
          Aqui estão os resultados brutos das suas análises ancestrais. 
          Estes dados serão utilizados para gerar insights personalizados nas próximas etapas.
        </p>
      </div>

      {/* Tabs */}
      <div style={styles.tabContainer}>
        <div style={styles.tabList}>
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              style={{
                ...styles.tab,
                ...(activeTab === index ? styles.tabActive : styles.tabInactive)
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          <ActiveComponent />
        </div>
      </div>

      {/* Footer */}
      <div style={styles.infoBox}>
        <p style={{fontSize: '14px', color: '#1e40af'}}>
          ✨ <strong>Próximo passo:</strong> Estes dados serão analisados para gerar seu Plano de Voo personalizado 
          com insights específicos e recomendações para cada dimensão do seu desenvolvimento.
        </p>
      </div>
    </div>
  );
};

export default FirstAnalysisResults;