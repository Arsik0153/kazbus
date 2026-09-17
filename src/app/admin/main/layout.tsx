import Menu from '@/components/admin/menu';
import BusFront from '@/assets/admin/BusFront';
import Pulse from '@/components/admin/pulse';
import Exit from '@/assets/admin/Exit';
import { getAdminSession } from '@/lib/admin-auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';
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
        <div className="flex min-h-screen w-full flex-col bg-[#E32B2B] lg:flex-row">
            <div className="w-full lg:w-1/5">
                <Menu />
            </div>
            <div className="flex w-full min-w-0 flex-col">
                <div className="flex flex-wrap justify-between gap-4 px-4 py-4 md:px-7">
                    <div className="flex flex-row items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
                            <BusFront color="#E74949" width={20} height={20} />
                        </div>
                        <div className="flex flex-col">
                            <p className="text-sm font-bold text-white">
                                {session.user.full_name ||
                                    session.user.username ||
                                    'Администратор'}
                            </p>
                            <div className="flex flex-row items-center gap-1 text-sm font-medium text-[#A0A0A0]">
                                <Pulse color="#21C01E" pulseRadius={5} />
                                Активен
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row items-center gap-4 md:gap-6">
                        <Link
                            href="/admin/main/company"
                            className="hidden text-base font-medium text-white underline-offset-4 hover:underline sm:block"
                        >
                            Редактировать данные
                        </Link>
                        <form action={logoutAction}>
                            <button
                                type="submit"
                                className="flex flex-row items-center gap-3 text-base font-semibold text-white opacity-60 duration-150 hover:opacity-100"
                            >
                                <Exit color="white" />
                                <span className="underline">Выйти</span>
                            </button>
                        </form>
                    </div>
                </div>
                <div className="h-full w-full min-w-0 rounded-t-[28px] bg-[#F1F5F9] px-3 pt-4 md:px-7 md:pt-7 lg:rounded-tl-[40px] lg:rounded-tr-none">
                    {children}
                </div>
            </div>
        </div>
    );
}
