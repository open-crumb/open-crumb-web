import { encodeGlobalID } from '@pothos/plugin-relay';
import builder from '@/server/graphql/builder';
import { UserType } from '@/server/graphql/schema/user';
import { LogbookEntryModel } from '@/server/data/LogbookDataSource';

export const LogbookEntryType =
  builder.objectRef<LogbookEntryModel>('LogbookEntry');

builder.node(LogbookEntryType, {
  description: `
Represents a logbook entry for an entity. This might be a single bake an entity
is working on.`,
  id: {
    resolve: ({ id }) => id,
  },
  async loadOne(id, context) {
    return await context.dataSources.logbook.getEntryByID(id);
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
    slug: t.exposeString('id', {
      description: `An opaque URL-friendly identifier for the entry.`,
    }),
    title: t.exposeString('title'),
    description: t.exposeString('description'),
  }),
});

// @todo auth
builder.objectField(UserType, 'logbookEntries', (t) =>
  t.connection({
    type: LogbookEntryType,
    async resolve(user, args, context) {
      const entries = await context.dataSources.logbook.getEntriesForUser(
        user.id,
      );

      return {
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor:
            entries.length > 0
              ? encodeGlobalID('LogbookEntry', entries[0].id)
              : null,
          endCursor:
            entries.length > 0
              ? encodeGlobalID('LogbookEntry', entries.at(-1)!.id)
              : null,
        },
        edges: entries.map((entry) => ({
          cursor: encodeGlobalID('LogbookEntry', entry.id),
          node: entry,
        })),
      };
    },
  }),
);

// @todo auth
builder.queryField('logbookEntry', (t) =>
  t.field({
    type: LogbookEntryType,
    nullable: true,
    args: {
      slug: t.arg.string({
        required: true,
      }),
    },
    async resolve(root, args, context) {
      return await context.dataSources.logbook.getEntryByID(args.slug);
    },
  }),
);
