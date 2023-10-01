import jwt from 'jsonwebtoken';

export function verifyToken(req, res, next) {
    const token = req.cookies.token; // Get the token from the cookies
    console.log('🚀 ~ file: auth.js:5 ~ verifyToken ~ token:', token);
    if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        console.log(
            '🚀 ~ file: auth.js:11 ~ jwt.verify ~ process.env.JWT_SECRET:',
            process.env.JWT_SECRET
        );
        console.log('🚀 ~ file: auth.js:11 ~ jwt.verify ~ token:', token);
        if (err) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        // Set the user data in req.user
        req.user = decoded;
        next();
    });
}

export function requireRole(role) {
    return function (req, res, next) {
        if (req.user && req.user.role === role) {
            next();
        } else {
            res.status(403).send('Forbidden');
        }
    };
}
