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
// jwtPayload es lo que firmaste en el login: { id, email, role, ... }
return done(null, jwtPayload)
} catch (err) {
return done(err, false)
}
}))
}