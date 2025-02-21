export type TitleType = 'movie' | 'tvSeries' | 'tvEpisode';

export interface Title {
  id: string;
  type: TitleType;
  primaryTitle: string;
  originalTitle: string;
  startYear: number | null;
  endYear: number | null;
  genres: string[];
  runtimeMinutes: number | null;
  averageRate: number | null;
}
