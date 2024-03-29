import UserRepository from '../repositories/user.repository.js';
import { createHash, generateToken, isValidPassword } from '../utils.js';
import CartsService from '../services/carts.service.js';

export default class UsersService {
  static async registerUser(userData) {
    try {
      const { first_name, last_name, email, password, age } = userData;

      // Crear un carrito para el usuario
      const cartCreationResult = await CartsService.createCart();
      const cartId = cartCreationResult.cartId;

      // Crear un nuevo usuario con el ID del carrito utilizando el repositorio
      const hashedPassword = createHash(password);
      const newUser = await UserRepository.createUser({
        first_name,
        last_name,
        email,
        password: hashedPassword,
        age,
        cartId,
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
      // Buscar al usuario por correo electrónico utilizando el repositorio
      const user = await UserRepository.getUserByEmail(email);
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
      // Actualizar la contraseña utilizando el repositorio
      const updatedUser = await UserRepository.updateUserPassword(email, createHash(newPassword));
      return updatedUser;
    } catch (error) {
      console.error('Error updating user password (service):', error);
      throw error;
    }
  }

  static async getUserById(userId) {
    try {
      const user = await UserRepository.getUserById(userId);
      return user;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      throw { status: 500, error: 'Error obtaining user.' };
    }
  }

  static async updateUserCartId(userId, newCartId) {
    try {
      const updatedUser = await UserRepository.updateUserCartId(userId, newCartId);
      return updatedUser;
    } catch (error) {
      console.error('Error updating user cartId:', error);
      throw { status: 500, error: 'Error updating user cartId.' };
    }
  }
}
