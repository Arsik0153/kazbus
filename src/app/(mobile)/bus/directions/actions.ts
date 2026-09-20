'use server';

import { z } from 'zod';
import { createServerAction } from 'zsa';
import { directionSchema, availableDirections } from './model';

export const getDirectionsAction = createServerAction().handler(async () => {
    const response = await fetch(`${process.env.API_URL}/trip/trips/`, {
        cache: 'no-store',
    });
    if (!response.ok)
        throw new Error('Не удалось получить направления. Попробуйте ещё раз.');
    const directions = z.array(directionSchema).parse(await response.json());
    const today = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Almaty',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(new Date());
    return availableDirections(directions, today);
});
