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
import { useEffect, useState } from 'react';

type ID = string;
type ModelType = 'LogbookEntry' | 'LogbookUpdate' | 'LogbookIngredient';

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
  };
}

interface LogbookIngredientModel extends BaseModel<LogbookIngredientEntity> {
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
  text: string;
};

type Cache = {
  LogbookEntry: Record<ID, LogbookEntryModel>;
  LogbookUpdate: Record<ID, LogbookUpdateModel>;
  LogbookIngredient: Record<ID, LogbookIngredientModel>;
};

const cache: Cache = {
  LogbookEntry: {
    'le.1': {
      id: 'le.1',
      createdAt: new Date(),
      modifiedAt: new Date(),
      isLocal: true,
      entity: {
        id: 'le.1',
        title: 'Classic Sourdough',
        description: '',
      },
      references: {
        updates: {
          type: 'MANY',
          to: 'LogbookUpdate',
          ids: ['lu.1'],
        },
      },
    },
  },
  LogbookUpdate: {
    'lu.1': {
      id: 'lu.1',
      createdAt: new Date(),
      modifiedAt: new Date(),
      isLocal: true,
      entity: {
        id: 'lu.1',
        date: new Date('2023-11-24T11:00:00.000Z'),
        title: 'Prepare Levain',
        description: '',
      },
      references: {
        entry: {
          type: 'ONE',
          to: 'LogbookEntry',
          id: 'le.1',
        },
        ingredients: {
          type: 'MANY',
          to: 'LogbookIngredient',
          ids: ['li.1', 'li.2', 'li.3'],
        },
      },
    },
  },
  LogbookIngredient: {
    'li.1': {
      id: 'li.1',
      createdAt: new Date(),
      modifiedAt: new Date(),
      isLocal: true,
      entity: {
        id: 'li.1',
        text: '20g Sourdough Starter',
      },
      references: {
        update: {
          type: 'ONE',
          to: 'LogbookUpdate',
          id: 'lu.1',
        },
      },
    },
    'li.2': {
      id: 'li.2',
      createdAt: new Date(),
      modifiedAt: new Date(),
      isLocal: true,
      entity: {
        id: 'li.2',
        text: '40g Flour',
      },
      references: {
        update: {
          type: 'ONE',
          to: 'LogbookUpdate',
          id: 'lu.1',
        },
      },
    },
    'li.3': {
      id: 'li.3',
      createdAt: new Date(),
      modifiedAt: new Date(),
      isLocal: true,
      entity: {
        id: 'li.3',
        text: '40g Water',
      },
      references: {
        update: {
          type: 'ONE',
          to: 'LogbookUpdate',
          id: 'lu.1',
        },
      },
    },
  },
};

const eventBus = new EventTarget();

/**
 * Updates a logbook entry and re-renders any subscribed components.
 */
export function setLogbookEntry(options: {
  id: ID;
  title?: string;
  description?: string;
}): void {
  cache.LogbookEntry[options.id] = {
    ...cache.LogbookEntry[options.id],
    modifiedAt: new Date(),
    entity: {
      ...cache.LogbookEntry[options.id].entity,
      ...options,
    },
  };

  eventBus.dispatchEvent(new Event(`LogbookEntry.${options.id}.UPDATE`));
}

/**
 * Creates a logbook update and adds it to the specific entry. Any components
 * subscribed to the entry will be re-rendered.
 */
export function createLogbookUpdate(options: {
  title: string;
  description: string;
  date: Date;
  entryID: ID;
}): void {
  const id = createID('LogbookUpdate');

  cache.LogbookUpdate[id] = {
    id,
    createdAt: new Date(),
    modifiedAt: new Date(),
    isLocal: true,
    entity: {
      id,
      title: options.title,
      description: options.description,
      date: options.date,
    },
    references: {
      entry: {
        type: 'ONE',
        to: 'LogbookEntry',
        id: 'le.1',
      },
      ingredients: {
        type: 'MANY',
        to: 'LogbookIngredient',
        ids: [],
      },
    },
  };

  cache.LogbookEntry[options.entryID].references.updates.ids.push(id);

  eventBus.dispatchEvent(new Event(`LogbookEntry.${options.entryID}.UPDATE`));
}

/**
 * Updates a logbook update and re-renders any subscribed components.
 */
export function setLogbookUpdate(options: {
  id: ID;
  title?: string;
  description?: string;
  date?: Date;
}): void {
  cache.LogbookUpdate[options.id] = {
    ...cache.LogbookUpdate[options.id],
    modifiedAt: new Date(),
    entity: {
      ...cache.LogbookUpdate[options.id].entity,
      ...options,
    },
  };

  eventBus.dispatchEvent(new Event(`LogbookUpdate.${options.id}.UPDATE`));
}

/**
 * Creates a logbook ingredient and adds it to the specified logbook update. Any
 * component subscribed to the logbook update will be re-rendered.
 */
export function createLogbookIngredient(options: {
  text: string;
  updateID: ID;
}): void {
  const id = createID('LogbookIngredient');

  cache.LogbookIngredient[id] = {
    id,
    createdAt: new Date(),
    modifiedAt: new Date(),
    isLocal: true,
    entity: {
      id,
      text: options.text,
    },
    references: {
      update: {
        type: 'ONE',
        to: 'LogbookUpdate',
        id: options.updateID,
      },
    },
  };

  cache.LogbookUpdate[options.updateID].references.ingredients.ids.push(
    options.updateID,
  );

  eventBus.dispatchEvent(new Event(`LogbookUpdate.${options.updateID}.UPDATE`));
}

/**
 * Updates a logbook ingredient and re-renders any subscribed components.
 */
export function setLogbookIngredient(options: { id: ID; text?: string }): void {
  cache.LogbookIngredient[options.id] = {
    ...cache.LogbookIngredient[options.id],
    modifiedAt: new Date(),
    entity: {
      ...cache.LogbookIngredient[options.id].entity,
      ...options,
    },
  };

  eventBus.dispatchEvent(new Event(`LogbookIngredient.${options.id}.UPDATE`));
}

/**
 * React hook to get a logbook entryin the cache.
 */
export function useLogbookEntry(id: ID): LogbookEntryModel {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const handleUpdate = () => setCounter(counter + 1);

    eventBus.addEventListener(`LogbookEntry.${id}.UPDATE`, handleUpdate);

    return () => {
      eventBus.removeEventListener(`LogbookEntry.${id}.UPDATE`, handleUpdate);
    };
  }, []);

  return cache.LogbookEntry[id];
}

/**
 * React hook to get a logbook update from the cache.
 */
export function useLogbookUpdate(id: ID): LogbookUpdateModel {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const handleUpdate = () => setCounter(counter + 1);

    eventBus.addEventListener(`LogbookUpdate.${id}.UPDATE`, handleUpdate);

    return () => {
      eventBus.removeEventListener(`LogbookUpdate.${id}.UPDATE`, handleUpdate);
    };
  }, []);

  return cache.LogbookUpdate[id];
}

/**
 * React hook to get a logbook ingredient from the cache.
 */
export function useLogbookIngredient(id: ID): LogbookIngredientModel {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const handleUpdate = () => setCounter(counter + 1);

    eventBus.addEventListener(`LogbookIngredient.${id}.UPDATE`, handleUpdate);

    return () => {
      eventBus.removeEventListener(
        `LogbookIngredient.${id}.UPDATE`,
        handleUpdate,
      );
    };
  }, []);

  return cache.LogbookIngredient[id];
}
