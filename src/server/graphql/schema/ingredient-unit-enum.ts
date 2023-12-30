import builder from '@/server/graphql/builder';

const IngredientUnit = builder.enumType('IngredientUnit', {
  description: `
Ingredient units per the [Unicode CLDR](https://github.com/unicode-org/cldr/blob/main/common/validity/unit.xml).`,
  values: [
    'MassGram',
    'MassKilogram',
    'VolumeMilliliter',
    'VolumeLiter',
    'MassOunce',
    'MassPound',
    'VolumeTeaspoon',
    'VolumeTablespoon',
    'VolumeCup',
    'VolumeFluidOunce',
    'VolumePint',
    'VolumeQuart',
    'VolumeGallon',
  ] as const,
});

export default IngredientUnit;
