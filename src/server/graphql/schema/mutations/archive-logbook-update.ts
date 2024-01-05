import builder from '@/server/graphql/builder';
import { LogbookUpdateType } from '@/server/graphql/schema/logbook-update';

const ArchiveLogbookUpdateSuccess = builder.simpleObject(
  'ArchiveLogbookUpdateSuccess',
  {
    fields: (t) => ({
      update: t.field({
        type: LogbookUpdateType,
      }),
    }),
  },
);

const ArchiveLogbookUpdateError = builder.enumType(
  'ArchiveLogbookUpdateError',
  {
    values: ['LogbookUpdateNotFound', 'Unauthorized'] as const,
  },
);

const ArchiveLogbookUpdateFail = builder.simpleObject(
  'ArchiveLogbookUpdateFail',
  {
    fields: (t) => ({
      error: t.field({
        type: ArchiveLogbookUpdateError,
      }),
    }),
  },
);

const ArchiveLogbookUpdateResult = builder.unionType(
  'ArchiveLogbookUpdateResult',
  {
    types: [ArchiveLogbookUpdateSuccess, ArchiveLogbookUpdateFail],
    resolveType: (result) =>
      'error' in result
        ? 'ArchiveLogbookUpdateFail'
        : 'ArchiveLogbookUpdateSuccess',
  },
);

// @todo auth
builder.mutationField('archiveLogbookUpdate', (t) =>
  t.field({
    type: ArchiveLogbookUpdateResult,
    args: {
      id: t.arg.globalID({
        required: true,
      }),
    },
    async resolve(root, args, context) {
      const update = await context.dataSources.logbook.archiveUpdate(
        args.id.id,
      );

      return update
        ? { update }
        : {
            error: 'LogbookUpdateNotFound' as const,
          };
    },
  }),
);
