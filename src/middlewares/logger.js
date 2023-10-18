import winston from 'winston/lib/winston/config';

const levels = {
    debug: 0,
    http: 1,
    info: 2,
    warning: 3,
    error: 4,
    fatal: 5,
};

const developmentFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
);

const productionFormat = winston.format.json();

const transports = [new winston.transports.Console()];

if (process.env.NODE_ENV === 'production') {
    transports.push(
        new winston.transports.File({ filename: 'error.log', level: 'error' })
    );
    transports.push(new winston.transports.File({ filename: 'combined.log' }));
}

export const logger = winston.createLogger({
    levels,
    format:
        process.env.NODE_ENV === 'production'
            ? productionFormat
            : developmentFormat,
    transports,
});
