import { useEffect, useState } from 'react';
import {
  fetchTrending,
  fetchNowPlaying,
  fetchTopRated,
  fetchByGenre,
  fetchByYear,
  searchMovies,
  fetchMovieById,
} from './lib/tmdb';
import { normalizeMovie } from './lib/transform';
import MovieRow from './components/MovieRow';
import MovieRowCard from './components/MovieRowCard';
import MovieDetail from './components/MovieDetail';
import SearchInput from './components/SearchInput';
import HeroSlider from './components/HeroSlider';
import { Movie } from './types/tmdb';

// Genre IDs from TMDB
const GENRE_ROWS = [
  { key: 'action',   label: '💥 Acción',          id: 28 },
  { key: 'comedy',   label: '😂 Comedia',          id: 35 },
  { key: 'drama',    label: '🎭 Drama',             id: 18 },
  { key: 'horror',   label: '👻 Terror',            id: 27 },
  { key: 'scifi',    label: '🚀 Ciencia Ficción',   id: 878 },
  { key: 'thriller', label: '🔪 Thriller',          id: 53 },
  { key: 'romance',  label: '❤️ Romance',           id: 10749 },
  { key: 'animation',label: '🎨 Animación',         id: 16 },
  { key: 'crime',    label: '🕵️ Crimen',            id: 80 },
] as const;

type CategoryKey = (typeof GENRE_ROWS)[number]['key'] | 'trending' | 'topRated' | 'year2025' | 'year2024';

export default function App() {
  const [nowPlaying, setNowPlaying]       = useState<Movie[]>([]);
  const [categories, setCategories]       = useState<Partial<Record<CategoryKey, Movie[]>>>({});
  const [q, setQ]                         = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState('');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      setError('');
      try {
        // Parallel fetch — hero + all category rows
        const [
          nowPlayingData,
          trendingData,
          topRatedData,
          year2025Data,
          year2024Data,
          ...genreData
        ] = await Promise.all([
          fetchNowPlaying(1),
          fetchTrending('movie', 'week'),
          fetchTopRated(1),
          fetchByYear(2025),
          fetchByYear(2024),
          ...GENRE_ROWS.map((g) => fetchByGenre(g.id)),
        ]);

        setNowPlaying(nowPlayingData.results.map(normalizeMovie));

        const built: Partial<Record<CategoryKey, Movie[]>> = {
          trending:  trendingData.results.map(normalizeMovie),
          topRated:  topRatedData.results.map(normalizeMovie),
          year2025:  year2025Data.results.map(normalizeMovie),
          year2024:  year2024Data.results.map(normalizeMovie),
        };
        GENRE_ROWS.forEach((g, i) => {
          built[g.key] = genreData[i].results.map(normalizeMovie);
        });

        setCategories(built);
      } catch (err) {
        console.error(err);
        setError('No se pudo cargar datos de TMDB.');
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const handleSearch = async (term: string) => {
    setQ(term);
    if (!term.trim()) { setSearchResults([]); return; }
    setLoading(true);
    setError('');
    try {
      const resp = await searchMovies(term, 1);
      setSearchResults(resp.results.map(normalizeMovie));
    } catch (err) {
      console.error(err);
      setError('Error en búsqueda de TMDB.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMovie = async (movie: Movie) => {
    setLoading(true);
    try {
      const data = await fetchMovieById(movie.id);
      setSelectedMovie(normalizeMovie(data));
    } catch (err) {
      console.error(err);
      setError('No se pudo cargar el detalle de la película.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-foreground">
      {selectedMovie ? (
        <MovieDetail movie={selectedMovie} onBack={() => setSelectedMovie(null)} onSelectMovie={handleSelectMovie} />
      ) : (
        /* ── Home view ── */
        <>
          {/* Navbar — solid bg when buscando, gradiente sobre hero */}
          <header className={`fixed left-0 right-0 top-0 z-50 px-6 py-4 transition-all duration-300 ${
            q ? 'bg-[#0a0a0f]/95 backdrop-blur-md border-b border-slate-800' : 'bg-gradient-to-b from-black/80 to-transparent'
          }`}>
            <div className="mx-auto flex max-w-7xl items-center justify-between">
              <h1 className="text-3xl font-black tracking-tight text-primary">Verflix</h1>
              <SearchInput value={q} onSearch={handleSearch} />
            </div>
          </header>

          {/* Hero slider */}
          {!q && <HeroSlider movies={nowPlaying} onSelectMovie={handleSelectMovie} />}

          {/* Search results — página independiente */}
          {q && (
            <div className="min-h-screen pt-24">
              <div className="mx-auto max-w-7xl px-6">

                {/* Header búsqueda */}
                <div className="mb-10 border-b border-slate-800 pb-8">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
                    Resultados de búsqueda
                  </p>
                  <h2 className="text-4xl font-black text-white md:text-5xl">
                    "{q}"
                  </h2>
                  {!loading && (
                    <p className="mt-3 text-sm text-slate-400">
                      {searchResults.length > 0
                        ? `${searchResults.length} películas encontradas`
                        : 'Sin resultados'}
                    </p>
                  )}
                </div>

                {/* Spinner */}
                {loading && (
                  <div className="flex items-center gap-3 py-20 justify-center text-slate-400">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    Buscando...
                  </div>
                )}

                {/* Sin resultados */}
                {!loading && searchResults.length === 0 && (
                  <div className="py-28 text-center">
                    <p className="text-5xl mb-5">🎬</p>
                    <p className="text-xl font-bold text-white">Sin resultados para "{q}"</p>
                    <p className="mt-2 text-sm text-slate-500">Prueba con otro título o palabra clave</p>
                  </div>
                )}

                {/* Grid de resultados */}
                {!loading && searchResults.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {searchResults.map((movie) => (
                      <MovieRowCard
                        key={movie.id}
                        movie={movie}
                        className="w-full"
                        onClick={() => handleSelectMovie(movie)}
                      />
                    ))}
                  </div>
                )}

              </div>
            </div>
          )}

          {/* Category rows */}
          <main className="mx-auto max-w-7xl px-6 py-8">
            {error && (
              <div className="mb-6 rounded-lg border border-red-600/40 bg-red-600/20 p-3 text-red-300">
                {error}
              </div>
            )}

            {/* Home rows */}
            {!q && (
              <>
                <MovieRow
                  title="🔥 Trending esta semana"
                  movies={categories.trending ?? []}
                  onSelectMovie={handleSelectMovie}
                />
                <MovieRow
                  title="⭐ Mejor Valoradas"
                  movies={categories.topRated ?? []}
                  onSelectMovie={handleSelectMovie}
                />
                <MovieRow
                  title="🎬 Estrenos 2025"
                  movies={categories.year2025 ?? []}
                  onSelectMovie={handleSelectMovie}
                />
                <MovieRow
                  title="📅 Lo mejor de 2024"
                  movies={categories.year2024 ?? []}
                  onSelectMovie={handleSelectMovie}
                />
                {GENRE_ROWS.map((g) => (
                  <MovieRow
                    key={g.key}
                    title={g.label}
                    movies={categories[g.key] ?? []}
                    onSelectMovie={handleSelectMovie}
                  />
                ))}
              </>
            )}
          </main>
        </>
      )}
    </div>
  );
}
