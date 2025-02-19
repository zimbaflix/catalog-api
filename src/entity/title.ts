export interface Title {
  id: string;
  type: string;
  primaryTitle: string;
  originalTitle: string;
  startYear: number | null;
  endYear: number | null;
  genres: string[];
  runtimeMinutes: number | null;
}
