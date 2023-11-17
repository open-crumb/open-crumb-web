/**
 * This calculator is used to determine the amounts of each ingredient needed
 * for a batch of bread.
 */
'use client';

import Heading from '@/ui/design/Heading';
import CalculatorContext, {
  CalculatorProvider,
} from '@/ui/core/calculator/CalculatorContext';
import CalculatorEditor from '@/ui/core/calculator/CalculatorEditor';
import CalculatorDisplay from '@/ui/core/calculator/CalculatorDisplay';

export default function CalculatorBlock() {
  return (
    <CalculatorProvider>
      <Heading level="2">Calculator</Heading>
      <CalculatorContext.Consumer>
        {({ state }) => {
          switch (state.step) {
            case 'EDIT':
              return <CalculatorEditor />;
            case 'DISPLAY':
              return <CalculatorDisplay />;
          }
        }}
      </CalculatorContext.Consumer>
    </CalculatorProvider>
  );
}
