import builder from '@/server/graphql/builder';

export type UserModel = {
  id: string;
  createdAt: Date;
  modifiedAt: Date;
  name: string;
};

export const UserType = builder.objectRef<UserModel>('User');

builder.node(UserType, {
  description: `Represents an individual user and allows access to user-specific data.`,
  id: {
    resolve: ({ id }) => id,
  },
  async loadOne(id, context) {
    return await context.dataSources.users.getUserByID(id);
  },
  fields: (t) => ({
    createdAt: t.expose('createdAt', {
      type: 'Date',
    }),
    modifiedAt: t.expose('modifiedAt', {
      type: 'Date',
    }),
    // @todo formalize shape
    // email: t.exposeString('email'),
    // username: t.exposeString('username'),
    name: t.exposeString('name'),
    // slug: t.exposeString('username', {
    // 	description: `An opaque URL-friendly identifier for the user.`,
    // }),
  }),
});

builder.queryField('me', (t) =>
  t.field({
    type: UserType,
    nullable: true,
    async resolve(root, args, context) {
      if (!context.userID) {
        return null;
      }

      return await context.dataSources.users.getUserByID(context.userID);
    },
  }),
);
