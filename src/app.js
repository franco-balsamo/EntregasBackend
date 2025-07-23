import express from 'express';
//import hbs from 'express-handlebars';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';


import handlebars from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup __dirname para ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


import viewsRouter from './routes/viewsRouter.js';
import productsRouter from './routes/products.js';
import cartsRouter from './routes/carts.js';
//import ProductManager from './managers/productManager.js';


const app = express();

const serverHttp = http.createServer(app)
const io = new Server(serverHttp)

app.use(express.json());

// MIDDLEWARE
app.use(express.static(import.meta.dirname + "/public"))

// CONFIGURACION DE HBS

const hbs = handlebars.create({
  helpers: {
    ifEquals: function (a, b, options) {
      return a === b ? options.fn(this) : options.inverse(this);
    }
  }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));


//app.engine("handlebars", hbs.engine());
//app.set("views", import.meta.dirname + "/views")
//app.set("view engine", "handlebars")

// ROUTE
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use('/', viewsRouter);

const DEFAULT_CART_ID = '687fa3a084fbe2122ed137c6'; // Reemplazalo por el _id real de Mongo

app.use((req, res, next) => {
  req.cartId = DEFAULT_CART_ID;
  next();
});

// WEBSOCKETS
//const productManager = new ProductManager();

//io.on('connection', async socket => {
//  console.log('🟢 Cliente conectado');
//  socket.emit('productos', await productManager.getAllProducts());
//
//  socket.on('nuevoProducto', async data => {
//    await productManager.addProduct(data);
//    const productos = await productManager.getAllProducts();
//    io.emit('productos', productos);
//  });
//
//  socket.on('eliminarProducto', async id => {
//    await productManager.deleteProduct(id);
//    const productos = await productManager.getAllProducts();
//    io.emit('productos', productos);
//  });
//});


serverHttp.listen(8080,() => console.log('Server is running on http://localhost:8080'))

mongoose.connect("mongodb+srv://balsamote96:d2LmITzmEeDZMour@cluster0.gwohru6.mongodb.net/backend1?retryWrites=true&w=majority&appName=Cluster0") 
  .then(() => console.log("MongoDB connected success"))
  .catch((e) => console.log("MongoDB error: \n" + e))