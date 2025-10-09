import bcrypt from 'bcrypt';

export const createHash = (plain) =>
  bcrypt.hashSync(plain, bcrypt.genSaltSync(10));

export const isValidPassword = (userOrHash, plain) => {
  const hash = typeof userOrHash === 'string'
    ? userOrHash
    : userOrHash?.password;

  if (typeof plain !== 'string' || typeof hash !== 'string' || !hash)
    return false; 

  return bcrypt.compareSync(plain, hash);
};

