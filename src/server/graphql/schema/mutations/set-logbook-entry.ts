import builder from '@/server/graphql/builder';
import { LogbookEntryType } from '@/server/graphql/schema/logbook-entry';

const SetLogbookEntrySuccess = builder.simpleObject('SetLogbookEntrySuccess', {
  fields: (t) => ({
    entry: t.field({
      type: LogbookEntryType,
    }),
  }),
});

const SetLogbookEntryError = builder.enumType('SetLogbookEntryError', {
  values: ['LogbookEntryNotFound', 'Unauthorized'] as const,
});

const SetLogbookEntryFail = builder.simpleObject('SetLogbookEntryFail', {
  fields: (t) => ({
    error: t.field({
      type: SetLogbookEntryError,
    }),
  }),
});

const SetLogbookEntryResult = builder.unionType('SetLogbookEntryResult', {
  types: [SetLogbookEntrySuccess, SetLogbookEntryFail],
  resolveType: (result) =>
    'error' in result ? 'SetLogbookEntryFail' : 'SetLogbookEntrySuccess',
});

// @todo auth
builder.mutationField('setLogbookEntry', (t) =>
  t.field({
    type: SetLogbookEntryResult,
    args: {
      id: t.arg.globalID({
        required: true,
      }),
      title: t.arg.string(),
      description: t.arg.string(),
    },
    async resolve(root, args, context) {
      const entry = await context.dataSources.logbook.setEntry({
        id: args.id.id,
        ...(typeof args.title === 'string' && { title: args.title }),
        ...(typeof args.description === 'string' && {
          description: args.description,
        }),
      });

      return entry
        ? { entry }
        : {
            error: 'LogbookEntryNotFound' as const,
          };
    },
  }),
);
