'use client';

import { type ReactNode } from 'react';
import type { AdminCargoState } from '@/lib/cargo-contract';

export type CargoPageProps = { state: AdminCargoState; currentUserId: number };

export function Panel({
    title,
    children,
}: {
    title: string;
    children: ReactNode;
}) {
    return (
        <section className="flex min-w-0 flex-col gap-5 rounded-[20px] bg-white p-5 md:p-8">
            <h2 className="text-2xl font-semibold text-[#4A4A4A]">{title}</h2>
            <div className="flex flex-col gap-4">{children}</div>
        </section>
    );
}

export {
    CargoInput,
    CargoTextarea,
    CargoSelect,
    CargoForm,
} from '@/components/cargo/form';
