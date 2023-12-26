import LogbookBlock from '@/ui/core/logbook/LogbookBlock';
import type { Metadata } from 'next';
import { request, gql } from 'graphql-request';

export const metadata: Metadata = {
  title: 'Logbook',
};

type GraphQLData = {
  me: {
    logbookEntries: {
      edges: Array<{
        node: {
          id: string;
          slug: string;
          title: string;
        };
      }>;
    };
  };
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
  const data = await request<GraphQLData>(
    process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!,
    gql`
      query LogbookPageQuery {
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
