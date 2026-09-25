'use client';

import { Button } from '@/components/ui/button';

export default function CargoError({ reset }: { reset: () => void }) {
    return (
        <div role="alert" className="rounded-[20px] bg-white p-8">
            <h2 className="text-2xl font-semibold">
                Не удалось загрузить данные
            </h2>
            <p className="text-muted-foreground my-4">
                Проверьте соединение и попробуйте ещё раз.
            </p>
            <Button onClick={reset}>Повторить загрузку</Button>
        </div>
    );
}
