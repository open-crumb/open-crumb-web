import LogbookEntryBlock from '@/ui/core/logbook/entry/LogbookEntryBlock';
import { Cache, LogbookProvider } from '@/ui/core/logbook/LogbookContext';
import type { Metadata } from 'next';
import { request, gql } from 'graphql-request';
import {
  LogbookEntryPageQuery,
  LogbookEntryPageQueryVariables,
} from '@/ui/graphql/graphql';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Classic Sourdough',
};

type NextJSData = {
  entry: {
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
        name: string;
        quantity: number | null;
        unit: string | null;
      }>;
      measurements: Array<{
        id: string;
        createdAt: Date;
        modifiedAt: Date;
        name: string;
        value: number | null;
        unit: string | null;
      }>;
    }>;
  };
};

async function getData(slug: string): Promise<NextJSData> {
  // @todo add proper error handling
  const data = await request<
    LogbookEntryPageQuery,
    LogbookEntryPageQueryVariables
  >(
    process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!,
    gql`
      query LogbookEntryPage($slug: String!) {
        logbookEntry(slug: $slug) {
          id
          createdAt
          modifiedAt
          title
          description
          updates {
            edges {
              node {
                id
                createdAt
                modifiedAt
                date
                title
                description
                ingredients {
                  edges {
                    node {
                      id
                      createdAt
                      modifiedAt
                      name
                      quantity
                      unit
                    }
                  }
                }
                measurements {
                  edges {
                    node {
                      id
                      createdAt
                      modifiedAt
                      name
                      value
                      unit
                    }
                  }
                }
              }
            }
          }
        }
      }
    `,
    { slug },
  );

  if (!data || !data.logbookEntry) {
    redirect('/logbook');
  }

  return {
    entry: {
      id: data.logbookEntry.id,
      createdAt: new Date(data.logbookEntry.createdAt),
      modifiedAt: new Date(data.logbookEntry.modifiedAt),
      title: data.logbookEntry.title,
      description: data.logbookEntry.description,
      updates: data.logbookEntry.updates.edges.map(({ node: update }) => ({
        id: update.id,
        createdAt: new Date(update.createdAt),
        modifiedAt: new Date(update.modifiedAt),
        date: new Date(update.date),
        title: update.title,
        description: update.description,
        ingredients: update.ingredients.edges.map(({ node: ingredient }) => ({
          id: ingredient.id,
          createdAt: new Date(ingredient.createdAt),
          modifiedAt: new Date(ingredient.modifiedAt),
          name: ingredient.name,
          quantity: ingredient.quantity,
          unit: ingredient.unit,
        })),
        measurements: update.measurements.edges.map(
          ({ node: measurement }) => ({
            id: measurement.id,
            createdAt: new Date(measurement.createdAt),
            modifiedAt: new Date(measurement.modifiedAt),
            name: measurement.name,
            value: measurement.value,
            unit: measurement.unit,
          }),
        ),
      })),
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
      <LogbookEntryBlock id={data.entry.id} />
    </LogbookProvider>
  );
}

function entryDataToCache(entry: NextJSData['entry']): Cache {
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
            measurements: {
              type: 'MANY',
              to: 'LogbookMeasurement',
              ids: update.measurements.map(({ id }) => id),
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
              name: ingredient.name,
              quantity:
                ingredient.quantity !== null ? String(ingredient.quantity) : '',
              unit: ingredient.unit || '',
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
    LogbookMeasurement: Object.fromEntries(
      entry.updates.flatMap((update) =>
        update.measurements.map((measurement) => [
          measurement.id,
          {
            id: measurement.id,
            createdAt: measurement.createdAt,
            modifiedAt: measurement.modifiedAt,
            isLocal: false,
            entity: {
              id: measurement.id,
              name: measurement.name,
              value: String(measurement.value),
              unit: measurement.unit || '',
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
