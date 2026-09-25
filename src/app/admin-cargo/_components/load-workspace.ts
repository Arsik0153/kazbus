import { cache } from 'react';
import { redirect } from 'next/navigation';
import { loadAdminCargoState } from '@/actions/cargo';
import { CargoApiError, getCargoSession } from '@/lib/cargo-auth';

export const loadCargoWorkspace = cache(async () => {
    const session = await getCargoSession();
    if (!session || session.role !== 'admin_cargo')
        redirect('/admin-cargo/login');
    try {
        const state = await loadAdminCargoState();
        return { state, session };
    } catch (error) {
        if (error instanceof CargoApiError && [401, 403].includes(error.status))
            redirect('/admin-cargo/login?error=session');
        throw error;
    }
});
