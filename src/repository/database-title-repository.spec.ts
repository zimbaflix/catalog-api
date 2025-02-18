import { DatabaseTitleRepository } from './database-title-repository';
import { describe, expect, it, vi } from 'vitest';
import { prisma } from '../common/prisma';
import { Title } from '@prisma/client';

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
      });
    });

    it('calls prisma.title.findMany with custom limit', async () => {
      const sut = makeSut();
      await sut.list({ limit: 5 });
      expect(prisma.title.findMany).toHaveBeenCalledWith({
        take: 5,
      });
    });

    it('calls prisma.title.findMany with max limit', async () => {
      const sut = makeSut();
      await sut.list({ limit: 100 });
      expect(prisma.title.findMany).toHaveBeenCalledWith({
        take: 10,
      });
    });

    it('calls prisma.title.findMany with cursor', async () => {
      const sut = makeSut();
      await sut.list({ cursor: '1', limit: 10 });
      expect(prisma.title.findMany).toHaveBeenCalledWith({
        take: 10,
        skip: 1,
        cursor: {
          tconst: '1',
        },
      });
    });

    it('calls prisma.title.findMany with order', async () => {
      const sut = makeSut();
      await sut.list({ order: { field: 'tconst', direction: 'asc' }, limit: 10 });
      expect(prisma.title.findMany).toHaveBeenCalledWith({
        take: 10,
        orderBy: {
          tconst: 'asc',
        },
      });
    });

    it('calls prisma.title.findMany with filter', async () => {
      const sut = makeSut();
      await sut.list({ filter: { type: 'movie' }, limit: 10 });
      expect(prisma.title.findMany).toHaveBeenCalledWith({
        take: 10,
        where: {
          titletype: 'movie',
        },
      });
    });

    it('returns data from prisma.title.findMany', async () => {
      const sut = makeSut();
      const title: Title = {
        tconst: '1',
        titletype: 'movie',
        primarytitle: 'Movie',
        originaltitle: 'Movie',
        startyear: 2021,
        endyear: 2021,
        genres: 'Action',
        runtimeminutes: 120,
        isadult: false,
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
        tconst: '1',
        titletype: 'movie',
        primarytitle: 'Movie',
        originaltitle: 'Movie',
        startyear: 2021,
        endyear: 2021,
        genres: null,
        runtimeminutes: 120,
        isadult: false,
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
