import { Router } from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';

import { config } from '../config/config.js';
import UsersRepository from '../dao/repositories/users.repository.js';
import CartsRepository from '../dao/repositories/carts.repository.js';
import { createHash, isValidPassword } from '../utils/crypto.js';
import UserDTO from '../dto/user.dto.js';
import { ensureUserCart } from '../middlewares/ensureUserCart.js';
import { sendPasswordResetEmail } from '../utils/mailer.js';

const router = Router();
const COOKIE_NAME = 'authToken';
const cookieOpts = {
  httpOnly: true,
  sameSite: 'lax',
  maxAge: 1000 * 60 * 60 * 24, 
};

router.post('/register', async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const exists = await UsersRepository.getByEmail(email);
    if (exists) return res.status(409).json({ error: 'Email ya registrado' });

    const cart = await CartsRepository.create();
    const user = await UsersRepository.create({
      first_name, last_name, email,
      age: age ?? null,
      password: createHash(password),
      cart: cart._id,
      role: 'user'
    });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      config.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.cookie(COOKIE_NAME, token, cookieOpts);
    res.status(201).json(new UserDTO(user));
  } catch (err) {
    console.error('POST /api/sessions/register', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email y password requeridos' });

    
    const user = await UsersRepository.getByEmailWithPassword(email); 
    if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });

    const ok = isValidPassword(user, password); 
    if (!ok) return res.status(401).json({ error: 'Credenciales inválidas' });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      config.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.cookie(COOKIE_NAME, token, cookieOpts);
    res.json(new UserDTO(user));
  } catch (err) {
    console.error('POST /api/sessions/login', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie(COOKIE_NAME);
  res.json({ status: 'ok' });
});

router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  ensureUserCart,                  
  (req, res) => {
    res.json(new UserDTO(req.user));
  }
);

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'email requerido' });

  const user = await UsersRepository.getByEmail(email);
  if (!user) return res.json({ status: 'ok' }); 

  const ph = (user.password || '').slice(-10);
  const token = jwt.sign({ uid: user._id, ph, type: 'reset' }, config.RESET_SECRET, { expiresIn: '1h' });
  const resetUrl = `${config.PUBLIC_URL}/api/sessions/reset-password?token=${token}`;

  try {
    await sendPasswordResetEmail(user.email, resetUrl, user.first_name); 
  } catch (e) {
    console.error('Mailer error:', e?.message);
  }

  if (config.NODE_ENV !== 'production') return res.json({ status: 'ok', previewUrl: resetUrl });
  res.json({ status: 'ok' });
});


router.get('/reset-password', (req, res) => {
  const { token } = req.query;
  const page = `
  <!doctype html><meta charset="utf-8" />
  <title>Restablecer contraseña</title>
  <div style="font-family:system-ui;max-width:480px;margin:48px auto">
    <h2>Restablecer contraseña</h2>
    <form method="POST" action="/api/sessions/reset-password" style="display:grid;gap:12px">
      <input type="hidden" name="token" value="${token||''}">
      <input name="password" type="password" placeholder="Nueva contraseña" required minlength="8" />
      <button type="submit" style="padding:10px 14px;border:0;border-radius:8px;background:#0d6efd;color:#fff">
        Cambiar contraseña
      </button>
    </form>
  </div>`;
  res.setHeader('Content-Type','text/html; charset=utf-8');
  res.send(page);
});

router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) {
    return res.status(400).json({ error: 'token y password requeridos' });
  }

  let payload;
  try {
    payload = jwt.verify(token, config.RESET_SECRET);
  } catch {
    return res.status(400).json({ error: 'Token inválido o expirado' });
  }
  if (payload.type !== 'reset' || !payload.uid) {
    return res.status(400).json({ error: 'Token inválido' });
  }

  const user = await UsersRepository.getByIdWithPassword(payload.uid);
  if (!user) return res.status(400).json({ error: 'Usuario inexistente' });

  const currentPh = (user.password || '').slice(-10);   
  if (payload.ph !== currentPh) {
    return res.status(400).json({ error: 'Token ya usado o inválido' });
  }

  if (isValidPassword(user, password)) {
    return res.status(400).json({ error: 'La nueva contraseña debe ser distinta a la anterior' });
  }

  if (password.length < 5) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' });
  }

  const newHash = createHash(password);
  await UsersRepository.updateById(user._id, {
    password: newHash,
    passwordChangedAt: new Date()
  });

  return res.json({ status: 'ok' });
});

export default router;
