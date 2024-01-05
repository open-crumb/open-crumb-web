import { encodeGlobalID } from '@pothos/plugin-relay';
import builder from '@/server/graphql/builder';
import { LogbookEntryType } from '@/server/graphql/schema/logbook-entry';
import { LogbookUpdateModel } from '@/server/data/LogbookDataSource';

export const LogbookUpdateType =
  builder.objectRef<LogbookUpdateModel>('LogbookUpdate');

builder.node(LogbookUpdateType, {
  description: `
Represents a step or update to a logbook entry. May have associated
ingredients or measurements. An example might be preparing the levain for a
country sourdough logbook entry.`,
  id: {
    resolve: ({ id }) => id,
  },
  async loadOne(id, context) {
    return await context.dataSources.logbook.getUpdateByID(id);
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
    date: t.expose('date', {
      type: 'Date',
    }),
    title: t.exposeString('title'),
    description: t.exposeString('description'),
  }),
});

builder.objectField(LogbookEntryType, 'updates', (t) =>
  t.connection({
    type: LogbookUpdateType,
    async resolve(entry, args, context) {
      const updates = await context.dataSources.logbook.getUpdatesForEntry(
        entry.id,
      );

      return {
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor:
            updates.length > 0
              ? encodeGlobalID('LogbookUpdate', updates[0].id)
              : null,
          endCursor:
            updates.length > 0
              ? encodeGlobalID('LogbookUpdate', updates.at(-1)!.id)
              : null,
        },
        edges: updates.map((update) => ({
          cursor: encodeGlobalID('LogbookUpdate', update.id),
          node: update,
        })),
      };
    },
  }),
);
