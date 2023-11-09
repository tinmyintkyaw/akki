import rateLimit from "express-rate-limit";

const globalRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

const sessionRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 100,
  keyGenerator: async (_req, res) => res.locals.session.sessionId,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

export { globalRateLimiter, sessionRateLimiter };
