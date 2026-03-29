export interface TmdbMovieResponse {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  poster_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  genre_ids?: number[];
  vote_average?: number;
  original_language?: string;
}

export interface TmdbListResponse {
  page: number;
  results: TmdbMovieResponse[];
  total_pages: number;
  total_results: number;
}

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster: string;
  year: string;
  genres: string[];
  rating: number;
}
