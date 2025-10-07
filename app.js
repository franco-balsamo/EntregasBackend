import express from 'express';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import handlebars from 'express-handlebars';

import { connectDB } from './src/config/db.js';
import initPassport from './src/config/passport.js';

import productsRouter from './src/routes/products.router.js';
import sessionsRouter from './src/routes/sessions.router.js';
import cartsRouter from './src/routes/carts.router.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Passport
initPassport();
app.use(passport.initialize());

// Handlebars
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', 'views');

// Routers
app.use('/api/products', productsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/carts', cartsRouter);


// DB + Server
connectDB().catch(err => { console.error('Mongo error', err); process.exit(1); });

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));




