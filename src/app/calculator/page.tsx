import CalculatorBlock from '@/ui/core/calculator/CalculatorBlock';
import { Heading } from '@radix-ui/themes';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Calculator',
};

export default function CalculatorPage() {
  return (
    <main>
      <Heading mt="4" mb="2">
        Calculator
      </Heading>
      <CalculatorBlock />
    </main>
  );
}
