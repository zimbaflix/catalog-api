import type { Logger } from '../common/logger/logger.ts';
import type { Title } from '../entity/title.ts';
import type { TitleRepository } from '../repository/title-repository.ts';

export type ListTitlesUseCaseInput = {
  cursor?: string;
  order?: { field: 'field'; direction: 'asc' };
  filter?: { type?: string };
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
    this.logger.debug('Listing titles', input);
    const { data, cursor } = await this.titleRepository.list({
      cursor: input?.cursor,
      order: input?.order,
      filter: input?.filter,
    });
    this.logger.info('Listed titles', { count: data.length, cursor });
    return {
      titles: data,
      cursor,
    };
  }
}
