import Link from 'next/link';
import Topbar from '@/components/topbar';

export default function DeleteAccountPage() {
    return (
        <>
            <Topbar backHref="/bus/profile">Удаление аккаунта</Topbar>
            <main className="space-y-5 px-5 py-10">
                <h1 className="text-2xl font-semibold">
                    Удаление аккаунта пока недоступно
                </h1>
                <p>
                    Аккаунт и история поездок сохранены. Выход из приложения
                    завершает сессию, но не удаляет ваши данные.
                </p>
                <Link
                    href="/bus/profile"
                    className="block text-[#E23333] underline"
                >
                    Вернуться в профиль
                </Link>
            </main>
        </>
    );
}
