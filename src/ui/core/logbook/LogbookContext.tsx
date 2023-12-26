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
  createContext,
  RefObject,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from 'react';

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

export type Cache = {
  LogbookEntry: Record<ID, LogbookEntryModel>;
  LogbookUpdate: Record<ID, LogbookUpdateModel>;
  LogbookIngredient: Record<ID, LogbookIngredientModel>;
  LogbookMeasurement: Record<ID, LogbookMeasurementModel>;
};

type LogbookContextValue = {
  cacheRef: RefObject<Cache>;
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
  const cacheRef = useRef(initialCache);
  const eventBusRef = useRef(new EventTarget());

  return (
    <LogbookContext.Provider value={{ cacheRef, eventBusRef }}>
      {children}
    </LogbookContext.Provider>
  );
}

function useCache(): Cache {
  const { cacheRef } = useContext(LogbookContext);

  return cacheRef.current!;
}

function useEventBus(): EventTarget {
  const { eventBusRef } = useContext(LogbookContext);

  return eventBusRef.current!;
}

export function useLogbookActions(): {
  setEntry(options: { id: ID; title?: string; description?: string }): void;
  createUpdate(options: { entryID: ID }): void;
  setUpdate(options: {
    id: ID;
    title?: string;
    description?: string;
    date?: Date;
  }): void;
  deleteUpdate(options: { id: ID }): void;
  createIngredient(options: { updateID: ID }): void;
  setIngredient(options: {
    id: ID;
    name?: string;
    quantity?: string;
    unit?: string;
  }): void;
  deleteIngredient(options: { id: ID }): void;
  createMeasurement(options: { updateID: ID }): void;
  setMeasurement(options: {
    id: ID;
    name?: string;
    value?: string;
    unit?: string;
  }): void;
  deleteMeasurement(options: { id: ID }): void;
} {
  const cache = useCache();
  const eventBus = useEventBus();

  return {
    setEntry(options) {
      cache.LogbookEntry[options.id] = {
        ...cache.LogbookEntry[options.id],
        modifiedAt: new Date(),
        entity: {
          ...cache.LogbookEntry[options.id].entity,
          ...options,
        },
      };

      eventBus.dispatchEvent(new Event(`LogbookEntry.${options.id}.UPDATE`));
    },
    createUpdate(options) {
      const id = createID('LogbookUpdate');

      cache.LogbookUpdate[id] = {
        id,
        createdAt: new Date(),
        modifiedAt: new Date(),
        isLocal: true,
        entity: {
          id,
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

      cache.LogbookEntry[options.entryID].references.updates.ids.unshift(id);

      eventBus.dispatchEvent(
        new Event(`LogbookEntry.${options.entryID}.UPDATE`),
      );
    },
    setUpdate(options) {
      cache.LogbookUpdate[options.id] = {
        ...cache.LogbookUpdate[options.id],
        modifiedAt: new Date(),
        entity: {
          ...cache.LogbookUpdate[options.id].entity,
          ...options,
        },
      };

      eventBus.dispatchEvent(new Event(`LogbookUpdate.${options.id}.UPDATE`));
    },
    deleteUpdate(options) {
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

      eventBus.dispatchEvent(new Event(`LogbookEntry.${entry.id}.UPDATE`));
    },
    createIngredient(options) {
      const id = createID('LogbookIngredient');

      cache.LogbookIngredient[id] = {
        id,
        createdAt: new Date(),
        modifiedAt: new Date(),
        isLocal: true,
        entity: {
          id,
          name: '',
          quantity: '',
          unit: 'gram',
        },
        references: {
          update: {
            type: 'ONE',
            to: 'LogbookUpdate',
            id: options.updateID,
          },
        },
      };

      cache.LogbookUpdate[options.updateID].references.ingredients.ids.push(id);

      eventBus.dispatchEvent(
        new Event(`LogbookUpdate.${options.updateID}.UPDATE`),
      );
    },
    setIngredient(options) {
      cache.LogbookIngredient[options.id] = {
        ...cache.LogbookIngredient[options.id],
        modifiedAt: new Date(),
        entity: {
          ...cache.LogbookIngredient[options.id].entity,
          ...options,
        },
      };

      eventBus.dispatchEvent(
        new Event(`LogbookIngredient.${options.id}.UPDATE`),
      );
    },
    deleteIngredient(options) {
      const ingredient = cache.LogbookIngredient[options.id];
      const update = cache.LogbookUpdate[ingredient.references.update.id];

      delete cache.LogbookIngredient[options.id];

      update.references.ingredients.ids =
        update.references.ingredients.ids.filter((id) => id !== options.id);

      eventBus.dispatchEvent(new Event(`LogbookUpdate.${update.id}.UPDATE`));
    },
    createMeasurement(options) {
      const id = createID('LogbookMeasurement');

      cache.LogbookMeasurement[id] = {
        id,
        createdAt: new Date(),
        modifiedAt: new Date(),
        isLocal: true,
        entity: {
          id,
          name: '',
          value: '',
          unit: 'fahrenheit',
        },
        references: {
          update: {
            type: 'ONE',
            to: 'LogbookUpdate',
            id: options.updateID,
          },
        },
      };

      cache.LogbookUpdate[options.updateID].references.measurements.ids.push(
        id,
      );

      eventBus.dispatchEvent(
        new Event(`LogbookUpdate.${options.updateID}.UPDATE`),
      );
    },
    setMeasurement(options) {
      cache.LogbookMeasurement[options.id] = {
        ...cache.LogbookMeasurement[options.id],
        modifiedAt: new Date(),
        entity: {
          ...cache.LogbookMeasurement[options.id].entity,
          ...options,
        },
      };

      eventBus.dispatchEvent(
        new Event(`LogbookMeasurement.${options.id}.UPDATE`),
      );
    },
    deleteMeasurement(options) {
      const measurement = cache.LogbookMeasurement[options.id];
      const update = cache.LogbookUpdate[measurement.references.update.id];

      delete cache.LogbookMeasurement[options.id];

      update.references.measurements.ids =
        update.references.measurements.ids.filter((id) => id !== options.id);

      eventBus.dispatchEvent(new Event(`LogbookUpdate.${update.id}.UPDATE`));
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
    eventBus.addEventListener(`LogbookEntry.${id}.UPDATE`, forceUpdate);

    return () => {
      eventBus.removeEventListener(`LogbookEntry.${id}.UPDATE`, forceUpdate);
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
    eventBus.addEventListener(`LogbookUpdate.${id}.UPDATE`, forceUpdate);

    return () => {
      eventBus.removeEventListener(`LogbookUpdate.${id}.UPDATE`, forceUpdate);
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
    eventBus.addEventListener(`LogbookIngredient.${id}.UPDATE`, forceUpdate);

    return () => {
      eventBus.removeEventListener(
        `LogbookIngredient.${id}.UPDATE`,
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
    eventBus.addEventListener(`LogbookMeasurement.${id}.UPDATE`, forceUpdate);

    return () => {
      eventBus.removeEventListener(
        `LogbookMeasurement.${id}.UPDATE`,
        forceUpdate,
      );
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return cache.LogbookMeasurement[id];
}
