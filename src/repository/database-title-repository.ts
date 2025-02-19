import type { DefaultArgs } from '@prisma/client/runtime/library';
import type { TitleRepository, TitleRepositoryListInput, TitleRepositoryListOutput } from './title-repository';
import { Prisma, PrismaClient } from '@prisma/client';
import { Title } from '../entity/title';

export class DatabaseTitleRepository implements TitleRepository {
  private readonly maxLimit = 10;

  constructor(private readonly db: PrismaClient) {}

  async list(input: TitleRepositoryListInput): Promise<TitleRepositoryListOutput> {
    const rows = await this.db.title.findMany({
      take: input.limit ? Math.min(input.limit, this.maxLimit) : this.maxLimit,
      ...this.buildListQuery(input),
    });
    const titles: Title[] = rows.map((row) => ({
      id: row.id,
      type: row.type,
      primaryTitle: row.primaryTitle,
      originalTitle: row.originalTitle,
      startYear: row.startYear,
      endYear: row.endYear,
      genres: row.genres?.split(',') ?? [],
      runtimeMinutes: row.runtimeMinutes,
    }));
    return {
      data: titles,
      cursor: titles.length > 0 ? titles[titles.length - 1].id : undefined,
    };
  }

  private buildListQuery(input: TitleRepositoryListInput): Prisma.TitleFindManyArgs<DefaultArgs> {
    const query: Prisma.TitleFindManyArgs<DefaultArgs> = {};
    if (input.cursor) {
      Object.assign(query, { skip: 1, cursor: { tconst: input.cursor } });
    }
    if (input.sort?.field) {
      Object.assign(query, { orderBy: { [input.sort.field]: input.sort.direction } });
    }
    if (input.filter?.type) {
      Object.assign(query, { where: { type: input.filter.type } });
    }
    return query;
  }
}
