import moment from 'moment-timezone';

export const getCurrentTimestamp = () => {
    return Math.floor(moment().tz('America/Los_Angeles').valueOf() / 1000);
};

export const formatDateToMySQL = (date: Date) => {
    return moment(date).tz('America/Los_Angeles').format('YYYY-MM-DD HH:mm:ss');
};

export const parseDateToTimestamp = (date: string | Date) => {
    if (date === undefined || date === null || ['', "Unspecified", "Unspecified Date", "Unknown", "unknown"].includes(date.toString())) {
        return getCurrentTimestamp();
    }
    return Math.floor(moment(date).tz('America/Los_Angeles').valueOf() / 1000);
};

export const getFutureDate = (date: string | Date, days: number) => {
    return moment(date).tz('America/Los_Angeles').add(days, 'days').format('YYYY-MM-DD HH:mm:ss');
};