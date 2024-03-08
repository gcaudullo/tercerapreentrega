import path, { resolve } from 'path';
import url from 'url';
import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken'
import passport from 'passport';
import config from './config/config.js'
import { faker } from '@faker-js/faker';
import jwt from 'jsonwebtoken';




const __filename = url.fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename)
export const JWT_SECRET = config.jwtSecret;


export const base_Url = 'http://localhost:8080/api/products';

export const buildResponsePaginated = (data, baseUrl = base_Url) => {

    return {
        status: 'success',
        payload: data.docs.map((doc) => doc.toJSON()),
        totalPages: data.totalPages,
        prevPage: data.prevPage,
        nextPage: data.nextPage,
        page: data.page,
        hasPrevPage: data.hasPrevPage,
        hasNextPage: data.hasNextPage,
        prevLink: data.hasPrevPage ? `${baseUrl}/?limit=${data.limit}&page=${data.prevPage}${data.sort ? `&sort=${data.sort}` : ''}${data.category ? `&category=${data.category}` : ''}` : null,
        nextLink: data.hasNextPage ? `${baseUrl}/?limit=${data.limit}&page=${data.nextPage}${data.sort ? `&sort=${data.sort}` : ''}${data.category ? `&category=${data.category}` : ''}` : null,
    };
}

//Hasheo del password para guardarlo en la base de datos.
export const createHash = (password) => {
    const result = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    return result;
}
//Deshasheo el password para compararlo con el password que ingresó el usuario
export const isValidPassword = (password, user) => {
    const result = bcrypt.compareSync(password, user.password)
    return result;
}

//Una vez chequeado que el usuario está registrado y logueado generamos el Token
export const generateToken = (user) => {
    const payload = {
        id: user._id, //si no anda revisar este campo puede ser user._id
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
        cart_id: user.cartId,
    }
    return JWT.sign(payload, JWT_SECRET, { expiresIn: '1h' })
};

export const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        JWT.verify(token, JWT_SECRET, (error, payload) => {
            if (error) {
                return reject(error)
            }
            resolve(payload)
        });
    });
};

export const authMiddleware = (strategy) => (req, res, next) => {
    //hacer un switch case con las distintas estrategias.
    passport.authenticate(strategy, function (error, payload, info) {
        if (error) {
            return next(error);
            /*Si ocurre algun error al llamar al metodo next con parametro de error va al middleware de errores que está en app.js*/
        }
        if (!payload) {
            return res.status(401).json({ message: info.message ? info.message : info.toString() });
        }
        req.user = payload;
        next();
    })(req, res, next) /*aquí llamamos a la funcion function que acabamos de definir*/
};


export const authRolesMiddleware = (roles) => (req, res, next) => {
    const { user } = req;
    if (!user) {
        return res.status(401).json({ message: 'unauthorized 😨' });
    }
    if (!roles.includes(user.role)) {
        return res.status(403).json({ message: 'forbidden 😨' });
    }
    next();
}

export const generateProduct = () => {
    return {
        id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.lorem.paragraph(),
        code: faker.string.alphanumeric({ length: 10 }),
        price: faker.commerce.price(),
        status: faker.datatype.boolean(),
        stock: faker.number.int({ min: 100, max: 300 }),
        category: faker.commerce.department(),
        thumbnails: faker.image.url(),
        createdAt: faker.date.anytime(),
        updatedAt: faker.date.anytime()
    }
};

export const extractUserFromToken = (req) => {
    const token = req.signedCookies['token'];

    if (token) {
        try {
            const decoded = jwt.verify(token, config.jwtSecret);
            return decoded;
        } catch (error) {
            console.error('Error decoding token:', error);
        }
    }

    return null;
};

// Función para calcular el total de la compra
export function calculateTotal(products) {
    // Verifica si hay productos en el carrito
    if (!products || products.length === 0) {
        return 0;
    }

    // Calcula el total considerando la cantidad de cada producto
    const total = products.reduce((acc, product) => {
        // Verifica si el producto tiene un precio válido y una cantidad válida
        if (product.product && typeof product.product.price === 'number' && typeof product.quantity === 'number') {
            // Suma al acumulador el precio multiplicado por la cantidad
            return acc + product.product.price * product.quantity;
        } else {
            console.warn('Producto con precio o cantidad inválidos:', product);
            console.log('Precio:', typeof product.product.price, 'Cantidad:', typeof product.quantity);
            console.log('Producto completo:', product);
            return acc;
        }
    }, 0);

    return total;
}

