import builder from '@/server/graphql/builder';

builder.scalarType('Date', {
  serialize: (date) => date.toISOString(),
  parseValue: (date) => new Date(date as string),
});
