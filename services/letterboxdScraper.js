import axios from 'axios';
import * as cheerio from 'cheerio';
import { throttle } from '../utils/rateLimiter.js';

const scrapeLetterboxdSearch = async (query) => {
  await throttle(); // Respect rate limits
  try {
    const { data } = await axios.get(
      `https://letterboxd.com/search/${encodeURIComponent(query)}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36...'
        }
      }
    );
    
    const $ = cheerio.load(data);
    const results = [];
    
    $('.film-detail').each((i, el) => {
      const title = $(el).find('.film-name').text().trim();
      const year = parseInt($(el).find('.metadata').text().trim().match(/\d{4}/)?.[0]) || null;
      results.push({ title, year });
    });

    return results;
  } catch (error) {
    console.error('Letterboxd search error:', error.message);
    return [];
  }
};

export { scrapeLetterboxdSearch };