import { redirect } from 'next/navigation';

import { loadAdminCargoState } from '@/actions/cargo';
import { getValidCargoSession } from '@/lib/cargo-auth';
import AdminCargoDashboard from './dashboard';

export const dynamic = 'force-dynamic';

export default async function AdminCargoPage() {
    const session = await getValidCargoSession('admin_cargo');
    if (!session) {
        redirect('/admin-cargo/login');
    }

    let state;
    try {
        state = await loadAdminCargoState();
    } catch {
        redirect('/admin-cargo/login?error=session');
    }

    return (
        <AdminCargoDashboard state={state} currentUserId={session.user.id} />
    );
}
