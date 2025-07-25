// src/components/onboarding/steps/BiohackingStep3.tsx - Nutrição

import React, { useState, useEffect } from 'react';
import { 
  Apple, 
  Droplet, 
  Coffee, 
  Pill, 
  AlertTriangle, 
  TrendingUp,
  Info,
  Plus,
  X,
  Clock,
  Heart
} from 'lucide-react';
import { BiohackingData } from '../../../types/biohacking';

interface BiohackingStep3Props {
  data: BiohackingData;
  onUpdate: (updates: Partial<BiohackingData>) => void;
  onValidationChange: (isValid: boolean) => void;
}

const BiohackingStep3: React.FC<BiohackingStep3Props> = ({
  data,
  onUpdate,
  onValidationChange
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [insights, setInsights] = useState<{
    hydrationScore?: number;
    nutritionBalance?: string;
    metabolicType?: string;
    recommendations?: string[];
  }>({});

  // 🎯 PADRÕES ALIMENTARES
  const dietaryPatterns = [
    {
      value: 'omnivore',
      label: 'Onívoro',
      description: 'Come tanto alimentos vegetais quanto animais',
      benefits: ['Variedade nutricional', 'Facilidade social', 'Proteína completa']
    },
    {
      value: 'vegetarian',
      label: 'Vegetariano',
      description: 'Evita carne, mas consome laticínios e ovos',
      benefits: ['Rico em fibras', 'Menor inflamação', 'Sustentabilidade']
    },
    {
      value: 'vegan',
      label: 'Vegano',
      description: 'Exclui todos os produtos de origem animal',
      benefits: ['Anti-inflamatório', 'Rico em antioxidantes', 'Baixo impacto ambiental']
    },
    {
      value: 'ketogenic',
      label: 'Cetogênico',
      description: 'Muito baixo em carboidratos, alto em gorduras',
      benefits: ['Cetose metabólica', 'Estabilidade energética', 'Perda de peso']
    },
    {
      value: 'paleo',
      label: 'Paleo',
      description: 'Baseado em alimentos não processados',
      benefits: ['Alimentos integrais', 'Baixa inflamação', 'Estabilidade glicêmica']
    },
    {
      value: 'mediterranean',
      label: 'Mediterrâneo',
      description: 'Rico em azeite, peixes, frutas e vegetais',
      benefits: ['Saúde cardiovascular', 'Longevidade', 'Anti-inflamatório']
    },
    {
      value: 'intermittent_fasting',
      label: 'Jejum Intermitente',
      description: 'Períodos alternados de alimentação e jejum',
      benefits: ['Autofagia', 'Sensibilidade à insulina', 'Flexibilidade metabólica']
    },
    {
      value: 'other',
      label: 'Outro',
      description: 'Padrão alimentar personalizado ou específico',
      benefits: ['Adaptado às necessidades', 'Flexibilidade', 'Personalização']
    }
  ];

  // 🎯 FREQUÊNCIAS
  const snackingFrequencies = [
    { value: 'never', label: 'Nunca' },
    { value: 'rarely', label: 'Raramente (1-2x/semana)' },
    { value: 'sometimes', label: 'Às vezes (3-4x/semana)' },
    { value: 'often', label: 'Frequentemente (5-6x/semana)' },
    { value: 'very_often', label: 'Muito frequentemente (diariamente)' }
  ];

  const alcoholOptions = [
    { value: 'never', label: 'Nunca bebo' },
    { value: 'rarely', label: 'Raramente (ocasiões especiais)' },
    { value: 'weekly', label: 'Semanalmente (1-3x/semana)' },
    { value: 'daily', label: 'Diariamente (1 dose/dia)' },
    { value: 'multiple_daily', label: 'Múltiplas doses por dia' }
  ];

  const caffeineOptions = [
    { value: 'never', label: 'Não consumo cafeína' },
    { value: 'rarely', label: 'Raramente (1-2x/semana)' },
    { value: 'daily', label: 'Diariamente (1-2 doses)' },
    { value: 'multiple_daily', label: 'Múltiplas doses por dia (3+)' }
  ];

  // 🎯 OPÇÕES DE SELEÇÃO
  const caffeineSources = [
    'Café', 'Chá preto', 'Chá verde', 'Chá branco', 'Matcha', 
    'Yerba mate', 'Refrigerantes', 'Energéticos', 'Chocolate', 'Suplementos'
  ];

  const cafeineTimings = [
    'Logo ao acordar', 'Manhã (7h-10h)', 'Meio-dia (10h-14h)', 
    'Tarde (14h-17h)', 'Início da noite (17h-20h)', 'Noite (após 20h)'
  ];

  const commonIntolerances = [
    'Lactose', 'Glúten', 'Frutose', 'Histamina', 'Salicilatos', 
    'Fodmaps', 'Nozes', 'Frutos do mar', 'Soja', 'Ovos', 
    'Conservantes', 'Corantes artificiais', 'Adoçantes artificiais'
  ];

  const commonSupplements = [
    'Multivitamínico', 'Vitamina D', 'Vitamina B12', 'Vitamina C', 
    'Ômega 3', 'Magnésio', 'Zinco', 'Ferro', 'Cálcio', 
    'Probióticos', 'Fibras', 'Proteína em pó', 'Creatina', 
    'Coenzima Q10', 'Curcumina', 'Ashwagandha'
  ];

  // 🔧 FUNÇÕES UTILITÁRIAS
  const calculateHydrationScore = (waterIntake: number): number => {
    // Score baseado na recomendação de 35ml/kg (aproximadamente 8 copos para 70kg)
    const recommended = 8;
    if (waterIntake >= recommended) return 100;
    return Math.round((waterIntake / recommended) * 100);
  };

  const analyzeNutritionBalance = (nutritionData: any): string => {
    const { mealsPerDay, snackingFrequency, waterIntake } = nutritionData;
    
    if (mealsPerDay < 2) return 'Padrão restritivo - possível déficit calórico';
    if (mealsPerDay > 5) return 'Padrão frequente - foco na qualidade dos alimentos';
    if (snackingFrequency === 'very_often') return 'Alto consumo de lanches - revisar escolhas';
    if (waterIntake < 4) return 'Hidratação insuficiente - aumentar consumo de água';
    
    return 'Padrão equilibrado - manter consistência';
  };

  const determineMetabolicType = (data: any): string => {
    const { dietaryPattern, mealsPerDay, snackingFrequency } = data;
    
    if (dietaryPattern === 'ketogenic') return 'Metabolismo gordura-adaptado';
    if (dietaryPattern === 'intermittent_fasting') return 'Metabolismo flexível';
    if (mealsPerDay <= 2) return 'Metabolismo de jejum intermitente';
    if (snackingFrequency === 'very_often') return 'Metabolismo dependente de glicose';
    
    return 'Metabolismo misto balanceado';
  };

  const generateNutritionRecommendations = (data: any): string[] => {
    const recommendations: string[] = [];
    
    if (data.waterIntake < 6) {
      recommendations.push('Aumentar consumo de água para pelo menos 6-8 copos/dia');
    }
    if (data.digestiveHealth < 3) {
      recommendations.push('Focar em alimentos anti-inflamatórios e probióticos');
    }
    if (data.eatingPatterns.stressEating) {
      recommendations.push('Desenvolver estratégias para eating emocional');
    }
    if (data.caffeine.consumption === 'multiple_daily' && data.caffeine.timing.includes('Noite (após 20h)')) {
      recommendations.push('Evitar cafeína após 14h para melhor qualidade do sono');
    }
    if (data.foodIntolerances.length > 3) {
      recommendations.push('Considerar teste de intolerâncias alimentares detalhado');
    }
    
    return recommendations;
  };

  // 🔧 VALIDAÇÃO E CÁLCULOS
  useEffect(() => {
    const newErrors: Record<string, string> = {};
    
    if (data.nutrition.mealsPerDay < 1 || data.nutrition.mealsPerDay > 10) {
      newErrors.mealsPerDay = 'Número de refeições deve estar entre 1 e 10';
    }
    if (data.nutrition.waterIntake < 0 || data.nutrition.waterIntake > 20) {
      newErrors.waterIntake = 'Consumo de água deve estar entre 0 e 20 copos';
    }
    if (data.nutrition.digestiveHealth < 1 || data.nutrition.digestiveHealth > 5) {
      newErrors.digestiveHealth = 'Saúde digestiva deve estar entre 1 e 5';
    }

    setErrors(newErrors);

    // Calcular insights
    const hydrationScore = calculateHydrationScore(data.nutrition.waterIntake);
    const nutritionBalance = analyzeNutritionBalance(data.nutrition);
    const metabolicType = determineMetabolicType(data.nutrition);
    const recommendations = generateNutritionRecommendations(data.nutrition);

    setInsights({ hydrationScore, nutritionBalance, metabolicType, recommendations });

    // Validação geral
    const isValid = Object.keys(newErrors).length === 0 && 
                   data.nutrition.mealsPerDay > 0 && 
                   data.nutrition.waterIntake >= 0;
    
    onValidationChange(isValid);
  }, [data.nutrition, onValidationChange]);

  // 🔧 HANDLERS
  const updateNutrition = (field: string, value: any) => {
    onUpdate({
      nutrition: {
        ...data.nutrition,
        [field]: value
      }
    });
  };

  const updateCaffeine = (field: string, value: any) => {
    onUpdate({
      nutrition: {
        ...data.nutrition,
        caffeine: {
          ...data.nutrition.caffeine,
          [field]: value
        }
      }
    });
  };

  const updateEatingPatterns = (field: string, value: boolean) => {
    onUpdate({
      nutrition: {
        ...data.nutrition,
        eatingPatterns: {
          ...data.nutrition.eatingPatterns,
          [field]: value
        }
      }
    });
  };

  const toggleArrayItem = (field: string, item: string) => {
    const currentArray = data.nutrition[field as keyof typeof data.nutrition] as string[];
    const newArray = currentArray.includes(item)
      ? currentArray.filter(i => i !== item)
      : [...currentArray, item];
    
    updateNutrition(field, newArray);
  };

  const toggleCaffeineItem = (field: string, item: string) => {
    const currentArray = data.nutrition.caffeine[field as keyof typeof data.nutrition.caffeine] as string[];
    const newArray = currentArray.includes(item)
      ? currentArray.filter(i => i !== item)
      : [...currentArray, item];
    
    updateCaffeine(field, newArray);
  };

  return (
    <div className="space-y-8">
      {/* Padrão Alimentar */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-3 block">
          Seu padrão alimentar atual
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dietaryPatterns.map((pattern) => (
            <div
              key={pattern.value}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                data.nutrition.dietaryPattern === pattern.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => updateNutrition('dietaryPattern', pattern.value)}
            >
              <h4 className="font-medium text-gray-900 mb-2">{pattern.label}</h4>
              <p className="text-sm text-gray-600 mb-2">{pattern.description}</p>
              <ul className="text-xs text-gray-500 space-y-1">
                {pattern.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-1">
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Frequência de Refeições */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Clock className="w-4 h-4" />
            Refeições principais por dia
          </label>
          <input
            type="number"
            value={data.nutrition.mealsPerDay || ''}
            onChange={(e) => updateNutrition('mealsPerDay', parseInt(e.target.value) || 0)}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.mealsPerDay ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="3"
            min="1"
            max="10"
          />
          {errors.mealsPerDay && (
            <p className="mt-1 text-sm text-red-600">{errors.mealsPerDay}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Frequência de lanches
          </label>
          <select
            value={data.nutrition.snackingFrequency}
            onChange={(e) => updateNutrition('snackingFrequency', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {snackingFrequencies.map((freq) => (
              <option key={freq.value} value={freq.value}>
                {freq.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Hidratação */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <Droplet className="w-4 h-4" />
          Consumo diário de água (copos de 250ml)
        </label>
        <div className="flex items-center gap-4">
          <input
            type="number"
            value={data.nutrition.waterIntake || ''}
            onChange={(e) => updateNutrition('waterIntake', parseInt(e.target.value) || 0)}
            className={`w-32 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.waterIntake ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="8"
            min="0"
            max="20"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              {insights.hydrationScore && (
                <>
                  <Droplet className="w-4 h-4 text-blue-500" />
                  <span>Score de hidratação: {insights.hydrationScore}%</span>
                  {insights.hydrationScore < 80 && (
                    <span className="text-orange-600">• Aumentar consumo</span>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        {errors.waterIntake && (
          <p className="mt-1 text-sm text-red-600">{errors.waterIntake}</p>
        )}
      </div>

      {/* Álcool */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Consumo de álcool
        </label>
        <select
          value={data.nutrition.alcoholConsumption}
          onChange={(e) => updateNutrition('alcoholConsumption', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {alcoholOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Cafeína */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
          <Coffee className="w-5 h-5" />
          Consumo de Cafeína
        </h3>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Frequência de consumo
            </label>
            <select
              value={data.nutrition.caffeine.consumption}
              onChange={(e) => updateCaffeine('consumption', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {caffeineOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {data.nutrition.caffeine.consumption !== 'never' && (
            <>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Fontes de cafeína (selecione todas que usa)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {caffeineSources.map((source) => (
                    <label
                      key={source}
                      className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={data.nutrition.caffeine.sources.includes(source)}
                        onChange={() => toggleCaffeineItem('sources', source)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{source}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Horários de consumo (selecione todos que se aplicam)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {cafeineTimings.map((timing) => (
                    <label
                      key={timing}
                      className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={data.nutrition.caffeine.timing.includes(timing)}
                        onChange={() => toggleCaffeineItem('timing', timing)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{timing}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Intolerâncias Alimentares */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
          <AlertTriangle className="w-4 h-4" />
          Intolerâncias ou sensibilidades alimentares
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {commonIntolerances.map((intolerance) => (
            <label
              key={intolerance}
              className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={data.nutrition.foodIntolerances.includes(intolerance)}
                onChange={() => toggleArrayItem('foodIntolerances', intolerance)}
                className="rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <span className="text-sm text-gray-700">{intolerance}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Suplementos */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
          <Pill className="w-4 h-4" />
          Suplementos que você toma regularmente
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {commonSupplements.map((supplement) => (
            <label
              key={supplement}
              className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={data.nutrition.supplements.includes(supplement)}
                onChange={() => toggleArrayItem('supplements', supplement)}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">{supplement}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Saúde Digestiva */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-3 block">
          Como você avalia sua saúde digestiva geral?
        </label>
        <div className="flex items-center gap-4">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              onClick={() => updateNutrition('digestiveHealth', value)}
              className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all ${
                data.nutrition.digestiveHealth === value
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
        {errors.digestiveHealth && (
          <p className="mt-1 text-sm text-red-600">{errors.digestiveHealth}</p>
        )}
      </div>

      {/* Padrões Alimentares Comportamentais */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
          <Heart className="w-5 h-5" />
          Padrões Comportamentais
        </h3>
        
        <div className="space-y-3">
          {[
            { key: 'emotionalEating', label: 'Como quando estou estressado(a) ou emocional' },
            { key: 'socialEating', label: 'Como mais em situações sociais' },
            { key: 'stressEating', label: 'Tenho compulsões alimentares relacionadas ao estresse' },
            { key: 'lateNightEating', label: 'Costumo comer tarde da noite' }
          ].map((pattern) => (
            <label
              key={pattern.key}
              className="flex items-center gap-3 p-3 rounded hover:bg-gray-100 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={data.nutrition.eatingPatterns[pattern.key as keyof typeof data.nutrition.eatingPatterns]}
                onChange={(e) => updateEatingPatterns(pattern.key, e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{pattern.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Insights Nutricionais */}
      {insights.nutritionBalance && (
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="font-medium text-blue-900">Análise Nutricional</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-blue-700">Balanço nutricional:</span>
              <span className="ml-2 font-medium">{insights.nutritionBalance}</span>
            </div>
            <div>
              <span className="text-blue-700">Tipo metabólico:</span>
              <span className="ml-2 font-medium">{insights.metabolicType}</span>
            </div>
            {insights.hydrationScore && (
              <div>
                <span className="text-blue-700">Hidratação:</span>
                <span className="ml-2 font-medium">{insights.hydrationScore}%</span>
              </div>
            )}
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
            <h4 className="font-medium text-blue-900 mb-2">Ciência da Nutrição Personalizada</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>Padrão alimentar:</strong> Influencia microbioma, inflamação e metabolismo</li>
              <li>• <strong>Timing nutricional:</strong> Afeta ritmo circadiano e sensibilidade à insulina</li>
              <li>• <strong>Hidratação:</strong> Essencial para todas as funções metabólicas</li>
              <li>• <strong>Intolerâncias:</strong> Podem causar inflamação sistêmica e prejuízo da absorção</li>
              <li>• <strong>Suplementação:</strong> Deve ser baseada em deficiências específicas identificadas</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiohackingStep3;