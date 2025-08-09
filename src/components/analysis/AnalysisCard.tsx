// components/analysis/AnalysisCard.tsx
import React from 'react';
import { CheckCircle, ChevronRight, Lock, Clock } from 'lucide-react';

export type AnalysisStatus = 'locked' | 'available' | 'complete';

export interface AnalysisItem {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  estimatedTime: string;
  description: string;
  status: AnalysisStatus;
  completedAt?: Date;
  progress?: number; // 0-100 para análises em andamento
}

interface AnalysisCardProps {
  analysis: AnalysisItem;
  onClick: () => void;
  className?: string;
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({ 
  analysis, 
  onClick, 
  className = '' 
}) => {
  const getStatusColor = () => {
    switch (analysis.status) {
      case 'complete': 
        return 'bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700';
      case 'available': 
        return 'bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700';
      case 'locked': 
        return 'bg-gradient-to-br from-gray-400 to-gray-500';
    }
  };

  const getStatusIcon = () => {
    switch (analysis.status) {
      case 'complete': 
        return <CheckCircle className="w-6 h-6 text-white" />;
      case 'available': 
        return <ChevronRight className="w-6 h-6 text-white" />;
      case 'locked': 
        return <Lock className="w-6 h-6 text-white/70" />;
    }
  };

  const getStatusText = () => {
    switch (analysis.status) {
      case 'complete': return 'Concluído';
      case 'available': return 'Disponível';
      case 'locked': return 'Bloqueado';
    }
  };

  const getButtonText = () => {
    switch (analysis.status) {
      case 'complete': return 'Revisar';
      case 'available': return 'Iniciar';
      case 'locked': return 'Bloqueado';
    }
  };

  const isClickable = analysis.status !== 'locked';

  return (
    <div 
      className={`
        relative overflow-hidden rounded-2xl cursor-pointer transform transition-all duration-300
        ${analysis.status === 'locked' 
          ? 'opacity-60 cursor-not-allowed' 
          : 'hover:scale-[1.02] hover:shadow-2xl'
        }
        ${getStatusColor()}
        ${className}
      `}
      onClick={isClickable ? onClick : undefined}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12" />
        <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 opacity-50" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-6">
        
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">{analysis.emoji}</div>
            <div>
              <h3 className="text-xl font-bold text-white leading-tight">{analysis.title}</h3>
              <p className="text-white/80 text-sm">{analysis.subtitle}</p>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            {getStatusIcon()}
            <span className={`
              px-2 py-1 rounded-full text-xs font-medium
              ${analysis.status === 'complete' 
                ? 'bg-white/20 text-white' 
                : analysis.status === 'available'
                ? 'bg-white/20 text-white'
                : 'bg-black/20 text-white/70'
              }
            `}>
              {getStatusText()}
            </span>
          </div>
        </div>

        {/* Progress Bar (para análises em andamento) */}
        {analysis.progress !== undefined && analysis.progress > 0 && analysis.progress < 100 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-white/80 text-xs">Progresso</span>
              <span className="text-white text-xs font-medium">{analysis.progress}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${analysis.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Description */}
        <p className="text-white/90 text-sm mb-6 leading-relaxed">
          {analysis.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-white/70" />
            <span className="text-white/70 text-sm">{analysis.estimatedTime}</span>
          </div>
          
          <button 
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${isClickable 
                ? 'bg-white/20 text-white hover:bg-white/30 active:scale-95' 
                : 'bg-black/10 text-white/50 cursor-not-allowed'
              }
            `}
            disabled={!isClickable}
          >
            {getButtonText()}
          </button>
        </div>

        {/* Completed Info */}
        {analysis.completedAt && (
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="flex items-center justify-between">
              <p className="text-white/60 text-xs">
                Concluído em {analysis.completedAt.toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })}
              </p>
              <div className="flex items-center space-x-1">
                <CheckCircle className="w-3 h-3 text-white/60" />
                <span className="text-white/60 text-xs">Completo</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hover Effect */}
      {isClickable && (
        <div className="absolute inset-0 bg-white/0 hover:bg-white/5 transition-all duration-300" />
      )}

      {/* Click Ripple Effect */}
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full animate-pulse" />
      </div>
    </div>
  );
};

export default AnalysisCard;