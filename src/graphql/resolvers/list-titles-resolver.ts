import { GraphQLError } from 'graphql';
import { Logger } from '../../common/logger/logger';
import type { Title, TitleType } from '../../entity/title';
import { ListTitlesUseCase, ListTitlesUseCaseInput } from '../../use-case/list-titles-use-case';

type ListTitlesResolverArgs = {
  cursor?: string;
  type?: string;
  startYear?: number;
  sort?: { field: string; direction: string };
};

type ListTitlesResolverOutput = {
  items: Title[];
  cursor: string | null;
};

export const listTitlesResolver =
  (logger: Logger, listTitlesUseCase: ListTitlesUseCase) =>
  async (_: unknown, args: ListTitlesResolverArgs): Promise<ListTitlesResolverOutput> => {
    try {
      logger.debug('listing titles', { args });
      const input: ListTitlesUseCaseInput = {
        sort: {},
        filter: {},
      };
      if (args.cursor) {
        input.cursor = args.cursor;
      }
      if (args.type) {
        input.filter = { type: args.type as TitleType };
      }
      if (args.startYear) {
        input.filter = { ...input.filter, startYear: args.startYear };
      }
      if (args.sort) {
        input.sort = { [args.sort.field]: args.sort.direction.toLowerCase() as 'asc' | 'desc' };
      }
      const { titles, cursor } = await listTitlesUseCase.execute(input);
      logger.info(`listed titles`, { args, count: titles.length });
      return { items: titles, cursor };
    } catch (error) {
      logger.error('failed to list titles', { args, error });
      throw new GraphQLError('Internal server error');
    }
  };
