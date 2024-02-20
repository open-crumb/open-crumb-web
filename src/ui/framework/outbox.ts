import request, { gql } from 'graphql-request';
import {
  SetLogbookEntryMutation,
  SetLogbookEntryMutationVariables,
} from '@/ui/graphql/graphql';

type Outbox = {};

export function createOutbox(): Outbox {
  return {};
}

let timer: any = null;
let pendingPromise: any = null;
let outbox: any = {};
let errors: any = null;
let pending: any = {};

async function setLogbookEntry(options: {
  id: string;
  title?: string;
  description?: string;
}) {
  if (pending[options.id]) {
    pending[options.id].cancel();
  }

  if (outbox[options.id]) {
    outbox[options.id] = {
      ...outbox[options.id],
      ...options,
    };
  } else {
    outbox[options.id] = options;
  }

  let cancelled = false;

  const timer = setTimeout(async () => {
    if (pending[options.id].promise) {
      try {
        await pending[options.id].promise;
      } catch (error) {}
    }

    if (cancelled) {
      return;
    }

    pending = null;

    pendingPromise = setLogbookEntryGraphQLRequest(outbox[options.id]);

    delete outbox[options.id];

    try {
      await pendingPromise;
    } catch (error) {
      errors = error;
    }
  }, 1000);

  pending = {
    cancel() {
      cancelled = true;

      clearTimeout(timer);
    },
  };
}

setLogbookEntry({
  id: '1',
  title: 'Country Sourdough',
});

async function setLogbookEntryGraphQLRequest(
  variables: SetLogbookEntryMutationVariables,
) {
  return await request<
    SetLogbookEntryMutation,
    SetLogbookEntryMutationVariables
  >(
    process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!,
    gql`
      mutation SetLogbookEntry($id: ID!, $title: String, $description: String) {
        result: setLogbookEntry(
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
