import CalculatorBlock from '@/ui/core/calculator/CalculatorBlock';
import { CalculatorProvider } from '@/ui/core/calculator/CalculatorContext';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Calculator',
};

export default function CalculatorPage() {
  return (
    <CalculatorProvider>
      <CalculatorBlock />
    </CalculatorProvider>
  );
}
