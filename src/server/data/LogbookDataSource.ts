import { Client } from 'edgedb';
import e from '@/dbschema/edgeql-js';

export type LogbookEntryModel = {
  id: string;
  createdAt: Date;
  modifiedAt: Date;
  archivedAt: Date | null;
  title: string;
  description: string;
};

export type LogbookUpdateModel = {
  id: string;
  createdAt: Date;
  modifiedAt: Date;
  archivedAt: Date | null;
  date: Date;
  title: string;
  description: string;
};

export type LogbookIngredientUnit =
  | 'MassGram'
  | 'MassKilogram'
  | 'VolumeMilliliter'
  | 'VolumeLiter'
  | 'MassOunce'
  | 'MassPound'
  | 'VolumeTeaspoon'
  | 'VolumeTablespoon'
  | 'VolumeCup'
  | 'VolumeFluidOunce'
  | 'VolumePint'
  | 'VolumeQuart'
  | 'VolumeGallon';

export type LogbookIngredientModel = {
  id: string;
  createdAt: Date;
  modifiedAt: Date;
  archivedAt: Date | null;
  name: string;
  quantity: number | null;
  unit: LogbookIngredientUnit | null;
};

export type LogbookMeasurementUnit =
  | 'TemperatureFahrenheit'
  | 'TemperatureCelsius'
  | 'Percent';

export type LogbookMeasurementModel = {
  id: string;
  createdAt: Date;
  modifiedAt: Date;
  archivedAt: Date | null;
  name: string;
  value: number | null;
  unit: LogbookMeasurementUnit | null;
};

export default class LogbookDataSource {
  edgedb: Client;

  constructor(edgedb: Client) {
    this.edgedb = edgedb;
  }

  /**
   * Gets a logbook entry by ID. Returns `null` if not found.
   */
  async getEntryByID(id: string): Promise<LogbookEntryModel | null> {
    const query = e.select(e.LogbookEntry, (entry) => ({
      id: true,
      createdAt: true,
      modifiedAt: true,
      archivedAt: true,
      title: true,
      description: true,

      filter_single: e.op(entry.id, '=', e.uuid(id)),
    }));

    return await query.run(this.edgedb);
  }

  /**
   * Gets logbook entries for a user.
   */
  async getEntriesForUser(userID: string): Promise<LogbookEntryModel[]> {
    const owner = e.select(e.User, (user) => ({
      filter_single: e.op(user.id, '=', e.uuid(userID)),
    }));
    const query = e.select(e.LogbookEntry, (entry) => ({
      id: true,
      createdAt: true,
      modifiedAt: true,
      archivedAt: true,
      title: true,
      description: true,

      filter: e.op(
        e.op(entry.owner, '=', owner),
        'and',
        e.op('not', e.op('exists', entry.archivedAt)),
      ),
    }));

    return await query.run(this.edgedb);
  }

  /**
   * Modifies fields on a logbook entry. Returns `null` if the entry was not
   * found for the given `id`.
   */
  async setEntry(options: {
    id: string;
    title?: string;
    description?: string;
  }): Promise<LogbookEntryModel | null> {
    const entry = e.update(e.LogbookEntry, (entry) => ({
      set: {
        title: options.title,
        description: options.description,
      },
      filter_single: e.op(entry.id, '=', e.uuid(options.id)),
    }));
    const query = e.select(entry, (entry) => ({
      id: true,
      createdAt: true,
      modifiedAt: true,
      archivedAt: true,
      title: true,
      description: true,
    }));

    return await query.run(this.edgedb);
  }

  /**
   * Gets a logbook update by ID. Returns `null` if not found.
   */
  async getUpdateByID(id: string): Promise<LogbookUpdateModel | null> {
    const query = e.select(e.LogbookUpdate, (update) => ({
      id: true,
      createdAt: true,
      modifiedAt: true,
      archivedAt: true,
      date: true,
      title: true,
      description: true,

      filter_single: e.op(update.id, '=', e.uuid(id)),
    }));

    return await query.run(this.edgedb);
  }

  /**
   * Gets logbook updates for an entry.
   */
  async getUpdatesForEntry(entryID: string): Promise<LogbookUpdateModel[]> {
    const entry = e.select(e.LogbookEntry, (entry) => ({
      filter_signle: e.op(entry.id, '=', e.uuid(entryID)),
    }));
    const query = e.select(e.LogbookUpdate, (update) => ({
      id: true,
      createdAt: true,
      modifiedAt: true,
      archivedAt: true,
      date: true,
      title: true,
      description: true,

      filter: e.op(
        e.op(update.entry, '=', entry),
        'and',
        e.op('not', e.op('exists', update.archivedAt)),
      ),
    }));

    return await query.run(this.edgedb);
  }

