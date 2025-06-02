import winston from 'winston';
import moment from 'moment-timezone';

const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp({
            format: () => moment().tz('America/Los_Angeles').format('YYYY-MM-DD HH:mm:ss.SSS Z')
        }),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: "logs/error.log", level: "warn" }),
        new winston.transports.File({ filename: "logs/app.log" }),
    ],
    
}); 

export default logger;