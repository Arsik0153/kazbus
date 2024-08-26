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
        return inputDate;
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

export function getStringByNumber(
    number: number,
    strings: [string, string, string]
): string {
    const cases = [2, 0, 1, 1, 1, 2];
    const stringIndex =
        number % 100 > 4 && number % 100 < 20
            ? 2
            : cases[Math.min(number % 10, 5)];

    return strings[stringIndex];
}

export const dateTimeToReadable = (inputDateTime: string): string => {
    // Проверяем, соответствует ли входная строка формату ISO
    const datePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
    if (!datePattern.test(inputDateTime)) {
        throw new Error('Invalid datetime format. Expected format is YYYY-MM-DDTHH:mm:ssZ.');
    }

    // Преобразуем и форматируем дату
    const dateTime = dayjs(inputDateTime);
    return dateTime.format('DD.MM.YYYY HH:mm');
};