# 🧠 Proyecto Full Backend – Coderhouse (Backend I + Backend II)

**Autor:** Franco Balsamo  
**Cursos:**  
- [Programación Backend I – Desarrollo Avanzado de Backend] 
- [Programación Backend II – Diseño y Arquitectura Backend]

---

## 📚 Índice

1. [Backend I – Proyecto CRUD + Handlebars + WebSockets](#backend-i)
2. [Backend II – Arquitectura avanzada + MongoDB + JWT + Mailing](#backend-ii)
3. [Tecnologías generales](#tecnologías-generales)
4. [Autor](#autor)

---

# Backend I
<a name="backend-i"></a>

Proyecto del curso **Backend I**, enfocado en conceptos fundamentales:
- Servidor Express.
- Motor de plantillas **Handlebars**.
- WebSockets para comunicación en tiempo real.
- Persistencia en archivos (FileSystem).
- CRUD básico de productos y carritos.
- Enrutamiento básico y middlewares.
- Manejo de sesiones.

El proyecto final consistió en un **e-commerce funcional** con vistas renderizadas, creación de productos en tiempo real y persistencia simple.

---

# Backend II
<a name="backend-ii"></a>

Este proyecto amplía el anterior aplicando **arquitectura por capas**, **MongoDB**, **JWT**, **roles**, **mailing** y **sistema de tickets**.

---

## 🧩 Tecnologías

- Node.js v18+
- Express.js
- MongoDB + Mongoose
- Handlebars (para vistas de `/products` y `/carts`)
- JWT (auth cookie httpOnly)
- bcrypt (hash de contraseñas)
- Nodemailer + Gmail (mailing)
- UUID (tickets)
- WebSockets (real-time)
- Arquitectura de Capas (Controllers → Services → DAO → Models)

---

## 📂 Estructura del proyecto

```
/src
├── config/
│   ├── config.js
│   ├── db.js
│   └── passport.js
├── controllers/
│   ├── cartsControllers.js          
│   └── productsControllers.js
├── dao/
│   └── repositories/
│       ├── carts.repository.js
│       ├── products.repository.js
│       ├── tickets.repository.js
│       └── users.repository.js
├── dto/
│   └── user.dto.js
├── middlewares/
│   ├── authorization.js
│   ├── cartOwnership.js
│   ├── ensureUserCart.js
│   ├── passportAuth.js
│   └── requireAuth.js
├── models/
│   ├── cart.model.js
│   ├── product.model.js
│   ├── ticket.model.js
│   └── user.model.js
├── routes/
│   ├── carts.router.js
│   ├── products.router.js
│   ├── sessions.router.js
│   └── viewsRouter.js              
├── utils/
│   ├── crypto.js
│   └── mailer.js
├── views/                           
│   ├── layouts/
│   │   └── main.handlebars          
│   ├── cartDetail.handlebars        
│   ├── productDetail.handlebars
│   └── products.handlebars
/postman
│   └── backend-ecommerce_api-tests.postman_collection.json
app.js
package.json
.env
README.md


```

---

## 🔐 Autenticación y Roles

- Registro y login con JWT guardado en cookie `authToken` (httpOnly).  
- Roles: `user` y `admin`.  
- Middleware `ownsCartOrAdmin` protege rutas de carrito.

---

## ✉️ Recuperación de contraseña

- `POST /api/sessions/forgot-password` → genera token (expira 1 h) y envía mail con botón.  
- `POST /api/sessions/reset-password` → permite cambiarla (no puede ser igual a la anterior).  
- Link de **un solo uso** y expiración automática.

---

## 🛍️ Lógica de negocio

### Products `/api/products`
CRUD completo.  
Solo **admin** puede crear/editar/eliminar.  
Soporta paginado, filtros y orden.

### Carts `/api/carts`
- Ownership (solo dueño o admin).  
- Agregar, actualizar, eliminar y vaciar productos.  
- `POST /api/carts/:cid/purchase` genera un **Ticket**:
  ```json
  {
    "ticket": { "code": "uuid", "amount": 200, "purchaser": "user@test.com" },
    "purchasedCount": 1,
    "unprocessedProducts": []
  }
  ```

### Tickets
Modelo con `code`, `purchase_datetime`, `amount`, `purchaser`.  
Creado automáticamente en cada compra.

---

## 🧪 Endpoints principales

| Método | Ruta | Descripción | Rol |
|---------|------|-------------|-----|
| POST | `/api/sessions/register` | Crear usuario + carrito | Público |
| POST | `/api/sessions/login` | Login (set cookie) | Público |
| GET | `/api/sessions/current` | Datos del usuario actual | Logueado |
| POST | `/api/sessions/forgot-password` | Enviar mail de reseteo | Público |
| POST | `/api/sessions/reset-password` | Cambiar contraseña | Público |
| GET | `/api/products` | Listar productos | Todos |
| POST | `/api/products` | Crear producto | Admin |
| PUT | `/api/products/:pid` | Editar producto | Admin |
| DELETE | `/api/products/:pid` | Eliminar producto | Admin |
| GET | `/api/carts/:cid` | Ver carrito | User dueño |
| POST | `/api/carts/:cid/product/:pid` | Agregar producto | User dueño |
| PUT | `/api/carts/:cid/product/:pid` | Cambiar cantidad | User dueño |
| DELETE | `/api/carts/:cid/product/:pid` | Eliminar producto | User dueño |
| POST | `/api/carts/:cid/purchase` | Finalizar compra y crear ticket | User dueño |

---

## 🧩 Testing en Postman

Colecciones disponibles:
- **Mini Demo (10 requests)**  
  https://raw.githubusercontent.com/franco-balsamo/EntregasBackend/master/postman/backend-ecommerce_api-tests.postman_collection.json

Flujos recomendados:
1. Login Admin → crear productos.  
2. Login User → agregar productos a su carrito.  
3. `/purchase` → generar ticket.  
4. `/forgot-password` → `/reset-password`.

---

## 🧠 Entregas del curso Backend II

| Etapa | Contenido |
|--------|------------|
| 1 | Registro y login con JWT |
| 2 | Roles y ownership |
| 3 | Carts avanzados + purchase |
| 4 | Ticket + Recuperación de contraseña por mail |

---

## 🧰 Tecnologías generales
- Node.js + Express  
- MongoDB + Mongoose  
- Handlebars  
- WebSockets  
- JWT + Cookies  
- bcrypt  
- Nodemailer  
- Dotenv  
- UUID  
- Postman (testing)

---

## 👨‍💻 Autor
**Franco Balsamo**  
Proyecto final conjunto de los cursos **Backend I** y **Backend II – Coderhouse**.
