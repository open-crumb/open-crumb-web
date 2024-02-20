import builder from '@/server/graphql/builder';
import { LogbookIngredientType } from '@/server/graphql/schema/logbook-ingredient';
import IngredientUnit from '@/server/graphql/schema/ingredient-unit-enum';

const CreateLogbookIngredientSuccess = builder.simpleObject(
  'CreateLogbookIngredientSuccess',
  {
    fields: (t) => ({
      ingredient: t.field({
        type: LogbookIngredientType,
      }),
    }),
  },
);

const CreateLogbookIngredientError = builder.enumType(
  'CreateLogbookIngredientError',
  {
    values: ['LogbookUpdateNotFound', 'Unauthorized'] as const,
  },
);

const CreateLogbookIngredientFail = builder.simpleObject(
  'CreateLogbookIngredientFail',
  {
    fields: (t) => ({
      error: t.field({
        type: CreateLogbookIngredientError,
      }),
    }),
  },
);

const CreateLogbookIngredientResult = builder.unionType(
  'CreateLogbookIngredientResult',
  {
    types: [CreateLogbookIngredientSuccess, CreateLogbookIngredientFail],
    resolveType: (result) =>
      'error' in result
        ? 'CreateLogbookIngredientFail'
        : 'CreateLogbookIngredientSuccess',
  },
);

// @todo auth
builder.mutationField('createLogbookIngredient', (t) =>
  t.field({
    type: CreateLogbookIngredientResult,
    args: {
      updateID: t.arg.globalID({
        required: true,
      }),
      name: t.arg.string(),
      quantity: t.arg.float({
        description: `
          Leave this arg undefined to avoid setting a value. Explicitly sending
          \`null\` for this arg will persist it as \`null\`.
        `,
      }),
      unit: t.arg({
        type: IngredientUnit,
        description: `
          Leave this arg undefined to avoid setting a value. Explicitly sending
          \`null\` for this arg will persist it as \`null\`.
        `,
      }),
    },
    async resolve(root, args, context) {
      const ingredient = await context.dataSources.logbook.createIngredient({
        updateID: args.updateID.id,
        ...(typeof args.name === 'string' && { name: args.name }),
        ...(typeof args.quantity !== 'undefined' && {
          description: args.quantity,
        }),
        ...(typeof args.unit !== 'undefined' && { unit: args.unit }),
      });

      return { ingredient };
    },
  }),
);
