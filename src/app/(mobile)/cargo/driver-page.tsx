import { redirect } from 'next/navigation';

import { loadDriverState } from '@/actions/cargo';
import { getValidCargoSession } from '@/lib/cargo-auth';
import DriverWorkspace, { type DriverView } from './driver-workspace';

export default async function DriverPage({
    view = 'home',
}: {
    view?: DriverView;
}) {
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

    return (
        <DriverWorkspace
            key={view}
            state={state}
            currentUserId={session.user.id}
            view={view}
        />
    );
}
