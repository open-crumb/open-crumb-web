/**
 * This calculator is used to determine the amounts of each ingredient needed
 * for a batch of bread.
 */
'use client';

import { useContext } from 'react';
import Heading from '@/ui/design/Heading';
import CalculatorContext from '@/ui/core/calculator/CalculatorContext';
import CalculatorEditor from '@/ui/core/calculator/CalculatorEditor';
import CalculatorDisplay from '@/ui/core/calculator/CalculatorDisplay';

export default function CalculatorBlock() {
  const { state } = useContext(CalculatorContext);

  return (
    <>
      <Heading level="2">Calculator</Heading>
      {state.step === 'EDIT' && <CalculatorEditor />}
      {state.step === 'DISPLAY' && <CalculatorDisplay />}
    </>
  );
}
