import { describe, expect, it, vi } from 'vitest';
import type {
  TitleRepository,
  TitleRepositoryListInput,
  TitleRepositoryListOutput,
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
  it('calls repository with correct params', async () => {
    const titleRepositoryListSpy = vi.spyOn(TitleRepositoryStub.prototype, 'list');
    const sut = makeSut();
    await sut.execute();
    expect(titleRepositoryListSpy).toHaveBeenCalledWith({});
  });

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
      order: { field: 'field', direction: 'asc' },
      filter: { type: 'movie' },
    };
    await sut.execute(sutInput);
    expect(loggerDebugSpy).toHaveBeenCalledWith('Listing titles', sutInput);
    expect(loggerInfoSpy).toHaveBeenCalledWith('Listed titles', { count: 0, cursor: undefined });
  });

  it('calls repository with correct params', async () => {
    const titleRepositoryListSpy = vi.spyOn(TitleRepositoryStub.prototype, 'list');
    const sut = makeSut();
    await sut.execute();
    expect(titleRepositoryListSpy).toHaveBeenCalledWith({});
    await sut.execute({
      cursor: 'cursor',
      order: { field: 'field', direction: 'asc' },
      filter: { type: 'movie' },
    });
    expect(titleRepositoryListSpy).toHaveBeenCalledWith({
      cursor: 'cursor',
      order: { field: 'field', direction: 'asc' },
      filter: { type: 'movie' },
    });
  });
});
