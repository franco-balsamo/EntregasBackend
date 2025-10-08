import CartsRepository from '../dao/repositories/carts.repository.js';
import UsersRepository from '../dao/repositories/users.repository.js';

export const ensureUserCart = async (req, res, next) => {
  try {
    if (!req.user) return res.sendStatus(401);
    // Si no querés crear carritos para admin, mantené esta línea:
    if (req.user.role !== 'user') return next();

    let needNewCart = false;

    if (!req.user.cart) {
      needNewCart = true;                    // no tiene cart
    } else {
      // tiene un id, pero ¿existe el doc?
      const exists = await CartsRepository.getById(req.user.cart);
      if (!exists) needNewCart = true;       // cart “colgado”
    }

    if (needNewCart) {
      const cart = await CartsRepository.create({ products: [] });
      await UsersRepository.updateById(req.user._id, { cart: cart._id });
      req.user.cart = cart._id;              // para que el DTO lo muestre ya
      console.log('[ensureUserCart] asignado cart', cart._id.toString(), 'a', req.user.email);
    }

    next();
  } catch (e) {
    console.error('[ensureUserCart] error', e);
    res.status(500).json({ error: 'Internal server error' });
  }
};
