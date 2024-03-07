import userModel from '../dao/models/user.model.js';

export default class UserRepository {
  static async createUser(userData) {
    try {
      const newUser = await userModel.create(userData);
      return newUser;
    } catch (error) {
      throw error;
    }
  }

  static async getUserByEmail(email) {
    try {
      return await userModel.findOne({ email });
    } catch (error) {
      throw error;
    }
  }

  static async updateUserPassword(email, newPassword) {
    try {
      const user = await userModel.findOne({ email });
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      user.password = newPassword;
      await user.save();

      return user;
    } catch (error) {
      throw error;
    }
  }

  static async getUserById(userId) {
    try {
      const user = await userModel.findById(userId);
      return user;
    } catch (error) {
      throw error;
    }
  }

  static async updateUserCartId(userId, newCartId) {
    try {
      const updatedUser = await userModel.findByIdAndUpdate(
        userId,
        { $set: { cartId: newCartId } },
        { new: true } // Devuelve el documento actualizado
      );

      if (!updatedUser) {
        console.error(`User with ID ${userId} not found.`);
        throw { status: 404, error: 'User not found.' };
      }

      return updatedUser;
    } catch (error) {
      throw error;
    }
  }
}
