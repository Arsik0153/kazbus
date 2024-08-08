import Menu from '@/components/admin/menu';
import BusFront from '@/assets/admin/BusFront';
import Pulse from '@/components/admin/pulse';
import Exit from '@/assets/admin/Exit';

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex min-h-screen bg-[#E32B2B] w-full" vaul-drawer-wrapper="">
            <div className="w-1/5"><Menu />
            </div>
            <div className="flex flex-col w-full">
                <div className="px-7 flex flex-row py-4 justify-between">
                    <div className="flex flex-row gap-4 items-center">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white">
                            <BusFront color="#E74949" width={20} height={20} />
                        </div>
                        <div className="flex flex-col">
                            <p className="text-sm font-bold text-white">Таксопарк “ТОО ЖОЛЫМБЕТ ПЕРЕВОЗКИ”</p>
                            <div className="text-sm font-medium text-[#A0A0A0] flex flex-row items-center gap-1">
                                <Pulse color="#21C01E" pulseRadius={5} />
                                Активен
                            </div>

                        </div>
                    </div>
                    <div className="flex flex-row items-center gap-6">
                        <a href="" className="text-base font-medium text-white">Редактировать данные</a>
                        <a href="/admin" className="text-base font-semibold text-white flex flex-row gap-3 items-center opacity-60 "><Exit color='white' /><span className=' underline'>Выйти</span> </a>

                    </div>
                </div>
                <div className="pt-7 px-7 w-full h-full rounded-tl-[40px] bg-[#F1F5F9]">
                    {children}
                </div>

            </div>
        </div>
    );
}
