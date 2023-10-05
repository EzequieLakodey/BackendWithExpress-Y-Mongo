import jwt from 'jsonwebtoken';

export function verifyToken(req, res, next) {
    const token = req.cookies.token; // Get the token from the cookies

    if (!token) {
        return next(); // No token provided, continue without setting req.user
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
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
