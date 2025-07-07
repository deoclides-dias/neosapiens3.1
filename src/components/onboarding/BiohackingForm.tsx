// src/components/onboarding/BiohackingForm.tsx

import React, { useState } from 'react';
import { 
  Activity, ArrowLeft, ArrowRight, Utensils, Dumbbell, 
  Heart, Stethoscope, Clock, Scale, Droplet, Apple,
  Pill, Shield, Brain, Zap, Moon, Sun, TreePine
} from 'lucide-react';

interface BiohackingData {
  // Step 1: Dados Físicos
  altura: number;
  peso: number;
  biotipo: string;
  circunferenciaQuadril: number;
  circunferenciaCintura: number;
  
  // Step 2: Sono & Energia
  cronotipo: string;
  horasDeSono: number;
  qualidadeSono: number;
  energiaManha: number;
  energiaTarde: number;
  energiaNoite: number;
  
  // Step 3: Nutrição
  refeicoesParDia: number;
  litrosAguaPorDia: number;
  dietaEstilo: string;
  restricoesAlimentares: string[];
  suplementos: string[];
  saudeDigestiva: number;
  
  // Step 4: Atividade Física
  frequenciaExercicio: number;
  intensidadeExercicio: string;
  tiposExercicio: string[];
  capacidadeFuncional: number;
  
  // Step 5: Saúde Geral
  saudeMental: number;
  medicamentos: string[];
  suplementosRegulares: string[];
  deficienciasNutricionais: string[];
  
  // Step 6: Medicina Funcional
  elementoMadeira: number;
  elementoFogo: number;
  elementoTerra: number;
  elementoMetal: number;
  elementoAgua: number;
  capacidadeCognitiva: number;
}

// INSERIR AQUI:
interface LocalBiohackingFormProps {
  onComplete: (data: BiohackingData) => void;
  onBack: () => void;
  initialData?: any;
  onStepChange?: (step: number) => void;
  onDataUpdate?: (data: BiohackingData) => void;
}


