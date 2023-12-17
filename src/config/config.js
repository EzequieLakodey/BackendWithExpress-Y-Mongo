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
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackUrl: 'http://localhost:8080/api/sessions/github-callback',
    },
};
