import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs, resolvers } from '../models/apollo/schema';

const path = '/graphql';

export default ({ app }: { app: express.Application }) => {
  const server = new ApolloServer({ typeDefs, resolvers });

  server.applyMiddleware({ app, path });
};
