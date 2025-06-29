import React, { useState, useEffect } from 'react';

// 🎯 INTERFACES E TIPOS (copiadas do hook)
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

interface AnalysisOrchestratorProps {
  userData: UserData | null;
  onAnalysisComplete?: (results: any) => void;
}

const AnalysisOrchestrator: React.FC<AnalysisOrchestratorProps> = ({ 
  userData, 
  onAnalysisComplete 
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [completedAnalyses, setCompletedAnalyses] = useState<string[]>([]);

  // 🎨 ESTILOS
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
    userInfo: {
      padding: '16px',
      backgroundColor: '#f0f9ff',
      border: '1px solid #bae6fd',
      borderRadius: '8px',
      marginBottom: '24px',
      textAlign: 'center' as const
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
      transition: 'all 0.2s ease',
      position: 'relative' as const
    },
    tabActive: {
      backgroundColor: '#3182ce',
      color: 'white'
    },
    tabInactive: {
      backgroundColor: '#f7fafc',
      color: '#4a5568'
    },
    tabCompleted: {
      backgroundColor: '#10b981',
      color: 'white'
    },
    tabContent: {
      minHeight: '400px'
    },
    comingSoon: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      padding: '80px 20px',
      textAlign: 'center' as const,
      backgroundColor: '#f9fafb',
      borderRadius: '12px',
      border: '2px dashed #d1d5db'
    },
    footer: {
      marginTop: '40px',
      padding: '20px',
      backgroundColor: '#fef3c7',
      border: '1px solid #fcd34d',
      borderRadius: '8px',
      textAlign: 'center' as const
    },
    progressBar: {
      width: '100%',
      height: '8px',
      backgroundColor: '#e5e7eb',
      borderRadius: '4px',
      marginBottom: '16px',
      overflow: 'hidden'
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#3b82f6',
      borderRadius: '4px',
      transition: 'width 0.3s ease'
    }
  };

  // 📊 CONFIGURAÇÃO DAS ABAS
  const tabs = [
    { 
      id: 'western-astrology',
      label: '🌟 Horóscopo Ocidental', 
      implemented: true 
    },
    { 
      id: 'chinese-astrology',
      label: '🐉 Astrologia Chinesa', 
      implemented: false 
    },
    { 
      id: 'numerology',
      label: '🔢 Numerologia', 
      implemented: false 
    }
  ];

  // 🎯 CALLBACK QUANDO ANÁLISE É CONCLUÍDA
  const handleAnalysisComplete = (analysisId: string, results: any) => {
    if (!completedAnalyses.includes(analysisId)) {
      setCompletedAnalyses(prev => [...prev, analysisId]);
    }
    
    // Notificar componente pai se necessário
    if (onAnalysisComplete) {
      onAnalysisComplete({ analysisId, results });
    }
  };

  // 📈 CALCULAR PROGRESSO
  const progressPercentage = (completedAnalyses.length / tabs.filter(t => t.implemented).length) * 100;

  const hasValidData = userData && userData.id && userData.name && userData.birthDate;

  // ⭐ COMPONENTE DA ANÁLISE ASTROLÓGICA OCIDENTAL (PLACEHOLDER)
  const WesternAstrologyPlaceholder: React.FC = () => (
    <div style={styles.comingSoon}>
      <div style={{fontSize: '48px', marginBottom: '16px'}}>🌟</div>
      <h3 style={{color: '#3b82f6', marginBottom: '12px'}}>
        Análise Astrológica Ocidental Pronta!
      </h3>
      <p style={{color: '#6b7280', maxWidth: '500px', lineHeight: '1.5', marginBottom: '20px'}}>
        O componente completo de Astrologia Ocidental com mapa astral, planetas, casas e aspectos 
        já foi desenvolvido e está pronto para integração. Aqui apareceriam:
      </p>
      
      <div style={{
        textAlign: 'left' as const,
        backgroundColor: '#f8fafc',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        maxWidth: '500px'
      }}>
        <h4 style={{color: '#1e293b', marginBottom: '12px'}}>✨ Análises Incluídas:</h4>
        <ul style={{color: '#475569', lineHeight: '1.6', margin: 0, paddingLeft: '20px'}}>
          <li>🎨 <strong>Mapa Astral Visual</strong> - Canvas interativo com planetas e aspectos</li>
          <li>☀️ <strong>Trio Principal</strong> - Sol, Lua e Ascendente calculados</li>
          <li>🪐 <strong>Posições Planetárias</strong> - Todos os planetas em signos e casas</li>
          <li>🔗 <strong>Aspectos Planetários</strong> - Conexões energéticas coloridas</li>
          <li>🏠 <strong>12 Casas Astrológicas</strong> - Áreas da vida detalhadas</li>
          <li>📊 <strong>Síntese do Perfil</strong> - Elemento e modalidade dominantes</li>
        </ul>
      </div>

      <div style={{
        marginTop: '20px',
        padding: '12px 24px',
        backgroundColor: '#10b981',
        color: '#064e3b',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: '600'
      }}>
        ✅ Pronto para uso com dados: {userData?.name} | {userData?.birthDate}
      </div>
    </div>
  );

  // 📝 RENDERIZAR DADOS DO USUÁRIO
  const renderUserInfo = () => {
    if (!userData) return null;

    return (
      <div style={styles.userInfo}>
        <h4 style={{margin: '0 0 8px 0', color: '#0369a1'}}>
          👤 Análises para: <strong>{userData.name}</strong>
        </h4>
        <div style={{fontSize: '14px', color: '#0369a1'}}>
          <span><strong>📅 Data:</strong> {userData.birthDate}</span>
          {userData.birthTime && (
            <span style={{marginLeft: '16px'}}>
              <strong>⏰ Horário:</strong> {userData.birthTime}
            </span>
          )}
          {userData.birthPlace && (
            <span style={{marginLeft: '16px'}}>
              <strong>📍 Local:</strong> {userData.birthPlace.name}
            </span>
          )}
        </div>
      </div>
    );
  };

  // 🚧 COMPONENTE "EM BREVE"
  const ComingSoonComponent: React.FC<{ type: string }> = ({ type }) => (
    <div style={styles.comingSoon}>
      <div style={{fontSize: '48px', marginBottom: '16px'}}>🚧</div>
      <h3 style={{color: '#6b7280', marginBottom: '12px'}}>
        {type === 'chinese-astrology' && 'Astrologia Chinesa Em Desenvolvimento'}
        {type === 'numerology' && 'Numerologia Em Desenvolvimento'}
        {type === 'western-astrology' && 'Análise Astrológica Ocidental'}
      </h3>
      <p style={{color: '#9ca3af', maxWidth: '400px', lineHeight: '1.5'}}>
        {type === 'western-astrology' ? (
          'Esta análise já está implementada! O componente completo será integrado aqui.'
        ) : (
          'Este módulo de análise está sendo desenvolvido e estará disponível em breve. Continue com as análises disponíveis para ter uma visão completa do seu perfil!'
        )}
      </p>
      <div style={{
        marginTop: '20px',
        padding: '12px 24px',
        backgroundColor: type === 'western-astrology' ? '#10b981' : '#fbbf24',
        color: type === 'western-astrology' ? '#064e3b' : '#92400e',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: '600'
      }}>
        {type === 'western-astrology' ? '✅ Implementado' : '🔜 Próxima atualização'}
      </div>
    </div>
  );

  // ❌ ESTADO SEM DADOS
  if (!hasValidData) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>⚠️ Dados Insuficientes</h1>
          <p style={styles.subtitle}>
            Para realizar as análises ancestrais, precisamos de pelo menos:
            nome completo, data de nascimento e ID do usuário.
          </p>
        </div>
        
        <div style={{
          ...styles.comingSoon,
          backgroundColor: '#fef2f2',
          border: '2px dashed #fca5a5'
        }}>
          <div style={{fontSize: '48px', marginBottom: '16px'}}>📋</div>
          <h3 style={{color: '#dc2626', marginBottom: '12px'}}>
            Complete o Formulário de Onboarding
          </h3>
          <p style={{color: '#7f1d1d', maxWidth: '400px', lineHeight: '1.5'}}>
            Retorne ao formulário de onboarding para fornecer os dados necessários 
            para suas análises ancestrais personalizadas.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <h1 style={styles.title}>
          🔍 Suas Análises Ancestrais Personalizadas
        </h1>
        <p style={styles.subtitle}>
          Análises profundas baseadas nos seus dados reais de nascimento, 
          combinando sabedoria ancestral com cálculos precisos.
        </p>
      </div>

      {/* INFORMAÇÕES DO USUÁRIO */}
      {renderUserInfo()}

      {/* BARRA DE PROGRESSO */}
      <div style={{marginBottom: '24px'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
          <span style={{fontSize: '14px', fontWeight: '600', color: '#374151'}}>
            Progresso das Análises
          </span>
          <span style={{fontSize: '14px', color: '#6b7280'}}>
            {completedAnalyses.length} de {tabs.filter(t => t.implemented).length} concluídas
          </span>
        </div>
        <div style={styles.progressBar}>
          <div 
            style={{
              ...styles.progressFill,
              width: `${progressPercentage}%`
            }}
          />
        </div>
      </div>

      {/* TABS DE NAVEGAÇÃO */}
      <div style={styles.tabContainer}>
        <div style={styles.tabList}>
          {tabs.map((tab, index) => {
            const isActive = activeTab === index;
            const isCompleted = completedAnalyses.includes(tab.id);
            const isImplemented = tab.implemented;
            
            return (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                disabled={!isImplemented}
                style={{
                  ...styles.tab,
                  ...(isActive ? styles.tabActive : 
                      isCompleted ? styles.tabCompleted : 
                      styles.tabInactive),
                  opacity: isImplemented ? 1 : 0.6,
                  cursor: isImplemented ? 'pointer' : 'not-allowed'
                }}
              >
                {tab.label}
                {isCompleted && !isActive && (
                  <span style={{marginLeft: '8px'}}>✅</span>
                )}
                {!isImplemented && (
                  <span style={{marginLeft: '8px'}}>🚧</span>
                )}
              </button>
            );
          })}
        </div>

        {/* CONTEÚDO DA TAB ATIVA */}
        <div style={styles.tabContent}>
          {tabs[activeTab].id === 'western-astrology' ? (
            <WesternAstrologyPlaceholder />
          ) : (
            <ComingSoonComponent type={tabs[activeTab].id} />
          )}
        </div>
      </div>

      {/* FOOTER CALL-TO-ACTION */}
      <div style={styles.footer}>
        <h4 style={{margin: '0 0 8px 0', color: '#d97706'}}>
          ✨ Primeira Rodada de Análises Concluída!
        </h4>
        <p style={{margin: '0 0 12px 0', color: '#92400e', fontSize: '14px'}}>
          Você acabou de ver análises profundas baseadas nos seus dados reais. 
          Isso é apenas o <strong>COMEÇO</strong> da sua jornada NeoSapiens!
        </p>
        <div style={{
          padding: '12px',
          backgroundColor: '#fbbf24',
          color: '#78350f',
          borderRadius: '6px',
          fontWeight: '600',
          fontSize: '15px'
        }}>
          🚀 <strong>Próximo Passo:</strong> Segunda Rodada - Integração Tridimensional e Plano de Voo Personalizado!
        </div>
      </div>
    </div>
  );
};

export default AnalysisOrchestrator;