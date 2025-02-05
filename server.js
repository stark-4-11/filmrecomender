import express from 'express';
import connectDB from './database/db.js';
import './cron/updateDatabase.js';
import { scrapeLetterboxdSearch } from './services/letterboxdScraper.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Database connection
connectDB();

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'running',
    database: 'connected',
    lastUpdated: new Date().toISOString()
  });
});

// Live search endpoint
app.get('/search', async (req, res) => {
  const results = await scrapeLetterboxdSearch(req.query.q);
  res.json(results);
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});