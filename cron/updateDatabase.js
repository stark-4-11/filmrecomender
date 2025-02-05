import cron from 'node-cron';
import Movie from '../database/movieModel.js';
import { scrapeLetterboxdSearch } from '../services/letterboxdScraper.js';
import { fetchTMDBDetails } from '../services/tmdbService.js';

const HIGH_RATED_LISTS = [
  'https://letterboxd.com/ashleynicolexo/list/world-cinema-101/',
  'https://letterboxd.com/dave/list/official-top-250-narrative-feature-films/',
  'https://letterboxd.com/ashleynicolexo/list/underrated-movies-that-are-a-must-watch/'
];

const updateDatabase = async () => {
  console.log('Starting database update...');
  
  try {
    for (const listUrl of HIGH_RATED_LISTS) {
      const movies = await scrapeLetterboxdSearch(listUrl);
      
      for (const movie of movies) {
        const existing = await Movie.findOne({ 
          title: movie.title,
          year: movie.year
        });

        if (!existing) {
          const tmdbData = await fetchTMDBDetails(movie.title, movie.year);
          
          if (tmdbData && tmdbData.tmdbRating >= 7.0) {
            const newMovie = new Movie({
              ...movie,
              ...tmdbData,
              underrated: movie.letterboxdRating >= 3.8 && tmdbData.tmdbRating < 7.5
            });

            await newMovie.save();
            console.log(`Added: ${movie.title} (${movie.year})`);
          }
        }
      }
    }
    console.log('Database update completed successfully');
  } catch (error) {
    console.error('Database update failed:', error.message);
  }
};

cron.schedule('0 3 * * *', updateDatabase);
updateDatabase();