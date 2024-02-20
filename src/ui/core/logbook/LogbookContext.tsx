/**
 * Initially setting up a custom state management solution. I'd like to auto
 * save as the user types, but I don't want to blast the server with a request
 * on each keystroke either. So I need some eventually-persistent state
 * management solution which optimistically updates the UI and batches update
 * requests in the background. I've also got hierarchical data where persisting
 * data of one entity may depend on another being persisted first--for example
 * creating a logbook update then quickly creating an ingredient under that
 * logbook update before the network request to create the logbook update
 * resolves. I'm not aware of any current frameworks that handle this cleanly
 * out of the box but if you know of one, let me know. Thinking some mix of
 * Recoil (atom state management), Apollo Client (hierarchical schema with
 * normalized cache), and eventual batch persisting.
 *
 * This initially does no persisting but lays the groundwork for optimistic UI
 * updates.
 */
'use client';

import createID from '@/lib/create-id';
import {
  ArchiveLogbookIngredientMutation,
  ArchiveLogbookIngredientMutationVariables,
  ArchiveLogbookMeasurementMutation,
  ArchiveLogbookMeasurementMutationVariables,
  ArchiveLogbookUpdateMutation,
  ArchiveLogbookUpdateMutationVariables,
  CreateLogbookIngredientMutation,
  CreateLogbookIngredientMutationVariables,
  CreateLogbookMeasurementMutation,
  CreateLogbookMeasurementMutationVariables,
  CreateLogbookUpdateMutation,
  CreateLogbookUpdateMutationVariables,
  IngredientUnit,
  MeasurementUnit,
  SetLogbookEntryMutation,
  SetLogbookEntryMutationVariables,
  SetLogbookIngredientMutation,
  SetLogbookIngredientMutationVariables,
  SetLogbookMeasurementMutation,
  SetLogbookMeasurementMutationVariables,
  SetLogbookUpdateMutation,
  SetLogbookUpdateMutationVariables,
} from '@/ui/graphql/graphql';
import { gql, GraphQLClient } from 'graphql-request';
import {
  createContext,
  RefObject,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from 'react';
import { setLogbookEntry } from './logbook-service';

type ID = string;
type ModelType =
  | 'LogbookEntry'
  | 'LogbookUpdate'
  | 'LogbookIngredient'
  | 'LogbookMeasurement';

type BaseReferenceOne = {
  type: 'ONE';
  to: ModelType;
  id: ID;
};

type ReferenceOne<M extends ModelType> = BaseReferenceOne & {
  to: M;
};

type BaseReferenceMany = {
  type: 'MANY';
  to: ModelType;
  ids: ID[];
};

type ReferenceMany<M extends ModelType> = BaseReferenceMany & {
  to: M;
};

type BaseReference = BaseReferenceOne | BaseReferenceMany;

interface BaseModel<E> {
  id: ID;
  createdAt: Date;
  modifiedAt: Date;
  isLocal: boolean;
  entity: E;
  references: Record<string, BaseReference>;
}

interface LogbookEntryModel extends BaseModel<LogbookEntryEntity> {
  references: {
    updates: ReferenceMany<'LogbookUpdate'>;
  };
}

interface LogbookUpdateModel extends BaseModel<LogbookUpdateEntity> {
  references: {
    entry: ReferenceOne<'LogbookEntry'>;
    ingredients: ReferenceMany<'LogbookIngredient'>;
    measurements: ReferenceMany<'LogbookMeasurement'>;
  };
}

interface LogbookIngredientModel extends BaseModel<LogbookIngredientEntity> {
  references: {
    update: ReferenceOne<'LogbookUpdate'>;
  };
}

interface LogbookMeasurementModel extends BaseModel<LogbookMeasurementEntity> {
  references: {
    update: ReferenceOne<'LogbookUpdate'>;
  };
}

type LogbookEntryEntity = {
  id: ID;
  title: string;
  description: string;
};

type LogbookUpdateEntity = {
  id: ID;
  date: Date;
  title: string;
  description: string;
};

type LogbookIngredientEntity = {
  id: ID;
  name: string;
  quantity: string;
  unit: string;
};

type LogbookMeasurementEntity = {
  id: ID;
  name: string;
  value: string;
  unit: string;
};

/**
 * A mutable store for UI data.
 */
export type Cache = {
  LogbookEntry: Record<ID, LogbookEntryModel>;
  LogbookUpdate: Record<ID, LogbookUpdateModel>;
  LogbookIngredient: Record<ID, LogbookIngredientModel>;
  LogbookMeasurement: Record<ID, LogbookMeasurementModel>;
};

/**
 * A mutable store for data waiting to be persisted to the server.
 */
type Outbox = {
  setLogbookEntry: {
    timeout: NodeJS.Timeout;
    data: {
      id: string;
      title?: string;
      description?: string;
    };
  } | null;
  // createLogbookUpdate: {
  //   timeout: NodeJS.Timeout | null;
  //   data: {
  //     date?: Date;
  //     title?: string;
  //     description?: string;
  //   };
  // } | null;
  // setLogbookUpdate: {
  //   timeout: NodeJS.Timeout;
  //   data: {
  //     id: string;
  //     date?: Date;
  //     title?: string;
  //     description?: string;
  //   };
  // } | null;
  // createLogbookIngredient: {
  //   timeout: NodeJS.Timeout;
  //   data: {
  //     name?: string;
  //     quantity?: string | null;
  //     unit?: string | null;
  //   };
  // } | null;
  // setLogbookIngredient: {
  //   timeout: NodeJS.Timeout;
  //   data: {
  //     id: string;
  //     name?: string;
  //     quantity?: string | null;
  //     unit?: string | null;
  //   };
  // } | null;
  // createLogbookMeasurement: {
  //   timeout: NodeJS.Timeout;
  //   data: {
  //     name?: string;
  //     value?: string | null;
  //     unit?: string | null;
  //   };
  // } | null;
  // setLogbookMeasurement: {
  //   timeout: NodeJS.Timeout;
  //   data: {
  //     id: string;
  //     name?: string;
  //     value?: string | null;
  //     unit?: string | null;
  //   };
  // } | null;
};

type LogbookContextValue = {
  cacheRef: RefObject<Cache>;
  outboxRef: RefObject<Outbox>;
  eventBusRef: RefObject<EventTarget>;
};

const LogbookContext = createContext<LogbookContextValue>({
  cacheRef: {
    current: {
      LogbookEntry: {},
      LogbookUpdate: {},
      LogbookIngredient: {},
      LogbookMeasurement: {},
    },
  },
  outboxRef: {
    current: {
      setLogbookEntry: null,
    },
  },
  eventBusRef: {
    current: new EventTarget(),
  },
});

type LogbookProviderProps = {
  initialCache: Cache;
  children: React.ReactNode;
};

export function LogbookProvider({
  initialCache,
  children,
}: LogbookProviderProps) {
  const cacheRef = useRef<Cache>(initialCache);
  const outboxRef = useRef<Outbox>({
    setLogbookEntry: null,
  });
  const eventBusRef = useRef<EventTarget>(new EventTarget());

  return (
    <LogbookContext.Provider value={{ cacheRef, outboxRef, eventBusRef }}>
      {children}
    </LogbookContext.Provider>
  );
}

function useCache(): Cache {
  const { cacheRef } = useContext(LogbookContext);

  return cacheRef.current!;
}

function useOutbox(): Outbox {
  const { outboxRef } = useContext(LogbookContext);

  return outboxRef.current!;
}

function useEventBus(): EventTarget {
  const { eventBusRef } = useContext(LogbookContext);

  return eventBusRef.current!;
}

class CustomDataEvent<D> extends Event {
  data: D;

  constructor(options: { type: string; data: D; eventOptions?: EventInit }) {
    super(options.type, options.eventOptions);

    this.data = options.data;
  }
}

class LogbookEntryChangedEvent extends Event {
  static getType(id: string) {
    return `LogbookEntry.${id}.CHANGE`;
  }

  constructor(id: string) {
    super(LogbookEntryChangedEvent.getType(id));
  }
}

class LogbookUpdateCreatedEvent extends CustomDataEvent<{ id: string }> {
  static getType(localID: string) {
    return `LogbookUpdate.${localID}.CREATE`;
  }

  constructor(options: { localID: string; id: string }) {
    super({
      type: LogbookUpdateCreatedEvent.getType(options.localID),
      data: { id: options.id },
    });
  }
}

class LogbookUpdateChangedEvent extends Event {
  static getType(id: string) {
    return `LogbookUpdate.${id}.CHANGE`;
  }

  constructor(id: string) {
    super(LogbookUpdateChangedEvent.getType(id));
  }
}

class LogbookIngredientCreatedEvent extends CustomDataEvent<{ id: string }> {
  static getType(localID: string) {
    return `LogbookIngredient.${localID}.CREATE`;
  }

  constructor(options: { localID: string; id: string }) {
    super({
      type: LogbookIngredientCreatedEvent.getType(options.localID),
      data: { id: options.id },
    });
  }
}

class LogbookIngredientChangedEvent extends Event {
  static getType(id: string) {
    return `LogbookIngredient.${id}.CHANGE`;
  }

  constructor(id: string) {
    super(LogbookIngredientChangedEvent.getType(id));
  }
}

class LogbookMeasurementCreatedEvent extends CustomDataEvent<{ id: string }> {
  static getType(localID: string) {
    return `LogbookMeasurement.${localID}.CREATE`;
  }

  constructor(options: { localID: string; id: string }) {
    super({
      type: LogbookMeasurementCreatedEvent.getType(options.localID),
      data: { id: options.id },
    });
  }
}

class LogbookMeasurementChangedEvent extends Event {
  static getType(id: string) {
    return `LogbookMeasurement.${id}.CHANGE`;
  }

  constructor(id: string) {
    super(LogbookMeasurementChangedEvent.getType(id));
  }
}

/**
 * Time window to allow subsequent actions to batch into a single request.
 */
const ACTION_BATCH_TIME = 1000;

export function useLogbookActions(): {
  setEntry(options: {
    id: ID;
    title?: string;
    description?: string;
  }): Promise<void>;
  createUpdate(options: { entryID: ID }): Promise<void>;
  setUpdate(options: {
    id: ID;
    title?: string;
    description?: string;
    date?: Date;
  }): Promise<void>;
  deleteUpdate(options: { id: ID }): Promise<void>;
  createIngredient(options: { updateID: ID }): Promise<void>;
  setIngredient(options: {
    id: ID;
    name?: string;
    quantity?: string;
    unit?: IngredientUnit;
  }): Promise<void>;
  deleteIngredient(options: { id: ID }): Promise<void>;
  createMeasurement(options: { updateID: ID }): Promise<void>;
  setMeasurement(options: {
    id: ID;
    name?: string;
    value?: string;
    unit?: MeasurementUnit;
  }): Promise<void>;
  deleteMeasurement(options: { id: ID }): Promise<void>;
} {
  const client = new GraphQLClient(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!);
  const cache = useCache();
  const outbox = useOutbox();
  const eventBus = useEventBus();

  return {
    async setEntry(options) {
      cache.LogbookEntry[options.id] = {
        ...cache.LogbookEntry[options.id],
        modifiedAt: new Date(),
        entity: {
          ...cache.LogbookEntry[options.id].entity,
          ...options,
        },
      };

      eventBus.dispatchEvent(new LogbookEntryChangedEvent(options.id));

      const timeout = setTimeout(async () => {
        try {
          const data = await setLogbookEntry(client, {
            id: options.id,
            title: options.title,
            description: options.description,
          });

          if (data.result.__typename === 'SetLogbookEntryFail') {
            // @todo add proper error handling
            console.error(data.result.error);
          }
        } catch (error) {
          console.error('ERROR', error);
          throw error;
        }
      }, ACTION_BATCH_TIME);

      if (outbox.setLogbookEntry) {
        clearTimeout(outbox.setLogbookEntry.timeout);

        outbox.setLogbookEntry.timeout = timeout;
        outbox.setLogbookEntry.data = {
          ...outbox.setLogbookEntry.data,
          ...options,
        };
      } else {
        outbox.setLogbookEntry = {
          timeout,
          data: options,
        };
      }
    },
    async createUpdate(options) {
      const localID = createID('LogbookUpdate');

      cache.LogbookUpdate[localID] = {
        id: localID,
        createdAt: new Date(),
        modifiedAt: new Date(),
        isLocal: true,
        entity: {
          id: localID,
          title: '',
          description: '',
          date: new Date(),
        },
        references: {
          entry: {
            type: 'ONE',
            to: 'LogbookEntry',
            id: options.entryID,
          },
          ingredients: {
            type: 'MANY',
            to: 'LogbookIngredient',
            ids: [],
          },
          measurements: {
            type: 'MANY',
            to: 'LogbookMeasurement',
            ids: [],
          },
        },
      };

      cache.LogbookEntry[options.entryID].references.updates.ids.unshift(
        localID,
      );

      eventBus.dispatchEvent(new LogbookEntryChangedEvent(options.entryID));

      // @todo add batching to reduce request load
      const data = await client.request<
        CreateLogbookUpdateMutation,
        CreateLogbookUpdateMutationVariables
      >(
        gql`
          mutation CreateLogbookUpdate($entryID: ID!) {
            result: createLogbookUpdate(entryID: $entryID) {
              __typename
              ... on CreateLogbookUpdateSuccess {
                update {
                  id
                  createdAt
                  modifiedAt
                }
              }
              ... on CreateLogbookUpdateFail {
                error
              }
            }
          }
        `,
        { entryID: options.entryID },
      );

      if (data.result.__typename === 'CreateLogbookUpdateFail') {
        // @todo add proper error handling
        console.error(data.result.error);
      } else {
        const newUpdateID = data.result.update.id;

        cache.LogbookUpdate[newUpdateID] = {
          ...cache.LogbookUpdate[localID],
          id: newUpdateID,
          createdAt: new Date(data.result.update.createdAt),
          modifiedAt: new Date(data.result.update.modifiedAt),
          isLocal: false,
          entity: {
            ...cache.LogbookUpdate[localID].entity,
            id: newUpdateID,
          },
        };

        delete cache.LogbookUpdate[localID];

        cache.LogbookEntry[options.entryID].references.updates.ids =
          cache.LogbookEntry[options.entryID].references.updates.ids.map(
            (id) => (id === localID ? newUpdateID : id),
          );

        eventBus.dispatchEvent(
          new LogbookUpdateCreatedEvent({ localID, id: data.result.update.id }),
        );
        eventBus.dispatchEvent(new LogbookEntryChangedEvent(options.entryID));
      }
    },
    async setUpdate(options) {
      let id = options.id;

      cache.LogbookUpdate[id] = {
        ...cache.LogbookUpdate[id],
        modifiedAt: new Date(),
        entity: {
          ...cache.LogbookUpdate[id].entity,
          ...options,
        },
      };

      eventBus.dispatchEvent(new LogbookUpdateChangedEvent(id));

      // If the update hasn't been created yet we need to to use the server ID
      if (cache.LogbookUpdate[id].isLocal) {
        id = await new Promise<string>((resolve) => {
          eventBus.addEventListener(
            LogbookUpdateCreatedEvent.getType(id),
            (event) => {
              resolve((event as LogbookUpdateCreatedEvent).data.id);
            },
          );
        });
      }

      // @todo add batching to reduce request load
      const data = await client.request<
        SetLogbookUpdateMutation,
        SetLogbookUpdateMutationVariables
      >(
        gql`
          mutation SetLogbookUpdate(
            $id: ID!
            $date: Date
            $title: String
            $description: String
          ) {
            result: setLogbookUpdate(
              id: $id
              date: $date
              title: $title
              description: $description
            ) {
              __typename
              ... on SetLogbookUpdateFail {
                error
              }
            }
          }
        `,
        {
          id,
          date: options.date,
          title: options.title,
          description: options.description,
        },
      );

      if (data.result.__typename === 'SetLogbookUpdateFail') {
        // @todo add proper error handling
        console.error(data.result.error);
      } else {
        eventBus.dispatchEvent(new LogbookUpdateChangedEvent(id));
      }
    },
    async deleteUpdate(options) {
      const update = cache.LogbookUpdate[options.id];
      const entry = cache.LogbookEntry[update.references.entry.id];

      delete cache.LogbookUpdate[options.id];

      entry.references.updates.ids = entry.references.updates.ids.filter(
        (id) => id !== options.id,
      );

      update.references.ingredients.ids.forEach((id) => {
        delete cache.LogbookIngredient[id];
      });

      update.references.measurements.ids.forEach((id) => {
        delete cache.LogbookMeasurement[id];
      });

      eventBus.dispatchEvent(new LogbookEntryChangedEvent(entry.id));

      const data = await client.request<
        ArchiveLogbookUpdateMutation,
        ArchiveLogbookUpdateMutationVariables
      >(
        gql`
          mutation ArchiveLogbookUpdate($id: ID!) {
            result: archiveLogbookUpdate(id: $id) {
              __typename
              ... on ArchiveLogbookUpdateFail {
                error
              }
            }
          }
        `,
        { id: options.id },
      );

      if (data.result.__typename === 'ArchiveLogbookUpdateFail') {
        // @todo add proper error handling
        console.error(data.result.error);
      }
    },
    async createIngredient(options) {
      let updateID = options.updateID;
      const localID = createID('LogbookIngredient');

      cache.LogbookIngredient[localID] = {
        id: localID,
        createdAt: new Date(),
        modifiedAt: new Date(),
        isLocal: true,
        entity: {
          id: localID,
          name: '',
          quantity: '',
          unit: 'MassGram',
        },
        references: {
          update: {
            type: 'ONE',
            to: 'LogbookUpdate',
            id: updateID,
          },
        },
      };

      cache.LogbookUpdate[updateID].references.ingredients.ids.push(localID);

      eventBus.dispatchEvent(new LogbookUpdateChangedEvent(updateID));

      // If the parent logbook update hasn't been created yet, we need to wait
      // to be able to use the server-created ID.
      if (cache.LogbookUpdate[updateID].isLocal) {
        updateID = await new Promise<string>((resolve) => {
          eventBus.addEventListener(
            LogbookUpdateCreatedEvent.getType(updateID),
            (event) => {
              resolve((event as LogbookUpdateCreatedEvent).data.id);
            },
          );
        });
      }

      // @todo add batching to reduce request load
      const data = await client.request<
        CreateLogbookIngredientMutation,
        CreateLogbookIngredientMutationVariables
      >(
        gql`
          mutation CreateLogbookIngredient(
            $updateID: ID!
            $unit: IngredientUnit!
          ) {
            result: createLogbookIngredient(updateID: $updateID, unit: $unit) {
              __typename
              ... on CreateLogbookIngredientSuccess {
                ingredient {
                  id
                  createdAt
                  modifiedAt
                }
              }
              ... on CreateLogbookIngredientFail {
                error
              }
            }
          }
        `,
        {
          updateID,
          unit: 'MassGram',
        },
      );

      if (data.result.__typename === 'CreateLogbookIngredientFail') {
        // @todo add proper error handling
        console.error(data.result.error);
      } else {
        const newIngredientID = data.result.ingredient.id;

        cache.LogbookIngredient[newIngredientID] = {
          ...cache.LogbookIngredient[localID],
          id: newIngredientID,
          createdAt: new Date(data.result.ingredient.createdAt),
          modifiedAt: new Date(data.result.ingredient.modifiedAt),
          isLocal: false,
          entity: {
            ...cache.LogbookIngredient[localID].entity,
            id: newIngredientID,
          },
        };

        delete cache.LogbookIngredient[localID];

        cache.LogbookUpdate[updateID].references.ingredients.ids =
          cache.LogbookUpdate[updateID].references.ingredients.ids.map((id) =>
            id === localID ? newIngredientID : id,
          );

        eventBus.dispatchEvent(
          new LogbookIngredientCreatedEvent({
            localID,
            id: data.result.ingredient.id,
          }),
        );
        eventBus.dispatchEvent(new LogbookUpdateChangedEvent(updateID));
      }
    },
    async setIngredient(options) {
      cache.LogbookIngredient[options.id] = {
        ...cache.LogbookIngredient[options.id],
        modifiedAt: new Date(),
        entity: {
          ...cache.LogbookIngredient[options.id].entity,
          ...options,
        },
      };

      eventBus.dispatchEvent(new LogbookIngredientChangedEvent(options.id));

      // @todo add batching to reduce request load
      const data = await client.request<
        SetLogbookIngredientMutation,
        SetLogbookIngredientMutationVariables
      >(
        gql`
          mutation SetLogbookIngredient(
            $id: ID!
            $name: String
            $quantity: Float
            $unit: IngredientUnit
          ) {
            result: setLogbookIngredient(
              id: $id
              name: $name
              quantity: $quantity
              unit: $unit
            ) {
              __typename
              ... on SetLogbookIngredientFail {
                error
              }
            }
          }
        `,
        {
          id: options.id,
          name: options.name,
          ...(() => {
            // `quantity` is input as a string (from the `<input />` field). We need
            // to make sure it is a valid number. If it's not provided as an
            // option, we shouldn't try to set it. If it is provided and not a
            // valid number, we should set it to `null`.
            if (typeof options.quantity === 'undefined') {
              return {};
            }

            const quantity = parseFloat(options.quantity);

            return Number.isFinite(quantity)
              ? { quantity }
              : { quantity: null };
          })(),
          unit: options.unit,
        },
      );

      if (data.result.__typename === 'SetLogbookIngredientFail') {
        // @todo add proper error handling
        console.error(data.result.error);
      }
    },
    async deleteIngredient(options) {
      const ingredient = cache.LogbookIngredient[options.id];
      const update = cache.LogbookUpdate[ingredient.references.update.id];

      delete cache.LogbookIngredient[options.id];

      update.references.ingredients.ids =
        update.references.ingredients.ids.filter((id) => id !== options.id);

      eventBus.dispatchEvent(new LogbookUpdateChangedEvent(update.id));

      const data = await client.request<
        ArchiveLogbookIngredientMutation,
        ArchiveLogbookIngredientMutationVariables
      >(
        gql`
          mutation ArchiveLogbookIngredient($id: ID!) {
            result: archiveLogbookIngredient(id: $id) {
              __typename
              ... on ArchiveLogbookIngredientFail {
                error
              }
            }
          }
        `,
        { id: options.id },
      );

      if (data.result.__typename === 'ArchiveLogbookIngredientFail') {
        // @todo add proper error handling
        console.error(data.result.error);
      }
    },
    async createMeasurement(options) {
      let updateID = options.updateID;
      const localID = createID('LogbookMeasurement');

      cache.LogbookMeasurement[localID] = {
        id: localID,
        createdAt: new Date(),
        modifiedAt: new Date(),
        isLocal: true,
        entity: {
          id: localID,
          name: '',
          value: '',
          unit: '',
        },
        references: {
          update: {
            type: 'ONE',
            to: 'LogbookUpdate',
            id: updateID,
          },
        },
      };

      cache.LogbookUpdate[updateID].references.measurements.ids.push(localID);

      eventBus.dispatchEvent(new LogbookUpdateChangedEvent(updateID));

      // If the parent logbook update hasn't been created yet, we need to wait
      // to be able to use the server-created ID.
      if (cache.LogbookUpdate[updateID].isLocal) {
        await new Promise<void>((resolve) => {
          eventBus.addEventListener(
            LogbookUpdateCreatedEvent.getType(updateID),
            (event) => {
              updateID = (event as LogbookUpdateCreatedEvent).data.id;

              resolve();
            },
          );
        });
      }

      // @todo add batching to reduce request load
      const data = await client.request<
        CreateLogbookMeasurementMutation,
        CreateLogbookMeasurementMutationVariables
      >(
        gql`
          mutation CreateLogbookMeasurement($updateID: ID!) {
            result: createLogbookMeasurement(updateID: $updateID) {
              __typename
              ... on CreateLogbookMeasurementSuccess {
                measurement {
                  id
                  createdAt
                  modifiedAt
                }
              }
              ... on CreateLogbookMeasurementFail {
                error
              }
            }
          }
        `,
        { updateID },
      );

      if (data.result.__typename === 'CreateLogbookMeasurementFail') {
        // @todo add proper error handling
        console.error(data.result.error);
      } else {
        const newMeasurementID = data.result.measurement.id;

        cache.LogbookMeasurement[newMeasurementID] = {
          ...cache.LogbookMeasurement[localID],
          id: newMeasurementID,
          createdAt: new Date(data.result.measurement.createdAt),
          modifiedAt: new Date(data.result.measurement.modifiedAt),
          isLocal: false,
          entity: {
            ...cache.LogbookMeasurement[localID].entity,
            id: newMeasurementID,
          },
        };

        delete cache.LogbookMeasurement[localID];

        cache.LogbookUpdate[updateID].references.measurements.ids =
          cache.LogbookUpdate[updateID].references.measurements.ids.map((id) =>
            id === localID ? newMeasurementID : id,
          );

        eventBus.dispatchEvent(
          new LogbookMeasurementCreatedEvent({
            localID,
            id: data.result.measurement.id,
          }),
        );
        eventBus.dispatchEvent(new LogbookUpdateChangedEvent(updateID));
      }
    },
    async setMeasurement(options) {
      cache.LogbookMeasurement[options.id] = {
        ...cache.LogbookMeasurement[options.id],
        modifiedAt: new Date(),
        entity: {
          ...cache.LogbookMeasurement[options.id].entity,
          ...options,
        },
      };

      eventBus.dispatchEvent(new LogbookMeasurementChangedEvent(options.id));

      // @todo add batching to reduce request load
      const data = await client.request<
        SetLogbookMeasurementMutation,
        SetLogbookMeasurementMutationVariables
      >(
        gql`
          mutation SetLogbookMeasurement(
            $id: ID!
            $name: String
            $value: Float
            $unit: MeasurementUnit
          ) {
            result: setLogbookMeasurement(
              id: $id
              name: $name
              value: $value
              unit: $unit
            ) {
              __typename
              ... on SetLogbookMeasurementFail {
                error
              }
            }
          }
        `,
        {
          id: options.id,
          name: options.name,
          ...(() => {
            // `value` is input as a string (from the `<input />` field). We
            // need to make sure it is a valid number. If it's not provided as
            // an option, we shouldn't try to set it. If it is provided and not
            // a valid number, we should set it to `null`.
            if (typeof options.value === 'undefined') {
              return {};
            }

            const value = parseFloat(options.value);

            return Number.isFinite(value) ? { value } : { value: null };
          })(),
          unit: options.unit,
        },
      );

      if (data.result.__typename === 'SetLogbookMeasurementFail') {
        // @todo add proper error handling
        console.error(data.result.error);
      }
    },
    async deleteMeasurement(options) {
      const measurement = cache.LogbookMeasurement[options.id];
      const update = cache.LogbookUpdate[measurement.references.update.id];

      delete cache.LogbookMeasurement[options.id];

      update.references.measurements.ids =
        update.references.measurements.ids.filter((id) => id !== options.id);

      eventBus.dispatchEvent(new LogbookUpdateChangedEvent(update.id));

      const data = await client.request<
        ArchiveLogbookMeasurementMutation,
        ArchiveLogbookMeasurementMutationVariables
      >(
        gql`
          mutation ArchiveLogbookMeasurement($id: ID!) {
            result: archiveLogbookMeasurement(id: $id) {
              __typename
              ... on ArchiveLogbookMeasurementFail {
                error
              }
            }
          }
        `,
        { id: options.id },
      );

      if (data.result.__typename === 'ArchiveLogbookMeasurementFail') {
        // @todo add proper error handling
        console.error(data.result.error);
      }
    },
  };
}

/**
 * A React hook to force a component to update and re-render.
 */
function useForceUpdate() {
  const [, forceUpdate] = useReducer((n) => n + 1, 0);

  return forceUpdate;
}

/**
 * React hook to get a logbook entryin the cache.
 */
export function useLogbookEntry(id: ID): LogbookEntryModel {
  const cache = useCache();
  const eventBus = useEventBus();
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    eventBus.addEventListener(
      LogbookEntryChangedEvent.getType(id),
      forceUpdate,
    );

    return () => {
      eventBus.removeEventListener(
        LogbookEntryChangedEvent.getType(id),
        forceUpdate,
      );
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return cache.LogbookEntry[id];
}

/**
 * React hook to get a logbook update from the cache.
 */
export function useLogbookUpdate(id: ID): LogbookUpdateModel {
  const cache = useCache();
  const eventBus = useEventBus();
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    eventBus.addEventListener(
      LogbookUpdateChangedEvent.getType(id),
      forceUpdate,
    );

    return () => {
      eventBus.removeEventListener(
        LogbookUpdateChangedEvent.getType(id),
        forceUpdate,
      );
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return cache.LogbookUpdate[id];
}

/**
 * React hook to get a logbook ingredient from the cache.
 */
export function useLogbookIngredient(id: ID): LogbookIngredientModel {
  const cache = useCache();
  const eventBus = useEventBus();
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    eventBus.addEventListener(
      LogbookIngredientChangedEvent.getType(id),
      forceUpdate,
    );

    return () => {
      eventBus.removeEventListener(
        LogbookIngredientChangedEvent.getType(id),
        forceUpdate,
      );
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return cache.LogbookIngredient[id];
}

export function useLogbookMeasurement(id: ID): LogbookMeasurementModel {
  const cache = useCache();
  const eventBus = useEventBus();
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    eventBus.addEventListener(
      LogbookMeasurementChangedEvent.getType(id),
      forceUpdate,
    );

    return () => {
      eventBus.addEventListener(
        LogbookMeasurementChangedEvent.getType(id),
        forceUpdate,
      );
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return cache.LogbookMeasurement[id];
}
