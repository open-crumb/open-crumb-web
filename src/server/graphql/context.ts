import { Client } from 'edgedb';
import LogbookDataSource from '@/server/data/LogbookDataSource';
import UserDataSource from '@/server/data/UserDataSource';

export type GraphQLContext = {
  edgedb: Client;
  userID: string | null;
  dataSources: {
    users: UserDataSource;
    logbook: LogbookDataSource;
  };
};
