//// src/middlewares/cartOwnership.js
//export const ownsCartOrAdmin = (req, res, next) => {
//  if (!req.user) return res.sendStatus(401);
//  if (req.user.role === 'admin') return next(); // admin puede ver/operar cualquier carrito (si querés acotar, quitá esta línea)
//  const { cid } = req.params;
//  if (req.user.cart?.toString?.() === cid) return next();
//  return res.sendStatus(403);
//};


// src/middlewares/cartOwnership.js
export const ownsCartOrAdmin = (req, res, next) => {
  if (!req.user) return res.sendStatus(401);

  const paramCid = String(req.params.cid || '');
  const userCart = req.user.cart ? req.user.cart.toString() : '';

  console.log('[ownsCartOrAdmin]', { email: req.user.email, role: req.user.role, userCart, paramCid });

  // si querés que admin también pueda operar carritos, descomentá:
  // if (req.user.role === 'admin') return next();

  if (userCart && userCart === paramCid) return next();
  return res.sendStatus(403);
};
