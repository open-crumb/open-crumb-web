import CalculatorBlock from '@/ui/core/calculator/CalculatorBlock';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Calculator',
};

export default function CalculatorPage() {
  return (
    <main>
      <CalculatorBlock />
    </main>
  );
}
