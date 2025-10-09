import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { config } from './config.js'; 
import UsersRepository from '../dao/repositories/users.repository.js';

const cookieExtractor = (req) => (req?.cookies?.authToken ?? null);

export default function initPassport() {
  passport.use('jwt', new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      secretOrKey: config.JWT_SECRET
    },
    async (payload, done) => {
      try {
        const user = await UsersRepository.getById(payload.id);
        if (!user) return done(null, false);
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  ));
}
