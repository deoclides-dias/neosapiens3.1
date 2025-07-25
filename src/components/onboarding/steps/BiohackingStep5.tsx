// src/components/onboarding/steps/BiohackingStep5.tsx - Saúde Geral
// =============================================================================

import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Brain, 
  Pill, 
  AlertTriangle, 
  TrendingDown,
  Plus,
  X,
  Info,
  Activity,
  Shield
} from 'lucide-react';
import { BiohackingData } from '../../../types/biohacking';

interface BiohackingStep5Props {
  data: BiohackingData;
  onUpdate: (updates: Partial<BiohackingData>) => void;
  onValidationChange: (isValid: boolean) => void;
}

const BiohackingStep5: React.FC<BiohackingStep5Props> = ({
  data,
  onUpdate,
  onValidationChange
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [insights, setInsights] = useState<{
    healthScore?: number;
    riskFactors?: string[];
    priorities?: string[];
  }>({});

  // 🎯 CONDIÇÕES CRÔNICAS COMUNS
  const chronicConditions = [
    'Nenhuma condição crônica', 'Hipertensão', 'Diabetes tipo 2', 'Diabetes tipo 1',
    'Colesterol alto', 'Doença cardíaca', 'Asma', 'Artrite', 'Osteoporose',
    'Depressão', 'Ansiedade', 'Síndrome metabólica', 'Doença da tireoide',
    'DPOC', 'Doença renal', 'Doença hepática', 'Fibromialgia', 'Enxaqueca'
  ];

  // 🎯 MEDICAMENTOS COMUNS
  const commonMedications = [
    'Nenhum medicamento', 'Anti-hipertensivos', 'Metformina', 'Insulina',
    'Estatinas', 'Aspirina', 'Antidepressivos', 'Ansiolíticos',
    'Anti-inflamatórios', 'Hormônios da tireoide', 'Contraceptivos',
    'Corticoides', 'Antihistamínicos', 'Suplementos hormonais'
  ];

  // 🎯 SUPLEMENTOS REGULARES
  const regularSupplements = [
    'Multivitamínico', 'Vitamina D', 'Vitamina B12', 'Ômega 3', 'Magnésio',
    'Zinco', 'Ferro', 'Cálcio', 'Vitamina C', 'Probióticos', 'Coenzima Q10',
    'Ashwagandha', 'Curcumina', 'Melatonina', 'GABA', 'L-teanina'
  ];

  // 🎯 DEFICIÊNCIAS NUTRICIONAIS
  const nutritionalDeficiencies = [
    'Nenhuma deficiência conhecida', 'Vitamina D', 'Vitamina B12', 'Ferro',
    'Magnésio', 'Zinco', 'Folato', 'Vitamina B6', 'Cálcio', 'Ômega 3',
    'Vitamina C', 'Selênio', 'Iodo', 'Vitamina K'
  ];

  // 🎯 ALERGIAS COMUNS
  const commonAllergies = [
    'Nenhuma alergia conhecida', 'Pólen', 'Ácaros', 'Pelos de animais',
    'Poeira', 'Alimentos (especificar)', 'Medicamentos', 'Látex',
    'Produtos químicos', 'Metais', 'Cosméticos'
  ];

  // 🎯 MUDANÇAS DE SAÚDE RECENTES
  const recentHealthChanges = [
    'Nenhuma mudança significativa', 'Ganho de peso', 'Perda de peso',
    'Aumento da fadiga', 'Problemas de sono', 'Mudanças de humor',
    'Dores novas', 'Problemas digestivos', 'Mudanças na libido',
    'Problemas de memória', 'Mudanças na pele', 'Problemas hormonais'
  ];

  // 🎯 HISTÓRICO MÉDICO
  const surgeryTypes = [
    'Nunca fiz cirurgia', 'Cirurgia cardíaca', 'Cirurgia ortopédica',
    'Cirurgia abdominal', 'Cirurgia ginecológica', 'Cirurgia neurológica',
    'Cirurgia plástica', 'Cirurgia de catarata', 'Outras cirurgias'
  ];

  const familyHistoryConditions = [
    'Não há histórico relevante', 'Doença cardíaca', 'Diabetes', 'Câncer',
    'Hipertensão', 'Doença mental', 'Alzheimer', 'Osteoporose', 'Obesidade',
    'Doenças autoimunes', 'Problemas da tireoide'
  ];

  // 🔧 FUNÇÕES UTILITÁRIAS
  const calculateHealthScore = (healthData: any): number => {
    let score = 100;
    
    // Penalizar por condições crônicas (exceto "nenhuma")
    const conditions = healthData.chronicConditions.filter((c: string) => c !== 'Nenhuma condição crônica');
    score -= conditions.length * 10;
    
    // Penalizar por múltiplos medicamentos
    const medications = healthData.medications.filter((m: string) => m !== 'Nenhum medicamento');
    score -= medications.length * 5;
    
    // Considerar saúde geral e mental
    score += (healthData.overallHealth - 3) * 10;
    score += (healthData.mentalHealth - 3) * 10;
    
    // Penalizar por alto nível de estresse
    score -= (healthData.stressLevel - 3) * 5;
    
    return Math.max(0, Math.min(100, Math.round(score)));
  };

  const identifyRiskFactors = (healthData: any): string[] => {
    const risks: string[] = [];
    
    if (healthData.stressLevel >= 4) risks.push('Alto nível de estresse');
    if (healthData.mentalHealth <= 2) risks.push('Saúde mental comprometida');
    if (healthData.overallHealth <= 2) risks.push('Saúde geral comprometida');
    if (healthData.chronicConditions.includes('Diabetes tipo 2')) risks.push('Risco cardiovascular elevado');
    if (healthData.chronicConditions.includes('Hipertensão')) risks.push('Pressão arterial elevada');
    if (healthData.nutritionalDeficiencies.length > 2) risks.push('Múltiplas deficiências nutricionais');
    
    return risks;
  };

  const determinePriorities = (healthData: any): string[] => {
    const priorities: string[] = [];
    
    if (healthData.stressLevel >= 4) priorities.push('Gestão de estresse');
    if (healthData.mentalHealth <= 2) priorities.push('Suporte psicológico');
    if (healthData.nutritionalDeficiencies.length > 0) priorities.push('Correção nutricional');
    if (healthData.medications.length > 3) priorities.push('Revisão medicamentosa');
    
    return priorities;
  };

  // 🔧 VALIDAÇÃO E CÁLCULOS
  useEffect(() => {
    const newErrors: Record<string, string> = {};
    
    // Validações básicas
    if (data.healthStatus.overallHealth < 1 || data.healthStatus.overallHealth > 5) {
      newErrors.overallHealth = 'Saúde geral deve estar entre 1 e 5';
    }
    if (data.healthStatus.mentalHealth < 1 || data.healthStatus.mentalHealth > 5) {
      newErrors.mentalHealth = 'Saúde mental deve estar entre 1 e 5';
    }
    if (data.healthStatus.stressLevel < 1 || data.healthStatus.stressLevel > 5) {
      newErrors.stressLevel = 'Nível de estresse deve estar entre 1 e 5';
    }

    setErrors(newErrors);

    // Calcular insights
    const healthScore = calculateHealthScore(data.healthStatus);
    const riskFactors = identifyRiskFactors(data.healthStatus);
    const priorities = determinePriorities(data.healthStatus);

    setInsights({ healthScore, riskFactors, priorities });

    // Validação geral
    const isValid = Object.keys(newErrors).length === 0;
    onValidationChange(isValid);
  }, [data.healthStatus, onValidationChange]);

  // 🔧 HANDLERS
  const updateHealthStatus = (field: string, value: any) => {
    onUpdate({
      healthStatus: {
        ...data.healthStatus,
        [field]: value
      }
    });
  };

  const updateMedicalHistory = (field: string, value: any) => {
    onUpdate({
      healthStatus: {
        ...data.healthStatus,
        medicalHistory: {
          ...data.healthStatus.medicalHistory,
          [field]: value
        }
      }
    });
  };

  const toggleArrayItem = (field: string, item: string) => {
    const currentArray = data.healthStatus[field as keyof typeof data.healthStatus] as string[];
    const newArray = currentArray.includes(item)
      ? currentArray.filter(i => i !== item)
      : [...currentArray, item];
    
    updateHealthStatus(field, newArray);
  };

  const toggleHistoryItem = (field: string, item: string) => {
  // Verificar se o campo existe na interface
  if (field === 'familyHistory') {
    // Se familyHistory não existe, use significantIllnesses ou crie um campo alternativo
    const currentArray = data.healthStatus.medicalHistory.significantIllnesses || [];
    const newArray = currentArray.includes(item)
      ? currentArray.filter(i => i !== item)
      : [...currentArray, item];
    
    updateMedicalHistory('significantIllnesses', newArray);
  } else {
    // Para outros campos (surgeries, hospitalizations)
    const currentArray = data.healthStatus.medicalHistory[field as keyof typeof data.healthStatus.medicalHistory] as string[];
    const newArray = currentArray.includes(item)
      ? currentArray.filter(i => i !== item)
      : [...currentArray, item];
    
    updateMedicalHistory(field, newArray);
  }
};

  return (
    <div className="space-y-8">
      {/* Avaliações Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <Heart className="w-4 h-4" />
            Saúde geral
          </label>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                onClick={() => updateHealthStatus('overallHealth', value)}
                className={`w-full p-3 rounded border text-sm transition-all ${
                  data.healthStatus.overallHealth === value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {value} - {['Muito ruim', 'Ruim', 'Regular', 'Boa', 'Excelente'][value - 1]}
              </button>
            ))}
          </div>
          {errors.overallHealth && (
            <p className="mt-1 text-sm text-red-600">{errors.overallHealth}</p>
          )}
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <Brain className="w-4 h-4" />
            Saúde mental
          </label>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                onClick={() => updateHealthStatus('mentalHealth', value)}
                className={`w-full p-3 rounded border text-sm transition-all ${
                  data.healthStatus.mentalHealth === value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {value} - {['Muito ruim', 'Ruim', 'Regular', 'Boa', 'Excelente'][value - 1]}
              </button>
            ))}
          </div>
          {errors.mentalHealth && (
            <p className="mt-1 text-sm text-red-600">{errors.mentalHealth}</p>
          )}
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <TrendingDown className="w-4 h-4" />
            Nível de estresse
          </label>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                onClick={() => updateHealthStatus('stressLevel', value)}
                className={`w-full p-3 rounded border text-sm transition-all ${
                  data.healthStatus.stressLevel === value
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {value} - {['Muito baixo', 'Baixo', 'Moderado', 'Alto', 'Muito alto'][value - 1]}
              </button>
            ))}
          </div>
          {errors.stressLevel && (
            <p className="mt-1 text-sm text-red-600">{errors.stressLevel}</p>
          )}
        </div>
      </div>

      {/* Condições Crônicas */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
          <AlertTriangle className="w-4 h-4" />
          Condições crônicas (selecione todas que se aplicam)
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {chronicConditions.map((condition) => (
            <label
              key={condition}
              className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={data.healthStatus.chronicConditions.includes(condition)}
                onChange={() => toggleArrayItem('chronicConditions', condition)}
                className="rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <span className="text-sm text-gray-700">{condition}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Medicamentos e Suplementos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <Pill className="w-4 h-4" />
            Medicamentos prescritos
          </label>
          <div className="space-y-2">
            {commonMedications.map((medication) => (
              <label
                key={medication}
                className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={data.healthStatus.medications.includes(medication)}
                  onChange={() => toggleArrayItem('medications', medication)}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700">{medication}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-3 block">
            Suplementos regulares
          </label>
          <div className="space-y-2">
            {regularSupplements.map((supplement) => (
              <label
                key={supplement}
                className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={data.healthStatus.regularSupplements.includes(supplement)}
                  onChange={() => toggleArrayItem('regularSupplements', supplement)}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">{supplement}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Deficiências e Alergias */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-3 block">
            Deficiências nutricionais conhecidas
          </label>
          <div className="space-y-2">
            {nutritionalDeficiencies.map((deficiency) => (
              <label
                key={deficiency}
                className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={data.healthStatus.nutritionalDeficiencies.includes(deficiency)}
                  onChange={() => toggleArrayItem('nutritionalDeficiencies', deficiency)}
                  className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                />
                <span className="text-sm text-gray-700">{deficiency}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-3 block">
            Alergias conhecidas
          </label>
          <div className="space-y-2">
            {commonAllergies.map((allergy) => (
              <label
                key={allergy}
                className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={data.healthStatus.allergies.includes(allergy)}
                  onChange={() => toggleArrayItem('allergies', allergy)}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <span className="text-sm text-gray-700">{allergy}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Mudanças Recentes */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-3 block">
          Mudanças de saúde recentes (últimos 6 meses)
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {recentHealthChanges.map((change) => (
            <label
              key={change}
              className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={data.healthStatus.recentHealthChanges.includes(change)}
                onChange={() => toggleArrayItem('recentHealthChanges', change)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700">{change}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Histórico Médico */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Histórico Médico
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Cirurgias realizadas
            </label>
            <div className="space-y-2">
              {surgeryTypes.map((surgery) => (
                <label
                  key={surgery}
                  className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={data.healthStatus.medicalHistory.surgeries.includes(surgery)}
                    onChange={() => toggleHistoryItem('surgeries', surgery)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{surgery}</span>
                </label>
              ))}
            </div>
          </div>

              <div>
  <label className="text-sm font-medium text-gray-700 mb-2 block">
    Histórico familiar relevante
  </label>
  <div className="space-y-2">
    {familyHistoryConditions.map((condition) => (
      <label
        key={condition}
        className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer"
      >
        <input
          type="checkbox"
          checked={data.healthStatus.medicalHistory.significantIllnesses.includes(condition)}
          onChange={() => toggleHistoryItem('familyHistory', condition)}
          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <span className="text-sm text-gray-700">{condition}</span>
      </label>
    ))}
  </div>
</div>
          
        </div>
      </div>

      {/* Insights de Saúde */}
      {insights.healthScore !== undefined && (
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-5 h-5 text-blue-600" />
            <h3 className="font-medium text-blue-900">Análise de Saúde Geral</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <span className="text-blue-700">Score de saúde:</span>
              <div className="flex-1 bg-white rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all ${
                    insights.healthScore >= 80 ? 'bg-green-500' :
                    insights.healthScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${insights.healthScore}%` }}
                />
              </div>
              <span className="font-medium text-blue-900">{insights.healthScore}/100</span>
            </div>

            {insights.riskFactors && insights.riskFactors.length > 0 && (
              <div>
                <span className="text-blue-700 font-medium">Fatores de risco identificados:</span>
                <ul className="mt-1 space-y-1">
                  {insights.riskFactors.map((risk, index) => (
                    <li key={index} className="text-red-600 text-sm flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {insights.priorities && insights.priorities.length > 0 && (
              <div>
                <span className="text-blue-700 font-medium">Prioridades de cuidado:</span>
                <ul className="mt-1 space-y-1">
                  {insights.priorities.map((priority, index) => (
                    <li key={index} className="text-blue-600 text-sm flex items-center gap-1">
                      <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                      {priority}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Informações Científicas */}
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-blue-900 mb-2">Medicina Preventiva e Personalizada</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>Avaliação holística:</strong> Considera saúde física, mental e social</li>
              <li>• <strong>Medicina preventiva:</strong> Identificação precoce de fatores de risco</li>
              <li>• <strong>Interações medicamentosas:</strong> Múltiplos medicamentos podem interagir</li>
              <li>• <strong>Deficiências nutricionais:</strong> Podem afetar múltiplos sistemas</li>
              <li>• <strong>Histórico familiar:</strong> Importante para prevenção personalizada</li>
              <li>• <strong>Estresse crônico:</strong> Fator de risco para múltiplas doenças</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiohackingStep5;// src/components/onboarding/steps/BiohackingStep4.tsx - Atividade Física
