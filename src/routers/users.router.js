import { Router } from 'express';
import {  authMiddleware, authRolesMiddleware } from '../utils.js';
import passport from 'passport';
import UsersController from '../controllers/users.controllers.js';

const router = Router();

router.post('/sessions/register', async (req, res) => {
  await UsersController.registerUser(req, res);
});

router.post('/sessions/login', async (req, res) => {
  await UsersController.loginUser(req, res);
});

router.post('/sessions/recovery-password', async (req, res) => {
    await UsersController.updatePassword(req, res);
  });


router.get('/sessions/logout', (req, res) => {
    res.clearCookie('token'); // Elimina la cookie que almacena el token JWT, si la tienes
    res.redirect('/views/login');
});

router.get('/sessions/github', passport.authenticate('github', { scope: ['user:email'] }))

router.get('/sessions/github/callback', passport.authenticate('github', { failureRedirect: '/sessions/login' }), (req, res) => {
    console.log(req.user)
    res.redirect('/views')
})


router.get('/sessions/current', authMiddleware('jwt'), authRolesMiddleware(['admin']), async (req, res) => {
    res.status(200).json(req.user)
})

export default router;

