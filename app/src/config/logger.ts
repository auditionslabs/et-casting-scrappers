import winston from 'winston';

const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: "logs/error.log", level: "warn" }),
        new winston.transports.File({ filename: "logs/app.log" }),
    ],
}); 

export default logger;