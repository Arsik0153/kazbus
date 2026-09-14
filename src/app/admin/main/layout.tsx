import Link from 'next/link';
import { redirect } from 'next/navigation';

import BusFront from '@/assets/admin/BusFront';
import Exit from '@/assets/admin/Exit';
import Menu from '@/components/admin/menu';
import { getAdminSession } from '@/lib/admin-auth';

import { logoutAction } from '../action';

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await getAdminSession();

    if (!session) {
        redirect('/admin');
    }

    return (
        <div className="min-h-screen w-full bg-[#E32B2B] md:flex">
            <Menu />
            <div className="flex min-w-0 flex-1 flex-col md:ml-64">
                <header className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white">
                            <BusFront color="#E74949" width={20} height={20} />
                        </div>
                        <p className="text-sm font-bold text-white">
                            {session.user.full_name ||
                                session.user.username ||
                                'Администратор'}
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                        <Link
                            href="/admin/main/company"
                            className="rounded-sm text-base font-medium text-white underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                        >
                            Профиль компании
                        </Link>
                        <form action={logoutAction}>
                            <button
                                type="submit"
                                className="flex items-center gap-3 rounded-sm text-base font-semibold text-white/70 duration-150 hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                            >
                                <Exit color="white" />
                                <span className="underline">Выйти</span>
                            </button>
                        </form>
                    </div>
                </header>
                <main className="min-w-0 flex-1 bg-[#F1F5F9] px-4 py-5 sm:px-7 sm:py-7 md:rounded-tl-[40px]">
                    {children}
                </main>
            </div>
        </div>
    );
}
