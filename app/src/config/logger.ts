import winston from 'winston';
import moment from 'moment-timezone';

const currentDate = moment().tz('America/Los_Angeles').format('MM-DD-YY');

const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp({
            format: () => moment().tz('America/Los_Angeles').format('YYYY-MM-DD HH:mm:ss.SSS Z')
        }),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: `logs/error-${currentDate}.log`, level: "warn" }),
        new winston.transports.File({ filename: `logs/app-${currentDate}.log` }),
    ],
    
}); 

export default logger;