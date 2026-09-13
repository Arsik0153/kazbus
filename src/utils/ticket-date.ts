import { dayjsExt } from '@/lib/dayjs';

export const MISSING_TICKET_DATE = 'Дата не указана';

export const formatTicketDate = (date: string | null) => {
    if (!date) {
        return MISSING_TICKET_DATE;
    }

    const parsedDate = dayjsExt(date);

    return parsedDate.isValid()
        ? parsedDate.format('D MMMM')
        : MISSING_TICKET_DATE;
};
