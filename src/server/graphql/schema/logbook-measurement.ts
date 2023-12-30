import { encodeGlobalID } from '@pothos/plugin-relay';
import builder from '@/server/graphql/builder';
import { LogbookUpdateType } from '@/server/graphql/schema/logbook-update';
import MeasurementUnit from '@/server/graphql/schema/measurement-unit-enum';

export type LogbookMeasurementModel = {
  id: string;
  createdAt: Date;
  modifiedAt: Date;
  archivedAt: Date | null;
  name: string;
  value: number | null;
  unit: 'TemperatureFahrenheit' | 'TemperatureCelsius' | 'Percent' | null;
};

export const LogbookMeasurementType =
  builder.objectRef<LogbookMeasurementModel>('LogbookMeasurement');

builder.node(LogbookMeasurementType, {
  description: `
Represents a measurement taken during a logbook update. Examples might be dough
temperature, room temperature, or relative humidity.`,
  id: {
    resolve: ({ id }) => id,
  },
  async loadOne(id, context) {
    return await context.dataSources.logbook.getMeasurementByID(id);
  },
  fields: (t) => ({
    createdAt: t.expose('createdAt', {
      type: 'Date',
    }),
    modifiedAt: t.expose('modifiedAt', {
      type: 'Date',
    }),
    archivedAt: t.expose('archivedAt', {
      type: 'Date',
      nullable: true,
    }),
    name: t.exposeString('name'),
    value: t.exposeFloat('value', {
      nullable: true,
    }),
    unit: t.field({
      type: MeasurementUnit,
      nullable: true,
      resolve: (measurement) => measurement.unit,
    }),
  }),
});

builder.objectField(LogbookUpdateType, 'measurements', (t) =>
  t.connection({
    type: LogbookMeasurementType,
    async resolve(update, args, context) {
      const measurements =
        await context.dataSources.logbook.getMeasurementsForUpdate(update.id);

      return {
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor:
            measurements.length > 0
              ? encodeGlobalID('LogbookMeasurement', measurements[0].id)
              : null,
          endCursor:
            measurements.length > 0
              ? encodeGlobalID('LogbookMeasurement', measurements.at(-1)!.id)
              : null,
        },
        edges: measurements.map((measurement) => ({
          cursor: encodeGlobalID('LogbookMeasurement', measurement.id),
          node: measurement,
        })),
      };
    },
  }),
);
