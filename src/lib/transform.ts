import { Movie, TmdbMovieResponse } from '../types/tmdb';

const IMG_BASE = import.meta.env.VITE_TMDB_IMG_BASE || 'https://image.tmdb.org/t/p/w500';

const genreMap: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

const toYear = (movie: TmdbMovieResponse): string => {
  const date = movie.release_date || movie.first_air_date || '';
  if (!date) return 'N/A';
  const year = date.slice(0, 4);
  return year.match(/^\d{4}$/) ? year : 'N/A';
};

const toPoster = (path?: string | null): string => {
  if (!path) return '/placeholder-poster.png';
  return `${IMG_BASE}${path}`;
};

const toGenres = (ids?: number[]): string[] => {
  if (!Array.isArray(ids)) return [];
  return ids.map((id) => genreMap[id] || 'Unknown');
};

export const normalizeMovie = (input: TmdbMovieResponse): Movie => ({
  id: input.id,
  title: input.title || input.name || 'Untitled',
  overview: input.overview?.trim() || 'Descripción no disponible',
  poster: toPoster(input.poster_path),
  year: toYear(input),
  genres: toGenres(input.genre_ids),
  rating: Number((input.vote_average ?? 0).toFixed(1)),
});
