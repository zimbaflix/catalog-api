import { Logger } from '../../common/logger/logger';
import type { Title, TitleType } from '../../entity/title';
import { ListTitlesUseCase } from '../../use-case/list-titles-use-case';

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
    logger.debug('listing titles', { args });
    const { titles, cursor } = await listTitlesUseCase.execute({
      cursor: args.cursor,
      filter: {
        startYear: args.startYear,
        type: args.type as TitleType,
      },
      sort: {
        [args.sort?.field]: args.sort?.direction.toLowerCase(),
      },
    });
    logger.info(`listed titles`, { args, count: titles.length });
    return { items: titles, cursor };
  };
