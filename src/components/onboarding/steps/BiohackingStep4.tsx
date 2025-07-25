// src/components/onboarding/steps/BiohackingStep4.tsx - Atividade Física

import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Dumbbell, 
  Activity, 
  Target, 
  TrendingUp,
  Info,
  Clock,
  Zap,
  Shield
} from 'lucide-react';
import { BiohackingData } from '../../../types/biohacking';

interface BiohackingStep4Props {
  data: BiohackingData;
  onUpdate: (updates: Partial<BiohackingData>) => void;
  onValidationChange: (isValid: boolean) => void;
}

const BiohackingStep4: React.FC<BiohackingStep4Props> = ({
  data,
  onUpdate,
  onValidationChange
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [insights, setInsights] = useState<{
    fitnessLevel?: string;
    weeklyVolume?: number;
    recoveryNeeds?: string;
    recommendations?: string[];
  }>({});

  // 🎯 INTENSIDADES DE EXERCÍCIO
  const intensityLevels = [
    {
      value: 'light',
      label: 'Leve',
      description: 'Caminhada, yoga suave, alongamento',
      characteristics: ['Pouco suor', 'Conversa normal', 'Relaxante']
    },
    {
      value: 'moderate',
      label: 'Moderado',
      description: 'Caminhada rápida, ciclismo recreativo, dança',
      characteristics: ['Suor moderado', 'Conversa possível', 'Energizante']
    },
    {
      value: 'vigorous',
      label: 'Vigoroso',
      description: 'Corrida, musculação intensa, esportes',
      characteristics: ['Suor abundante', 'Conversa difícil', 'Desafiador']
    },
    {
      value: 'high_intensity',
      label: 'Alta Intensidade',
      description: 'HIIT, crossfit, treino atlético',
      characteristics: ['Máximo esforço', 'Sem conversa', 'Exaustivo']
    }
  ];

  // 🎯 TIPOS DE ATIVIDADE
  const activityTypes = [
    'Caminhada', 'Corrida', 'Ciclismo', 'Natação', 'Musculação',
    'Yoga', 'Pilates', 'Dança', 'Artes marciais', 'Futebol',
    'Basquete', 'Tênis', 'Crossfit', 'Calistenia', 'Escalada',
    'Surf', 'Trilha', 'Remo', 'Spinning', 'Funcional'
  ];

  // 🎯 LIMITAÇÕES FÍSICAS
  const commonLimitations = [
    'Nenhuma limitação', 'Dores nas costas', 'Dores no joelho', 
    'Dores no ombro', 'Artrite', 'Lesão prévia', 'Problemas cardíacos',
    'Problemas respiratórios', 'Diabetes', 'Hipertensão', 'Outras'
  ];

  // 🎯 OBJETIVOS FITNESS
  const fitnessGoals = [
    'Perda de peso', 'Ganho de massa muscular', 'Melhora cardiovascular',
    'Aumento de força', 'Flexibilidade', 'Resistência', 'Reabilitação',
    'Performance esportiva', 'Bem-estar geral', 'Redução de estresse'
  ];

  // 🎯 MÉTODOS DE RECUPERAÇÃO
  const recoveryMethods = [
    'Sono adequado', 'Alongamento', 'Massagem', 'Sauna', 'Banho frio',
    'Meditação', 'Foam roller', 'Fisioterapia', 'Yoga restaurativa',
    'Hidroterapia', 'Suplementos', 'Descanso ativo'
  ];

  // 🔧 FUNÇÕES UTILITÁRIAS
  const calculateWeeklyVolume = (frequency: number, duration: number): number => {
    return frequency * duration;
  };

  const assessFitnessLevel = (frequency: number, intensity: string, functionalCapacity: number): string => {
    if (frequency === 0) return 'Sedentário';
    if (frequency <= 2 && intensity === 'light') return 'Iniciante';
    if (frequency <= 3 && (intensity === 'light' || intensity === 'moderate')) return 'Intermediário';
    if (frequency >= 4 && intensity === 'moderate') return 'Ativo';
    if (frequency >= 5 && (intensity === 'vigorous' || intensity === 'high_intensity')) return 'Avançado';
    return 'Intermediário';
  };

  const determineRecoveryNeeds = (frequency: number, intensity: string): string => {
    if (frequency >= 6 && intensity === 'high_intensity') return 'Alta necessidade de recuperação';
    if (frequency >= 4 && intensity === 'vigorous') return 'Recuperação moderada necessária';
    if (frequency <= 3) return 'Recuperação básica suficiente';
    return 'Recuperação moderada recomendada';
  };

  const generateFitnessRecommendations = (data: any): string[] => {
    const recommendations: string[] = [];
    const { weeklyFrequency, preferredIntensity, currentFitnessLevel, recovery } = data;
    
    if (weeklyFrequency === 0) {
      recommendations.push('Começar com 2-3 sessões leves por semana');
    }
    if (weeklyFrequency >= 6 && preferredIntensity === 'high_intensity') {
      recommendations.push('Incluir pelo menos 1-2 dias de recuperação ativa');
    }
    if (currentFitnessLevel <= 2 && preferredIntensity === 'vigorous') {
      recommendations.push('Progressão gradual para evitar lesões');
    }
    if (recovery.quality < 3) {
      recommendations.push('Focar em métodos de recuperação e qualidade do sono');
    }
    
    return recommendations;
  };

  // 🔧 VALIDAÇÃO E CÁLCULOS
  useEffect(() => {
    const newErrors: Record<string, string> = {};
    
    if (data.physicalActivity.weeklyFrequency < 0 || data.physicalActivity.weeklyFrequency > 14) {
      newErrors.weeklyFrequency = 'Frequência deve estar entre 0 e 14 vezes por semana';
    }
    if (data.physicalActivity.averageSessionDuration < 0 || data.physicalActivity.averageSessionDuration > 300) {
      newErrors.averageSessionDuration = 'Duração deve estar entre 0 e 300 minutos';
    }

    setErrors(newErrors);

    // Calcular insights
    const weeklyVolume = calculateWeeklyVolume(
      data.physicalActivity.weeklyFrequency, 
      data.physicalActivity.averageSessionDuration
    );
    const fitnessLevel = assessFitnessLevel(
      data.physicalActivity.weeklyFrequency,
      data.physicalActivity.preferredIntensity,
      data.physicalActivity.functionalCapacity
    );
    const recoveryNeeds = determineRecoveryNeeds(
      data.physicalActivity.weeklyFrequency,
      data.physicalActivity.preferredIntensity
    );
    const recommendations = generateFitnessRecommendations(data.physicalActivity);

    setInsights({ fitnessLevel, weeklyVolume, recoveryNeeds, recommendations });

    // Validação geral
    const isValid = Object.keys(newErrors).length === 0;
    onValidationChange(isValid);
  }, [data.physicalActivity, onValidationChange]);

  // 🔧 HANDLERS
  const updatePhysicalActivity = (field: string, value: any) => {
    onUpdate({
      physicalActivity: {
        ...data.physicalActivity,
        [field]: value
      }
    });
  };

  const updateRecovery = (field: string, value: any) => {
    onUpdate({
      physicalActivity: {
        ...data.physicalActivity,
        recovery: {
          ...data.physicalActivity.recovery,
          [field]: value
        }
      }
    });
  };

  const toggleArrayItem = (field: string, item: string) => {
    const currentArray = data.physicalActivity[field as keyof typeof data.physicalActivity] as string[];
    const newArray = currentArray.includes(item)
      ? currentArray.filter(i => i !== item)
      : [...currentArray, item];
    
    updatePhysicalActivity(field, newArray);
  };

  return (
    <div className="space-y-8">
      {/* Frequência e Duração */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Clock className="w-4 h-4" />
            Frequência semanal de exercícios
          </label>
          <input
            type="number"
            value={data.physicalActivity.weeklyFrequency || ''}
            onChange={(e) => updatePhysicalActivity('weeklyFrequency', parseInt(e.target.value) || 0)}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.weeklyFrequency ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="3"
            min="0"
            max="14"
          />
          <p className="mt-1 text-xs text-gray-500">Quantas vezes por semana você se exercita?</p>
          {errors.weeklyFrequency && (
            <p className="mt-1 text-sm text-red-600">{errors.weeklyFrequency}</p>
          )}
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Activity className="w-4 h-4" />
            Duração média por sessão (minutos)
          </label>
          <input
            type="number"
            value={data.physicalActivity.averageSessionDuration || ''}
            onChange={(e) => updatePhysicalActivity('averageSessionDuration', parseInt(e.target.value) || 0)}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.averageSessionDuration ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="45"
            min="0"
            max="300"
          />
          <p className="mt-1 text-xs text-gray-500">Tempo médio de cada treino</p>
          {errors.averageSessionDuration && (
            <p className="mt-1 text-sm text-red-600">{errors.averageSessionDuration}</p>
          )}
        </div>
      </div>

      {/* Intensidade Preferida */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-3 block">
          Intensidade preferida de exercício
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {intensityLevels.map((level) => (
            <div
              key={level.value}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                data.physicalActivity.preferredIntensity === level.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => updatePhysicalActivity('preferredIntensity', level.value)}
            >
              <h4 className="font-medium text-gray-900 mb-2">{level.label}</h4>
              <p className="text-sm text-gray-600 mb-2">{level.description}</p>
              <ul className="text-xs text-gray-500 space-y-1">
                {level.characteristics.map((char, index) => (
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

      {/* Tipos de Atividade */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
          <Dumbbell className="w-4 h-4" />
          Tipos de atividade que você pratica (selecione todos)
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {activityTypes.map((activity) => (
            <label
              key={activity}
              className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={data.physicalActivity.activityTypes.includes(activity)}
                onChange={() => toggleArrayItem('activityTypes', activity)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{activity}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Níveis de Capacidade */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-3 block">
            Nível de condicionamento atual
          </label>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                onClick={() => updatePhysicalActivity('currentFitnessLevel', value)}
                className={`w-full p-3 rounded border text-sm transition-all ${
                  data.physicalActivity.currentFitnessLevel === value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {value} - {['Sedentário', 'Iniciante', 'Intermediário', 'Ativo', 'Avançado'][value - 1]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-3 block">
            Capacidade funcional
          </label>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                onClick={() => updatePhysicalActivity('functionalCapacity', value)}
                className={`w-full p-3 rounded border text-sm transition-all ${
                  data.physicalActivity.functionalCapacity === value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {value} - {['Muito limitada', 'Limitada', 'Moderada', 'Boa', 'Excelente'][value - 1]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Limitações e Objetivos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <Shield className="w-4 h-4" />
            Limitações físicas
          </label>
          <div className="space-y-2">
            {commonLimitations.map((limitation) => (
              <label
                key={limitation}
                className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={data.physicalActivity.limitations.includes(limitation)}
                  onChange={() => toggleArrayItem('limitations', limitation)}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <span className="text-sm text-gray-700">{limitation}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <Target className="w-4 h-4" />
            Objetivos fitness
          </label>
          <div className="space-y-2">
            {fitnessGoals.map((goal) => (
              <label
                key={goal}
                className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={data.physicalActivity.goals.includes(goal)}
                  onChange={() => toggleArrayItem('goals', goal)}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">{goal}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Recuperação */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Recuperação e Regeneração
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Qualidade da recuperação pós-exercício
            </label>
            <div className="flex items-center gap-4">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() => updateRecovery('quality', value)}
                  className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all ${
                    data.physicalActivity.recovery.quality === value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-lg font-semibold">{value}</span>
                  <span className="text-xs text-center">
                    {value === 1 && 'Muito ruim'}
                    {value === 2 && 'Ruim'}
                    {value === 3 && 'Regular'}
                    {value === 4 && 'Bom'}
                    {value === 5 && 'Excelente'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Métodos de recuperação que você usa
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {recoveryMethods.map((method) => (
                <label
                  key={method}
                  className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={data.physicalActivity.recovery.methods.includes(method)}
                    onChange={() => {
                      const currentMethods = data.physicalActivity.recovery.methods;
                      const newMethods = currentMethods.includes(method)
                        ? currentMethods.filter(m => m !== method)
                        : [...currentMethods, method];
                      updateRecovery('methods', newMethods);
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{method}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Insights de Atividade Física */}
      {insights.fitnessLevel && (
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="font-medium text-blue-900">Análise de Atividade Física</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-blue-700">Nível de fitness:</span>
              <span className="ml-2 font-medium">{insights.fitnessLevel}</span>
            </div>
            <div>
              <span className="text-blue-700">Volume semanal:</span>
              <span className="ml-2 font-medium">{insights.weeklyVolume} min/semana</span>
            </div>
            <div>
              <span className="text-blue-700">Necessidade de recuperação:</span>
              <span className="ml-2 font-medium">{insights.recoveryNeeds}</span>
            </div>
          </div>
          {insights.recommendations && insights.recommendations.length > 0 && (
            <div className="mt-3">
              <span className="text-blue-700 font-medium">Recomendações:</span>
              <ul className="mt-1 space-y-1">
                {insights.recommendations.map((rec, index) => (
                  <li key={index} className="text-blue-600 text-sm flex items-center gap-1">
                    <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Informações Científicas */}
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-blue-900 mb-2">Ciência do Exercício e Performance</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>Frequência:</strong> Mínimo 150 min/semana moderado ou 75 min/semana vigoroso</li>
              <li>• <strong>Intensidade:</strong> Varia com objetivos - HIIT para cardio, força para hipertrofia</li>
              <li>• <strong>Recuperação:</strong> Tão importante quanto o treino para adaptações</li>
              <li>• <strong>Progressão:</strong> Aumento gradual de 10% na carga/volume por semana</li>
              <li>• <strong>Individualização:</strong> Considerar genética, histórico e limitações</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiohackingStep4;