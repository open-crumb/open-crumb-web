import LogbookBlock from '@/ui/core/logbook/LogbookBlock';
import type { Metadata } from 'next';
import { request, gql } from 'graphql-request';
import { LogbookPageQuery } from '@/ui/graphql/graphql';

export const metadata: Metadata = {
  title: 'Logbook',
};

type NextJSData = {
  entries: Array<{
    id: string;
    slug: string;
    title: string;
  }>;
};

async function getData(): Promise<NextJSData> {
  // @todo add proper error handling
  const data = await request<LogbookPageQuery>(
    process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!,
    gql`
      query LogbookPage {
        me {
          logbookEntries {
            edges {
              node {
                id
                slug
                title
              }
            }
          }
        }
      }
    `,
  );

  if (!data || !data.me) {
    return {
      entries: [],
    };
  }

  return {
    entries: data.me.logbookEntries.edges.map((edge) => ({
      id: edge.node.id,
      slug: edge.node.slug,
      title: edge.node.title,
    })),
  };
}

export default async function LogbookPage() {
  const data = await getData();

  return <LogbookBlock entries={data.entries} />;
}
