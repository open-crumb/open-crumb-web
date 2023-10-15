/**
 * Initially we need to work out the total flour weight for one loaf. In baker's
 * math ingredient weights are expressed as ratios of the total flour weight.
 * When planning some bakers start with this value while others may target a
 * total dough weight (to fit a specific banneton size for example) and want to
 * calculate the total flour weight from this based on hydration preference.
 * Most sources recommend a salinity of 2% for bread so that's the default.
 *
 * Formulas:
 *
 *   Dough Weight = Flour Weight + Water Weight + Salt Weight + Filling Weight
 *
 *   Water Weight = Flour Weight * Hydration
 *
 *   Salt Weight = Flour Weight * Salinity
 *
 *   Filling Weight = Flour Weight * Filling Ratio
 *
 *   Dough Weight =
 *     (Flour Weight) +
 *     (Flour Weight * Hydration) +
 *     (Flour Weight * Salinity) +
 *     (Flour Weight * Filling Ratio)
 *
 *   Dough Weight = Flour Weight * (1 + Hydration + Salinity + Filling Ratio)
 *
 *   Flour Weight = Dough Weight / (1 + Hydration + Salinity + Filling Ratio)
 */
import { Box, Button, Flex, TextField } from '@radix-ui/themes';
import { useState } from 'react';

type Props = {
  onNext: () => void;
};

export default function Step1(props: Props) {
  const [mode, setMode] = useState<'BY_FLOUR_WEIGHT' | 'BY_DOUGH_WEIGHT'>(
    'BY_FLOUR_WEIGHT',
  );
  const [flourWeightInput, setFlourWeightInput] = useState('');
  const [doughWeightInput, setDoughWeightInput] = useState('');
  const [hydrationInput, setHydrationInput] = useState('80');
  const [salinityInput, setSalinityInput] = useState('2');
  const [fillingRatioInput, setFillingRatioInput] = useState('0');

  return (
    <div>
      <Flex gap="4">
        <Box grow="1">
          <label>
            Flour Weight
            <TextField.Root>
              <TextField.Input
                type="number"
                value={flourWeightInput}
                onChange={(event) => {
                  setMode('BY_FLOUR_WEIGHT');
                  setFlourWeightInput(event.target.value);
                  setDoughWeightInput(
                    calculateDoughWeight({
                      flourWeightInput: event.target.value,
                      hydrationInput,
                      salinityInput,
                      fillingRatioInput,
                    }),
                  );
                }}
                min="0"
              />
              <TextField.Slot>g</TextField.Slot>
            </TextField.Root>
          </label>
        </Box>
        <Box grow="1" mb="2">
          <label>
            Dough Weight
            <TextField.Root>
              <TextField.Input
                type="number"
                value={doughWeightInput}
                onChange={(event) => {
                  setMode('BY_DOUGH_WEIGHT');
                  setDoughWeightInput(event.target.value);
                  setFlourWeightInput(
                    calculateFlourWeight({
                      doughWeightInput: event.target.value,
                      hydrationInput,
                      salinityInput,
                      fillingRatioInput,
                    }),
                  );
                }}
                min="0"
              />
              <TextField.Slot>g</TextField.Slot>
            </TextField.Root>
          </label>
        </Box>
      </Flex>
      <label className="mb-2 block">
        Hydration
        <TextField.Root>
          <TextField.Input
            type="number"
            value={hydrationInput}
            onChange={(event) => {
              setHydrationInput(event.target.value);

              switch (mode) {
                case 'BY_FLOUR_WEIGHT':
                  setDoughWeightInput(
                    calculateDoughWeight({
                      flourWeightInput,
                      hydrationInput: event.target.value,
                      salinityInput,
                      fillingRatioInput,
                    }),
                  );

                  break;
                case 'BY_DOUGH_WEIGHT':
                  setFlourWeightInput(
                    calculateFlourWeight({
                      doughWeightInput,
                      hydrationInput: event.target.value,
                      salinityInput,
                      fillingRatioInput,
                    }),
                  );

                  break;
              }
            }}
            min="0"
          />
          <TextField.Slot>%</TextField.Slot>
        </TextField.Root>
      </label>
      <label className="mb-2 block">
        Salt
        <TextField.Root>
          <TextField.Input
            type="number"
            value={salinityInput}
            onChange={(event) => {
              setSalinityInput(event.target.value);

              switch (mode) {
                case 'BY_FLOUR_WEIGHT':
                  setDoughWeightInput(
                    calculateDoughWeight({
                      flourWeightInput,
                      hydrationInput,
                      salinityInput: event.target.value,
                      fillingRatioInput,
                    }),
                  );

                  break;
                case 'BY_DOUGH_WEIGHT':
                  setFlourWeightInput(
                    calculateFlourWeight({
                      doughWeightInput,
                      hydrationInput,
                      salinityInput: event.target.value,
                      fillingRatioInput,
                    }),
                  );

                  break;
              }
            }}
            min="0"
          />
          <TextField.Slot>%</TextField.Slot>
        </TextField.Root>
      </label>
      <label className="mb-2 block">
        Filling (optional)
        <TextField.Root>
          <TextField.Input
            type="number"
            value={fillingRatioInput}
            onChange={(event) => {
              setFillingRatioInput(event.target.value);

              switch (mode) {
                case 'BY_FLOUR_WEIGHT':
                  setDoughWeightInput(
                    calculateDoughWeight({
                      flourWeightInput,
                      hydrationInput,
                      salinityInput,
                      fillingRatioInput: event.target.value,
                    }),
                  );

                  break;
                case 'BY_DOUGH_WEIGHT':
                  setFlourWeightInput(
                    calculateFlourWeight({
                      doughWeightInput,
                      hydrationInput,
                      salinityInput,
                      fillingRatioInput: event.target.value,
                    }),
                  );

                  break;
              }
            }}
            min="0"
          />
          <TextField.Slot>%</TextField.Slot>
        </TextField.Root>
      </label>
      <Button>Next</Button>
    </div>
  );
}

function calculateDoughWeight({
  flourWeightInput,
  hydrationInput,
  salinityInput,
  fillingRatioInput,
}: {
  flourWeightInput: string;
  hydrationInput: string;
  salinityInput: string;
  fillingRatioInput: string;
}): string {
  const flourWeight = Number(flourWeightInput);
  const hydration = Number(hydrationInput) / 100;
  const salinity = Number(salinityInput) / 100;
  const fillingRatio = Number(fillingRatioInput) / 100;

  if (
    !Number.isFinite(flourWeight) ||
    !Number.isFinite(hydration) ||
    !Number.isFinite(salinity) ||
    !Number.isFinite(fillingRatio)
  ) {
    return '';
  }

  const doughWeight = flourWeight * (1 + hydration + salinity + fillingRatio);

  return String(Math.round(doughWeight));
}

function calculateFlourWeight({
  doughWeightInput,
  hydrationInput,
  salinityInput,
  fillingRatioInput,
}: {
  doughWeightInput: string;
  hydrationInput: string;
  salinityInput: string;
  fillingRatioInput: string;
}): string {
  const doughWeight = Number(doughWeightInput);
  const hydration = Number(hydrationInput) / 100;
  const salinity = Number(salinityInput) / 100;
  const fillingRatio = Number(fillingRatioInput) / 100;

  if (
    !Number.isFinite(doughWeight) ||
    !Number.isFinite(hydration) ||
    !Number.isFinite(salinity) ||
    !Number.isFinite(fillingRatio)
  ) {
    return '';
  }

  const flourWeight = doughWeight / (1 + hydration + salinity + fillingRatio);

  return String(Math.round(flourWeight));
}
