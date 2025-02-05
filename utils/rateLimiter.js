import { RateLimiter } from 'limiter';

// Limit to 10 requests per minute
const limiter = new RateLimiter({
  tokensPerInterval: 10,
  interval: 'minute'
});

export const throttle = async () => {
  await limiter.removeTokens(1);
};