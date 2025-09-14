import express from 'express';
import handlebars from 'express-handlebars';

import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import passport from 'passport';

import connectDB from './src/config/db.js';
import initializePassport from './src/config/passportConfig.js';

import viewsRouter from './src/routes/viewsRouter.js';
import productsRouter from './src/routes/products.js';
import cartsRouter from './src/routes/carts.js';
import sessionsRouter from './routes/session.js'
//import ProductManager from './managers/productManager.js';

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.static('public'));

// Passport JWT
initializePassport();
app.use(passport.initialize());

// Handlebars
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', 'views');

// ROUTE
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use('/', viewsRouter);
app.use('/api/sessions', sessionsRouter)


// Mongo y servidor

const PORT = process.env.PORT || 3000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
})



