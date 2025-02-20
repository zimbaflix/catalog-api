import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginCacheControl } from '@apollo/server/plugin/cacheControl';
import { startStandaloneServer } from '@apollo/server/standalone';
import { listTitlesResolver } from './resolvers/list-titles-resolver';
import { PinoLogger } from '../common/logger/pino-logger';
import { DatabaseTitleRepository } from '../repository/database-title-repository';
import { prisma } from '../common/prisma';
import { ListTitlesUseCase } from '../use-case/list-titles-use-case';

const typeDefs = `#graphql
  enum CacheControlScope {
    PUBLIC
    PRIVATE
  }

  directive @cacheControl(
    maxAge: Int
    scope: CacheControlScope
    inheritMaxAge: Boolean
  ) on FIELD_DEFINITION | OBJECT | INTERFACE | UNION

  type Title {
    id: ID!
    type: String!
    primaryTitle: String!
    originalTitle: String!
    averageRate: Float
    startYear: Int
    endYear: Int
    genres: [String]
    runtimeMinutes: Int
  }

  enum SortDirection {
    ASC
    DESC
  }

  input Sort {
    field: String!
    direction: SortDirection!
  }

  type ListTitlesOutput {
    titles: [Title] @cacheControl(maxAge: 60)
    cursor: String
  }

  type Query {
    titles(
      type: String, 
      sort: Sort, 
      genres: [String] 
      cursor: String, 
      limit: Int
    ): ListTitlesOutput
  }
`;

const logger = new PinoLogger();
const titlesRepository = new DatabaseTitleRepository(prisma);
const listTitlesUseCase = new ListTitlesUseCase(titlesRepository, logger);

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query: {
      titles: listTitlesResolver(logger.child({ context: listTitlesResolver.name }), listTitlesUseCase),
    },
  },
  plugins: [ApolloServerPluginCacheControl({ defaultMaxAge: 60 })],
});

export async function startGraphQLServer(port = 4000) {
  const { url } = await startStandaloneServer(server, {
    listen: { port },
  });
  logger.info(`🚀 server ready at: ${url}`);
}
