// config.js
import dotenv from 'dotenv';
dotenv.config();

export default {
    port: process.env.PORT || 3000,
    mongoDbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce',
    jwtSecret: process.env.JWT_SECRET,
    cookieSecret: process.env.COOKIE_SECRET
};
