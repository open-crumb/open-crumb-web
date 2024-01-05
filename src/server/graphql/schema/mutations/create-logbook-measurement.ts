import builder from '@/server/graphql/builder';
import { LogbookMeasurementType } from '@/server/graphql/schema/logbook-measurement';
import MeasurementUnit from '@/server/graphql/schema/measurement-unit-enum';

const CreateLogbookMeasurementSuccess = builder.simpleObject(
  'CreateLogbookMeasurementSuccess',
  {
    fields: (t) => ({
      ingredient: t.field({
        type: LogbookMeasurementType,
      }),
    }),
  },
);

const CreateLogbookMeasurementError = builder.enumType(
  'CreateLogbookMeasurementError',
  {
    values: ['LogbookUpdateNotFound', 'Unauthorized'] as const,
  },
);

const CreateLogbookMeasurementFail = builder.simpleObject(
  'CreateLogbookMeasurementFail',
  {
    fields: (t) => ({
      error: t.field({
        type: CreateLogbookMeasurementError,
      }),
    }),
  },
);

const CreateLogbookMeasurementResult = builder.unionType(
  'CreateLogbookMeasurementResult',
  {
    types: [CreateLogbookMeasurementSuccess, CreateLogbookMeasurementFail],
    resolveType: (result) =>
      'error' in result
        ? 'CreateLogbookMeasurementFail'
        : 'CreateLogbookMeasurementSuccess',
  },
);

// @todo auth
builder.mutationField('createLogbookMeasurement', (t) =>
  t.field({
    type: CreateLogbookMeasurementResult,
    args: {
      updateID: t.arg.globalID({
        required: true,
      }),
      name: t.arg.string(),
      value: t.arg.float(),
      unit: t.arg({
        type: MeasurementUnit,
      }),
    },
    async resolve(root, args, context) {
      const ingredient = await context.dataSources.logbook.createMeasurement({
        updateID: args.updateID.id,
        ...(typeof args.name === 'string' && { name: args.name }),
        ...(typeof args.value === 'number' && {
          description: args.value,
        }),
        ...(args.unit && { unit: args.unit }),
      });

      return { ingredient };
    },
  }),
);
