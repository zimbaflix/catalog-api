import { Logger } from '../../common/logger/logger';
import type { Title } from '../../entity/title';
import { ListTitlesUseCase } from '../../use-case/list-titles-use-case';

type ListTitlesResolverArgs = {
  cursor?: string;
  type?: string;
  startYear?: { lte?: number; eq?: number };
  sort?: { field: string; direction: string };
};

type ListTitlesResolverOutput = {
  titles: Title[];
  cursor: string | null;
};

export const listTitlesResolver =
  (logger: Logger, listTitlesUseCase: ListTitlesUseCase) =>
  async (_: unknown, args: ListTitlesResolverArgs): Promise<ListTitlesResolverOutput> => {
    logger.debug('listing titles', { args });
    const { titles, cursor } = await listTitlesUseCase.execute({
      sort: {
        field: args.sort?.field,
        direction: args.sort?.direction.toLowerCase(),
      },
      cursor: args.cursor,
      type: args.type,
      startYear: args.startYear,
    });
    logger.info(`listed titles`, { args, count: titles.length });
    return { titles, cursor };
  };
