export const sanitizePhone = (phone: string): string => {
    return phone.replace(/\D/g, '');
};

export const dateToDTO = (dateString: string): string => {
    const [day, month, year] = dateString.split('.');
    return `${year}-${month}-${day}`;
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
