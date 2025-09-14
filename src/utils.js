import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


const SALT_ROUNDS = 10


export function createHash(password) {
return bcrypt.hashSync(password, SALT_ROUNDS)
}


export function isValidPassword(user, plainPassword) {
return bcrypt.compareSync(plainPassword, user.password)
}


export function generateToken(payload) {
const { JWT_SECRET, JWT_EXPIRES } = process.env
return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES || '1h' })
}