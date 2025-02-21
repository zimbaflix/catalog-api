import { Title, TitleType } from '../entity/title';

export enum TitleSortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export type TitleSort = Partial<Record<keyof Title, TitleSortDirection>>;

export type TitleFilterFields = Partial<Omit<Title, 'id'>>;

export type TitleFilterOperators<T> = T & {
  eq?: T | null;
  not?: T | null;
  lte?: T;
  gte?: T;
  in?: T[];
  notIn?: T[];
  like?: string;
};

export type TitleFilter = TitleFilterFields & {
  type?: TitleFilterOperators<TitleType>;
  startYear?: TitleFilterOperators<number>;
  averageRate?: TitleFilterOperators<number>;
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
