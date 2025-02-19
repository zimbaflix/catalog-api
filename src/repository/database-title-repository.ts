import type { DefaultArgs } from '@prisma/client/runtime/library';
import type { TitleRepository, TitleRepositoryListInput, TitleRepositoryListOutput } from './title-repository';
import { Prisma, PrismaClient } from '@prisma/client';

export class DatabaseTitleRepository implements TitleRepository {
  private readonly maxLimit = 10;

  constructor(private readonly db: PrismaClient) {}

  async list(input: TitleRepositoryListInput): Promise<TitleRepositoryListOutput> {
    const rows = await this.db.title.findMany({
      ...this.buildListQuery(input),
      take: input.limit ? Math.min(input.limit, this.maxLimit) : this.maxLimit,
    });
    const titles = rows.map((row) => ({
      id: row.tconst,
      type: row.titletype,
      primaryTitle: row.primarytitle,
      originalTitle: row.originaltitle,
      startYear: row.startyear,
      endYear: row.endyear,
      genres: row.genres?.split(',') ?? [],
      runtimeMinutes: row.runtimeminutes,
    }));
    return {
      data: titles,
      cursor: titles.length > 0 ? titles[titles.length - 1].id : undefined,
    };
  }

  private buildListQuery(input: TitleRepositoryListInput): Prisma.TitleFindManyArgs<DefaultArgs> {
    const query = {};
    if (input.cursor) {
      Object.assign(query, {
        skip: 1,
        cursor: {
          tconst: input.cursor,
        },
      });
    }
    if (input.order?.field) {
      Object.assign(query, {
        orderBy: {
          [input.order.field]: input.order.direction,
        },
      });
    }
    if (input.filter?.type) {
      Object.assign(query, {
        where: {
          titletype: input.filter.type,
        },
      });
    }
    return query;
  }
}
