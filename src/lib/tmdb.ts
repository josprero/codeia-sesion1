import { TmdbListResponse, TmdbMovieResponse } from '../types/tmdb';

const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY || '';
const DEFAULT_LANGUAGE = 'es-ES';

if (!API_KEY) {
  console.warn('TMDB API key no encontrada en VITE_TMDB_API_KEY');
}

const buildUrl = (path: string, params: Record<string, string | number | undefined> = {}) => {
  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.set('api_key', API_KEY);
  url.searchParams.set('language', DEFAULT_LANGUAGE);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  });
  return url.toString();
};

const request = async <T>(path: string, params: Record<string, string | number | undefined> = {}): Promise<T> => {
  const url = buildUrl(path, params);
  const res = await fetch(url);

  if (res.status === 429) {
    throw new Error('Rate limit excedido');
  }
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`TMDB error ${res.status}: ${text}`);
  }

  return (await res.json()) as T;
};

export const fetchTrending = (mediaType: 'movie' | 'tv' = 'movie', timeWindow: 'day' | 'week' = 'week') =>
  request<TmdbListResponse>(`/trending/${mediaType}/${timeWindow}`);

export const fetchPopular = (page = 1) => request<TmdbListResponse>('/movie/popular', { page });

export const searchMovies = (query: string, page = 1) => request<TmdbListResponse>('/search/movie', { query, page });

export const fetchMovieById = (id: number) => request<TmdbMovieResponse>(`/movie/${id}`);

export const fetchTVById = (id: number) => request<TmdbMovieResponse>(`/tv/${id}`);
