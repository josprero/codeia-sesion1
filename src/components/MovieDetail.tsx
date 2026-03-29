import { useState, useEffect } from 'react';
import {
  fetchMovieCredits,
  fetchMovieVideos,
  fetchMovieWatchProviders,
  fetchMovieReviews,
  fetchMovieRecommendations,
} from '../lib/tmdb';
import { normalizeMovie } from '../lib/transform';
import { Movie, CastMember, Video, Review, WatchProviderResult } from '../types/tmdb';
import MovieRowCard from './MovieRowCard';

interface Props {
  movie: Movie;
  onBack: () => void;
  onSelectMovie?: (movie: Movie) => void;
}

interface Extras {
  cast: CastMember[];
  trailer: Video | null;
  providers: WatchProviderResult;
  reviews: Review[];
  recommendations: Movie[];
}

const SECTIONS = [
  { id: 'reparto',    label: 'Reparto' },
  { id: 'trailer',   label: 'Trailer' },
  { id: 'donde-ver', label: 'Dónde ver' },
  { id: 'resenas',   label: 'Reseñas' },
  { id: 'similares', label: 'Similares' },
];

const IMG_PROFILE  = 'https://image.tmdb.org/t/p/w185';
const IMG_PROVIDER = 'https://image.tmdb.org/t/p/w92';