  /**
   * Creates a logbook update for an entry. Throws if the entry does not exist.
   */
  async createUpdate(options: {
    entryID: string;
    date?: Date;
    title?: string;
    description?: string;
  }): Promise<LogbookUpdateModel> {
    const entry = e.select(e.LogbookEntry, (entry) => ({
      filter_single: e.op(entry.id, '=', e.uuid(options.entryID)),
    }));
    const update = e.insert(e.LogbookUpdate, {
      entry,
      date: options.date,
      title: options.title,
      description: options.description,
    });
    const query = e.select(update, () => ({
      id: true,
      createdAt: true,
      modifiedAt: true,
      archivedAt: true,
      date: true,
      title: true,
      description: true,
    }));

    return await query.run(this.edgedb);
  }

  /**
   * Modifies fields on a logbook update. Returns `null` if not found.
   */
  async setUpdate(options: {
    id: string;
    date?: Date;
    title?: string;
    description?: string;
  }): Promise<LogbookUpdateModel | null> {
    const update = e.update(e.LogbookUpdate, (update) => ({
      set: {
        date: options.date,
        title: options.title,
        description: options.description,
      },
      filter_single: e.op(update.id, '=', e.uuid(options.id)),
    }));
    const query = e.select(update, () => ({
      id: true,
      createdAt: true,
      modifiedAt: true,
      archivedAt: true,
      date: true,
      title: true,
      description: true,
    }));

    return await query.run(this.edgedb);
  }

  /**
   * Archives a logbook update so that it will not be queried with unarchived
   * updates.
   */
  async archiveUpdate(id: string): Promise<LogbookUpdateModel | null> {
    const update = e.update(e.LogbookUpdate, (update) => ({
      set: {
        archivedAt: e.datetime_current(),
      },
      filter_single: e.op(update.id, '=', e.uuid(id)),
    }));
    const query = e.select(update, () => ({
      id: true,
      createdAt: true,
      modifiedAt: true,
      archivedAt: true,
      date: true,
      title: true,
      description: true,
    }));

    return await query.run(this.edgedb);
  }

  /**
   * Gets a logbook ingredient by ID. Returns `null` if not found.
   */
  async getIngredientByID(id: string): Promise<LogbookIngredientModel | null> {
    const query = e.select(e.LogbookIngredient, (ingredient) => ({
      id: true,
      createdAt: true,
      modifiedAt: true,
      archivedAt: true,
      name: true,
      quantity: true,
      unit: true,

      filter_single: e.op(ingredient.id, '=', e.uuid(id)),
    }));

    return await query.run(this.edgedb);
  }

  /**
   * Gets logbook ingredients for an update.
   */
  async getIngredientsForUpdate(
    updateID: string,
  ): Promise<LogbookIngredientModel[]> {
    const update = e.select(e.LogbookUpdate, (update) => ({
      filter_single: e.op(update.id, '=', e.uuid(updateID)),
    }));
    const query = e.select(e.LogbookIngredient, (ingredient) => ({
      id: true,
      createdAt: true,
      modifiedAt: true,
      archivedAt: true,
      name: true,
      quantity: true,
      unit: true,

      filter: e.op(
        e.op(ingredient.update, '=', update),
        'and',
        e.op('not', e.op('exists', ingredient.archivedAt)),
      ),
    }));

    return await query.run(this.edgedb);
  }

  /**
   * Creates a logbook ingredient for an update. Throws if the update does not
   * exist.
   */
  async createIngredient(options: {
    updateID: string;
    name?: string;
    quantity?: number;
    unit?: LogbookIngredientUnit;
  }): Promise<LogbookIngredientModel> {
    const update = e.select(e.LogbookUpdate, (update) => ({
      filter_single: e.op(update.id, '=', e.uuid(options.updateID)),
    }));
    const ingredient = e.insert(e.LogbookIngredient, {
      update,
      name: options.name,
      quantity: options.quantity,
      unit: options.unit,
    });
    const query = e.select(ingredient, () => ({
      id: true,
      createdAt: true,
      modifiedAt: true,
      archivedAt: true,
      name: true,
      quantity: true,
      unit: true,
    }));

    return await query.run(this.edgedb);
  }

