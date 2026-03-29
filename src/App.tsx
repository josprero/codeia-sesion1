import { useEffect, useState } from 'react';
import { fetchTrending, fetchPopular, searchMovies } from './lib/tmdb';
import { normalizeMovie } from './lib/transform';
import MovieGrid from './components/MovieGrid';
import SearchInput from './components/SearchInput';

export default function App() {
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [q, setQ] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      setError('');
      try {
        const trendingData = await fetchTrending('movie', 'week');
        setTrending(trendingData.results.map(normalizeMovie));
        const popularData = await fetchPopular(1);
        setPopular(popularData.results.map(normalizeMovie));
      } catch (err) {
        console.error(err);
        setError('No se pudo cargar datos de TMDB.');
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const handleSearch = async (term) => {
    setQ(term);
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }
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

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <header className="mx-auto max-w-6xl px-4 py-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">NetfliXia</h1>
        <SearchInput value={q} onSearch={handleSearch} />
      </header>

      <main className="mx-auto max-w-6xl px-4">
        {error && <div className="rounded-lg bg-red-600 p-3 text-white">{error}</div>}
        {loading && <div className="py-8">Cargando...</div>}

        {!q && (
          <>
            <section className="mb-8">
              <h2 className="mb-4 text-xl font-semibold">Trending esta semana</h2>
              <MovieGrid movies={trending} />
            </section>
            <section className="mb-8">
              <h2 className="mb-4 text-xl font-semibold">Populares</h2>
              <MovieGrid movies={popular} />
            </section>
          </>
        )}

        {q && (
          <section className="mb-8">
            <h2 className="mb-4 text-xl font-semibold">Resultados para "{q}"</h2>
            <MovieGrid movies={searchResults} />
          </section>
        )}
      </main>
    </div>
  );
}
