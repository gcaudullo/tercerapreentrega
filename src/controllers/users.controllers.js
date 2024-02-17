// users.controller.js
import UsersService from '../services/users.service.js';

export default class UsersController {
  static async registerUser(req, res) {
    try {
      const userData = req.body;
      const result = await UsersService.registerUser(userData);
      res.status(201).json(result);
    } catch (error) {
      console.error('Error in user registration controller:', error);
      res.status(error.status || 500).json({ error: error.error || 'Internal Server Error' });
    }
  }

  static async loginUser(req, res) {
    try {
      const { email, password } = req.body;
      const result = await UsersService.loginUser(email, password);
      res.cookie('token', result.token, {
        maxAge: 1000 * 60 * 30, // 30 minutos
        httpOnly: true,
        signed: true,
      });
      res.status(200).json(result);
    } catch (error) {
      console.error('Error in user login controller:', error);
      res.status(error.status || 500).json({ error: error.error || 'Internal Server Error' });
    }
  }

  static async updatePassword(req, res) {
    const { body: { email, password } } = req;
    if (!email || !password) {
      res.render('error', { messageError: 'Todos los campos son requeridos.' });
      return;
    }

    try {
      const updatedUser = await UsersService.updatePassword(email, password);
      res.redirect('/views/login');
    } catch (error) {
      console.error('Error updating user password (controller):', error);
      res.render('error', { messageError: 'Error al actualizar la contraseña del usuario.' });
    }
  }
}