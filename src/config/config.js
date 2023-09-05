import dotenv from 'dotenv';

dotenv.config();

export const config = {
    server: {
        port: 8080,
        secretSession: process.env.SECRET_SESSION,
    },
    mongo: {
        url: 'mongodb://localhost:27017',
    },
};
