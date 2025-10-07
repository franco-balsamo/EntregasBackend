import 'dotenv/config';

export const config = {
  PORT: process.env.PORT ?? 8080,
  MONGO_URL: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
};
