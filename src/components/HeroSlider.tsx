import { useState, useEffect, useCallback } from 'react';
import { Movie } from '../types/tmdb';

interface Props {
  movies: Movie[];
  onSelectMovie?: (movie: Movie) => void;
}

const DURATION = 7000;

export default function HeroSlider({ movies, onSelectMovie }: Props) {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);

  const total = Math.min(movies.length, 6);

  const goTo = useCallback(
    (idx: number) => {
      setCurrent(idx);
      setProgress(0);
    },
    [],
  );

  const goNext = () => goTo((current + 1) % total);
  const goPrev = () => goTo((current - 1 + total) % total);

  useEffect(() => {
    if (!total) return;
    let frame: number;
    let start: number | null = null;

    const tick = (ts: number) => {
      if (start === null) start = ts;
      const p = Math.min(((ts - start) / DURATION) * 100, 100);
      setProgress(p);
      if (p < 100) {
        frame = requestAnimationFrame(tick);
      } else {
        setCurrent((prev) => (prev + 1) % total);
        setProgress(0);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [current, total]);

  if (!total) return null;

  const movie = movies[current];

  return (
    <div className="relative h-[90vh] min-h-[600px] w-full overflow-hidden bg-black">
      {/* Slides — crossfade */}
      {movies.slice(0, total).map((m, idx) => (
        <div
          key={m.id}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: idx === current ? 1 : 0 }}
        >
          <img
            src={m.backdrop || m.poster}
            alt=""
            className="h-full w-full object-cover"
            onError={(e) => (e.currentTarget.src = '/placeholder-poster.png')}
          />
        </div>
      ))}

      {/* Gradient overlays */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0a0a0f] via-transparent to-black/20" />

      {/* Main content */}
      <div className="absolute inset-0 z-20 flex items-center">
        <div className="w-full max-w-2xl px-8 md:px-16 lg:px-20">
          {/* "En cartelera" badge */}
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px w-8 bg-primary" />
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              En cartelera
            </span>
          </div>

          {/* Title */}
          <h1 className="mb-4 text-5xl font-black leading-tight tracking-tight text-white drop-shadow-2xl md:text-6xl lg:text-7xl">
            {movie.title}
          </h1>

          {/* Meta row */}
          <div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
            <span className="rounded border border-slate-500/60 px-2 py-0.5 text-slate-300">
              {movie.year}
            </span>
            <span className="font-semibold text-yellow-400">★ {movie.rating}</span>
            {movie.genres.slice(0, 3).map((g) => (
              <span key={g} className="text-slate-400">
                {g}
              </span>
            ))}
          </div>

          {/* Overview */}
          <p className="mb-8 max-w-lg text-sm leading-relaxed text-slate-300 line-clamp-3">
            {movie.overview}
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onSelectMovie?.(movie)}
              className="flex items-center gap-2 rounded-lg bg-primary px-8 py-3 font-bold text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:bg-[#f40612] hover:shadow-primary/40"
            >
              <span>▶</span> Ver detalle
            </button>
            <button className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-8 py-3 font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20">
              <span>+</span> Mi lista
            </button>
          </div>
        </div>
      </div>

      {/* Thumbnail strip — right side */}
      <div className="absolute right-6 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-3 lg:flex">
        {movies.slice(0, total).map((m, idx) => (
          <button
            key={m.id}
            onClick={() => goTo(idx)}
            className={`relative h-16 w-28 overflow-hidden rounded-lg border-2 transition-all ${
              idx === current
                ? 'border-primary shadow-lg shadow-primary/30'
                : 'border-transparent opacity-50 hover:opacity-80'
            }`}
          >
            <img
              src={m.backdrop || m.poster}
              alt={m.title}
              className="h-full w-full object-cover"
              onError={(e) => (e.currentTarget.src = '/placeholder-poster.png')}
            />
            {idx === current && (
              <div className="absolute inset-0 bg-primary/10" />
            )}
          </button>
        ))}
      </div>

      {/* Side arrows */}
      <button
        onClick={goPrev}
        aria-label="Anterior"
        className="absolute left-3 top-1/2 z-30 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/40 text-2xl text-white backdrop-blur-sm transition-all hover:border-white/40 hover:bg-black/70 lg:left-5"
      >
        ‹
      </button>
      <button
        onClick={goNext}
        aria-label="Siguiente"
        className="absolute right-3 top-1/2 z-30 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/40 text-2xl text-white backdrop-blur-sm transition-all hover:border-white/40 hover:bg-black/70 lg:right-44"
      >
        ›
      </button>

      {/* Bottom progress lines + counter */}
      <div className="absolute bottom-8 left-8 z-30 flex items-center gap-4 md:left-16 lg:left-20">
        <span className="font-mono text-xs text-slate-400">
          <span className="font-bold text-white">{String(current + 1).padStart(2, '0')}</span>
          /{String(total).padStart(2, '0')}
        </span>
        <div className="flex items-center gap-2">
          {Array.from({ length: total }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              aria-label={`Ir a slide ${idx + 1}`}
              className="relative h-[3px] overflow-hidden rounded-full bg-slate-700 transition-all duration-300"
              style={{ width: idx === current ? 48 : 20 }}
            >
              {idx < current && <div className="absolute inset-0 bg-primary" />}
              {idx === current && (
                <div
                  className="absolute inset-y-0 left-0 bg-primary transition-none"
                  style={{ width: `${progress}%` }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