  /**
   * Modifies fields on a logbook ingredient. Returns `null` if not found.
   */
  async setIngredient(options: {
    id: string;
    name?: string;
    quantity?: number;
    unit?: LogbookIngredientUnit;
  }): Promise<LogbookIngredientModel | null> {
    const ingredient = e.update(e.LogbookIngredient, (ingredient) => ({
      set: {
        name: options.name,
        quantity: options.quantity,
        unit: options.unit,
      },
      filter_single: e.op(ingredient.id, '=', e.uuid(options.id)),
    }));
    const query = e.select(ingredient, () => ({
      id: true,
      createdAt: true,
      modifiedAt: true,
      archivedAt: true,
      name: true,
      quantity: true,
      unit: true,
    }));

    return await query.run(this.edgedb);
  }

  /**
   * Archives a logbook ingredient so that it will not be queried with
   * unarchived ingredients.
   */
  async archiveIngredient(id: string): Promise<LogbookIngredientModel | null> {
    const ingredient = e.update(e.LogbookIngredient, (ingredient) => ({
      set: {
        archivedAt: e.datetime_current(),
      },
      filter_single: e.op(ingredient.id, '=', e.uuid(id)),
    }));
    const query = e.select(ingredient, () => ({
      id: true,
      createdAt: true,
      modifiedAt: true,
      archivedAt: true,
      name: true,
      quantity: true,
      unit: true,
    }));

    return await query.run(this.edgedb);
  }

  /**
   * Gets a logbook measurement by ID. Returns `null` if not found.
   */
  async getMeasurementByID(
    id: string,
  ): Promise<LogbookMeasurementModel | null> {
    const query = e.select(e.LogbookMeasurement, (measurement) => ({
      id: true,
      createdAt: true,
      modifiedAt: true,
      archivedAt: true,
      name: true,
      value: true,
      unit: true,

      filter_single: e.op(measurement.id, '=', e.uuid(id)),
    }));

    return await query.run(this.edgedb);
  }

  /**
   * Gets logbook measurements for an update.
   */
  async getMeasurementsForUpdate(
    updateID: string,
  ): Promise<LogbookMeasurementModel[]> {
    const update = e.select(e.LogbookUpdate, (update) => ({
      filter_single: e.op(update.id, '=', e.uuid(updateID)),
    }));
    const query = e.select(e.LogbookMeasurement, (measurement) => ({
      id: true,
      createdAt: true,
      modifiedAt: true,
      archivedAt: true,
      name: true,
      value: true,
      unit: true,

      filter: e.op(
        e.op(measurement.update, '=', update),
        'and',
        e.op('not', e.op('exists', measurement.archivedAt)),
      ),
    }));

    return await query.run(this.edgedb);
  }

  /**
   * Creates a logbook measurement for an update. Throws if the update does not
   * exist.
   */
  async createMeasurement(options: {
    updateID: string;
    name?: string;
    value?: number;
    unit?: LogbookMeasurementUnit;
  }): Promise<LogbookMeasurementModel> {
    const update = e.select(e.LogbookUpdate, (update) => ({
      filter_single: e.op(update.id, '=', e.uuid(options.updateID)),
    }));
    const measurement = e.insert(e.LogbookMeasurement, {
      update,
      name: options.name,
      value: options.value,
      unit: options.unit,
    });
    const query = e.select(measurement, () => ({
      id: true,
      createdAt: true,
      modifiedAt: true,
      archivedAt: true,
      name: true,
      value: true,
      unit: true,
    }));

    return await query.run(this.edgedb);
  }

  /**
   * Modifies fields on a logbook measurement. Returns `null` if not found.
   */
  async setMeasurement(options: {
    id: string;
    name?: string;
    value?: number;
    unit?: LogbookMeasurementUnit;
  }): Promise<LogbookMeasurementModel | null> {
    const measurement = e.update(e.LogbookMeasurement, (measurement) => ({
      set: {
        name: options.name,
        value: options.value,
        unit: options.unit,
      },
      filter_single: e.op(measurement.id, '=', e.uuid(options.id)),
    }));
    const query = e.select(measurement, () => ({
      id: true,
      createdAt: true,
      modifiedAt: true,
      archivedAt: true,
      name: true,
      value: true,
      unit: true,
    }));

    return await query.run(this.edgedb);
  }

  /**
   * Archives a logbook measurement so that it will not be queried with
   * unarchived measurements.
   */
  async archiveMeasurement(
    id: string,
  ): Promise<LogbookMeasurementModel | null> {
    const measurement = e.update(e.LogbookMeasurement, (measurement) => ({
      set: {
        archivedAt: e.datetime_current(),
      },
      filter_single: e.op(measurement.id, '=', e.uuid(id)),
    }));
    const query = e.select(measurement, () => ({
      id: true,
      createdAt: true,
      modifiedAt: true,
      archivedAt: true,
      name: true,
      value: true,
      unit: true,
    }));

    return await query.run(this.edgedb);
  }
}
