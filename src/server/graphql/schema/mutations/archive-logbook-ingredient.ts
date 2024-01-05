import builder from '@/server/graphql/builder';
import { LogbookIngredientType } from '@/server/graphql/schema/logbook-ingredient';

const ArchiveLogbookIngredientSuccess = builder.simpleObject(
  'ArchiveLogbookIngredientSuccess',
  {
    fields: (t) => ({
      ingredient: t.field({
        type: LogbookIngredientType,
      }),
    }),
  },
);

const ArchiveLogbookIngredientError = builder.enumType(
  'ArchiveLogbookIngredientError',
  {
    values: ['LogbookIngredientNotFound', 'Unauthorized'] as const,
  },
);

const ArchiveLogbookIngredientFail = builder.simpleObject(
  'ArchiveLogbookIngredientFail',
  {
    fields: (t) => ({
      error: t.field({
        type: ArchiveLogbookIngredientError,
      }),
    }),
  },
);

const ArchiveLogbookIngredientResult = builder.unionType(
  'ArchiveLogbookIngredientResult',
  {
    types: [ArchiveLogbookIngredientSuccess, ArchiveLogbookIngredientFail],
    resolveType: (result) =>
      'error' in result
        ? 'ArchiveLogbookIngredientFail'
        : 'ArchiveLogbookIngredientSuccess',
  },
);

// @todo auth
builder.mutationField('archiveLogbookIngredient', (t) =>
  t.field({
    type: ArchiveLogbookIngredientResult,
    args: {
      id: t.arg.globalID({
        required: true,
      }),
    },
    async resolve(root, args, context) {
      const ingredient = await context.dataSources.logbook.archiveIngredient(
        args.id.id,
      );

      return ingredient
        ? { ingredient }
        : {
            error: 'LogbookIngredientNotFound' as const,
          };
    },
  }),
);
