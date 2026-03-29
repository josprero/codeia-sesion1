import { Movie } from '../types/tmdb';
import MovieCard from './MovieCard';

interface Props {
  movies: Movie[];
  onSelectMovie?: (movie: Movie) => void;
}

export default function MovieGrid({ movies, onSelectMovie }: Props) {
  if (!movies.length) {
    return <p className="rounded-lg bg-slate-800 p-6 text-center text-slate-300">No hay resultados.</p>;
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} onClick={() => onSelectMovie?.(movie)} />
      ))}
    </div>
  );
}
