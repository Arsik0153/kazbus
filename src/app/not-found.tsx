import Link from 'next/link';
import React from 'react';

const NotFoundPage = () => {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center">
            <h1 className="text-lg">Страница не найдена</h1>
            <Link
                href="/main"
                className="mt-4 text-lg text-[var(--accent)] underline underline-offset-2"
            >
                Вернуться на главную
            </Link>
        </div>
    );
};

export default NotFoundPage;
