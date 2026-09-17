import { redirect } from 'next/navigation';

import { loadShipperState } from '@/actions/cargo';
import { getValidCargoSession } from '@/lib/cargo-auth';
import { Shell } from '../_prototype/shell';
import { Store } from '../_prototype/store';

export const dynamic = 'force-dynamic';

export default async function ShipperWorkspaceLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    if (!(await getValidCargoSession('shipper'))) {
        redirect('/shipper/login');
    }

    let state;
    try {
        state = await loadShipperState();
    } catch {
        redirect('/shipper/login?error=session');
    }

    return (
        <Store initialState={state}>
            <Shell>{children}</Shell>
        </Store>
    );
}
