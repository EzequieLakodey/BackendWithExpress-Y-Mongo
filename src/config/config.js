import dotenv from 'dotenv';
import path from 'path';
import { __dirname } from '../utils.js';

dotenv.config({ path: path.resolve(__dirname, '.env') });

export const config = {
    server: {
        port: process.env.PORT,
        secretSession: process.env.SECRET_SESSION,
    },
    mongo: {
        url: process.env.MONGO_URL,
    },
    github: {
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackUrl: 'http://localhost:8080/api/sessions/github-callback',
    },
};
