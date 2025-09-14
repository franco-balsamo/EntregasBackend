import passport from 'passport'

export const passportJWT = passport.authenticate('jwt', { session: false })


export function authorization(roles = []) {
return (req, res, next) => {
// Requiere que passportJWT ya haya seteado req.user
const user = req.user
if (!user) return res.status(401).json({ error: 'Unauthorized' })


if (roles.length === 0 || roles.includes(user.role)) {
return next()
}
return res.status(403).json({ error: 'Forbidden: insufficient role' })
}
}