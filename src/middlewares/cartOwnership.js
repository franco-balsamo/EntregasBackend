export const ownsCartOrAdmin = (req, res, next) => {
  if (!req.user) return res.sendStatus(401);

  const paramCid = String(req.params.cid || '');
  const userCart = req.user.cart ? req.user.cart.toString() : '';

  // Si querés que admin pueda operar cualquier carrito, descomentá:
  // if (req.user.role === 'admin') return next();

  console.log('[ownsCartOrAdmin]', { email: req.user.email, role: req.user.role, userCart, paramCid });

  if (userCart && userCart === paramCid) return next();
  return res.sendStatus(403);
};
