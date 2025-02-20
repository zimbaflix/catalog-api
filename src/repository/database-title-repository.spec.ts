import { DatabaseTitleRepository } from './database-title-repository';
import { describe, expect, it, vi } from 'vitest';
import { prisma } from '../common/prisma';
import { Title } from '@prisma/client';
import { TitleSortDirection } from './title-repository';

vi.mock('@prisma/client', () => ({
  PrismaClient: class PrismaClient {
    title = {
      findMany: vi.fn().mockResolvedValue([]),
    };
  },
}));

function makeSut() {
  return new DatabaseTitleRepository(prisma);
}

describe('DatabaseTitleRepository', () => {
  describe('list', () => {
    it('calls prisma.title.findMany with default arguments', async () => {
      const sut = makeSut();
      await sut.list({});
      expect(prisma.title.findMany).toHaveBeenCalledWith({
        take: 10,
        cursor: undefined,
        skip: 0,
        where: { isAdult: false },
        orderBy: [],
      });
    });

    it('calls prisma.title.findMany with custom limit', async () => {
      const sut = makeSut();
      await sut.list({ limit: 5 });
      expect(prisma.title.findMany).toHaveBeenCalledWith({
        take: 5,
        cursor: undefined,
        skip: 0,
        where: { isAdult: false },
        orderBy: [],
      });
    });

    it('calls prisma.title.findMany with max limit', async () => {
      const sut = makeSut();
      await sut.list({ limit: 100 });
      expect(prisma.title.findMany).toHaveBeenCalledWith({
        take: 10,
        cursor: undefined,
        skip: 0,
        where: { isAdult: false },
        orderBy: [],
      });
    });

    it('calls prisma.title.findMany with cursor', async () => {
      const sut = makeSut();
      await sut.list({ cursor: '1', limit: 10 });
      expect(prisma.title.findMany).toHaveBeenCalledWith({
        take: 10,
        skip: 1,
        orderBy: [],
        cursor: { id: '1' },
        where: { isAdult: false },
      });
    });

    it('calls prisma.title.findMany with order', async () => {
      const sut = makeSut();
      await sut.list({ sort: { tconst: TitleSortDirection.ASC }, limit: 10 });
      expect(prisma.title.findMany).toHaveBeenCalledWith({
        take: 10,
        skip: 0,
        orderBy: [{ tconst: 'asc' }],
        where: { isAdult: false },
      });
    });

    it('calls prisma.title.findMany with filter', async () => {
      const sut = makeSut();
      await sut.list({ filter: { type: 'movie' }, limit: 10 });
      expect(prisma.title.findMany).toHaveBeenCalledWith({
        cursor: undefined,
        skip: 0,
        take: 10,
        orderBy: [],
        where: {
          isAdult: false,
          type: 'movie',
        },
      });
    });

    it('returns data from prisma.title.findMany', async () => {
      const sut = makeSut();
      const title: Title = {
        id: '1',
        type: 'movie',
        primaryTitle: 'Movie',
        originalTitle: 'Movie',
        startYear: 2021,
        endYear: 2021,
        genres: 'Action',
        runtimeMinutes: 120,
        isAdult: false,
      };
      vi.spyOn(prisma.title, 'findMany').mockResolvedValueOnce([title]);
      const result = await sut.list({ limit: 10 });
      expect(result).toEqual({
        data: [
          {
            id: '1',
            type: 'movie',
            primaryTitle: 'Movie',
            originalTitle: 'Movie',
            startYear: 2021,
            endYear: 2021,
            genres: ['Action'],
            runtimeMinutes: 120,
          },
        ],
        cursor: '1',
      });
    });

    it('returns empty data from prisma.title.findMany', async () => {
      const sut = makeSut();
      const result = await sut.list({ limit: 10 });
      expect(result).toEqual({
        data: [],
        cursor: undefined,
      });
    });

    it('returns a empty genres array when genres is null', async () => {
      const sut = makeSut();
      const title: Title = {
        id: '1',
        type: 'movie',
        primaryTitle: 'Movie',
        originalTitle: 'Movie',
        startYear: 2021,
        endYear: 2021,
        genres: null,
        runtimeMinutes: 120,
        isAdult: false,
      };
      vi.spyOn(prisma.title, 'findMany').mockResolvedValueOnce([title]);
      const result = await sut.list({ limit: 10 });
      expect(result).toEqual({
        data: [
          {
            id: '1',
            type: 'movie',
            primaryTitle: 'Movie',
            originalTitle: 'Movie',
            startYear: 2021,
            endYear: 2021,
            genres: [],
            runtimeMinutes: 120,
          },
        ],
        cursor: '1',
      });
    });
  });
});
