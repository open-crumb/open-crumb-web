import builder from '@/server/graphql/builder';

const MeasurementUnit = builder.enumType('MeasurementUnit', {
  description: `
Measurement units per the [Unicode CLDR](https://github.com/unicode-org/cldr/blob/main/common/validity/unit.xml).`,
  values: ['TemperatureFahrenheit', 'TemperatureCelsius', 'Percent'] as const,
});

export default MeasurementUnit;
