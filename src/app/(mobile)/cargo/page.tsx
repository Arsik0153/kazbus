import { redirect } from 'next/navigation';

import { loadDriverState } from '@/actions/cargo';
import { getValidCargoSession } from '@/lib/cargo-auth';
import DriverWorkspace from './driver-workspace';

export const dynamic = 'force-dynamic';

export default async function CargoDriverPage() {
    if (!(await getValidCargoSession('cargo_driver'))) {
        redirect('/cargo/login');
    }

    let state;
    try {
        state = await loadDriverState();
    } catch {
        redirect('/cargo/login?error=session');
    }

    return <DriverWorkspace state={state} />;
}
