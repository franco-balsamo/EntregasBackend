// src/middlewares/requireAuth.js
import passport from 'passport';
export const requireAuth = passport.authenticate('jwt', { session: false });
