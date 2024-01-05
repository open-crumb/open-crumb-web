import { UserModel } from '@/server/graphql/schema/user';
import { Client } from 'edgedb';
import e from '@/dbschema/edgeql-js';

export default class UserDataSource {
  edgedb: Client;

  constructor(edgedb: Client) {
    this.edgedb = edgedb;
  }

  /**
   * Gets a user by ID. Returns `null` if not found.
   */
  async getUserByID(id: string): Promise<UserModel | null> {
    const query = e.select(e.User, (user) => ({
      id: true,
      createdAt: true,
      modifiedAt: true,
      name: true,

      filter_single: e.op(user.id, '=', e.uuid(id)),
    }));

    return await query.run(this.edgedb);
  }
}
