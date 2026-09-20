'use client';
import Link from 'next/link';

export default function DriverError({ reset }: { reset: () => void }) {
    return (
        <main className="min-h-screen px-5 pt-24 pb-28 text-[#4A4A4A]">
            <h1 className="text-2xl font-bold">Не удалось загрузить кабинет</h1>
            <p className="my-4">
                Проверьте соединение и попробуйте снова. Если сессия истекла,
                войдите повторно.
            </p>
            <button
                className="rounded-xl bg-[#E23333] px-5 py-3 text-white"
                onClick={reset}
            >
                Повторить
            </button>
            <Link className="ml-4 underline" href="/busdriver/login">
                Войти
            </Link>
        </main>
    );
}
