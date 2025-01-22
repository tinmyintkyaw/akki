import rateLimit from "express-slow-down";

const globalRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  delayAfter: 50,
  delayMs: (hits) => hits * 100,
  legacyHeaders: false,
});

const sessionRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  delayAfter: 50,
  delayMs: (hits) => hits * 100,
  keyGenerator: async (_req, res) => res.locals.session.session.id,
  legacyHeaders: false,
});

export { globalRateLimiter, sessionRateLimiter };
