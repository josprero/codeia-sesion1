export interface TmdbMovieResponse {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  genre_ids?: number[];
  vote_average?: number;
  original_language?: string;
  runtime?: number;
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
  backdrop: string;
  year: string;
  genres: string[];
  rating: number;
  runtime?: number;
}

// Credits
export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path?: string | null;
  order: number;
}

// Videos
export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

// Reviews
export interface Review {
  id: string;
  author: string;
  content: string;
  created_at: string;
  author_details: {
    rating?: number | null;
    avatar_path?: string | null;
  };
}

// Watch Providers
export interface WatchProvider {
  logo_path: string;
  provider_name: string;
  provider_id: number;
}

export interface WatchProviderResult {
  flatrate?: WatchProvider[];
  rent?: WatchProvider[];
  buy?: WatchProvider[];
}
