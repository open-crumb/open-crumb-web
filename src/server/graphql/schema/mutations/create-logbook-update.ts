import builder from '@/server/graphql/builder';
import { LogbookUpdateType } from '@/server/graphql/schema/logbook-update';

const CreateLogbookUpdateSuccess = builder.simpleObject(
  'CreateLogbookUpdateSuccess',
  {
    fields: (t) => ({
      update: t.field({
        type: LogbookUpdateType,
      }),
    }),
  },
);

const CreateLogbookUpdateError = builder.enumType('CreateLogbookUpdateError', {
  values: ['LogbookEntryNotFound', 'Unauthorized'] as const,
});

const CreateLogbookUpdateFail = builder.simpleObject(
  'CreateLogbookUpdateFail',
  {
    fields: (t) => ({
      error: t.field({
        type: CreateLogbookUpdateError,
      }),
    }),
  },
);

const CreateLogbookUpdateResult = builder.unionType(
  'CreateLogbookUpdateResult',
  {
    types: [CreateLogbookUpdateSuccess, CreateLogbookUpdateFail],
    resolveType: (result) =>
      'error' in result
        ? 'CreateLogbookUpdateFail'
        : 'CreateLogbookUpdateSuccess',
  },
);

// @todo auth
builder.mutationField('createLogbookUpdate', (t) =>
  t.field({
    type: CreateLogbookUpdateResult,
    args: {
      entryID: t.arg.globalID({
        required: true,
      }),
      date: t.arg({ type: 'Date' }),
      title: t.arg.string(),
      description: t.arg.string(),
    },
    async resolve(root, args, context) {
      const update = await context.dataSources.logbook.createUpdate({
        entryID: args.entryID.id,
        ...(args.date && { date: args.date }),
        ...(typeof args.title === 'string' && { title: args.title }),
        ...(typeof args.description === 'string' && {
          description: args.description,
        }),
      });

      return { update };
    },
  }),
);
