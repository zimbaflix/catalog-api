import type { Logger } from '../common/logger/logger';
import type { Title } from '../entity/title';
import { TitleFilter, TitleSort, TitleRepository } from '../repository/title-repository';

export type ListTitlesUseCaseInput = {
  cursor?: string;
  type?: string;
  startYear?: { lte?: number; eq?: number };
  sort?: { field: string; direction: string };
};

export type ListTitlesUseCaseOutput = {
  titles: Title[];
  cursor?: string;
};

export class ListTitlesUseCase {
  constructor(private readonly titleRepository: TitleRepository, private readonly logger: Logger) {
    this.logger = logger.child({ component: ListTitlesUseCase.name });
  }

  async execute(input?: ListTitlesUseCaseInput): Promise<ListTitlesUseCaseOutput> {
    this.logger.debug('listing titles', input);
    const { data, cursor } = await this.titleRepository.list({
      sort: this.buildTitleGatewaySort(input),
      filter: this.buildTitleGatewayFilter(input),
      cursor: input?.cursor,
    });
    this.logger.info('listed titles', { count: data.length, cursor });
    return {
      titles: data,
      cursor,
    };
  }

  private buildTitleGatewaySort(input: ListTitlesUseCaseInput): TitleSort {
    const sort: TitleSort = {};
    if (input?.sort) {
      Object.assign(sort, { [input.sort.field]: input.sort.direction });
    }
    return sort;
  }

  private buildTitleGatewayFilter(input: ListTitlesUseCaseInput): TitleFilter {
    const filter: TitleFilter = {};
    if (input?.type) {
      Object.assign(filter, { type: input.type });
    }
    return filter;
  }
}
