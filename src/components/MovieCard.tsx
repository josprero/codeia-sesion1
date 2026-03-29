import { Movie } from '../types/tmdb';

interface Props {
  movie: Movie;
}

export default function MovieCard({ movie }: Props) {
  return (
    <article className="group relative overflow-hidden rounded-lg border border-slate-700 bg-slate-900 text-left shadow-lg transition-all hover:-translate-y-1 hover:border-primary">
      <img
        src={movie.poster}
        alt={movie.title}
        className="h-72 w-full object-cover transition duration-300 group-hover:scale-105"
        onError={(e) => (e.currentTarget.src = '/placeholder-poster.png')}
      />
      <div className="p-3">
        <h3 className="text-base font-bold text-white">{movie.title}</h3>
        <div className="mt-1 flex items-center justify-between text-xs text-slate-300">
          <span>{movie.year}</span>
          <span className="rounded bg-slate-700 px-2 py-0.5 text-[10px]">⭐ {movie.rating}</span>
        </div>
        <p className="mt-2 text-xs text-slate-300 line-clamp-3">{movie.overview}</p>
      </div>
    </article>
  );
}
