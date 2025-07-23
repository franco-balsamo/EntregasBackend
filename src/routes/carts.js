import { Router } from 'express';
import {
  getCart,
  deleteProductFromCart,
  replaceCart,
  updateProductQuantity,
  clearCart,
  createCart
} from '../controllers/cartsControllers.js';

const router = Router();
router.post('/', createCart);
router.get('/:cid', getCart);
router.delete('/:cid/products/:pid', deleteProductFromCart);
router.put('/:cid', replaceCart);
router.put('/:cid/products/:pid', updateProductQuantity);
router.delete('/:cid', clearCart);
export default router;