const BiohackingForm: React.FC<LocalBiohackingFormProps> = ({ onComplete, onBack, initialData, onStepChange, onDataUpdate }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<BiohackingData>({
    // Inicialização com valores padrão
    altura: 170,
    peso: 70,
    biotipo: 'mesomorfo',
    circunferenciaQuadril: 90,
    circunferenciaCintura: 80,
    cronotipo: 'intermediario',
    horasDeSono: 7,
    qualidadeSono: 7,
    energiaManha: 7,
    energiaTarde: 7,
    energiaNoite: 7,
    refeicoesParDia: 3,
    litrosAguaPorDia: 2,
    dietaEstilo: 'equilibrada',
    restricoesAlimentares: [],
    suplementos: [],
    saudeDigestiva: 7,
    frequenciaExercicio: 3,
    intensidadeExercicio: 'moderada',
    tiposExercicio: [],
    capacidadeFuncional: 7,
    saudeMental: 7,
    medicamentos: [],
    suplementosRegulares: [],
    deficienciasNutricionais: [],
    elementoMadeira: 7,
    elementoFogo: 7,
    elementoTerra: 7,
    elementoMetal: 7,
    elementoAgua: 7,
    capacidadeCognitiva: 7
  });

  const updateData = (field: keyof BiohackingData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 6) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete(data);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      onBack();
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Scale className="mx-auto h-12 w-12 text-blue-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Dados Físicos</h2>
        <p className="text-gray-600">Informações antropométricas básicas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Altura (cm)
          </label>
          <input
            type="number"
            value={data.altura}
            onChange={(e) => updateData('altura', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            min="100"
            max="250"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Peso (kg)
          </label>
          <input
            type="number"
            value={data.peso}
            onChange={(e) => updateData('peso', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            min="30"
            max="200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Biotipo
          </label>
          <select
            value={data.biotipo}
            onChange={(e) => updateData('biotipo', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="ectomorfo">Ectomorfo (Magro, rápido metabolismo)</option>
            <option value="mesomorfo">Mesomorfo (Atlético, equilibrado)</option>
            <option value="endomorfo">Endomorfo (Largo, metabolismo lento)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Circunferência do Quadril (cm)
          </label>
          <input
            type="number"
            value={data.circunferenciaQuadril}
            onChange={(e) => updateData('circunferenciaQuadril', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            min="50"
            max="150"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Circunferência da Cintura (cm)
          </label>
          <input
            type="number"
            value={data.circunferenciaCintura}
            onChange={(e) => updateData('circunferenciaCintura', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            min="40"
            max="150"
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Moon className="mx-auto h-12 w-12 text-purple-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Sono & Energia</h2>
        <p className="text-gray-600">Padrões circadianos e energéticos</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cronótipo (Preferência Natural)
          </label>
          <select
            value={data.cronotipo}
            onChange={(e) => updateData('cronotipo', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="matutino">Matutino (Acordo cedo naturalmente)</option>
            <option value="intermediario">Intermediário (Flexível)</option>
            <option value="vespertino">Vespertino (Prefiro noites tardias)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Horas de sono por noite
          </label>
          <input
            type="number"
            value={data.horasDeSono}
            onChange={(e) => updateData('horasDeSono', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            min="4"
            max="12"
            step="0.5"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Qualidade do sono (1-10)
          </label>
          <input
            type="range"
            value={data.qualidadeSono}
            onChange={(e) => updateData('qualidadeSono', Number(e.target.value))}
            className="w-full"
            min="1"
            max="10"
          />
          <div className="text-center text-sm text-gray-600 mt-1">
            {data.qualidadeSono}/10
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Sun className="inline w-4 h-4 mr-1" />
              Energia Manhã (1-10)
            </label>
            <input
              type="range"
              value={data.energiaManha}
              onChange={(e) => updateData('energiaManha', Number(e.target.value))}
              className="w-full"
              min="1"
              max="10"
            />
            <div className="text-center text-sm text-gray-600">{data.energiaManha}/10</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Zap className="inline w-4 h-4 mr-1" />
              Energia Tarde (1-10)
            </label>
            <input
              type="range"
              value={data.energiaTarde}
              onChange={(e) => updateData('energiaTarde', Number(e.target.value))}
              className="w-full"
              min="1"
              max="10"
            />
            <div className="text-center text-sm text-gray-600">{data.energiaTarde}/10</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Moon className="inline w-4 h-4 mr-1" />
              Energia Noite (1-10)
            </label>
            <input
              type="range"
              value={data.energiaNoite}
              onChange={(e) => updateData('energiaNoite', Number(e.target.value))}
              className="w-full"
              min="1"
              max="10"
            />
            <div className="text-center text-sm text-gray-600">{data.energiaNoite}/10</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Utensils className="mx-auto h-12 w-12 text-green-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Nutrição</h2>
        <p className="text-gray-600">Hábitos alimentares e digestivos</p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Refeições por dia
            </label>
            <input
              type="number"
              value={data.refeicoesParDia}
              onChange={(e) => updateData('refeicoesParDia', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              min="1"
              max="8"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Droplet className="inline w-4 h-4 mr-1" />
              Litros de água por dia
            </label>
            <input
              type="number"
              value={data.litrosAguaPorDia}
              onChange={(e) => updateData('litrosAguaPorDia', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              min="0.5"
              max="5"
              step="0.5"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estilo de dieta
          </label>
          <select
            value={data.dietaEstilo}
            onChange={(e) => updateData('dietaEstilo', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="equilibrada">Equilibrada/Tradicional</option>
            <option value="low-carb">Low Carb</option>
            <option value="cetogenica">Cetogênica</option>
            <option value="vegetariana">Vegetariana</option>
            <option value="vegana">Vegana</option>
            <option value="paleo">Paleo</option>
            <option value="mediterranea">Mediterrânea</option>
            <option value="intermitente">Jejum Intermitente</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Restrições alimentares (marque todas que se aplicam)
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              'Glúten', 'Lactose', 'Açúcar refinado', 'Carne vermelha',
              'Frutos do mar', 'Oleaginosas', 'Soja', 'Álcool'
            ].map((restricao) => (
              <label key={restricao} className="flex items-center">
                <input
                  type="checkbox"
                  checked={data.restricoesAlimentares.includes(restricao)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      updateData('restricoesAlimentares', [...data.restricoesAlimentares, restricao]);
                    } else {
                      updateData('restricoesAlimentares', 
                        data.restricoesAlimentares.filter(r => r !== restricao)
                      );
                    }
                  }}
                  className="mr-2"
                />
                {restricao}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Saúde digestiva geral (1-10)
          </label>
          <input
            type="range"
            value={data.saudeDigestiva}
            onChange={(e) => updateData('saudeDigestiva', Number(e.target.value))}
            className="w-full"
            min="1"
            max="10"
          />
          <div className="text-center text-sm text-gray-600 mt-1">
            {data.saudeDigestiva}/10
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Dumbbell className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Atividade Física</h2>
        <p className="text-gray-600">Exercícios e capacidade funcional</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Frequência de exercícios por semana
          </label>
          <input
            type="number"
            value={data.frequenciaExercicio}
            onChange={(e) => updateData('frequenciaExercicio', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            min="0"
            max="7"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Intensidade predominante
          </label>
          <select
            value={data.intensidadeExercicio}
            onChange={(e) => updateData('intensidadeExercicio', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="sedentario">Sedentário</option>
            <option value="leve">Leve (caminhada, yoga)</option>
            <option value="moderada">Moderada (natação, ciclismo)</option>
            <option value="intensa">Intensa (corrida, HIIT)</option>
            <option value="muito-intensa">Muito Intensa (crossfit, atleta)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipos de exercício (marque todos que pratica)
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              'Musculação', 'Cardio', 'Yoga/Pilates', 'Natação',
              'Corrida', 'Ciclismo', 'Esportes', 'Dança',
              'Artes marciais', 'Crossfit', 'Funcional', 'Caminhada'
            ].map((exercicio) => (
              <label key={exercicio} className="flex items-center">
                <input
                  type="checkbox"
                  checked={data.tiposExercicio.includes(exercicio)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      updateData('tiposExercicio', [...data.tiposExercicio, exercicio]);
                    } else {
                      updateData('tiposExercicio', 
                        data.tiposExercicio.filter(t => t !== exercicio)
                      );
                    }
                  }}
                  className="mr-2"
                />
                {exercicio}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Capacidade funcional geral (1-10)
          </label>
          <input
            type="range"
            value={data.capacidadeFuncional}
            onChange={(e) => updateData('capacidadeFuncional', Number(e.target.value))}
            className="w-full"
            min="1"
            max="10"
          />
          <div className="text-center text-sm text-gray-600 mt-1">
            {data.capacidadeFuncional}/10
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Considera: força, resistência, flexibilidade, coordenação
          </p>
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Heart className="mx-auto h-12 w-12 text-pink-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Saúde Geral</h2>
        <p className="text-gray-600">Condições médicas e suplementação</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Brain className="inline w-4 h-4 mr-1" />
            Saúde mental geral (1-10)
          </label>
          <input
            type="range"
            value={data.saudeMental}
            onChange={(e) => updateData('saudeMental', Number(e.target.value))}
            className="w-full"
            min="1"
            max="10"
          />
          <div className="text-center text-sm text-gray-600 mt-1">
            {data.saudeMental}/10
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Pill className="inline w-4 h-4 mr-1" />
            Medicamentos em uso regular
          </label>
          <textarea
            value={data.medicamentos.join(', ')}
            onChange={(e) => updateData('medicamentos', 
              e.target.value.split(',').map(s => s.trim()).filter(s => s)
            )}
            placeholder="Ex: Omeprazol, Losartana, Vitamina D..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            rows={2}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Suplementos regulares
          </label>
          <textarea
            value={data.suplementosRegulares.join(', ')}
            onChange={(e) => updateData('suplementosRegulares', 
              e.target.value.split(',').map(s => s.trim()).filter(s => s)
            )}
            placeholder="Ex: Whey protein, Ômega 3, Multivitamínico..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            rows={2}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Deficiências nutricionais conhecidas
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              'Vitamina D', 'Vitamina B12', 'Ferro', 'Zinco',
              'Magnésio', 'Ômega 3', 'Folato', 'Cálcio'
            ].map((deficiencia) => (
              <label key={deficiencia} className="flex items-center">
                <input
                  type="checkbox"
                  checked={data.deficienciasNutricionais.includes(deficiencia)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      updateData('deficienciasNutricionais', [...data.deficienciasNutricionais, deficiencia]);
                    } else {
                      updateData('deficienciasNutricionais', 
                        data.deficienciasNutricionais.filter(d => d !== deficiencia)
                      );
                    }
                  }}
                  className="mr-2"
                />
                {deficiencia}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep6 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <TreePine className="mx-auto h-12 w-12 text-emerald-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Medicina Funcional</h2>
        <p className="text-gray-600">Avaliação dos 5 elementos da MTC</p>
      </div>

      <div className="space-y-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-2">🌱 Elemento Madeira</h3>
          <p className="text-sm text-green-700 mb-3">Fígado/Vesícula - Planejamento, visão, flexibilidade</p>
          <input
            type="range"
            value={data.elementoMadeira}
            onChange={(e) => updateData('elementoMadeira', Number(e.target.value))}
            className="w-full"
            min="1"
            max="10"
          />
          <div className="text-center text-sm text-green-600 mt-1">
            {data.elementoMadeira}/10
          </div>
        </div>

        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="font-semibold text-red-800 mb-2">🔥 Elemento Fogo</h3>
          <p className="text-sm text-red-700 mb-3">Coração/Intestino Delgado - Alegria, comunicação, circulação</p>
          <input
            type="range"
            value={data.elementoFogo}
            onChange={(e) => updateData('elementoFogo', Number(e.target.value))}
            className="w-full"
            min="1"
            max="10"
          />
          <div className="text-center text-sm text-red-600 mt-1">
            {data.elementoFogo}/10
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="font-semibold text-yellow-800 mb-2">🌍 Elemento Terra</h3>
          <p className="text-sm text-yellow-700 mb-3">Baço/Estômago - Digestão, estabilidade, preocupação</p>
          <input
            type="range"
            value={data.elementoTerra}
            onChange={(e) => updateData('elementoTerra', Number(e.target.value))}
            className="w-full"
            min="1"
            max="10"
          />
          <div className="text-center text-sm text-yellow-600 mt-1">
            {data.elementoTerra}/10
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">⚡ Elemento Metal</h3>
          <p className="text-sm text-gray-700 mb-3">Pulmão/Intestino Grosso - Respiração, estrutura, letting go</p>
          <input
            type="range"
            value={data.elementoMetal}
            onChange={(e) => updateData('elementoMetal', Number(e.target.value))}
            className="w-full"
            min="1"
            max="10"
          />
          <div className="text-center text-sm text-gray-600 mt-1">
            {data.elementoMetal}/10
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">💧 Elemento Água</h3>
          <p className="text-sm text-blue-700 mb-3">Rim/Bexiga - Vitalidade, coragem, força de vontade</p>
          <input
            type="range"
            value={data.elementoAgua}
            onChange={(e) => updateData('elementoAgua', Number(e.target.value))}
            className="w-full"
            min="1"
            max="10"
          />
          <div className="text-center text-sm text-blue-600 mt-1">
            {data.elementoAgua}/10
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="font-semibold text-purple-800 mb-2">🧠 Capacidade Cognitiva</h3>
          <p className="text-sm text-purple-700 mb-3">Memória, foco, clareza mental, tomada de decisão</p>
          <input
            type="range"
            value={data.capacidadeCognitiva}
            onChange={(e) => updateData('capacidadeCognitiva', Number(e.target.value))}
            className="w-full"
            min="1"
            max="10"
          />
          <div className="text-center text-sm text-purple-600 mt-1">
            {data.capacidadeCognitiva}/10
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      case 6: return renderStep6();
      default: return renderStep1();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header com progresso */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Avaliação Biohacking
            </h1>
            <div className="text-sm font-medium text-gray-500">
              Step {currentStep} de 6
            </div>
          </div>
          
          {/* Barra de progresso */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 6) * 100}%` }}
            />
          </div>
          
          {/* Indicadores de steps */}
          <div className="flex justify-between text-xs text-gray-500">
            <span className={currentStep >= 1 ? 'text-blue-600 font-medium' : ''}>Físicos</span>
            <span className={currentStep >= 2 ? 'text-blue-600 font-medium' : ''}>Sono</span>
            <span className={currentStep >= 3 ? 'text-blue-600 font-medium' : ''}>Nutrição</span>
            <span className={currentStep >= 4 ? 'text-blue-600 font-medium' : ''}>Exercício</span>
            <span className={currentStep >= 5 ? 'text-blue-600 font-medium' : ''}>Saúde</span>
            <span className={currentStep >= 6 ? 'text-blue-600 font-medium' : ''}>MTC</span>
          </div>
        </div>

        {/* Conteúdo do step atual */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          {renderCurrentStep()}
        </div>

        {/* Botões de navegação */}
        <div className="flex justify-between">
          <button
            onClick={prevStep}
            className="flex items-center px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {currentStep === 1 ? 'Voltar' : 'Anterior'}
          </button>

          <button
            onClick={nextStep}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-colors"
          >
            {currentStep === 6 ? 'Finalizar Biohacking' : 'Próximo'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>

        {/* Informações adicionais */}
        <div className="mt-8 bg-blue-50 rounded-lg p-4">
          <div className="flex items-start">
            <Activity className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-blue-900 mb-1">
                Por que coletamos esses dados?
              </h3>
              <p className="text-sm text-blue-700">
                Cada informação é cientificamente relevante para criar seu perfil biohacking personalizado. 
                Combinamos dados antropométricos, padrões circadianos, nutrição, atividade física e medicina tradicional 
                chinesa para gerar insights únicos sobre sua saúde e performance.
              </p>
            </div>
          </div>
        </div>

        {/* Debug info (remover em produção) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 bg-gray-100 rounded-lg p-4">
            <details>
              <summary className="font-medium text-gray-700 cursor-pointer">
                Debug - Dados coletados
              </summary>
              <pre className="mt-2 text-xs text-gray-600 overflow-auto">
                {JSON.stringify(data, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>
    </div>
  );
};

export default BiohackingForm;