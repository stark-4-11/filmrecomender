import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true },
  year: Number,
  letterboxdRating: Number,
  tmdbRating: Number,
  genres: [String],
  themes: [String],
  directors: [String],
  plot: String,
  posterUrl: String,
  runtime: Number,
  countries: [String],
  underrated: Boolean,
  lastUpdated: { type: Date, default: Date.now }
});

const Movie = mongoose.model('Movie', movieSchema);

export default Movie;