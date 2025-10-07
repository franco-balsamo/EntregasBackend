//import passport from 'passport'
//import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
//
//
//function cookieExtractor(req) {
//    if (req && req.cookies) {
//        return req.cookies['token'] || null
//    }
//    return null
//}
//
//
//export default function initializePassport() {
//    const opts = {
//    jwtFromRequest: ExtractJwt.fromExtractors([
//    cookieExtractor,
//    ExtractJwt.fromAuthHeaderAsBearerToken(),
//    ]),
//    secretOrKey: process.env.JWT_SECRET,
//    }
//
//    passport.use('jwt', new JwtStrategy(opts, async (jwtPayload, done) => {
//        try {
//            return done(null, jwtPayload)
//        } catch (err) {
//            return done(err, false)
//        }
//    }))
//}

import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { config } from './config.js'; // ojo: ruta relativa desde este archivo
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
