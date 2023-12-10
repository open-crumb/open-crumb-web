import data from '@/data/logbook';
import LogbookEntryBlock from '@/ui/core/logbook/entry/LogbookEntryBlock';
import { Cache, LogbookProvider } from '@/ui/core/logbook/LogbookContext';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Classic Sourdough',
};

type EntryData = {
  id: string;
  createdAt: Date;
  modifiedAt: Date;
  title: string;
  description: string;
  updates: Array<{
    id: string;
    createdAt: Date;
    modifiedAt: Date;
    date: Date;
    title: string;
    description: string;
    ingredients: Array<{
      id: string;
      createdAt: Date;
      modifiedAt: Date;
      text: string;
    }>;
  }>;
};

type Data = {
  entry: EntryData;
};

async function getData(slug: string): Promise<Data> {
  const entry = data.LogbookEntry[slug];

  return {
    entry: {
      id: entry.id,
      createdAt: entry.createdAt,
      modifiedAt: entry.modifiedAt,
      title: entry.title,
      description: entry.description,
      updates: entry.updateIDs.map((updateID) => {
        const update = data.LogbookUpdate[updateID];

        return {
          id: update.id,
          createdAt: update.createdAt,
          modifiedAt: update.modifiedAt,
          date: update.date,
          title: update.title,
          description: update.description,
          ingredients: update.ingredientIDs.map((ingredientID) => {
            const ingredient = data.LogbookIngredient[ingredientID];

            return {
              id: ingredient.id,
              createdAt: ingredient.createdAt,
              modifiedAt: ingredient.modifiedAt,
              text: ingredient.text,
            };
          }),
        };
      }),
    },
  };
}

export default async function LogbookEntryPage({
  params,
}: {
  params: {
    slug: string;
  };
}) {
  const data = await getData(params.slug);

  return (
    <LogbookProvider initialCache={entryDataToCache(data.entry)}>
      <LogbookEntryBlock id={params.slug} />
    </LogbookProvider>
  );
}

function entryDataToCache(entry: EntryData): Cache {
  return {
    LogbookEntry: {
      [entry.id]: {
        id: entry.id,
        createdAt: entry.createdAt,
        modifiedAt: entry.createdAt,
        isLocal: false,
        entity: {
          id: entry.id,
          title: entry.title,
          description: entry.description,
        },
        references: {
          updates: {
            type: 'MANY',
            to: 'LogbookUpdate',
            ids: entry.updates.map(({ id }) => id),
          },
        },
      },
    },
    LogbookUpdate: Object.fromEntries(
      entry.updates.map((update) => [
        update.id,
        {
          id: update.id,
          createdAt: update.createdAt,
          modifiedAt: update.modifiedAt,
          isLocal: false,
          entity: {
            id: update.id,
            date: update.date,
            title: update.title,
            description: update.description,
          },
          references: {
            entry: {
              type: 'ONE',
              to: 'LogbookEntry',
              id: entry.id,
            },
            ingredients: {
              type: 'MANY',
              to: 'LogbookIngredient',
              ids: update.ingredients.map(({ id }) => id),
            },
          },
        },
      ]),
    ),
    LogbookIngredient: Object.fromEntries(
      entry.updates.flatMap((update) =>
        update.ingredients.map((ingredient) => [
          ingredient.id,
          {
            id: ingredient.id,
            createdAt: ingredient.createdAt,
            modifiedAt: ingredient.modifiedAt,
            isLocal: false,
            entity: {
              id: ingredient.id,
              text: ingredient.text,
            },
            references: {
              update: {
                type: 'ONE',
                to: 'LogbookUpdate',
                id: update.id,
              },
            },
          },
        ]),
      ),
    ),
  };
}
