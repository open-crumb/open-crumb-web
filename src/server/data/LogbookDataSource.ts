import { LogbookEntryModel } from '@/server/graphql/schema/logbook-entry';
import { LogbookIngredientModel } from '@/server/graphql/schema/logbook-ingredient';
import { LogbookMeasurementModel } from '@/server/graphql/schema/logbook-measurement';
import { LogbookUpdateModel } from '@/server/graphql/schema/logbook-update';
import { Client } from 'edgedb';
import e from '@/dbschema/edgeql-js';

export default class LogbookDataSource {
  edgedb: Client;

  constructor(edgedb: Client) {
    this.edgedb = edgedb;
  }

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

      filter: e.op(entry.owner, '=', owner),
    }));

    return await query.run(this.edgedb);
  }

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

      filter: e.op(update.entry, '=', entry),
    }));

    return await query.run(this.edgedb);
  }

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

      filter: e.op(ingredient.update, '=', update),
    }));

    return await query.run(this.edgedb);
  }

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

      filter: e.op(measurement.update, '=', update),
    }));

    return await query.run(this.edgedb);
  }
}
