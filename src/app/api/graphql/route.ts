import server from '@/server/graphql/server';

const { handleRequest } = server;

export {
  handleRequest as GET,
  handleRequest as POST,
  handleRequest as OPTIONS,
};
