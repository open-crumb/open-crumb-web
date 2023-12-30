import builder from '@/server/graphql/builder';
import '@/server/graphql/schema/date-scalar';
import '@/server/graphql/schema/ingredient-unit-enum';
import '@/server/graphql/schema/measurement-unit-enum';
import '@/server/graphql/schema/user';
import '@/server/graphql/schema/logbook-entry';
import '@/server/graphql/schema/logbook-update';
import '@/server/graphql/schema/logbook-ingredient';
import '@/server/graphql/schema/logbook-measurement';
import '@/server/graphql/schema/query';

const schema = builder.toSchema();

export default schema;
