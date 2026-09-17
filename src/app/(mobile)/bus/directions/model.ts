import { z } from 'zod';

const citySchema = z.object({
    id: z.number().int().positive(),
    name: z.string(),
});
export const directionSchema = z.object({
    id: z.number().int().positive(),
    departure_time: z.string(),
    ticket_price: z
        .string()
        .refine((value) => Number.isFinite(Number(value)) && Number(value) > 0),
    status: z.string(),
    is_always_active: z.boolean(),
    end_date: z.string().date().nullable(),
    route: z.object({ start_city: citySchema, end_city: citySchema }),
    bus: z.object({
        have_wifi: z.boolean(),
        have_toilet: z.boolean(),
        is_recumbent: z.boolean(),
    }),
});
export type Direction = z.infer<typeof directionSchema>;

export function availableDirections(directions: Direction[], today: string) {
    return directions.filter(
        (direction) =>
            ['active', 'scheduled'].includes(direction.status) &&
            (direction.is_always_active ||
                !direction.end_date ||
                direction.end_date >= today)
    );
}

export function selectDirections(
    directions: Direction[],
    cityId: string,
    cheapest: boolean
) {
    const selected = directions.filter(
        (direction) =>
            !cityId || String(direction.route.start_city.id) === cityId
    );
    return cheapest
        ? selected.sort(
              (a, b) => Number(a.ticket_price) - Number(b.ticket_price)
          )
        : selected;
}
