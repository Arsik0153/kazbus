'use server';

import { authedProcedure } from '@/actions';
import { logout } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const logoutAction = authedProcedure
    .createServerAction()
    .handler(async () => {
        await logout();
        redirect('/profile');
    });
