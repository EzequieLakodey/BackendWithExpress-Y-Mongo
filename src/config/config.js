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
    github: {
        clientId: 'Iv1.f90206feac82277d',
        clientSecret: '3ec4337036d3d14dfb88cb664a48f0fe541c39d0',
        callbackUrl: 'http://localhost:8080/api/sessions/github-callback',
    },
};
