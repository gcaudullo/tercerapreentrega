import dotenv from 'dotenv';
import { Command } from 'commander'


const program = new Command()

program
    .option('--mode <mode>', 'Este es el modo de ejecución del Backend', 'development')
    .parse();

const mode=program.opts().mode;
console.log('mode', mode)
let path;
if (mode==='production') {
    path = '.env.production'
} else {
    path = '.env.development'
}

dotenv.config({ path });

export default {
    port: process.env.PORT || 3000,
    mongoDbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce',
    jwtSecret: process.env.JWT_SECRET,
    cookieSecret: process.env.COOKIE_SECRET
};
