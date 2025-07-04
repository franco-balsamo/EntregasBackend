import express from 'express';
import hbs from 'express-handlebars';
import http from 'http';
import { Server } from 'socket.io';

import viewsRouter from './routes/viewsRouter.js';
import productsRouter from './routes/products.js';
import cartsRouter from './routes/carts.js';
import ProductManager from './managers/productManager.js';


const app = express();

const serverHttp = http.createServer(app)
const io = new Server(serverHttp)

app.use(express.json());

// MIDDLEWARE
app.use(express.static(import.meta.dirname + "/public"))

// CONFIGURACION DE HBS
app.engine("handlebars", hbs.engine());
app.set("views", import.meta.dirname + "/views")
app.set("view engine", "handlebars")

// ROUTE
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use('/', viewsRouter);


// WEBSOCKETS
const productManager = new ProductManager();

io.on('connection', async socket => {
  console.log('🟢 Cliente conectado');
  socket.emit('productos', await productManager.getAllProducts());

  socket.on('nuevoProducto', async data => {
    await productManager.addProduct(data);
    const productos = await productManager.getAllProducts();
    io.emit('productos', productos);
  });

  socket.on('eliminarProducto', async id => {
    await productManager.deleteProduct(id);
    const productos = await productManager.getAllProducts();
    io.emit('productos', productos);
  });
});


serverHttp.listen(8080,() => console.log('Server is running on http://localhost:8080'))