const formatRuntime = (mins?: number) => {
  if (!mins) return null;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

const avatarUrl = (path?: string | null) => {
  if (!path) return null;
  // TMDB sometimes stores external URLs as "/https://..."
  if (path.startsWith('/http')) return path.slice(1);
  return `${IMG_PROFILE}${path}`;
};

export default function MovieDetail({ movie, onBack, onSelectMovie }: Props) {
  const [extras, setExtras]             = useState<Extras | null>(null);
  const [loading, setLoading]           = useState(true);
  const [activeSection, setActiveSection] = useState('reparto');
  const [trailerOpen, setTrailerOpen]   = useState(false);

  useEffect(() => {
    setExtras(null);
    setLoading(true);
    setActiveSection('reparto');
    setTrailerOpen(false);
    window.scrollTo({ top: 0 });

    (async () => {
      try {
        const [credits, videos, providers, reviews, recs] = await Promise.all([
          fetchMovieCredits(movie.id),
          fetchMovieVideos(movie.id),
          fetchMovieWatchProviders(movie.id),
          fetchMovieReviews(movie.id),
          fetchMovieRecommendations(movie.id),
        ]);

        const trailer =
          videos.results.find(v => v.site === 'YouTube' && v.type === 'Trailer' && v.official) ??
          videos.results.find(v => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')) ??
          null;

        const regionProviders = providers.results?.ES ?? providers.results?.US ?? {};

        setExtras({
          cast: credits.cast.slice(0, 20),
          trailer,
          providers: regionProviders,
          reviews: reviews.results.slice(0, 6),
          recommendations: recs.results.slice(0, 12).map(normalizeMovie),
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [movie.id]);

  const scrollTo = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">

      {/* ── Hero banner ── */}
      <div className="relative h-[55vh] min-h-[380px] w-full overflow-hidden">
        <img
          src={movie.backdrop || movie.poster}
          alt=""
          className="h-full w-full object-cover object-top"
          onError={(e) => (e.currentTarget.src = '/placeholder-poster.png')}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/20 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f]/50 to-transparent" />
        <button
          onClick={onBack}
          className="absolute left-6 top-6 z-20 flex items-center gap-2 rounded-full border border-white/20 bg-black/50 px-4 py-2 text-sm font-medium backdrop-blur-sm transition hover:bg-black/80"
        >
          ← Volver
        </button>
      </div>

      {/* ── Contenido principal — solapa el banner ── */}
      <div className="relative z-10 -mt-36 mx-auto max-w-6xl px-8 md:px-14 lg:px-20">

        {/* Poster + info */}
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:gap-10">

          {/* Poster */}
          <div className="flex-shrink-0 w-44 md:w-56 lg:w-64">
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full rounded-2xl shadow-2xl shadow-black ring-2 ring-white/10"
              onError={(e) => (e.currentTarget.src = '/placeholder-poster.png')}
            />
          </div>

          {/* Info */}
          <div className="flex flex-col gap-4 pb-2">
            <div className="flex flex-wrap gap-2">
              {movie.genres.slice(0, 4).map((g) => (
                <span key={g} className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                  {g}
                </span>
              ))}
            </div>

            <h1 className="text-4xl font-black leading-tight tracking-tight md:text-5xl lg:text-6xl">
              {movie.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
              <span>{movie.year}</span>
              {movie.runtime && (
                <>
                  <span className="h-1 w-1 rounded-full bg-slate-600" />
                  <span>{formatRuntime(movie.runtime)}</span>
                </>
              )}
              <span className="h-1 w-1 rounded-full bg-slate-600" />
              <span className="font-bold text-yellow-400">★ {movie.rating} / 10</span>
            </div>

            <p className="max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">
              {movie.overview}
            </p>

            <div className="flex flex-wrap gap-3 pt-1">
              <button className="flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 font-bold shadow-lg shadow-primary/25 transition-all hover:scale-105 hover:bg-[#f40612]">
                ▶ Ver ahora
              </button>
              {extras?.trailer && (
                <button
                  onClick={() => setTrailerOpen(true)}
                  className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 font-bold backdrop-blur-sm transition hover:bg-white/20"
                >
                  🎬 Trailer
                </button>
              )}
              <button className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 font-bold backdrop-blur-sm transition hover:bg-white/20">
                + Mi lista
              </button>
            </div>
          </div>
        </div>

        {/* ── Sticky nav de secciones ── */}
        <div className="sticky top-0 z-40 mt-12 -mx-8 border-b border-slate-800 bg-[#0a0a0f]/95 px-8 backdrop-blur-md md:-mx-14 md:px-14 lg:-mx-20 lg:px-20">
          <div className="flex gap-1 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className={`whitespace-nowrap border-b-2 px-4 py-4 text-sm font-semibold transition-colors ${
                  activeSection === s.id
                    ? 'border-primary text-white'
                    : 'border-transparent text-slate-500 hover:text-white'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Spinner cargando extras ── */}
        {loading && (
          <div className="flex justify-center py-24">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}

        {extras && (
          <div className="mt-2">

            {/* ── REPARTO ── */}
            <section id="reparto" className="scroll-mt-16 pt-12">
              <h2 className="mb-6 text-xl font-bold">Reparto principal</h2>
              {extras.cast.length === 0 ? (
                <p className="text-sm text-slate-500">Sin información de reparto.</p>
              ) : (
                <div className="flex gap-4 overflow-x-auto pb-3" style={{ scrollbarWidth: 'none' }}>
                  {extras.cast.map((member) => (
                    <div key={`${member.id}-${member.character}`} className="flex-shrink-0 w-24 text-center">
                      <div className="mb-2 aspect-square w-full overflow-hidden rounded-xl bg-slate-800">
                        {member.profile_path ? (
                          <img
                            src={`${IMG_PROFILE}${member.profile_path}`}
                            alt={member.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-3xl text-slate-600">
                            👤
                          </div>
                        )}
                      </div>
                      <p className="text-xs font-bold text-white line-clamp-1">{member.name}</p>
                      <p className="mt-0.5 text-[10px] text-slate-500 line-clamp-1">{member.character}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* ── TRAILER ── */}
            <section id="trailer" className="scroll-mt-16 pt-14">
              <h2 className="mb-6 text-xl font-bold">Trailer</h2>
              {!extras.trailer ? (
                <p className="text-sm text-slate-500">No hay trailer disponible.</p>
              ) : (
                <div
                  className="group relative max-w-3xl cursor-pointer overflow-hidden rounded-2xl bg-slate-900"
                  onClick={() => setTrailerOpen(true)}
                >
                  <div className="aspect-video">
                    <img
                      src={`https://img.youtube.com/vi/${extras.trailer.key}/maxresdefault.jpg`}
                      alt={extras.trailer.name}
                      className="h-full w-full object-cover brightness-75 transition group-hover:brightness-90"
                    />
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary shadow-xl shadow-primary/40 transition group-hover:scale-110">
                      <span className="ml-1 text-2xl text-white">▶</span>
                    </div>
                    <span className="text-sm font-semibold text-white drop-shadow">{extras.trailer.name}</span>
                  </div>
                </div>
              )}
            </section>

            {/* ── DÓNDE VER ── */}
            <section id="donde-ver" className="scroll-mt-16 pt-14">
              <h2 className="mb-6 text-xl font-bold">Dónde ver</h2>
              {!extras.providers.flatrate && !extras.providers.rent && !extras.providers.buy ? (
                <p className="text-sm text-slate-500">No hay información de plataformas para tu región.</p>
              ) : (
                <div className="flex flex-col gap-8">
                  {extras.providers.flatrate && extras.providers.flatrate.length > 0 && (
                    <div>
                      <p className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500">
                        Incluido en suscripción
                      </p>
                      <div className="flex flex-wrap gap-4">
                        {extras.providers.flatrate.map((p) => (
                          <div key={p.provider_id} className="flex flex-col items-center gap-2">
                            <img
                              src={`${IMG_PROVIDER}${p.logo_path}`}
                              alt={p.provider_name}
                              className="h-14 w-14 rounded-xl shadow-md"
                            />
                            <span className="text-[11px] text-slate-400">{p.provider_name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {extras.providers.rent && extras.providers.rent.length > 0 && (
                    <div>
                      <p className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500">Alquiler</p>
                      <div className="flex flex-wrap gap-4">
                        {extras.providers.rent.map((p) => (
                          <div key={p.provider_id} className="flex flex-col items-center gap-2">
                            <img
                              src={`${IMG_PROVIDER}${p.logo_path}`}
                              alt={p.provider_name}
                              className="h-14 w-14 rounded-xl shadow-md"
                            />
                            <span className="text-[11px] text-slate-400">{p.provider_name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {extras.providers.buy && extras.providers.buy.length > 0 && (
                    <div>
                      <p className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500">Compra</p>
                      <div className="flex flex-wrap gap-4">
                        {extras.providers.buy.map((p) => (
                          <div key={p.provider_id} className="flex flex-col items-center gap-2">
                            <img
                              src={`${IMG_PROVIDER}${p.logo_path}`}
                              alt={p.provider_name}
                              className="h-14 w-14 rounded-xl shadow-md"
                            />
                            <span className="text-[11px] text-slate-400">{p.provider_name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* ── RESEÑAS ── */}
            <section id="resenas" className="scroll-mt-16 pt-14">
              <h2 className="mb-6 text-xl font-bold">Reseñas</h2>
              {extras.reviews.length === 0 ? (
                <p className="text-sm text-slate-500">No hay reseñas disponibles.</p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {extras.reviews.map((review) => (
                    <div key={review.id} className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-full bg-slate-700">
                          {avatarUrl(review.author_details.avatar_path) ? (
                            <img
                              src={avatarUrl(review.author_details.avatar_path)!}
                              alt={review.author}
                              className="h-full w-full object-cover"
                              onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-sm font-bold text-white">
                              {review.author.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{review.author}</p>
                          {review.author_details.rating != null && (
                            <p className="text-xs font-semibold text-yellow-400">
                              ★ {review.author_details.rating} / 10
                            </p>
                          )}
                        </div>
                        <p className="ml-auto text-xs text-slate-600">
                          {new Date(review.created_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'short' })}
                        </p>
                      </div>
                      <p className="text-sm leading-relaxed text-slate-400 line-clamp-5">{review.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* ── SIMILARES ── */}
            <section id="similares" className="scroll-mt-16 pb-24 pt-14">
              <h2 className="mb-6 text-xl font-bold">Películas similares</h2>
              {extras.recommendations.length === 0 ? (
                <p className="text-sm text-slate-500">No hay recomendaciones disponibles.</p>
              ) : (
                <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
                  {extras.recommendations.map((rec) => (
                    <MovieRowCard
                      key={rec.id}
                      movie={rec}
                      onClick={() => onSelectMovie?.(rec)}
                    />
                  ))}
                </div>
              )}
            </section>

          </div>
        )}
      </div>

      {/* ── Modal trailer ── */}
      {trailerOpen && extras?.trailer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setTrailerOpen(false)}
        >
          <div
            className="relative w-full max-w-5xl overflow-hidden rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${extras.trailer.key}?autoplay=1&rel=0&modestbranding=1`}
                title={extras.trailer.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
            <button
              onClick={() => setTrailerOpen(false)}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
