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
}
