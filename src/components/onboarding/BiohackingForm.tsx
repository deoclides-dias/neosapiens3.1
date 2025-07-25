// src/components/onboarding/BiohackingForm.tsx - Componente Principal

import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  Apple, 
  Heart, 
  Stethoscope, 
  Beaker,
  CheckCircle,
  Loader,
  Info
} from 'lucide-react';
import { BiohackingData } from '../../types/biohacking';

// Importar os componentes de steps (serão criados nos próximos artefatos)
import BiohackingStep1 from './steps/BiohackingStep1';
import BiohackingStep2 from './steps/BiohackingStep2';
import BiohackingStep3 from './steps/BiohackingStep3';
import BiohackingStep4 from './steps/BiohackingStep4';
import BiohackingStep5 from './steps/BiohackingStep5';
import BiohackingStep6 from './steps/BiohackingStep6';

// 🎯 INTERFACES
interface BiohackingFormProps {
  onComplete: (data: BiohackingData) => Promise<void>;
  onBack?: () => void;
  initialData?: Partial<BiohackingData>;
  onStepChange?: (step: number) => void;
  onDataUpdate?: (data: Partial<BiohackingData>) => void;
}

interface StepConfig {
  id: number;
  title: string;
  icon: React.ElementType;
  description: string;
  estimatedTime: number;
  fields: string[];
}

// 🎯 CONFIGURAÇÃO DOS STEPS
const STEPS: StepConfig[] = [
  {
    id: 1,
    title: 'Dados Físicos',
    icon: Activity,
    description: 'Medidas corporais e biotipo',
    estimatedTime: 5,
    fields: ['anthropometric']
  },
  {
    id: 2,
    title: 'Sono & Energia',
    icon: Clock,
    description: 'Padrões circadianos e cronótipo',
    estimatedTime: 7,
    fields: ['sleep']
  },
  {
    id: 3,
    title: 'Nutrição',
    icon: Apple,
    description: 'Hábitos alimentares e digestão',
    estimatedTime: 8,
    fields: ['nutrition']
  },
  {
    id: 4,
    title: 'Atividade Física',
    icon: Heart,
    description: 'Exercícios e capacidade funcional',
    estimatedTime: 6,
    fields: ['physicalActivity']
  },
  {
    id: 5,
    title: 'Saúde Geral',
    icon: Stethoscope,
    description: 'Condições médicas e medicamentos',
    estimatedTime: 10,
    fields: ['healthStatus']
  },
  {
    id: 6,
    title: 'Medicina Funcional',
    icon: Beaker,
    description: 'Avaliação MTC e capacidades cognitivas',
    estimatedTime: 12,
    fields: ['functionalMedicine', 'cognitive']
  }
];

