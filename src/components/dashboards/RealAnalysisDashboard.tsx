import React, { useState, useEffect } from 'react';
import { useUserDataForAnalysis } from '../../services/dataMapperService';

// Importar os componentes de análise que criamos (assumindo que estão disponíveis)
// import WesternAstrologyAnalysis from '../components/analysis/WesternAstrologyAnalysis';

const RealAnalysisDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { userData, loading, error, availability } = useUserDataForAnalysis();

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
      color: '#1f2937',
      marginBottom: '16px'
    },
    subtitle: {
      color: '#6b7280',
      maxWidth: '600px',
      margin: '0 auto',
      lineHeight: '1.5'
    },
    userCard: {
      padding: '20px',
      backgroundColor: '#f0f9ff',
      border: '1px solid #bae6fd',
      borderRadius: '12px',
      marginBottom: '24px'
    },
    loadingContainer: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      padding: '80px 20px',
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
      padding: '40px',
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: '12px',
      textAlign: 'center' as const,
      color: '#dc2626'
    },
    tabContainer: {
      marginBottom: '32px'
    },
    tabList: {
      display: 'flex',
      justifyContent: 'center' as const,
      marginBottom: '24px',
      borderBottom: '2px solid #e5e7eb',
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
      backgroundColor: '#3b82f6',
      color: 'white'
    },
    tabInactive: {
      backgroundColor: '#f9fafb',
      color: '#6b7280'
    },
    tabDisabled: {
      backgroundColor: '#f3f4f6',
      color: '#9ca3af',
      cursor: 'not-allowed',
      opacity: 0.6
    },
    availabilityGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '16px',
      marginBottom: '24px'
    },
    availabilityCard: {
      padding: '20px',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      backgroundColor: 'white'
    },
    availabilityCardAvailable: {
      borderColor: '#10b981',
      backgroundColor: '#f0fdf4'
    },
    availabilityCardUnavailable: {
      borderColor: '#f59e0b',
      backgroundColor: '#fffbeb'
    },
    missingDataContainer: {
      padding: '40px',
      backgroundColor: '#fef3c7',
      border: '1px solid #fcd34d',
      borderRadius: '12px',
      textAlign: 'center' as const
    },
    analysisContent: {
      backgroundColor: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      padding: '24px',
      minHeight: '400px'
    },
    placeholderContent: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      padding: '60px 20px',
      textAlign: 'center' as const,
      backgroundColor: '#f9fafb',
      borderRadius: '8px',
      border: '2px dashed #d1d5db'
    }
  };

  // 📊 CONFIGURAÇÃO DAS ABAS
  const tabs = [
    { 
      id: 'western-astrology',
      label: '🌟 Horóscopo Ocidental',
      available: availability?.westernAstrology?.available || false
    },
    { 
      id: 'chinese-astrology',
      label: '🐉 Astrologia Chinesa',
      available: availability?.chineseAstrology?.available || false
    },
    { 
      id: 'numerology',
      label: '🔢 Numerologia',
      available: availability?.numerology?.available || false
    }
  ];

  // ⏳ ESTADO DE CARREGAMENTO
  if (loading) {
    return (
      <div style={styles.container}>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <h3 style={{color: '#3b82f6', marginBottom: '8px'}}>
            🔍 Carregando seus dados...
          </h3>
          <p style={{color: '#6b7280', fontSize: '14px'}}>
            Buscando informações do onboarding no Supabase...
          </p>
        </div>
      </div>
    );
  }

  // ❌ ESTADO DE ERRO
  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <h3 style={{marginBottom: '16px', fontSize: '20px'}}>
            ⚠️ Dados Não Encontrados
          </h3>
          <p style={{marginBottom: '20px'}}>{error}</p>
          <div style={{
            padding: '16px',
            backgroundColor: '#fbbf24',
            color: '#92400e',
            borderRadius: '8px',
            fontSize: '14px'
          }}>
            💡 <strong>Solução:</strong> Complete o formulário de onboarding primeiro para 
            ter acesso às suas análises personalizadas.
          </div>
          <button 
            onClick={() => window.location.href = '/onboarding'}
            style={{
              marginTop: '20px',
              padding: '12px 24px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            🚀 Ir para Onboarding
          </button>
        </div>
      </div>
    );
  }

  // ❌ SEM DADOS DO USUÁRIO
  if (!userData) {
    return (
      <div style={styles.container}>
        <div style={styles.missingDataContainer}>
          <h3 style={{color: '#d97706', marginBottom: '16px'}}>
            📋 Complete seu Perfil
          </h3>
          <p style={{color: '#92400e', marginBottom: '20px'}}>
            Para gerar suas análises ancestrais personalizadas, precisamos dos seus dados de nascimento.
          </p>
          <button 
            onClick={() => window.location.href = '/onboarding'}
            style={{
              padding: '12px 24px',
              backgroundColor: '#f59e0b',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            📝 Completar Onboarding
          </button>
        </div>
      </div>
    );
  }

  // 🎯 COMPONENTE DE DISPONIBILIDADE DE ANÁLISES
  const AnalysisAvailabilityGrid = () => (
    <div style={styles.availabilityGrid}>
      {Object.entries(availability || {}).map(([key, value]: [string, any]) => {
        const isAvailable = value.available;
        const traditionNames = {
          westernAstrology: 'Horóscopo Ocidental',
          chineseAstrology: 'Astrologia Chinesa', 
          numerology: 'Numerologia'
        };
        
        const traditionEmojis = {
          westernAstrology: '🌟',
          chineseAstrology: '🐉',
          numerology: '🔢'
        };
        
        return (
          <div 
            key={key}
            style={{
              ...styles.availabilityCard,
              ...(isAvailable ? styles.availabilityCardAvailable : styles.availabilityCardUnavailable)
            }}
          >
            <div style={{display: 'flex', alignItems: 'center' as const, marginBottom: '12px'}}>
              <span style={{fontSize: '24px', marginRight: '8px'}}>
                {traditionEmojis[key as keyof typeof traditionEmojis]}
              </span>
              <h4 style={{
                margin: 0,
                color: isAvailable ? '#065f46' : '#92400e',
                fontSize: '16px',
                fontWeight: '600'
              }}>
                {traditionNames[key as keyof typeof traditionNames]}
              </h4>
            </div>
            
            <div style={{marginBottom: '8px'}}>
              <span style={{
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '600',
                backgroundColor: isAvailable ? '#10b981' : '#f59e0b',
                color: 'white'
              }}>
                {isAvailable ? '✅ Disponível' : '⚠️ Dados Insuficientes'}
              </span>
            </div>
            
            {value.missing && value.missing.length > 0 && (
              <div style={{fontSize: '12px', color: '#92400e'}}>
                <strong>Faltam:</strong> {value.missing.join(', ')}
              </div>
            )}
            
            {value.warnings && value.warnings.length > 0 && (
              <div style={{fontSize: '12px', color: '#d97706', marginTop: '4px'}}>
                <strong>Avisos:</strong> {value.warnings.join('; ')}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  // 🎨 COMPONENTE PLACEHOLDER PARA ANÁLISE
  const AnalysisPlaceholder: React.FC<{ type: string; available: boolean }> = ({ type, available }) => {
    if (!available) {
      return (
        <div style={styles.placeholderContent}>
          <div style={{fontSize: '48px', marginBottom: '16px'}}>⚠️</div>
          <h3 style={{color: '#f59e0b', marginBottom: '12px'}}>
            Dados Insuficientes para {type}
          </h3>
          <p style={{color: '#92400e', maxWidth: '400px', lineHeight: '1.5'}}>
            Complete o onboarding com todas as informações necessárias para 
            desbloquear esta análise.
          </p>
        </div>
      );
    }

    return (
      <div style={styles.placeholderContent}>
        <div style={{fontSize: '48px', marginBottom: '16px'}}>🚀</div>
        <h3 style={{color: '#3b82f6', marginBottom: '12px'}}>
          {type} com Dados Reais!
        </h3>
        <p style={{color: '#6b7280', maxWidth: '500px', lineHeight: '1.5', marginBottom: '20px'}}>
          Esta análise está pronta para ser gerada com seus dados reais do Supabase:
        </p>
        
        <div style={{
          textAlign: 'left' as const,
          backgroundColor: '#f8fafc',
          padding: '16px',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          maxWidth: '400px'
        }}>
          <h4 style={{color: '#1e293b', marginBottom: '8px', fontSize: '14px'}}>
            📊 Dados Detectados:
          </h4>
          <ul style={{margin: 0, paddingLeft: '16px', fontSize: '12px', color: '#475569'}}>
            <li><strong>Nome:</strong> {userData.name}</li>
            <li><strong>Data:</strong> {userData.birthDate}</li>
            {userData.birthTime && <li><strong>Horário:</strong> {userData.birthTime}</li>}
            {userData.birthPlace && <li><strong>Local:</strong> {userData.birthPlace.name}</li>}
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
          ✅ Integração com componente de análise aqui
        </div>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <h1 style={styles.title}>
          🎯 Suas Análises Personalizadas
        </h1>
        <p style={styles.subtitle}>
          Análises baseadas nos seus dados reais coletados no onboarding
        </p>
      </div>

      {/* INFORMAÇÕES DO USUÁRIO */}
      <div style={styles.userCard}>
        <h4 style={{margin: '0 0 8px 0', color: '#0369a1'}}>
          👤 Analisando perfil de: <strong>{userData.name}</strong>
        </h4>
        <div style={{fontSize: '14px', color: '#0369a1'}}>
          <span><strong>📅 Data de nascimento:</strong> {userData.birthDate}</span>
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

      {/* GRID DE DISPONIBILIDADE */}
      <AnalysisAvailabilityGrid />

      {/* TABS DE ANÁLISES */}
      <div style={styles.tabContainer}>
        <div style={styles.tabList}>
          {tabs.map((tab, index) => {
            const isActive = activeTab === index;
            const isAvailable = tab.available;
            
            return (
              <button
                key={index}
                onClick={() => isAvailable && setActiveTab(index)}
                style={{
                  ...styles.tab,
                  ...(isActive ? styles.tabActive : 
                      isAvailable ? styles.tabInactive : 
                      styles.tabDisabled)
                }}
                disabled={!isAvailable}
              >
                {tab.label}
                {!isAvailable && (
                  <span style={{marginLeft: '8px'}}>🔒</span>
                )}
              </button>
            );
          })}
        </div>

        {/* CONTEÚDO DA TAB ATIVA */}
        <div style={styles.analysisContent}>
          <AnalysisPlaceholder 
            type={tabs[activeTab].label} 
            available={tabs[activeTab].available}
          />
        </div>
      </div>

      {/* FOOTER DE INTEGRAÇÃO */}
      <div style={{
        marginTop: '32px',
        padding: '20px',
        backgroundColor: '#f0f9ff',
        border: '1px solid #bae6fd',
        borderRadius: '12px',
        textAlign: 'center' as const
      }}>
        <h4 style={{color: '#0369a1', marginBottom: '8px'}}>
          🔗 Integração Supabase → Análises Funcionando!
        </h4>
        <p style={{color: '#0369a1', fontSize: '14px', margin: 0}}>
          Dados carregados em tempo real do seu onboarding. 
          Próximo passo: conectar com os componentes de análise visual que criamos.
        </p>
      </div>
    </div>
  );
};

export default RealAnalysisDashboard;