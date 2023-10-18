export function errorHandler(err, req, res) {
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    res.status(statusCode).json({ message: err.message, type: err.type });
}
