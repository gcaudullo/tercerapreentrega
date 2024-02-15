import mongoose from 'mongoose';
import config from '../config/config.js'

export const init2 = async () => {
  try {
    const URI = config.mongoDbUri;
    await mongoose.connect(URI);
    console.log('Database connected susscessfully 🚀');
  } catch (error) {
    console.error('Ocurrio un error al intenter conectarnos a la base de datos 😨.', error.message);
  }
}
