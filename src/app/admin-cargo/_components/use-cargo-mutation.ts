'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export function useCargoMutation() {
    const router = useRouter();
    const pending = useRef(false);
    const [busy, setBusy] = useState('');
    const [errors, setErrors] = useState<{
        key: string;
        fields: Record<string, string>;
    }>({ key: '', fields: {} });

    async function run(
        key: string,
        operation: () => Promise<{
            ok: boolean;
            error?: string;
            fieldErrors?: Record<string, string>;
        }>,
        success = 'Изменения сохранены.'
    ) {
        if (pending.current) return false;
        pending.current = true;
        setBusy(key);
        setErrors({ key, fields: {} });
        try {
            const response = await operation();
            if (!response.ok) {
                setErrors({ key, fields: response.fieldErrors ?? {} });
                toast.error(response.error ?? 'Не удалось выполнить действие');
                return false;
            }
            toast.success(success);
            router.refresh();
            return true;
        } catch {
            toast.error(
                'Не удалось получить ответ сервера. Попробуйте ещё раз.'
            );
            return false;
        } finally {
            pending.current = false;
            setBusy('');
        }
    }
    return {
        busy,
        run,
        errorsFor: (key: string) => (errors.key === key ? errors.fields : {}),
    };
}
