import type { Logger } from '../common/logger/logger.ts';
import type { Title } from '../entity/title.ts';
import { TitleRepository, TitleRepositoryListInput } from '../repository/title-repository.js';

export type ListTitlesUseCaseInput = {
  cursor?: string;
  type?: string;
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
    const { data, cursor } = await this.titleRepository.list(this.buildListInput(input));
    this.logger.info('listed titles', { count: data.length, cursor });
    return {
      titles: data,
      cursor,
    };
  }

  private buildListInput(input: ListTitlesUseCaseInput): TitleRepositoryListInput {
    const listInput: TitleRepositoryListInput = {};
    if (input?.cursor) {
      Object.assign(listInput, { cursor: input.cursor });
    }
    if (input?.sort) {
      Object.assign(listInput, {
        order: {
          field: input.sort.field,
          direction: input.sort.direction,
        },
      });
    }
    if (input?.type) {
      Object.assign(listInput, { filter: { type: input.type } });
    }
    return listInput;
  }
}
