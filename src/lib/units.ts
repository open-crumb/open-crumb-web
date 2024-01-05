import { IngredientUnit, MeasurementUnit } from '@/ui/graphql/graphql';

export const INGREDIENT_UNITS: Array<{
  value: IngredientUnit;
  text: string;
}> = [
  {
    value: 'MassGram',
    text: 'g',
  },
  {
    value: 'MassKilogram',
    text: 'kg',
  },
  {
    value: 'VolumeMilliliter',
    text: 'mL',
  },
  {
    value: 'VolumeLiter',
    text: 'L',
  },
  {
    value: 'MassOunce',
    text: 'oz',
  },
  {
    value: 'MassPound',
    text: 'lb',
  },
  {
    value: 'VolumeTeaspoon',
    text: 'tsp',
  },
  {
    value: 'VolumeTablespoon',
    text: 'tbsp',
  },
  {
    value: 'VolumeCup',
    text: 'cup',
  },
  {
    value: 'VolumePint',
    text: 'pt',
  },
  {
    value: 'VolumeQuart',
    text: 'qt',
  },
  {
    value: 'VolumeGallon',
    text: 'gal',
  },
];

export const MEASUREMENT_UNITS: Array<{
  value: MeasurementUnit;
  text: string;
}> = [
  {
    value: 'TemperatureFahrenheit',
    text: '℉',
  },
  {
    value: 'TemperatureCelsius',
    text: '℃',
  },
  {
    value: 'Percent',
    text: '%',
  },
];
