import { encodeGlobalID } from '@pothos/plugin-relay';
import builder from '@/server/graphql/builder';
import { LogbookUpdateType } from '@/server/graphql/schema/logbook-update';
import IngredientUnit from '@/server/graphql/schema/ingredient-unit-enum';
import { LogbookIngredientModel } from '@/server/data/LogbookDataSource';

export const LogbookIngredientType =
  builder.objectRef<LogbookIngredientModel>('LogbookIngredient');

builder.node(LogbookIngredientType, {
  description: 'Represents an ingredient used in a logbook update.',
  id: {
    resolve: ({ id }) => id,
  },
  async loadOne(id, context) {
    return await context.dataSources.logbook.getIngredientByID(id);
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
    quantity: t.exposeFloat('quantity', {
      nullable: true,
    }),
    unit: t.field({
      type: IngredientUnit,
      nullable: true,
      resolve(ingredient) {
        return ingredient.unit;
      },
    }),
  }),
});

builder.objectField(LogbookUpdateType, 'ingredients', (t) =>
  t.connection({
    type: LogbookIngredientType,
    async resolve(update, args, context) {
      const ingredients =
        await context.dataSources.logbook.getIngredientsForUpdate(update.id);

      return {
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor:
            ingredients.length > 0
              ? encodeGlobalID('LogbookIngredient', ingredients[0].id)
              : null,
          endCursor:
            ingredients.length > 0
              ? encodeGlobalID('LogbookIngredient', ingredients.at(-1)!.id)
              : null,
        },
        edges: ingredients.map((ingredient) => ({
          cursor: encodeGlobalID('LogbookIngredient', ingredient.id),
          node: ingredient,
        })),
      };
    },
  }),
);
