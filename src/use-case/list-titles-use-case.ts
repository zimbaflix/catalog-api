import type { Logger } from '../common/logger/logger';
import type { Title } from '../entity/title';
import { TitleFilter, TitleSort, TitleRepository } from '../repository/title-repository';

export type ListTitlesUseCaseInput = { cursor?: string; sort: TitleSort; filter: TitleFilter };

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
      Object.assign(sort, input.sort);
    }
    return sort;
  }

  private buildTitleGatewayFilter(input: ListTitlesUseCaseInput): TitleFilter {
    const filter: TitleFilter = {};
    if (input?.filter) {
      Object.assign(filter, input.filter);
    }
    if (input?.sort) {
      // Add not null filter for each sort field to avoid null values
      Object.entries(input.sort).forEach(([key]) => {
        if (!filter[key]) {
          Object.assign(filter, { [key]: {} });
        }
        Object.assign<TitleFilter, unknown>(filter[key], { not: null });
      });
    }
    return filter;
  }
}
