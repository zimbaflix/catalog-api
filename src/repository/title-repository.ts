import { Title } from '../entity/title';

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export type TitleRepositoryListInput = {
  cursor?: string;
  limit?: number;
  sort?: {
    field: string;
    direction: SortDirection;
  };
  filter?: {
    type?: string;
  };
};

export type TitleRepositoryListOutput = {
  data: Title[];
  cursor?: string;
};

export interface TitleRepository {
  list(input: TitleRepositoryListInput): Promise<TitleRepositoryListOutput>;
}
