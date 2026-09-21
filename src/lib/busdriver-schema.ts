import { z } from 'zod';

export const busDriverSchema = z.object({
    id: z.number().int().positive(),
    full_name: z.string(),
    phone_number: z.string(),
    owner_id: z.number().int().positive(),
    is_active: z.boolean(),
});
