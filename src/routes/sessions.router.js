//import { Router } from 'express'
//import { UserModel } from '../models/users.js'
//import { createHash, isValidPassword, generateToken } from '../utils.js'
//import { passportJWT, authorization } from '../middlewares/auth.js'
//
//
//const router = Router()
//
//router.post('/register', async (req, res) => {
//    try {
//        const { first_name, last_name, email, age, password, role } = req.body
//        if (!first_name || !last_name || !email || !age || !password) {
//            return res.status(400).json({ error: 'Campos requeridos faltantes' })
//        }
//        
//        const exists = await UserModel.findOne({ email })
//        if (exists) return res.status(409).json({ error: 'Email ya registrado' })
//
//        const user = await UserModel.create({
//            first_name,
//            last_name,
//            email,
//            age,
//            password: createHash(password),
//            role: role === 'admin' ? 'admin' : 'user',
//        })
//
//        const dto = {
//            id: user._id,
//            first_name: user.first_name,
//            last_name: user.last_name,
//            email: user.email,
//            role: user.role,
//            age: user.age,
//        }
//        return res.status(201).json({ user: dto })
//
//    } catch (err) {
//        console.error('[register] error', err)
//        return res.status(500).json({ error: 'Internal server error' })
//    }
//})
//
//router.post('/login', async (req, res) => {
//    try {
//        const { email, password } = req.body
//        if (!email || !password) return res.status(400).json({ error: 'Faltan credenciales' })
//        
//        const user = await UserModel.findOne({ email })
//        if (!user) return res.status(401).json({ error: 'Usuario o contraseña inválidos' })
//        
//    
//        const valid = isValidPassword(user, password)
//        if (!valid) return res.status(401).json({ error: 'Usuario o contraseña inválidos' })
//
//        const payload = {
//        id: user._id.toString(),
//        email: user.email,
//        role: user.role,
//        first_name: user.first_name,
//        last_name: user.last_name,
//        }
//
//        const token = generateToken(payload)
//
//        res.cookie('token', token, {
//            httpOnly: true,
//            secure: process.env.NODE_ENV === 'production',
//            sameSite: 'lax',
//            maxAge: 1000 * 60 * 60, // 1h
//        })
//
//        return res.json({ status: 'ok' })
//
//    } catch (err) {
//        console.error('[login] error', err)
//        return res.status(500).json({ error: 'Internal server error' })
//    }
//})
//
//router.get('/current', passportJWT, (req, res) => {
//    const { id, email, role, first_name, last_name } = req.user
//    return res.json({ user: { id, email, role, first_name, last_name } })
//})
//
//router.get('/admin', passportJWT, authorization(['admin']), (req, res) => {
//    return res.json({ secret: 'solo-admin', me: req.user })
//})
//
//router.post('/logout', (req, res) => {
//    res.clearCookie('token')
//    return res.json({ status: 'logged out' })
//})
//
//export default router

import { Router } from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';

import { config } from '../config/config.js';
import UsersRepository from '../dao/repositories/users.repository.js';
import CartsRepository from '../dao/repositories/carts.repository.js';
import { createHash, isValidPassword } from '../utils/crypto.js';
import UserDTO from '../dto/user.dto.js';
import { ensureUserCart } from '../middlewares/ensureUserCart.js';

const router = Router();
const COOKIE_NAME = 'authToken';
const cookieOpts = {
  httpOnly: true,
  sameSite: 'lax',
  maxAge: 1000 * 60 * 60 * 24, // 1 día
  // secure: true, // activar en prod con HTTPS
};

// REGISTER (crea user + cart y deja logueado por cookie)
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

// LOGIN (setea cookie httpOnly)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email y password requeridos' });

    const user = await UsersRepository.getByEmail(email);
    if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });

    const ok = isValidPassword(password, user.password);
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

// LOGOUT (borra la cookie)
router.post('/logout', (req, res) => {
  res.clearCookie(COOKIE_NAME);
  res.json({ status: 'ok' });
});

// CURRENT (protegido, devuelve DTO sin password)
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  ensureUserCart,                  // <- agregado acá
  (req, res) => {
    res.json(new UserDTO(req.user));
  }
);

export default router;
