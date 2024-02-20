import builder from '@/server/graphql/builder';
import { LogbookMeasurementType } from '@/server/graphql/schema/logbook-measurement';
import MeasurementUnit from '@/server/graphql/schema/measurement-unit-enum';

const SetLogbookMeasurementSuccess = builder.simpleObject(
  'SetLogbookMeasurementSuccess',
  {
    fields: (t) => ({
      measurement: t.field({
        type: LogbookMeasurementType,
      }),
    }),
  },
);

const SetLogbookMeasurementError = builder.enumType(
  'SetLogbookMeasurementError',
  {
    values: ['LogbookMeasurementNotFound', 'Unauthorized'] as const,
  },
);

const SetLogbookMeasurementFail = builder.simpleObject(
  'SetLogbookMeasurementFail',
  {
    fields: (t) => ({
      error: t.field({
        type: SetLogbookMeasurementError,
      }),
    }),
  },
);

const SetLogbookMeasurementResult = builder.unionType(
  'SetLogbookMeasurementResult',
  {
    types: [SetLogbookMeasurementSuccess, SetLogbookMeasurementFail],
    resolveType: (result) =>
      'error' in result
        ? 'SetLogbookMeasurementFail'
        : 'SetLogbookMeasurementSuccess',
  },
);

// @todo auth
builder.mutationField('setLogbookMeasurement', (t) =>
  t.field({
    type: SetLogbookMeasurementResult,
    args: {
      id: t.arg.globalID({
        required: true,
      }),
      name: t.arg.string(),
      value: t.arg.float({
        description: `
          Leave this arg undefined to avoid setting a value. Explicitly sending
          \`null\` for this arg will persist it as \`null\`.
        `,
      }),
      unit: t.arg({
        type: MeasurementUnit,
        description: `
          Leave this arg undefined to avoid setting a value. Explicitly sending
          \`null\` for this arg will persist it as \`null\`.
        `,
      }),
    },
    async resolve(root, args, context) {
      const measurement = await context.dataSources.logbook.setMeasurement({
        id: args.id.id,
        ...(typeof args.name === 'string' && { name: args.name }),
        ...(typeof args.value !== 'undefined' && {
          value: args.value,
        }),
        ...(typeof args.unit !== 'undefined' && { unit: args.unit }),
      });

      return measurement
        ? { measurement }
        : {
            error: 'LogbookMeasurementNotFound' as const,
          };
    },
  }),
);
