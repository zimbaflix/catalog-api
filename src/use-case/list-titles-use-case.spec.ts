import { describe, expect, it, vi } from 'vitest';
import {
  TitleSortDirection,
  type TitleRepository,
  type TitleRepositoryListInput,
  type TitleRepositoryListOutput,
} from '../repository/title-repository';
import { ListTitlesUseCase, type ListTitlesUseCaseInput } from './list-titles-use-case';
import type { Title } from '../entity/title';
import type { Logger } from '../common/logger/logger';

class TitleRepositoryStub implements TitleRepository {
  async list(_input: TitleRepositoryListInput): Promise<TitleRepositoryListOutput> {
    return Promise.resolve({
      data: [],
      cursor: undefined,
    });
  }
}

class LoggerStub implements Logger {
  debug(_message: string, _meta?: object): void {
    // do nothing
  }

  info(_message: string, _meta?: object): void {
    // do nothing
  }

  warn(_message: string, _meta?: object): void {
    // do nothing
  }

  error(_message: string, _meta?: object): void {
    // do nothing
  }

  child(_meta: object): Logger {
    return new LoggerStub();
  }
}

function makeSut() {
  const titleRepository = new TitleRepositoryStub();
  const logger = new LoggerStub();
  return new ListTitlesUseCase(titleRepository, logger);
}

describe('ListTitlesUseCase', () => {
  it('returns correct output', async () => {
    const title: Title = {
      id: 'tt123',
      type: 'movie',
      primaryTitle: 'Title',
      originalTitle: 'Title',
      startYear: 2021,
      endYear: 2021,
      runtimeMinutes: 90,
      genres: ['Action'],
      averageRating: 3,
      ratingVotesCount: 100,
    };
    vi.spyOn(TitleRepositoryStub.prototype, 'list').mockResolvedValueOnce({
      data: [title],
      cursor: 'cursor',
    });
    const sut = makeSut();
    const output = await sut.execute();
    expect(output).toEqual({
      titles: [title],
      cursor: 'cursor',
    });
  });

  it('logs correctly', async () => {
    const loggerDebugSpy = vi.spyOn(LoggerStub.prototype, 'debug');
    const loggerInfoSpy = vi.spyOn(LoggerStub.prototype, 'info');
    const sut = makeSut();
    const sutInput: ListTitlesUseCaseInput = {
      cursor: 'cursor',
      sort: { id: TitleSortDirection.ASC },
      filter: { type: 'movie' },
    };
    await sut.execute(sutInput);
    expect(loggerDebugSpy).toHaveBeenCalledWith('listing titles', sutInput);
    expect(loggerInfoSpy).toHaveBeenCalledWith('listed titles', { count: 0, cursor: undefined });
  });

  it('calls repository with correct params', async () => {
    const titleRepositoryListSpy = vi.spyOn(TitleRepositoryStub.prototype, 'list');
    const sut = makeSut();
    await sut.execute();
    expect(titleRepositoryListSpy).toHaveBeenCalledWith({
      cursor: undefined,
      filter: {},
      sort: {},
    });
    await sut.execute({
      cursor: 'cursor',
      sort: { originalTitle: TitleSortDirection.ASC },
      filter: { type: 'movie' },
    });
    expect(titleRepositoryListSpy).toHaveBeenCalledWith({
      cursor: 'cursor',
      sort: { originalTitle: 'asc' },
      filter: { type: 'movie', originalTitle: { not: null } },
    });
  });
});
