import builder from '@/server/graphql/builder';
import { LogbookUpdateType } from '@/server/graphql/schema/logbook-update';

const SetLogbookUpdateSuccess = builder.simpleObject(
  'SetLogbookUpdateSuccess',
  {
    fields: (t) => ({
      update: t.field({
        type: LogbookUpdateType,
      }),
    }),
  },
);

const SetLogbookUpdateError = builder.enumType('SetLogbookUpdateError', {
  values: ['LogbookUpdateNotFound', 'Unauthorized'] as const,
});

const SetLogbookUpdateFail = builder.simpleObject('SetLogbookUpdateFail', {
  fields: (t) => ({
    error: t.field({
      type: SetLogbookUpdateError,
    }),
  }),
});

const SetLogbookUpdateResult = builder.unionType('SetLogbookUpdateResult', {
  types: [SetLogbookUpdateSuccess, SetLogbookUpdateFail],
  resolveType: (result) =>
    'error' in result ? 'SetLogbookUpdateFail' : 'SetLogbookUpdateSuccess',
});

// @todo auth
builder.mutationField('setLogbookUpdate', (t) =>
  t.field({
    type: SetLogbookUpdateResult,
    args: {
      id: t.arg.globalID({
        required: true,
      }),
      date: t.arg({ type: 'Date' }),
      title: t.arg.string(),
      description: t.arg.string(),
    },
    async resolve(root, args, context) {
      const update = await context.dataSources.logbook.setUpdate({
        id: args.id.id,
        ...(args.date && { date: args.date }),
        ...(typeof args.title === 'string' && { title: args.title }),
        ...(typeof args.description === 'string' && {
          description: args.description,
        }),
      });

      return update
        ? { update }
        : {
            error: 'LogbookUpdateNotFound' as const,
          };
    },
  }),
);
