import {
  SetLogbookEntryMutation,
  SetLogbookEntryMutationVariables,
} from '@/ui/graphql/graphql';
import { gql, GraphQLClient } from 'graphql-request';

export async function setLogbookEntry(
  client: GraphQLClient,
  variables: SetLogbookEntryMutationVariables,
) {
  return await client.request<
    SetLogbookEntryMutation,
    SetLogbookEntryMutationVariables
  >(
    gql`
      mutation SetLogbookEntry($id: ID!, $title: String, $description: String) {
        result: setLogbookEntr(
          id: $id
          title: $title
          description: $description
        ) {
          __typename
          ... on SetLogbookEntryFail {
            error
          }
        }
      }
    `,
    variables,
  );
}
