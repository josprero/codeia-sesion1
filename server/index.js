const express = require('express');
const fetch = require('node-fetch');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const TMDB_BASE_URL = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_DEFAULT_LANGUAGE = process.env.TMDB_DEFAULT_LANGUAGE || 'es-ES';

if (!TMDB_API_KEY) {
  console.warn('TMDB_API_KEY is not set in .env');
}

const tmdbFetch = async (path, query = {}) => {
  const url = new URL(`${TMDB_BASE_URL}${path}`);
  url.searchParams.set('api_key', TMDB_API_KEY || '');
  url.searchParams.set('language', TMDB_DEFAULT_LANGUAGE);
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && val# Re-create server url.searchParams.set(key, value);
    }
  })  })  })  })  })  })  }ait fetch(url.toString());
  if (!response.ok) {
    const text = await response.text();
    const error = new Error(`TMDB error ${response.status}: ${text}`);
    error.status = response.status;
    throw error;
  }
  return response.json();
};

const cache = new Map();
const CACHE_TTL_MS = 120000;

const getCache = (key) => {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return entry.value;
};

const setCache = (key, value) => {
  cache.set(key, { ts: Date.now(), value });
};

const withCache = async (key, fn) => {
  const cached = getCache(key);
  if (cached) return cached;
  const result = await fn();
  setCache(key, result);
  return result;
};

app.get('/api/movies/popular', async (req, res) => {
  try {
    const page = req.query.page || '1';
    const data = await withCache(`popular:${page}`, () => tmdbFetch('/movie/popular', { page }));
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
});

app.get('/api/movies/top-rated', async (req, res) => {
  try {
    const page = req.query.page || '1';
    const data = await withCache(`top_rated:${page}`, () => tmdbFetch('/movie/top_rated', { page }));
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
});

app.get('/api/genres/movie', async (req, res) => {
  try {
    const data = await withCache('genres_movie', () => tmdbFetch('/genre/movie/list'));
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
});

app.get('/api/search', async (req, res) => {
  try {
    const { q = '', type = 'multi', page = '1' } = req.query;
    if (!q.trim()) {
      return res.status(400).json({ message: 'query param q is required' });
    }
    const data = await tmdbFetch(`/search/${type}`, { query: q, page });
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
});

app.get('/api/movies/:id', async (req, res) => {
  try {
    const data = await tmdbFetch(`/movie/${req.params.id}`);
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
});

app.get('/api/movies/:id/credits', async (req, res) => {
  try {
    const data = await tmdbFetch(`/movie/${req.params.id}/credits`);
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
});

app.get('/api/movies/:id/videos', async (req, res) => {
  try {
    const data = await tmdbFetch(`/movie/${req.params.id}/videos`);
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`TMDB proxy backend running on port ${PORT}`));
