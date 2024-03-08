import express, { urlencoded } from 'express';
import path from 'path';
import { __dirname } from './utils.js';
import productsRouter from './routers/products.router.js';
import cartsRouter from './routers/carts.router.js';
import viewsRouter from './routers/views.router.js';
import sessionRouter from './routers/users.router.js';
import handlebars from 'express-handlebars';
import passport from 'passport';
import { init as initPassport} from './config/passport.config.js';
import cookieParser from 'cookie-parser';
import config from './config/config.js';
import cors from 'cors';


const app = express();


let COOKIE_SECRET = config.cookieSecret
app.use(cookieParser(COOKIE_SECRET))

// const whiteList = config.originsAllowed.split(',');
// app.use(cors({
//   origin: (origin, callback) => {
//     if (whiteList.includes(origin)){
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS.'))
//     }
//   } 
// }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
// Configuración de Handlebars
const hbs = handlebars.create({
  // ... otras configuraciones ...
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
});
app.engine('handlebars', hbs.engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

initPassport();
app.use(passport.initialize());
//esta linea hay que cometarla al usar JWT
//app.use(passport.session());


app.use('/api', productsRouter, cartsRouter, sessionRouter);
app.use('/views', viewsRouter);

app.use((error, req, res, next) => {
  const message = `Ah ocurrido un error deconocido 🎃: ${error.message}`
  console.error(message);
  res.status(500).json({ message });
})

export default app;





