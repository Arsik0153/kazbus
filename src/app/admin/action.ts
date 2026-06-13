'use server';

import { createServerAction } from 'zsa';
import { adminLoginSchema } from '@/data/schemas';
import { getAdminSession, loginAdmin, logoutAdmin } from '@/lib/admin-auth';
import { redirect } from 'next/navigation';

export const loginAction = createServerAction()
    .input(adminLoginSchema)
    .handler(async ({ input }) => {
        if (await getAdminSession()) {
            redirect('/admin/main');
        }

        await loginAdmin(input);
        redirect('/admin/main');
    });

export async function logoutAction() {
    'use server';

    await logoutAdmin();
    redirect('/admin');
}
