import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export function createHash(plain) {
  return bcrypt.hashSync(plain, bcrypt.genSaltSync(SALT_ROUNDS));
}

export function isValidPassword(plain, hashed) {
  return bcrypt.compareSync(plain, hashed);
}
