import { createServerActionProcedure } from 'zsa';
import { getSession } from './lib/auth';

export const authedProcedure = createServerActionProcedure().handler(
    async () => {
        const session = await getSession();

        if (!session) {
            throw new Error('User not authenticated');
        }

        return { user: session.user };
    }
);
