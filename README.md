# Backend 1 - Proyecto CRUD + Handlebars + WebSockets

Este proyecto forma parte de las entregas del curso **Programación Backend** de Coderhouse. Desarrolla un servidor utilizando **Node.js con Express**, aplicando operaciones CRUD sobre productos y carritos, almacenamiento en archivos JSON, y vistas dinámicas con **Handlebars**. También incorpora **WebSockets** para actualizar productos en tiempo real.

---

## 🧩 Tecnologías utilizadas

- Node.js
- Express.js
- File System (persistencia en archivos `.json`)
- Handlebars (motor de plantillas)
- WebSockets (Socket.IO)
- JavaScript moderno (ES6+)

---

## 📁 Estructura del proyecto

```
/project
│
├── /controllers.js
│   ├── cartsControllers.js
│   └── productsControllers.js
|
├── /models
│   ├── cartsModel.js
│   └── productsModel.js
│
├── /public
│   ├── realTime.js
│   └── styles.css
│
├── /routes
│   |__ carts.js
│   |__ products.js
|   |__ viewsRouter.js
|
├── /views
│   |__ /layouts
│   |       |__ products.js
|   |__ home.handlebars
|    |__ realTimeProducts.handlebars
|
|   app.js
|__ ...
```

---

## 🚀 Instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/franco-balsamo/backend1.git
cd backend1
```

2. Instalar dependencias:

```bash
npm install
```

3. Iniciar el servidor:

```bash
npm start
```

Por defecto, el servidor corre en `http://localhost:8080`.

---

## 🔧 Funcionalidades

### 🛒 Carritos – `/api/carts`

| Método | Ruta                                                | Descripción                                     |
|--------|-----------------------------------------------------|-------------------------------------------------|
| POST   | `/api/carts`                                        | Crea un nuevo carrito vacío                    |
| GET    | `/api/carts/:cid`                                   | Obtiene los productos de un carrito            |
| POST   | `/api/carts/:cid/product/:pid`                      | Agrega un producto al carrito indicado         |

---

### 📦 Productos – `/api/products`

| Método | Ruta                          | Descripción                                 |
|--------|-------------------------------|---------------------------------------------|
| GET    | `/api/products`              | Obtiene todos los productos                 |
| GET    | `/api/products/:pid`         | Obtiene un producto por su ID               |
| POST   | `/api/products`              | Crea un nuevo producto                      |
| PUT    | `/api/products/:pid`         | Actualiza un producto existente             |
| DELETE | `/api/products/:pid`         | Elimina un producto                         |

---

## 🖥️ Vistas

### 📄 `home.handlebars`

- URL: `http://localhost:8080/`
- Muestra todos los productos disponibles en una vista estática.

### ⚡ `realTimeProducts.handlebars`

- URL: `http://localhost:8080/realTimeProducts`
- Contiene un formulario para crear productos.
- Usa **WebSockets** para actualizar la lista de productos en tiempo real.

---

## 📚 Entregas del curso

### ✅ Entrega N°1

- Implementación CRUD de productos y carritos
- Uso de FileSystem para persistencia en JSON

### ✅ Entrega N°2

- Integración de **Handlebars**
- Implementación de **WebSockets** para productos en tiempo real
- Vistas dinámicas renderizadas en el navegador

---

## 📎 Recursos

- [Documentación Express.js](https://expressjs.com/)
- [Guía de Handlebars](https://handlebarsjs.com/)
- [Socket.IO](https://socket.io/)

---

## 👨‍💻 Autor

**Franco Balsamo**  
Proyecto del curso [Programación Backend - Coderhouse](https://www.coderhouse.com)

---