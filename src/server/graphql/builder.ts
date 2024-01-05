import SchemaBuilder from '@pothos/core';
import RelayPlugin from '@pothos/plugin-relay';
import { GraphQLContext } from '@/server/graphql/context';
import SimpleObjectsPlugin from '@pothos/plugin-simple-objects';

const builder = new SchemaBuilder<{
  Context: GraphQLContext;
  Scalars: {
    Date: {
      Input: Date;
      Output: Date;
    };
  };
  DefaultEdgesNullability: false;
}>({
  plugins: [RelayPlugin, SimpleObjectsPlugin],
  relayOptions: {
    clientMutationId: 'omit',
    cursorType: 'String',
    edgesFieldOptions: {
      nullable: false,
    },
  },
});

export default builder;
