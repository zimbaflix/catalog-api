import {
  TitleFilter,
  type TitleRepository,
  type TitleRepositoryListInput,
  type TitleRepositoryListOutput,
} from './title-repository';
import { Prisma, PrismaClient } from '@prisma/client';
import { Title, TitleType } from '../entity/title';

export class DatabaseTitleRepository implements TitleRepository {
  private readonly maxLimit = 10;

  constructor(private readonly db: PrismaClient) {}

  async list(input: TitleRepositoryListInput): Promise<TitleRepositoryListOutput> {
    const rows = await this.db.title.findMany({
      take: input.limit ? Math.min(input.limit, this.maxLimit) : this.maxLimit,
      cursor: input.cursor ? { id: input.cursor } : undefined,
      skip: input.cursor ? 1 : 0,
      where: this.buildWhereClause(input),
      orderBy: this.buildOrderByClause(input),
    });
    const titles: Title[] = rows.map((row) => ({
      id: row.id,
      type: row.type as TitleType,
      primaryTitle: row.primaryTitle,
      originalTitle: row.originalTitle,
      startYear: row.startYear,
      endYear: row.endYear,
      genres: row.genres?.split(',') ?? [],
      runtimeMinutes: row.runtimeMinutes,
      averageRating: row.averageRating,
      ratingVotesCount: row.ratingVotesCount,
    }));
    return {
      data: titles,
      cursor: titles.length > 0 ? titles[titles.length - 1].id : undefined,
    };
  }

  private buildWhereClause(input: TitleRepositoryListInput): Prisma.TitleWhereInput {
    const conditions: Prisma.TitleWhereInput = { isAdult: false };
    if (input.filter) {
      Object.assign<typeof conditions, TitleFilter>(conditions, input.filter);
    }
    return conditions;
  }

  private buildOrderByClause(input: TitleRepositoryListInput): Prisma.TitleOrderByWithRelationInput[] {
    if (input.sort) {
      return Object.entries(input.sort).map(([field, direction]) => {
        return { [field]: direction };
      });
    }
    return [];
  }
}
