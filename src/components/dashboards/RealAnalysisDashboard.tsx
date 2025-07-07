// src/components/dashboards/RealAnalysisDashboard.tsx

import React, { useState } from 'react';
// CORREÇÃO: Import como default export
import useUserDataForAnalysis from '../../services/dataMapperService';

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
    analysisGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '24px',
      marginBottom: '32px'
    },
    analysisCard: {
      padding: '24px',
      backgroundColor: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: '16px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.2s ease-in-out'
    },
    cardHeader: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '16px'
    },
    cardIcon: {
      width: '48px',
      height: '48px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: '16px',
      fontSize: '24px'
    },
    cardTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '4px'
    },
    cardSubtitle: {
      fontSize: '14px',
      color: '#6b7280'
    },
    statusBadge: {
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '500',
      marginBottom: '12px'
    },
    availableBadge: {
      backgroundColor: '#d1fae5',
      color: '#065f46'
    },
    unavailableBadge: {
      backgroundColor: '#fee2e2',
      color: '#991b1b'
    },
    cardDescription: {
      color: '#6b7280',
      lineHeight: '1.5',
      marginBottom: '16px'
    },
    cardButton: {
      width: '100%',
      padding: '12px 16px',
      borderRadius: '8px',
      border: 'none',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out'
    },
    enabledButton: {
      backgroundColor: '#3b82f6',
      color: 'white'
    },
    disabledButton: {
      backgroundColor: '#f3f4f6',
      color: '#9ca3af',
      cursor: 'not-allowed'
    }
  };

  // 🎨 DADOS DAS ANÁLISES
  const analysisCards = [
    {
      id: 'traditions',
      title: 'Tradições Ancestrais',
      subtitle: 'Astrologia + Numerologia + Medicina Chinesa',
      icon: '🌟',
      iconBg: '#fef3c7',
      description: 'Análise completa baseada em astrologia ocidental, chinesa e numerologia para descobrir seu propósito de vida.',
      available: availability.traditions,
      requiredData: 'Data, hora e local de nascimento'
    },
    {
      id: 'biohacking',
      title: 'Biohacking Personalizado',
      subtitle: 'Otimização Corporal + Mental',
      icon: '💪',
      iconBg: '#dbeafe',
      description: 'Protocolos personalizados de sono, alimentação, exercício e suplementação baseados no seu perfil.',
      available: availability.biohacking,
      requiredData: 'Dados de estilo de vida e saúde'
    },
    {
      id: 'psychological',
      title: 'Perfil Psicológico',
      subtitle: 'Big Five + DISC + VARK + MTC',
      icon: '🧠',
      iconBg: '#ede9fe',
      description: '104 questões científicas para mapear sua personalidade e estilo cognitivo completo.',
      available: availability.psychological,
      requiredData: 'Questionário psicológico completo'
    },
    {
      id: 'cognitive',
      title: 'Análise Cognitiva',
      subtitle: 'Inteligências + Processamento + Criatividade',
      icon: '⚡',
      iconBg: '#ecfdf5',
      description: 'Avaliação detalhada das suas capacidades cognitivas e estratégias de aprendizagem.',
      available: availability.cognitive,
      requiredData: 'Testes cognitivos e de inteligência'
    }
  ];

  // 🔄 ESTADOS DE CARREGAMENTO E ERRO
  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <h3 style={{ color: '#374151', marginBottom: '8px' }}>Carregando suas análises...</h3>
          <p style={{ color: '#6b7280' }}>Buscando seus dados para gerar insights personalizados</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <h3 style={{ marginBottom: '8px' }}>Erro ao carregar dados</h3>
          <p style={{ marginBottom: '16px' }}>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '8px 16px',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Suas Análises Personalizadas</h1>
        <p style={styles.subtitle}>
          Explore insights únicos baseados nos seus dados pessoais, de nascimento e perfil psicológico.
          Cada análise revela aspectos diferentes da sua jornada de autoconhecimento.
        </p>
      </div>

      {/* Card do Usuário */}
      {userData && (
        <div style={styles.userCard}>
          <h3 style={{ color: '#1f2937', marginBottom: '8px' }}>
            👋 Olá, {userData.personal?.name || 'Explorador'}!
          </h3>
          <p style={{ color: '#6b7280', margin: 0 }}>
            {userData.birth?.date 
              ? `Nascido em ${userData.birth.date} em ${userData.birth.place || 'local não especificado'}`
              : 'Complete seus dados de nascimento para unlock mais análises'
            }
          </p>
        </div>
      )}

      {/* Grid de Análises */}
      <div style={styles.analysisGrid}>
        {analysisCards.map((card) => (
          <div 
            key={card.id} 
            style={{
              ...styles.analysisCard,
              ...(card.available ? {} : { opacity: 0.7 })
            }}
          >
            {/* Header do Card */}
            <div style={styles.cardHeader}>
              <div 
                style={{
                  ...styles.cardIcon,
                  backgroundColor: card.iconBg
                }}
              >
                {card.icon}
              </div>
              <div>
                <h3 style={styles.cardTitle}>{card.title}</h3>
                <p style={styles.cardSubtitle}>{card.subtitle}</p>
              </div>
            </div>

            {/* Status Badge */}
            <span 
              style={{
                ...styles.statusBadge,
                ...(card.available ? styles.availableBadge : styles.unavailableBadge)
              }}
            >
              {card.available ? 'Disponível' : 'Dados Insuficientes'}
            </span>

            {/* Descrição */}
            <p style={styles.cardDescription}>{card.description}</p>

            {!card.available && (
              <p style={{ 
                fontSize: '12px', 
                color: '#f59e0b', 
                marginBottom: '16px',
                fontStyle: 'italic'
              }}>
                Necessário: {card.requiredData}
              </p>
            )}

            {/* Botão de Ação */}
            <button 
              style={{
                ...styles.cardButton,
                ...(card.available ? styles.enabledButton : styles.disabledButton)
              }}
              disabled={!card.available}
              onClick={() => {
                if (card.available) {
                  console.log(`Abrindo análise: ${card.id}`);
                  // Aqui você pode navegar para a página específica da análise
                }
              }}
            >
              {card.available ? 'Ver Análise' : 'Completar Dados'}
            </button>
          </div>
        ))}
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default RealAnalysisDashboard;