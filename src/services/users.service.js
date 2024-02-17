// users.services.js
import UsersDAO from '../dao/users.dao.js';
import { createHash, generateToken, isValidPassword } from '../utils.js';

export default class UsersService {
  static async registerUser(userData) {
    try {
      const { first_name, last_name, email, password, age } = userData;

      // Verificar si el usuario ya existe
      const existingUser = await UsersDAO.getUserByEmail(email);
      if (existingUser) {
        throw { status: 409, error: 'El usuario ya está registrado.' };
      }

      // Crear un nuevo usuario
      const hashedPassword = createHash(password);
      const newUser = await UsersDAO.createUser({
        first_name,
        last_name,
        email,
        password: hashedPassword,
        age,
      });

      // Generar token JWT
      const token = generateToken(newUser._id);

      // Devolver el token y cualquier otra información que desees
      return { token, user: newUser };
    } catch (error) {
      console.error('Error in user registration:', error);
      throw { status: error.status || 500, error: error.error || 'Error en el registro.' };
    }
  }

  static async loginUser(email, password) {
    try {
      // Buscar al usuario por correo electrónico
      const user = await UsersDAO.getUserByEmail(email);
      if (!user) {
        throw { status: 401, error: 'Usuario o contraseña inválidos' };
      }

      // Verificar la contraseña
      const isValidPass = isValidPassword(password, user);
      if (!isValidPass) {
        throw { status: 401, error: 'Usuario o contraseña inválidos' };
      }

      // Generar token JWT
      const token = generateToken(user);

      // Devolver el token y cualquier otra información que desees
      return { token, user };
    } catch (error) {
      console.error('Error in user login:', error);
      throw { status: error.status || 500, error: error.error || 'Error en el inicio de sesión.' };
    }
  }

  static async updatePassword(email, newPassword) {
    try {
      const updatedUser = await UsersDAO.updateUserPassword(email, createHash(newPassword));
      return updatedUser;
    } catch (error) {
      console.error('Error updating user password (service):', error);
      throw error;
    }
  }
}
