import { Title } from '../entity/title';

export type TitleRepositoryListInput = {
  cursor?: string;
  limit?: number;
  order?: {
    field: string;
    direction: 'asc' | 'desc';
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
