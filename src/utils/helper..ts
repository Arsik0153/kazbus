import dayjs from 'dayjs';

export const sanitizePhone = (phone: string): string => {
    return phone.replace(/\D/g, '');
};

export const dateToDTO = (inputDate: string): string => {
    const datePattern = /^\d{2}\.\d{2}\.\d{4}$/;
    if (!datePattern.test(inputDate)) {
        throw new Error('Invalid date format. Expected format is DD.MM.YYYY.');
    }
    const date = dayjs(inputDate, 'DD.MM.YYYY');
    return date.format('YYYY-MM-DD');
};

export const dateToReadable = (inputDate: string): string => {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(inputDate)) {
        throw new Error('Invalid date format. Expected format is YYYY-MM-DD.');
    }
    const date = dayjs(inputDate);
    return date.format('DD.MM.YYYY');
};

export const readablePhone = (phoneNumber: string): string => {
    if (phoneNumber.length !== 11) {
        throw new Error('Invalid phone number length');
    }

    const countryCode = '+7';
    const areaCode = phoneNumber.slice(1, 4);
    const firstPart = phoneNumber.slice(4, 7);
    const secondPart = phoneNumber.slice(7, 9);
    const thirdPart = phoneNumber.slice(9, 11);

    return `${countryCode}(${areaCode})-${firstPart}-${secondPart}-${thirdPart}`;
};
