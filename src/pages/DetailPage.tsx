import { useEffect, useState } from 'react';
import { fetchMovieById, fetchTVById } from '../lib/tmdb';
import { normalizeMovie } from '../lib/transform';
import MovieDetail from '../components/MovieDetail';
import { Movie } from '../types/tmdb';

export default function DetailPage() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const type = (params.get('type') || 'movie') as 'movie' | 'tv';

  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      if (!id) {
        setError('ID no proporcionado');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');
      try {
        const fetcher = type === 'tv' ? fetchTVById : fetchMovieById;
        const data = await fetcher(Number(id));
        setMovie(normalizeMovie(data));
      } catch (err) {
        console.error(err);
        setError('No se pudo cargar el detalle de la película.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, type]);

  if (loading) return <div className="p-6">Cargando...</div>;
  if (error) return <div className="rounded-lg bg-red-600 p-3 text-white">{error}</div>;
  if (!movie) return <div className="p-6">No encontrado</div>;

  return <MovieDetail movie={movie} onBack={() => window.history.back()} />;
}
