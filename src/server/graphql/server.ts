import { createClient } from 'edgedb';
import { createYoga } from 'graphql-yoga';
import LogbookDataSource from '@/server/data/LogbookDataSource';
import UserDataSource from '@/server/data/UserDataSource';
import { GraphQLContext } from '@/server/graphql/context';
import schema from '@/server/graphql/schema';

const server = createYoga({
  schema,
  context(): GraphQLContext {
    const edgedb = createClient();

    return {
      edgedb,
      userID: '611edeec-a46b-11ee-b7f1-9ba26be8246f',
      dataSources: {
        users: new UserDataSource(edgedb),
        logbook: new LogbookDataSource(edgedb),
      },
    };
  },
  graphqlEndpoint: '/api/graphql',
  fetchAPI: { Response },
});

export default server;
