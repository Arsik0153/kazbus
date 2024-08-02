import { createServerActionProcedure } from 'zsa';
import { getSession } from './lib/auth';

export const authedProcedure = createServerActionProcedure().handler(
    async () => {
        try {
            const { phone, id } = await getSession();
            console.log('FROM PROCEDURE', phone, id);

            return {
                user: {
                    phone,
                    id,
                },
            };
        } catch {
            throw new Error('User not authenticated');
        }
    }
);
