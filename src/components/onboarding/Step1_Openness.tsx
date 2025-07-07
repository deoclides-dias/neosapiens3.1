import React from 'react';

type StepProps = {
  data: number[];
  onDataChange: (data: number[]) => Promise<void>;
  onNext: () => Promise<void>;
  onPrevious: () => void;
  onStepComplete: () => void;
};

export default function Step1_Openness({
  data,
  onDataChange,
  onNext,
  onPrevious,
  onStepComplete
}: StepProps) {
  return <div>Step 1 – Openness</div>;
}
