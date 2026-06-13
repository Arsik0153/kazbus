import Menu from '@/components/admin/menu';
import BusFront from '@/assets/admin/BusFront';
import Pulse from '@/components/admin/pulse';
import Exit from '@/assets/admin/Exit';
import { getAdminSession } from '@/lib/admin-auth';
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
        <div className="flex min-h-screen w-full bg-[#E32B2B]">
            <div className="w-1/5">
                <Menu />
            </div>
            <div className="flex w-full flex-col">
                <div className="flex flex-row justify-between px-7 py-4">
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
                    <div className="flex flex-row items-center gap-6">
                        <span className="text-base font-medium text-white">
                            Редактировать данные
                        </span>
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
                <div className="h-full w-full rounded-tl-[40px] bg-[#F1F5F9] px-7 pt-7">
                    {children}
                </div>
            </div>
        </div>
    );
}
