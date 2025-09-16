import passport from 'passport'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'


function cookieExtractor(req) {
    if (req && req.cookies) {
        return req.cookies['token'] || null
    }
    return null
}


export default function initializePassport() {
    const opts = {
    jwtFromRequest: ExtractJwt.fromExtractors([
    cookieExtractor,
    ExtractJwt.fromAuthHeaderAsBearerToken(),
    ]),
    secretOrKey: process.env.JWT_SECRET,
    }

    passport.use('jwt', new JwtStrategy(opts, async (jwtPayload, done) => {
        try {
            return done(null, jwtPayload)
        } catch (err) {
            return done(err, false)
        }
    }))
}