import { Logger } from '../../common/logger/logger';
import type { Title } from '../../entity/title';
import { ListTitlesUseCase } from '../../use-case/list-titles-use-case';

type ListTitlesResolverArgs = {
  cursor?: string;
  type?: string;
  sort?: { field: string; direction: string };
};

type ListTitlesResolverOutput = {
  titles: Title[];
  cursor: string | null;
};

export const listTitles =
  (logger: Logger, listTitlesUseCase: ListTitlesUseCase) =>
  async (_: unknown, args: ListTitlesResolverArgs): Promise<ListTitlesResolverOutput> => {
    logger.info('listing titles', { args });
    const { titles, cursor } = await listTitlesUseCase.execute(args);
    logger.info(`listed titles`, { args, count: titles.length });
    return { titles, cursor };
  };
