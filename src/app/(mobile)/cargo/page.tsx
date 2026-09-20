import { redirect } from 'next/navigation';

import { loadDriverState } from '@/actions/cargo';
import { getValidCargoSession } from '@/lib/cargo-auth';
import DriverWorkspace from './driver-workspace';

export const dynamic = 'force-dynamic';

export default async function CargoDriverPage() {
    const session = await getValidCargoSession('cargo_driver');
    if (!session) {
        redirect('/cargo/login');
    }

    let state;
    try {
        state = await loadDriverState();
    } catch {
        redirect('/cargo/login?error=session');
    }

    return <DriverWorkspace state={state} currentUserId={session.user.id} />;
}
