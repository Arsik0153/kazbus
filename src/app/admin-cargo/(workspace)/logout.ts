'use server';

import { redirect } from 'next/navigation';
import { clearCargoSession } from '@/lib/cargo-auth';

export async function logoutAdminCargo() {
    await clearCargoSession();
    redirect('/admin-cargo/login');
}
