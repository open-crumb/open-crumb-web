import builder from '@/server/graphql/builder';
import { LogbookMeasurementType } from '@/server/graphql/schema/logbook-measurement';

const ArchiveLogbookMeasurementSuccess = builder.simpleObject(
  'ArchiveLogbookMeasurementSuccess',
  {
    fields: (t) => ({
      measurement: t.field({
        type: LogbookMeasurementType,
      }),
    }),
  },
);

const ArchiveLogbookMeasurementError = builder.enumType(
  'ArchiveLogbookMeasurementError',
  {
    values: ['LogbookMeasurementNotFound', 'Unauthorized'] as const,
  },
);

const ArchiveLogbookMeasurementFail = builder.simpleObject(
  'ArchiveLogbookMeasurementFail',
  {
    fields: (t) => ({
      error: t.field({
        type: ArchiveLogbookMeasurementError,
      }),
    }),
  },
);

const ArchiveLogbookMeasurementResult = builder.unionType(
  'ArchiveLogbookMeasurementResult',
  {
    types: [ArchiveLogbookMeasurementSuccess, ArchiveLogbookMeasurementFail],
    resolveType: (result) =>
      'error' in result
        ? 'ArchiveLogbookMeasurementFail'
        : 'ArchiveLogbookMeasurementSuccess',
  },
);

// @todo auth
builder.mutationField('archiveLogbookMeasurement', (t) =>
  t.field({
    type: ArchiveLogbookMeasurementResult,
    args: {
      id: t.arg.globalID({
        required: true,
      }),
    },
    async resolve(root, args, context) {
      const measurement = await context.dataSources.logbook.archiveMeasurement(
        args.id.id,
      );

      return measurement
        ? { measurement }
        : {
            error: 'LogbookMeasurementNotFound' as const,
          };
    },
  }),
);
