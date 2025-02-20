import { Title } from '../entity/title';

export enum TitleSortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export type TitleSort = Record<string, TitleSortDirection>;

export type TitleFilter = {
  type?: string;
  startYear?: {
    lte?: number;
    eq?: number;
  };
  averageRate?: {
    not?: number | null;
  };
};

export type TitleRepositoryListInput = {
  cursor?: string;
  limit?: number;
  sort?: TitleSort;
  filter?: TitleFilter;
};

export type TitleRepositoryListOutput = {
  data: Title[];
  cursor?: string;
};

export interface TitleRepository {
  list(input: TitleRepositoryListInput): Promise<TitleRepositoryListOutput>;
}
