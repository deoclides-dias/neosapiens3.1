// src/components/onboarding/steps/BiohackingStep1.tsx - Dados Físicos

import React, { useState, useEffect } from 'react';
import { 
  Scale, 
  Ruler, 
  Target, 
  User, 
  TrendingUp, 
  AlertCircle,
  Info,
  CheckCircle
} from 'lucide-react';
import { BiohackingData } from '../../../types/biohacking';

interface BiohackingStep1Props {
  data: BiohackingData;
  onUpdate: (updates: Partial<BiohackingData>) => void;
  onValidationChange: (isValid: boolean) => void;
}

const BiohackingStep1: React.FC<BiohackingStep1Props> = ({
  data,
  onUpdate,
  onValidationChange
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [insights, setInsights] = useState<{
    bmi?: number;
    bmiCategory?: string;
    weightGoal?: string;
    bodyTypeDescription?: string;
  }>({});

  // 🎯 OPÇÕES DE BIOTIPO
  const bodyTypes = [
    {
      value: 'ectomorph',
      label: 'Ectomorfo',
      description: 'Naturalmente magro, metabolismo rápido, dificuldade para ganhar peso',
      characteristics: ['Membros longos', 'Ombros estreitos', 'Pouca gordura corporal', 'Metabolismo acelerado']
    },
    {
      value: 'mesomorph',
      label: 'Mesomorfo',
      description: 'Construção atlética natural, ganha músculo facilmente',
      characteristics: ['Ombros largos', 'Cintura fina', 'Ganha músculo facilmente', 'Estrutura óssea média']
    },
    {
      value: 'endomorph',
      label: 'Endomorfo',
      description: 'Tendência a ganhar peso, metabolismo mais lento',
      characteristics: ['Estrutura mais arredondada', 'Metabolismo lento', 'Ganha peso facilmente', 'Ombros e quadris largos']
    },
    {
      value: 'mixed',
      label: 'Misto',
      description: 'Combinação de características dos tipos acima',
      characteristics: ['Características variadas', 'Pode mudar com treino', 'Resposta individual', 'Adaptação flexível']
    }
  ];

  const weightChangeOptions = [
    { value: 'gain', label: 'Ganho de peso' },
    { value: 'loss', label: 'Perda de peso' },
    { value: 'stable', label: 'Peso estável' },
    { value: 'fluctuating', label: 'Peso oscilante' }
  ];

  const easyChangeOptions = [
    { value: 'gain', label: 'Ganho facilmente' },
    { value: 'loss', label: 'Perco facilmente' },
    { value: 'both', label: 'Ambos facilmente' },
    { value: 'neither', label: 'Nenhum dos dois' }
  ];

  const weightConcerns = [
    'Ganho de peso não intencional',
    'Dificuldade para perder peso',
    'Dificuldade para ganhar peso',
    'Peso oscila muito',
    'Retenção de líquidos',
    'Distribuição de gordura corporal',
    'Perda de massa muscular',
    'Metabolismo lento',
    'Compulsão alimentar',
    'Nenhuma preocupação específica'
  ];

  // 🔧 FUNÇÕES UTILITÁRIAS
  const calculateBMI = (height: number, weight: number): number => {
    if (height > 0 && weight > 0) {
      const heightInMeters = height / 100;
      return weight / (heightInMeters * heightInMeters);
    }
    return 0;
  };

  const getBMICategory = (bmi: number): string => {
    if (bmi < 18.5) return 'Abaixo do peso';
    if (bmi < 25) return 'Peso normal';
    if (bmi < 30) return 'Sobrepeso';
    return 'Obesidade';
  };

  const getWeightGoalAdvice = (current: number, desired: number, height: number): string => {
    const difference = Math.abs(current - desired);
    const percentChange = (difference / current) * 100;
    
    if (difference < 2) return 'Meta de manutenção - foco na composição corporal';
    if (percentChange < 10) return 'Meta moderada e realista';
    if (percentChange < 20) return 'Meta ambiciosa - considere etapas intermediárias';
    return 'Meta muito ambiciosa - recomenda-se acompanhamento profissional';
  };

  // 🔧 VALIDAÇÃO E CÁLCULOS
  useEffect(() => {
    const newErrors: Record<string, string> = {};
    
    // Validações
    if (data.anthropometric.height <= 0 || data.anthropometric.height > 250) {
      newErrors.height = 'Altura deve estar entre 1 e 250 cm';
    }
    if (data.anthropometric.currentWeight <= 0 || data.anthropometric.currentWeight > 300) {
      newErrors.currentWeight = 'Peso atual deve estar entre 1 e 300 kg';
    }
    if (data.anthropometric.desiredWeight <= 0 || data.anthropometric.desiredWeight > 300) {
      newErrors.desiredWeight = 'Peso desejado deve estar entre 1 e 300 kg';
    }

    setErrors(newErrors);

    // Calcular insights
    const bmi = calculateBMI(data.anthropometric.height, data.anthropometric.currentWeight);
    const bmiCategory = getBMICategory(bmi);
    const weightGoal = getWeightGoalAdvice(
      data.anthropometric.currentWeight, 
      data.anthropometric.desiredWeight, 
      data.anthropometric.height
    );
    const bodyTypeDescription = bodyTypes.find(bt => bt.value === data.anthropometric.bodyType)?.description || '';

    setInsights({ bmi, bmiCategory, weightGoal, bodyTypeDescription });

    // Validação geral
    const isValid = Object.keys(newErrors).length === 0 && 
                   data.anthropometric.height > 0 && 
                   data.anthropometric.currentWeight > 0 && 
                   data.anthropometric.desiredWeight > 0;
    
    onValidationChange(isValid);
  }, [data.anthropometric, onValidationChange]);

  // 🔧 HANDLERS
  const updateAnthropometric = (field: string, value: any) => {
    onUpdate({
      anthropometric: {
        ...data.anthropometric,
        [field]: value
      }
    });
  };

  const updateWeightHistory = (field: string, value: any) => {
    onUpdate({
      anthropometric: {
        ...data.anthropometric,
        weightHistory: {
          ...data.anthropometric.weightHistory,
          [field]: value
        }
      }
    });
  };

  const toggleWeightConcern = (concern: string) => {
    const concerns = data.anthropometric.weightHistory.weightConcerns;
    const newConcerns = concerns.includes(concern)
      ? concerns.filter(c => c !== concern)
      : [...concerns, concern];
    
    updateWeightHistory('weightConcerns', newConcerns);
  };

  return (
    <div className="space-y-8">
      {/* Dados Básicos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Altura */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Ruler className="w-4 h-4" />
            Altura (cm)
          </label>
          <input
            type="number"
            value={data.anthropometric.height || ''}
            onChange={(e) => updateAnthropometric('height', parseFloat(e.target.value) || 0)}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.height ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="170"
            min="1"
            max="250"
          />
          {errors.height && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.height}
            </p>
          )}
        </div>

        {/* Peso Atual */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Scale className="w-4 h-4" />
            Peso Atual (kg)
          </label>
          <input
            type="number"
            step="0.1"
            value={data.anthropometric.currentWeight || ''}
            onChange={(e) => updateAnthropometric('currentWeight', parseFloat(e.target.value) || 0)}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.currentWeight ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="70.0"
            min="1"
            max="300"
          />
          {errors.currentWeight && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.currentWeight}
            </p>
          )}
        </div>

        {/* Peso Desejado */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Target className="w-4 h-4" />
            Peso Desejado (kg)
          </label>
          <input
            type="number"
            step="0.1"
            value={data.anthropometric.desiredWeight || ''}
            onChange={(e) => updateAnthropometric('desiredWeight', parseFloat(e.target.value) || 0)}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.desiredWeight ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="68.0"
            min="1"
            max="300"
          />
          {errors.desiredWeight && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.desiredWeight}
            </p>
          )}
        </div>
      </div>

      {/* Insights BMI */}
      {insights.bmi && insights.bmi > 0 && (
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="font-medium text-blue-900">Análise Antropométrica</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-blue-700">IMC:</span>
              <span className="ml-2 font-medium">{insights.bmi.toFixed(1)} ({insights.bmiCategory})</span>
            </div>
            <div>
              <span className="text-blue-700">Meta de peso:</span>
              <span className="ml-2 font-medium">{insights.weightGoal}</span>
            </div>
          </div>
        </div>
      )}

      {/* Dados Opcionais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Circunferência da Cintura */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Circunferência da Cintura (cm) - Opcional
          </label>
          <input
            type="number"
            value={data.anthropometric.waistCircumference || ''}
            onChange={(e) => updateAnthropometric('waistCircumference', parseFloat(e.target.value) || undefined)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="80"
            min="1"
            max="200"
          />
          <p className="mt-1 text-xs text-gray-500">
            💡 Medida importante para avaliação de risco cardiovascular
          </p>
        </div>

        {/* Percentual de Gordura */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Percentual de Gordura Corporal (%) - Opcional
          </label>
          <input
            type="number"
            step="0.1"
            value={data.anthropometric.bodyFatPercentage || ''}
            onChange={(e) => updateAnthropometric('bodyFatPercentage', parseFloat(e.target.value) || undefined)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="15.0"
            min="1"
            max="50"
          />
          <p className="mt-1 text-xs text-gray-500">
            💡 Se você tem esse dado (bioimpedância, DEXA, etc.)
          </p>
        </div>
      </div>

      {/* Biotipo Corporal */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
          <User className="w-4 h-4" />
          Biotipo Corporal
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bodyTypes.map((type) => (
            <div
              key={type.value}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                data.anthropometric.bodyType === type.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => updateAnthropometric('bodyType', type.value)}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-4 h-4 rounded-full border-2 ${
                  data.anthropometric.bodyType === type.value
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}>
                  {data.anthropometric.bodyType === type.value && (
                    <CheckCircle className="w-3 h-3 text-white" />
                  )}
                </div>
                <h4 className="font-medium text-gray-900">{type.label}</h4>
              </div>
              <p className="text-sm text-gray-600 mb-2">{type.description}</p>
              <ul className="text-xs text-gray-500 space-y-1">
                {type.characteristics.map((char, index) => (
                  <li key={index} className="flex items-center gap-1">
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    {char}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Histórico de Peso */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Histórico e Padrões de Peso
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pesos Históricos */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Maior peso já atingido (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={data.anthropometric.weightHistory.maxWeight || ''}
                onChange={(e) => updateWeightHistory('maxWeight', parseFloat(e.target.value) || 0)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="75.0"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Menor peso na vida adulta (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={data.anthropometric.weightHistory.minAdultWeight || ''}
                onChange={(e) => updateWeightHistory('minAdultWeight', parseFloat(e.target.value) || 0)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="60.0"
              />
            </div>
          </div>

          {/* Padrões de Mudança */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Mudanças recentes no peso
              </label>
              <select
                value={data.anthropometric.weightHistory.recentWeightChanges}
                onChange={(e) => updateWeightHistory('recentWeightChanges', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {weightChangeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Facilidade para mudanças de peso
              </label>
              <select
                value={data.anthropometric.weightHistory.easyWeightChange}
                onChange={(e) => updateWeightHistory('easyWeightChange', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {easyChangeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Preocupações com Peso */}
        <div className="mt-6">
          <label className="text-sm font-medium text-gray-700 mb-3 block">
            Preocupações relacionadas ao peso (selecione todas que se aplicam)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {weightConcerns.map((concern) => (
              <label
                key={concern}
                className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={data.anthropometric.weightHistory.weightConcerns.includes(concern)}
                  onChange={() => toggleWeightConcern(concern)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{concern}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Informações Científicas */}
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-blue-900 mb-2">Por que esses dados são importantes?</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>Composição corporal:</strong> Determina estratégias de nutrição e exercício</li>
              <li>• <strong>Biotipo:</strong> Influencia resposta a diferentes tipos de treinamento</li>
              <li>• <strong>Histórico de peso:</strong> Revela padrões metabólicos e hormonais</li>
              <li>• <strong>Circunferência da cintura:</strong> Indicador de risco cardiovascular</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiohackingStep1;