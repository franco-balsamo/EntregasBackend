import express from 'express';

const app = express();

app.use(express.json());

import productsRouter from './routes/products.js';
import cartsRouter from './routes/carts.js';

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.listen(8080,() => console.log('Server is running on http://localhost:8080'))
