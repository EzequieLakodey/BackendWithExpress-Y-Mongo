import crypto from 'crypto';

export const secretKey = crypto.randomBytes(32).toString('hex');
console.log('Generated Secret Key:', secretKey);

export const jwtConfig = {
    secretKey: secretKey, // Replace with your secret key
    expiresIn: '1h', // Token expiration duration (e.g., 1 hour)
};
