import 'dotenv/config';

export const config = {
  PORT: process.env.PORT ?? 8080,
  MONGO_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,

  MAIL: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS,
    from: process.env.SMTP_FROM || process.env.GMAIL_USER,
  },

  RESET_SECRET: process.env.RESET_SECRET,
  PUBLIC_URL: process.env.PUBLIC_URL,
  NODE_ENV: process.env.NODE_ENV ?? 'development',
};
