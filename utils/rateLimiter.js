import rateLimit from 'express-rate-limit';

// Create a rate limiter
const apiLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 20 minutes
  max: 600, // Limit each IP to 250 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

export default apiLimiter;
