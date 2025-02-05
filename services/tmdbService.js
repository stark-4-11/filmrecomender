import axios from 'axios';

const fetchTMDBDetails = async (title, year) => {
  try {
    const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${encodeURIComponent(title)}&year=${year}`;
    const searchRes = await axios.get(searchUrl);

    if (searchRes.data.results?.length > 0) {
      const movieId = searchRes.data.results[0].id;
      const detailsUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.TMDB_API_KEY}`;
      const detailsRes = await axios.get(detailsUrl);

      return {
        tmdbRating: detailsRes.data.vote_average,
        genres: detailsRes.data.genres.map(g => g.name),
        plot: detailsRes.data.overview,
        posterUrl: `https://image.tmdb.org/t/p/w500${detailsRes.data.poster_path}`,
        runtime: detailsRes.data.runtime,
        countries: detailsRes.data.production_countries.map(c => c.name),
        directors: detailsRes.data.credits.crew
          .filter(member => member.job === 'Director')
          .map(d => d.name)
      };
    }
    return null;
  } catch (error) {
    console.error('TMDB API error:', error.message);
    return null;
  }
};

// Named export (not default)
export { fetchTMDBDetails };