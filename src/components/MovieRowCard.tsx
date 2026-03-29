import { Movie } from '../types/tmdb';

interface Props {
  movie: Movie;
  onClick?: () => void;
  className?: string;
}

export default function MovieRowCard({ movie, onClick, className = 'w-72 flex-shrink-0' }: Props) {
  return (
    <article onClick={onClick} className={`group cursor-pointer ${className}`}>
      {/* 16:9 image */}
      <div className="relative aspect-video overflow-hidden rounded-md bg-slate-800">
        <img
          src={movie.backdrop || movie.poster}
          alt={movie.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => (e.currentTarget.src = '/placeholder-poster.png')}
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-white/15 backdrop-blur-sm">
            <span className="ml-0.5 text-sm text-white">▶</span>
          </div>
          <span className="text-xs font-semibold text-yellow-400">★ {movie.rating}</span>
        </div>
      </div>

      {/* Title — truncado al ancho de la imagen */}
      <p className="mt-2 w-full truncate text-sm font-medium text-slate-300 transition-colors group-hover:text-white">
        {movie.title}
      </p>
    </article>
  );
}
