import winston from 'winston';

const levels = {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
};

const colors = {
    debug: 'blue',
    http: 'green',
    info: 'cyan',
    warning: 'yellow',
    error: 'red',
    fatal: 'magenta',
};

winston.addColors(colors);

const developmentFormat = winston.format.combine(winston.format.colorize({ all: true }), winston.format.simple());

const productionFormat = winston.format.json();

const transports = [new winston.transports.Console()];

if (process.env.NODE_ENV === 'production') {
    transports.push(new winston.transports.File({ filename: 'error.log', level: 'error' }));
    transports.push(new winston.transports.File({ filename: 'combined.log' }));
}

export const logger = winston.createLogger({
    levels,
    format: process.env.NODE_ENV === 'production' ? productionFormat : developmentFormat,
    transports,
});
