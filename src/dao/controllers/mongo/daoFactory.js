/* eslint-disable indent */
// daoFactory.js
import CartsManagerMongo from './carts.mongo.js';
import ProductsManagerMongo from './products.mongo.js';
import ChatManagerMongo from './chat.mongo.js';
import UsersMongo from './usersRepository.js';
// import other DAOs...

export default function daoFactory(daoName) {
    switch (daoName) {
        case 'carts':
            return new CartsManagerMongo();

        case 'chat':
            return new ChatManagerMongo();

        case 'products':
            return new ProductsManagerMongo();

        case 'users':
            return new UsersMongo();
        // case for other DAOs...

        default:
            throw new Error(`Unknown DAO: ${daoName}`);
    }
}

const type = process.argv[2]; // get the command line parameter
const dao = DAOFactory.createDAO(type);
