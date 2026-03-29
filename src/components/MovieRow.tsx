import { useRef } from 'react';
import { Movie } from '../types/tmdb';
import MovieRowCard from './MovieRowCard';

interface Props {
  title: string;
  movies: Movie[];
  onSelectMovie?: (movie: Movie) => void;
}

export default function MovieRow({ title, movies, onSelectMovie }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  if (!movies.length) return null;

  return (
    <section className="group/row mb-10">
      <h2 className="mb-3 text-base font-bold text-white">
        <span className="border-l-[3px] border-primary pl-3">{title}</span>
      </h2>

      <div className="relative">
        {/* Left fade + arrow */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-[#0a0a0f] to-transparent" />
        <button
          onClick={() => scroll('left')}
          aria-label="Scroll izquierda"
          className="absolute left-0 top-1/3 z-20 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-black/60 text-lg text-white backdrop-blur-sm opacity-0 transition-opacity group-hover/row:opacity-100 hover:border-white/40 hover:bg-black/90"
        >
          ‹
        </button>

        {/* Scrollable strip */}
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto px-1 pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((movie) => (
            <MovieRowCard
              key={movie.id}
              movie={movie}
              onClick={() => onSelectMovie?.(movie)}
            />
          ))}
        </div>

        {/* Right fade + arrow */}
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-[#0a0a0f] to-transparent" />
        <button
          onClick={() => scroll('right')}
          aria-label="Scroll derecha"
          className="absolute right-0 top-1/3 z-20 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-black/60 text-lg text-white backdrop-blur-sm opacity-0 transition-opacity group-hover/row:opacity-100 hover:border-white/40 hover:bg-black/90"
        >
          ›
        </button>
      </div>
    </section>
  );
}
