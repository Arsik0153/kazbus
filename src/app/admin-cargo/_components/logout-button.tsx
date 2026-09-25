'use client';

import { useFormStatus } from 'react-dom';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="flex items-center gap-3 font-semibold text-white opacity-60 hover:opacity-100 disabled:opacity-40"
        >
            <LogOut className="size-5" />
            <span className="underline">{pending ? 'Выходим…' : 'Выйти'}</span>
        </button>
    );
}