// 🎯 COMPONENTE PRINCIPAL
const BiohackingForm: React.FC<BiohackingFormProps> = ({
  onComplete,
  onBack,
  initialData,
  onStepChange,
  onDataUpdate
}) => {
  // 🔧 ESTADOS
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<BiohackingData>(() => {
    return {
      // Dados iniciais com estrutura completa
      anthropometric: {
        height: initialData?.anthropometric?.height || 0,
        currentWeight: initialData?.anthropometric?.currentWeight || 0,
        desiredWeight: initialData?.anthropometric?.desiredWeight || 0,
        waistCircumference: initialData?.anthropometric?.waistCircumference,
        bodyFatPercentage: initialData?.anthropometric?.bodyFatPercentage,
        bodyType: initialData?.anthropometric?.bodyType || 'unknown',
        weightHistory: {
          maxWeight: initialData?.anthropometric?.weightHistory?.maxWeight || 0,
          minAdultWeight: initialData?.anthropometric?.weightHistory?.minAdultWeight || 0,
          recentWeightChanges: initialData?.anthropometric?.weightHistory?.recentWeightChanges || 'stable',
          easyWeightChange: initialData?.anthropometric?.weightHistory?.easyWeightChange || 'neither',
          weightConcerns: initialData?.anthropometric?.weightHistory?.weightConcerns || []
        }
      },
      sleep: {
        averageSleepDuration: initialData?.sleep?.averageSleepDuration || 7,
        bedtime: initialData?.sleep?.bedtime || '22:00',
        wakeTime: initialData?.sleep?.wakeTime || '06:00',
        sleepQuality: initialData?.sleep?.sleepQuality || 3, // ✅ CORRETO
        chronotype: initialData?.sleep?.chronotype || 'intermediate',
        sleepIssues: initialData?.sleep?.sleepIssues || [],
        energyLevels: {
          morning: initialData?.sleep?.energyLevels?.morning || 3,
          afternoon: initialData?.sleep?.energyLevels?.afternoon || 3,
          evening: initialData?.sleep?.energyLevels?.evening || 3
        },
        sleepAids: {
          naturalSupplements: initialData?.sleep?.sleepAids?.naturalSupplements || [],
          prescriptionMeds: initialData?.sleep?.sleepAids?.prescriptionMeds || [],
          other: initialData?.sleep?.sleepAids?.other || []
        }
      },
      nutrition: {
        dietaryPattern: initialData?.nutrition?.dietaryPattern || 'omnivore',
        mealsPerDay: initialData?.nutrition?.mealsPerDay || 3,
        snackingFrequency: initialData?.nutrition?.snackingFrequency || 'sometimes',
        waterIntake: initialData?.nutrition?.waterIntake || 6,
        alcoholConsumption: initialData?.nutrition?.alcoholConsumption || 'rarely',
        caffeine: {
          consumption: initialData?.nutrition?.caffeine?.consumption || 'daily',
          sources: initialData?.nutrition?.caffeine?.sources || [],
          timing: initialData?.nutrition?.caffeine?.timing || []
        },
        foodIntolerances: initialData?.nutrition?.foodIntolerances || [],
        supplements: initialData?.nutrition?.supplements || [],
        digestiveHealth: initialData?.nutrition?.digestiveHealth || 3,
        eatingPatterns: {
          emotionalEating: initialData?.nutrition?.eatingPatterns?.emotionalEating || false,
          socialEating: initialData?.nutrition?.eatingPatterns?.socialEating || false,
          stressEating: initialData?.nutrition?.eatingPatterns?.stressEating || false,
          lateNightEating: initialData?.nutrition?.eatingPatterns?.lateNightEating || false
        }
      },
      physicalActivity: {
        weeklyFrequency: initialData?.physicalActivity?.weeklyFrequency || 0,
        averageSessionDuration: initialData?.physicalActivity?.averageSessionDuration || 30,
        preferredIntensity: initialData?.physicalActivity?.preferredIntensity || 'moderate',
        activityTypes: initialData?.physicalActivity?.activityTypes || [],
        currentFitnessLevel: initialData?.physicalActivity?.currentFitnessLevel || 3,
        functionalCapacity: initialData?.physicalActivity?.functionalCapacity || 3,
        limitations: initialData?.physicalActivity?.limitations || [],
        goals: initialData?.physicalActivity?.goals || [],
        recovery: {
          quality: initialData?.physicalActivity?.recovery?.quality || 3,
          methods: initialData?.physicalActivity?.recovery?.methods || []
        }
      },
      healthStatus: {
        overallHealth: initialData?.healthStatus?.overallHealth || 3,
        mentalHealth: initialData?.healthStatus?.mentalHealth || 3,
        chronicConditions: initialData?.healthStatus?.chronicConditions || [],
        medications: initialData?.healthStatus?.medications || [],
        regularSupplements: initialData?.healthStatus?.regularSupplements || [],
        nutritionalDeficiencies: initialData?.healthStatus?.nutritionalDeficiencies || [],
        allergies: initialData?.healthStatus?.allergies || [],
        recentHealthChanges: initialData?.healthStatus?.recentHealthChanges || [],
        stressLevel: initialData?.healthStatus?.stressLevel || 3,
        medicalHistory: {
          surgeries: initialData?.healthStatus?.medicalHistory?.surgeries || [],
          hospitalizations: initialData?.healthStatus?.medicalHistory?.hospitalizations || [],
          significantIllnesses: initialData?.healthStatus?.medicalHistory?.significantIllnesses || [],
          familyHistory: initialData?.healthStatus?.medicalHistory?.familyHistory || []
        }
      },
      functionalMedicine: {
        fiveElements: {
          wood: {
            liverHealth: initialData?.functionalMedicine?.fiveElements?.wood?.liverHealth || 5,
            flexibility: initialData?.functionalMedicine?.fiveElements?.wood?.flexibility || 5,
            visionHealth: initialData?.functionalMedicine?.fiveElements?.wood?.visionHealth || 5,
            angerManagement: initialData?.functionalMedicine?.fiveElements?.wood?.angerManagement || 5,
            decisionMaking: initialData?.functionalMedicine?.fiveElements?.wood?.decisionMaking || 5,
            muscleStrength: initialData?.functionalMedicine?.fiveElements?.wood?.muscleStrength || 5,
            creativity: initialData?.functionalMedicine?.fiveElements?.wood?.creativity || 5,
            planningAbility: initialData?.functionalMedicine?.fiveElements?.wood?.planningAbility || 5,
            adaptability: initialData?.functionalMedicine?.fiveElements?.wood?.adaptability || 5
          },
          fire: {
            heartHealth: initialData?.functionalMedicine?.fiveElements?.fire?.heartHealth || 5,
            socialConnection: initialData?.functionalMedicine?.fiveElements?.fire?.socialConnection || 5,
            joyfulness: initialData?.functionalMedicine?.fiveElements?.fire?.joyfulness || 5,
            communicationSkills: initialData?.functionalMedicine?.fiveElements?.fire?.communicationSkills || 5,
            enthusiasm: initialData?.functionalMedicine?.fiveElements?.fire?.enthusiasm || 5,
            sleepDisturbances: Boolean(initialData?.functionalMedicine?.fiveElements?.fire?.sleepDisturbances) || false,
            emotionalExpression: initialData?.functionalMedicine?.fiveElements?.fire?.emotionalExpression || 5,
            circulation: initialData?.functionalMedicine?.fiveElements?.fire?.circulation || 5,
            anxietyTendency: initialData?.functionalMedicine?.fiveElements?.fire?.anxietyTendency || false // ← ADICIONAR ESTA LINHA
          },
          earth: {
            digestiveStrength: initialData?.functionalMedicine?.fiveElements?.earth?.digestiveStrength || 5,
            worryTendency: initialData?.functionalMedicine?.fiveElements?.earth?.worryTendency || 5,
            overthinking: initialData?.functionalMedicine?.fiveElements?.earth?.overthinking || 5,
            sweetCravings: initialData?.functionalMedicine?.fiveElements?.earth?.sweetCravings || false,
            bloatingAfterMeals: initialData?.functionalMedicine?.fiveElements?.earth?.bloatingAfterMeals || false,
            concentrationIssues: initialData?.functionalMedicine?.fiveElements?.earth?.concentrationIssues || false,
            empathy: initialData?.functionalMedicine?.fiveElements?.earth?.empathy || 5,
            groundedness: initialData?.functionalMedicine?.fiveElements?.earth?.groundedness || 5,
            nurturingAbility: initialData?.functionalMedicine?.fiveElements?.earth?.nurturingAbility || 5
          },
          metal: {
            respiratoryHealth: initialData?.functionalMedicine?.fiveElements?.metal?.respiratoryHealth || 5,
            skinHealth: initialData?.functionalMedicine?.fiveElements?.metal?.skinHealth || 5,
            griefProcessing: initialData?.functionalMedicine?.fiveElements?.metal?.griefProcessing || 5,
            detoxCapacity: initialData?.functionalMedicine?.fiveElements?.metal?.detoxCapacity || 5,
            immuneStrength: initialData?.functionalMedicine?.fiveElements?.metal?.immuneStrength || 5,
            breathingQuality: initialData?.functionalMedicine?.fiveElements?.metal?.breathingQuality || 5,
            organizationSkills: initialData?.functionalMedicine?.fiveElements?.metal?.organizationSkills || 5,
            perfectionism: initialData?.functionalMedicine?.fiveElements?.metal?.perfectionism || 5,
            boundariesSetting: initialData?.functionalMedicine?.fiveElements?.metal?.boundariesSetting || 5
          },
          water: {
            adrenalFatigue: initialData?.functionalMedicine?.fiveElements?.water?.adrenalFatigue || 5,
            fearAnxiety: initialData?.functionalMedicine?.fiveElements?.water?.fearAnxiety || 5,
            sexualVitality: initialData?.functionalMedicine?.fiveElements?.water?.sexualVitality || 5,
            boneHealth: initialData?.functionalMedicine?.fiveElements?.water?.boneHealth || 5,
            willpower: initialData?.functionalMedicine?.fiveElements?.water?.willpower || 5,
            coldTolerance: initialData?.functionalMedicine?.fiveElements?.water?.coldTolerance || 5,
            urinaryHealth: initialData?.functionalMedicine?.fiveElements?.water?.urinaryHealth || 5,
            memoryRetention: initialData?.functionalMedicine?.fiveElements?.water?.memoryRetention || 5,
            motivation: initialData?.functionalMedicine?.fiveElements?.water?.motivation || 5,
            resilience: initialData?.functionalMedicine?.fiveElements?.water?.resilience || 5
          }
        }
      },
      cognitive: {
        focusQuality: initialData?.cognitive?.focusQuality || 5,
        memoryQuality: initialData?.cognitive?.memoryQuality || 5,
        mentalClarity: initialData?.cognitive?.mentalClarity || 5,
        creativityLevel: initialData?.cognitive?.creativityLevel || 5,
        learningSpeed: initialData?.cognitive?.learningSpeed || 5,
        cognitiveSymptoms: {
          brainFog: initialData?.cognitive?.cognitiveSymptoms?.brainFog || false,
          concentrationDifficulty: initialData?.cognitive?.cognitiveSymptoms?.concentrationDifficulty || false,
          memoryLapses: initialData?.cognitive?.cognitiveSymptoms?.memoryLapses || false,
          mentalFatigue: initialData?.cognitive?.cognitiveSymptoms?.mentalFatigue || false,
          decisionFatigue: initialData?.cognitive?.cognitiveSymptoms?.decisionFatigue || false,
          wordFinding: initialData?.cognitive?.cognitiveSymptoms?.wordFinding || false,
          multitaskingDifficulty: initialData?.cognitive?.cognitiveSymptoms?.multitaskingDifficulty || false
        },
        preferredLearningStyle: initialData?.cognitive?.preferredLearningStyle || 'visual',
        attentionSpan: initialData?.cognitive?.attentionSpan || 30,
        stressResponse: {
          stressTriggers: initialData?.cognitive?.stressResponse?.stressTriggers || [],
          copingMechanisms: initialData?.cognitive?.stressResponse?.copingMechanisms || [],
          stressRecovery: initialData?.cognitive?.stressResponse?.stressRecovery || 5
        }
      }
    };
  });

  const [stepValidation, setStepValidation] = useState<Record<number, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // 🔧 FUNÇÕES UTILITÁRIAS
  const updateFormData = (updates: Partial<BiohackingData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    setHasUnsavedChanges(true);
    onDataUpdate?.(updates);
  };

  const validateStep = (step: number): boolean => {
    // Validação básica por step
    switch (step) {
      case 1: // Dados Físicos
        return formData.anthropometric.height > 0 && 
               formData.anthropometric.currentWeight > 0;
      case 2: // Sono & Energia
        return formData.sleep.averageSleepDuration > 0;
      case 3: // Nutrição
        return formData.nutrition.mealsPerDay > 0 && 
               formData.nutrition.waterIntake > 0;
      case 4: // Atividade Física
        return true; // Validação mais flexível
      case 5: // Saúde Geral
        return formData.healthStatus.overallHealth > 0;
      case 6: // Medicina Funcional
        return true; // Sempre válido (autoavaliação)
      default:
        return false;
    }
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= 6) {
      setCurrentStep(step);
      onStepChange?.(step);
    }
  };

  const nextStep = () => {
    const isValid = validateStep(currentStep);
    setStepValidation(prev => ({ ...prev, [currentStep]: isValid }));

    if (isValid) {
      if (currentStep < 6) {
        goToStep(currentStep + 1);
      } else {
        handleComplete();
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    } else {
      onBack?.();
    }
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      await onComplete(formData);
    } catch (error) {
      console.error('Erro ao finalizar biohacking:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🎯 RENDERIZAÇÃO DOS STEPS
  const renderCurrentStep = () => {
    const stepProps = {
      data: formData,
      onUpdate: updateFormData,
      onValidationChange: (isValid: boolean) => {
        setStepValidation(prev => ({ ...prev, [currentStep]: isValid }));
      }
    };

    switch (currentStep) {
      case 1:
        return <BiohackingStep1 {...stepProps} />;
      case 2:
        return <BiohackingStep2 {...stepProps} />;
      case 3:
        return <BiohackingStep3 {...stepProps} />;
      case 4:
        return <BiohackingStep4 {...stepProps} />;
      case 5:
        return <BiohackingStep5 {...stepProps} />;
      case 6:
        return <BiohackingStep6 {...stepProps} />;
      default:
        return <div>Step não encontrado</div>;
    }
  };

  const currentStepConfig = STEPS[currentStep - 1];
  const progressPercentage = ((currentStep - 1) / 6) * 100;
  const completedSteps = Object.keys(stepValidation).filter(
    key => stepValidation[parseInt(key)]
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header com progresso */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Perfil Biohacking
            </h1>
            <div className="text-sm text-gray-600">
              Step {currentStep} de 6 • {completedSteps} completos
            </div>
          </div>
          
          {/* Barra de progresso */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          {/* Step indicators */}
          <div className="grid grid-cols-6 gap-2 text-xs">
            {STEPS.map((step, index) => {
              const StepIcon = step.icon;
              const isCompleted = stepValidation[step.id];
              const isCurrent = currentStep === step.id;
              
              return (
                <div 
                  key={step.id}
                  className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                    isCurrent 
                      ? 'bg-blue-100 text-blue-700' 
                      : isCompleted 
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full mb-1">
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <StepIcon className="w-4 h-4" />
                    )}
                  </div>
                  <span className="text-center leading-tight">{step.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step atual */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <currentStepConfig.icon className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                {currentStepConfig.title}
              </h2>
            </div>
            <p className="text-gray-600 mb-2">{currentStepConfig.description}</p>
            <div className="text-sm text-gray-500">
              ⏱️ Tempo estimado: {currentStepConfig.estimatedTime} minutos
            </div>
          </div>

          <div className="p-6">
            {renderCurrentStep()}
          </div>
        </div>

        {/* Navegação */}
        <div className="flex justify-between items-center">
          <button
            onClick={prevStep}
            className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {currentStep === 1 ? 'Voltar' : 'Anterior'}
          </button>

          <div className="text-center">
            {hasUnsavedChanges && (
              <div className="text-sm text-orange-600 mb-2">
                ⚠️ Alterações não salvas
              </div>
            )}
          </div>

          <button
            onClick={nextStep}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                {currentStep === 6 ? 'Finalizar' : 'Próximo'}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Informações científicas */}
        <div className="mt-8 bg-blue-50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-blue-900 mb-1">
                Por que coletamos esses dados?
              </h3>
              <p className="text-sm text-blue-700">
                Cada informação é cientificamente validada para criar seu perfil biohacking personalizado. 
                Integramos dados antropométricos, padrões circadianos, nutrição, atividade física e medicina 
                tradicional chinesa para gerar insights únicos sobre sua saúde e performance.
              </p>
            </div>
          </div>
        </div>

        {/* Debug info (desenvolvimento) */}
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4 bg-gray-100 rounded-lg p-4">
            <summary className="font-medium text-gray-700 cursor-pointer">
              🔧 Debug - Dados do formulário
            </summary>
            <pre className="mt-2 text-xs text-gray-600 overflow-auto max-h-60">
              {JSON.stringify(formData, null, 2)}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
};

export default BiohackingForm;