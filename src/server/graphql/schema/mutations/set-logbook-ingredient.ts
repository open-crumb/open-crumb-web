import builder from '@/server/graphql/builder';
import { LogbookIngredientType } from '@/server/graphql/schema/logbook-ingredient';
import IngredientUnit from '@/server/graphql/schema/ingredient-unit-enum';

const SetLogbookIngredientSuccess = builder.simpleObject(
  'SetLogbookIngredientSuccess',
  {
    fields: (t) => ({
      ingredient: t.field({
        type: LogbookIngredientType,
      }),
    }),
  },
);

const SetLogbookIngredientError = builder.enumType(
  'SetLogbookIngredientError',
  {
    values: ['LogbookIngredientNotFound', 'Unauthorized'] as const,
  },
);

const SetLogbookIngredientFail = builder.simpleObject(
  'SetLogbookIngredientFail',
  {
    fields: (t) => ({
      error: t.field({
        type: SetLogbookIngredientError,
      }),
    }),
  },
);

const SetLogbookIngredientResult = builder.unionType(
  'SetLogbookIngredientResult',
  {
    types: [SetLogbookIngredientSuccess, SetLogbookIngredientFail],
    resolveType: (result) =>
      'error' in result
        ? 'SetLogbookIngredientFail'
        : 'SetLogbookIngredientSuccess',
  },
);

// @todo auth
builder.mutationField('setLogbookIngredient', (t) =>
  t.field({
    type: SetLogbookIngredientResult,
    args: {
      id: t.arg.globalID({
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
      console.log('DEBUG', args);
      const ingredient = await context.dataSources.logbook.setIngredient({
        id: args.id.id,
        ...(typeof args.name === 'string' && { name: args.name }),
        ...(typeof args.quantity !== 'undefined' && {
          quantity: args.quantity,
        }),
        ...(typeof args.unit !== 'undefined' && { unit: args.unit }),
      });

      return ingredient
        ? { ingredient }
        : {
            error: 'LogbookIngredientNotFound' as const,
          };
    },
  }),
);
