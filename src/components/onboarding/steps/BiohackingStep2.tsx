// src/components/onboarding/steps/BiohackingStep2.tsx - Sono & Energia

import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Moon, 
  Sun, 
  Battery, 
  Zap, 
  AlertCircle,
  Info,
  TrendingUp,
  Plus,
  X
} from 'lucide-react';
import { BiohackingData } from '../../../types/biohacking';

interface BiohackingStep2Props {
  data: BiohackingData;
  onUpdate: (updates: Partial<BiohackingData>) => void;
  onValidationChange: (isValid: boolean) => void;
}

const BiohackingStep2: React.FC<BiohackingStep2Props> = ({
  data,
  onUpdate,
  onValidationChange
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [insights, setInsights] = useState<{
    sleepEfficiency?: number;
    chronotypeDescription?: string;
    energyPattern?: string;
    recommendations?: string[];
  }>({});

  // 🎯 OPÇÕES DE CRONÓTIPO
  const chronotypes = [
    {
      value: 'morning',
      label: 'Matutino (Cotovia)',
      description: 'Acorda cedo naturalmente, mais produtivo pela manhã',
      characteristics: ['Acorda entre 5h-7h', 'Pico de energia manhã/início da tarde', 'Dorme entre 21h-23h', 'Mais alerta pela manhã']
    },
    {
      value: 'evening',
      label: 'Vespertino (Coruja)',
      description: 'Prefere dormir e acordar tarde, mais produtivo à noite',
      characteristics: ['Acorda após 8h', 'Pico de energia final da tarde/noite', 'Dorme após 23h', 'Mais alerta à noite']
    },
    {
      value: 'intermediate',
      label: 'Intermediário',
      description: 'Horários flexíveis, adapta-se a diferentes rotinas',
      characteristics: ['Horários variáveis', 'Picos de energia distribuídos', 'Adapta-se facilmente', 'Flexibilidade circadiana']
    }
  ];

  // 🎯 PROBLEMAS DE SONO
  const sleepIssuesOptions = [
    'Dificuldade para adormecer',
    'Despertares frequentes durante a noite',
    'Despertar muito cedo',
    'Sono não reparador',
    'Pesadelos frequentes',
    'Ronco ou apneia do sono',
    'Síndrome das pernas inquietas',
    'Sonambulismo',
    'Insônia relacionada ao estresse',
    'Sonolência diurna excessiva',
    'Jet lag ou trabalho em turnos',
    'Nenhum problema específico'
  ];

  // 🎯 AUXÍLIOS PARA DORMIR
  const naturalSupplementsOptions = [
    'Melatonina', 'Valeriana', 'Camomila', 'Magnésio', 'L-teanina', 
    'GABA', 'Ashwagandha', 'Passiflora', 'Melissa', 'Triptofano', 'Outro'
  ];

  const prescriptionMedsOptions = [
    'Zolpidem', 'Zopiclone', 'Diazepam', 'Lorazepam', 'Clonazepam', 
    'Trazodona', 'Mirtazapina', 'Quetiapina', 'Outro'
  ];

  const otherAidsOptions = [
    'Máscara para olhos', 'Tampões de ouvido', 'Ruído branco', 'Aromaterapia', 
    'Chá relaxante', 'Aplicativo de meditação', 'Leitura', 'Música relaxante', 
    'Banho quente', 'Alongamento/yoga', 'Outro'
  ];

  // 🔧 FUNÇÕES UTILITÁRIAS
  const calculateSleepEfficiency = (duration: number, quality: number): number => {
    // Fórmula baseada em duração ideal (7-9h) e qualidade (1-5)
    const idealDuration = 8;
    const durationScore = Math.max(0, 100 - Math.abs(duration - idealDuration) * 10);
    const qualityScore = (quality / 5) * 100;
    return Math.round((durationScore + qualityScore) / 2);
  };

  const getChronotypeDescription = (chronotype: string): string => {
    const type = chronotypes.find(ct => ct.value === chronotype);
    return type?.description || '';
  };

  const analyzeEnergyPattern = (levels: { morning: number; afternoon: number; evening: number }): string => {
    const { morning, afternoon, evening } = levels;
    const max = Math.max(morning, afternoon, evening);
    
    if (morning === max && morning > afternoon && morning > evening) {
      return 'Padrão matutino - energia decresce ao longo do dia';
    }
    if (evening === max && evening > morning && evening > afternoon) {
      return 'Padrão vespertino - energia aumenta ao longo do dia';
    }
    if (afternoon === max) {
      return 'Padrão bifásico - pico no meio do dia';
    }
    return 'Padrão irregular - energia varia sem padrão claro';
  };

  const generateRecommendations = (sleepData: any): string[] => {
    const recommendations: string[] = [];
    
    if (sleepData.averageSleepDuration < 7) {
      recommendations.push('Aumentar duração do sono para 7-9 horas');
    }
    if (sleepData.sleepQuality < 3) {
      recommendations.push('Melhorar higiene do sono e ambiente');
    }
    if (sleepData.sleepIssues.length > 2) {
      recommendations.push('Considerar avaliação com especialista em sono');
    }
    if (sleepData.energyLevels.morning < 3 && sleepData.chronotype === 'morning') {
      recommendations.push('Revisar horários de sono para otimizar cronótipo');
    }
    
    return recommendations;
  };

  // 🔧 VALIDAÇÃO E CÁLCULOS
  useEffect(() => {
    const newErrors: Record<string, string> = {};
    
    // Validações
    if (data.sleep.averageSleepDuration < 1 || data.sleep.averageSleepDuration > 12) {
      newErrors.averageSleepDuration = 'Duração do sono deve estar entre 1 e 12 horas';
    }
    
    // Validar formato de horários
    const timePattern = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timePattern.test(data.sleep.bedtime)) {
      newErrors.bedtime = 'Formato inválido (use HH:MM)';
    }
    if (!timePattern.test(data.sleep.wakeTime)) {
      newErrors.wakeTime = 'Formato inválido (use HH:MM)';
    }

    setErrors(newErrors);

    // Calcular insights
    const sleepEfficiency = calculateSleepEfficiency(data.sleep.averageSleepDuration, data.sleep.sleepQuality);
    const chronotypeDescription = getChronotypeDescription(data.sleep.chronotype);
    const energyPattern = analyzeEnergyPattern(data.sleep.energyLevels);
    const recommendations = generateRecommendations(data.sleep);

    setInsights({ sleepEfficiency, chronotypeDescription, energyPattern, recommendations });

    // Validação geral
    const isValid = Object.keys(newErrors).length === 0 && 
                   data.sleep.averageSleepDuration > 0;
    
    onValidationChange(isValid);
  }, [data.sleep, onValidationChange]);

  // 🔧 HANDLERS
  const updateSleep = (field: string, value: any) => {
    onUpdate({
      sleep: {
        ...data.sleep,
        [field]: value
      }
    });
  };

  const updateEnergyLevels = (period: string, value: number) => {
    onUpdate({
      sleep: {
        ...data.sleep,
        energyLevels: {
          ...data.sleep.energyLevels,
          [period]: value
        }
      }
    });
  };

  const updateSleepAids = (category: string, value: string[]) => {
    onUpdate({
      sleep: {
        ...data.sleep,
        sleepAids: {
          ...data.sleep.sleepAids,
          [category]: value
        }
      }
    });
  };

  const toggleSleepIssue = (issue: string) => {
    const issues = data.sleep.sleepIssues;
    const newIssues = issues.includes(issue)
      ? issues.filter(i => i !== issue)
      : [...issues, issue];
    
    updateSleep('sleepIssues', newIssues);
  };

  const addCustomSleepAid = (category: string, customValue: string) => {
    if (customValue.trim()) {
      const currentAids = data.sleep.sleepAids[category as keyof typeof data.sleep.sleepAids];
      updateSleepAids(category, [...currentAids, customValue.trim()]);
    }
  };

  const removeSleepAid = (category: string, aid: string) => {
    const currentAids = data.sleep.sleepAids[category as keyof typeof data.sleep.sleepAids];
    updateSleepAids(category, currentAids.filter(a => a !== aid));
  };

  return (
    <div className="space-y-8">
      {/* Padrões de Sono Básicos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Duração do Sono */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Clock className="w-4 h-4" />
            Horas de sono por noite
          </label>
          <input
            type="number"
            step="0.5"
            value={data.sleep.averageSleepDuration || ''}
            onChange={(e) => updateSleep('averageSleepDuration', parseFloat(e.target.value) || 0)}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.bedtime ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.bedtime && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.bedtime}
            </p>
          )}
        </div>

        {/* Horário de Acordar */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Sun className="w-4 h-4" />
            Horário habitual de acordar
          </label>
          <input
            type="time"
            value={data.sleep.wakeTime}
            onChange={(e) => updateSleep('wakeTime', e.target.value)}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.wakeTime ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.wakeTime && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.wakeTime}
            </p>
          )}
        </div>
      </div>

      {/* Qualidade do Sono */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-3 block">
          Qualidade geral do sono
        </label>
        <div className="flex items-center gap-4">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              onClick={() => updateSleep('sleepQuality', value)}
              className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all ${
                data.sleep.sleepQuality === value
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

      {/* Cronótipo */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-3 block">
          Seu cronótipo natural
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {chronotypes.map((type) => (
            <div
              key={type.value}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                data.sleep.chronotype === type.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => updateSleep('chronotype', type.value)}
            >
              <h4 className="font-medium text-gray-900 mb-2">{type.label}</h4>
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

      {/* Níveis de Energia */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
          <Battery className="w-5 h-5" />
          Níveis de Energia ao Longo do Dia
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Manhã */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Energia pela manhã (6h-12h)
            </label>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() => updateEnergyLevels('morning', value)}
                  className={`w-full p-2 rounded border text-sm transition-all ${
                    data.sleep.energyLevels.morning === value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {value} - {['Muito baixa', 'Baixa', 'Moderada', 'Alta', 'Muito alta'][value - 1]}
                </button>
              ))}
            </div>
          </div>

          {/* Tarde */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Energia à tarde (12h-18h)
            </label>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() => updateEnergyLevels('afternoon', value)}
                  className={`w-full p-2 rounded border text-sm transition-all ${
                    data.sleep.energyLevels.afternoon === value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {value} - {['Muito baixa', 'Baixa', 'Moderada', 'Alta', 'Muito alta'][value - 1]}
                </button>
              ))}
            </div>
          </div>

          {/* Noite */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Energia à noite (18h-22h)
            </label>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() => updateEnergyLevels('evening', value)}
                  className={`w-full p-2 rounded border text-sm transition-all ${
                    data.sleep.energyLevels.evening === value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {value} - {['Muito baixa', 'Baixa', 'Moderada', 'Alta', 'Muito alta'][value - 1]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Insights de Sono */}
      {insights.sleepEfficiency && (
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="font-medium text-blue-900">Análise do Padrão de Sono</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-blue-700">Eficiência do sono:</span>
              <span className="ml-2 font-medium">{insights.sleepEfficiency}%</span>
            </div>
            <div>
              <span className="text-blue-700">Padrão energético:</span>
              <span className="ml-2 font-medium">{insights.energyPattern}</span>
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

      {/* Problemas de Sono */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-3 block">
          Problemas de sono (selecione todos que se aplicam)
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {sleepIssuesOptions.map((issue) => (
            <label
              key={issue}
              className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={data.sleep.sleepIssues.includes(issue)}
                onChange={() => toggleSleepIssue(issue)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{issue}</span>
            </label>
          ))}
        </div>
      </div>

            // src/components/onboarding/steps/BiohackingStep2.tsx - PARTE FINAL (COMPLEMENTO)
// =====================================================================================
// ADICIONAR ESTA PARTE NO FINAL DO BiohackingStep2.tsx (antes do export)
// =====================================================================================

      {/* Auxílios para Dormir - CONTINUAÇÃO */}
      <div className="space-y-6">
        <h3 className="font-medium text-gray-900">Auxílios para dormir que você usa</h3>
        
        {/* Suplementos Naturais */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Suplementos naturais
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {data.sleep.sleepAids.naturalSupplements.map((supplement, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
              >
                {supplement}
                <button
                  onClick={() => removeSleepAid('naturalSupplements', supplement)}
                  className="text-green-600 hover:text-green-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <select
            onChange={(e) => {
              if (e.target.value && !data.sleep.sleepAids.naturalSupplements.includes(e.target.value)) {
                updateSleepAids('naturalSupplements', [...data.sleep.sleepAids.naturalSupplements, e.target.value]);
                e.target.value = '';
              }
            }}
            className="w-full p-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="">Selecionar suplemento...</option>
            {naturalSupplementsOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        {/* Medicamentos Prescritos */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Medicamentos prescritos
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {data.sleep.sleepAids.prescriptionMeds.map((med, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
              >
                {med}
                <button
                  onClick={() => removeSleepAid('prescriptionMeds', med)}
                  className="text-orange-600 hover:text-orange-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <select
            onChange={(e) => {
              if (e.target.value && !data.sleep.sleepAids.prescriptionMeds.includes(e.target.value)) {
                updateSleepAids('prescriptionMeds', [...data.sleep.sleepAids.prescriptionMeds, e.target.value]);
                e.target.value = '';
              }
            }}
            className="w-full p-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="">Selecionar medicamento...</option>
            {prescriptionMedsOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        {/* Outros Auxílios */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Outros auxílios
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {data.sleep.sleepAids.other.map((aid, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {aid}
                <button
                  onClick={() => removeSleepAid('other', aid)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <select
            onChange={(e) => {
              if (e.target.value && !data.sleep.sleepAids.other.includes(e.target.value)) {
                updateSleepAids('other', [...data.sleep.sleepAids.other, e.target.value]);
                e.target.value = '';
              }
            }}
            className="w-full p-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="">Selecionar auxílio...</option>
            {otherAidsOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Insights de Sono */}
      {insights.sleepEfficiency && (
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="font-medium text-blue-900">Análise do Padrão de Sono</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-blue-700">Eficiência do sono:</span>
              <span className="ml-2 font-medium">{insights.sleepEfficiency}%</span>
            </div>
            <div>
              <span className="text-blue-700">Padrão energético:</span>
              <span className="ml-2 font-medium">{insights.energyPattern}</span>
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
            <h4 className="font-medium text-blue-900 mb-2">Ciência do Sono e Energia</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>Cronótipo:</strong> Determina seus horários ideais de produtividade e descanso</li>
              <li>• <strong>Ritmo circadiano:</strong> Afeta hormônios, temperatura corporal e metabolismo</li>
              <li>• <strong>Eficiência do sono:</strong> Qualidade é mais importante que quantidade</li>
              <li>• <strong>Padrões de energia:</strong> Revelam seu cronótipo natural e necessidades individuais</li>
              <li>• <strong>Melatonina:</strong> Hormônio natural que regula o ciclo sono-vigília</li>
              <li>• <strong>Temperatura corporal:</strong> Varia 1-2°C ao longo do dia, influenciando o sono</li>
              <li>• <strong>Adenosina:</strong> Acumula durante vigília e é eliminada durante o sono profundo</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Dicas Práticas */}
      <div className="bg-green-50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-green-900 mb-2">Dicas para Otimização do Sono</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-700">
              <ul className="space-y-1">
                <li>• Manter horários regulares mesmo nos fins de semana</li>
                <li>• Evitar cafeína 6-8 horas antes de dormir</li>
                <li>• Criar um ambiente escuro, fresco e silencioso</li>
                <li>• Exposição à luz solar pela manhã (15-30 min)</li>
              </ul>
              <ul className="space-y-1">
                <li>• Limitar telas 1-2 horas antes de dormir</li>
                <li>• Jantar leve pelo menos 3 horas antes do sono</li>
                <li>• Desenvolver uma rotina relaxante pré-sono</li>
                <li>• Exercitar-se regularmente, mas não à noite</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Cronótipo Detalhado */}
      <div className="bg-purple-50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Sun className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-purple-900 mb-2">Entendendo Seu Cronótipo</h4>
            <div className="text-sm text-purple-700 space-y-2">
              <p><strong>Seu cronótipo atual:</strong> {data.sleep.chronotype === 'morning' ? 'Matutino (Cotovia)' : data.sleep.chronotype === 'evening' ? 'Vespertino (Coruja)' : 'Intermediário'}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <div>
                  <p className="font-medium">Horários ideais para:</p>
                  <ul className="mt-1 space-y-1">
                    <li>• Trabalho mental: {data.sleep.chronotype === 'morning' ? '8h-12h' : data.sleep.chronotype === 'evening' ? '18h-22h' : '10h-14h'}</li>
                    <li>• Exercícios: {data.sleep.chronotype === 'morning' ? '6h-8h' : data.sleep.chronotype === 'evening' ? '18h-20h' : '16h-18h'}</li>
                    <li>• Decisões importantes: {data.sleep.chronotype === 'morning' ? '9h-11h' : data.sleep.chronotype === 'evening' ? '19h-21h' : '11h-15h'}</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium">Dicas específicas:</p>
                  <ul className="mt-1 space-y-1">
                    {data.sleep.chronotype === 'morning' && (
                      <>
                        <li>• Aproveite a manhã para tarefas complexas</li>
                        <li>• Evite compromissos noturnos importantes</li>
                        <li>• Durma mais cedo para manter o padrão</li>
                      </>
                    )}
                    {data.sleep.chronotype === 'evening' && (
                      <>
                        <li>• Reserve manhãs para tarefas automáticas</li>
                        <li>• Use luz artificial para acordar</li>
                        <li>• Limite cafeína ainda mais cedo</li>
                      </>
                    )}
                    {data.sleep.chronotype === 'intermediate' && (
                      <>
                        <li>• Flexibilidade é sua vantagem</li>
                        <li>• Adapte-se conforme necessário</li>
                        <li>• Mantenha consistência quando possível</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



export default BiohackingStep2;