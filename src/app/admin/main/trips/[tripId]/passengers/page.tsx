import Link from 'next/link';
import { Download, ListChecks, ScanLine, Ticket } from 'lucide-react';

import AdminSectionCard from '@/components/admin/section-card';
import { Button } from '@/components/ui/button';

type Props = {
    params: {
        tripId: string;
    };
};

const manifestBlocks = [
    {
        title: 'Список пассажиров рейса',
        description:
            'Здесь должен появиться полный манифест: пассажир, документ, место, статус билета и статус посадки.',
        icon: ListChecks,
    },
    {
        title: 'Экспорт списка',
        description:
            'Отдельный сценарий под выгрузку списка пассажиров для печати и офлайн-контроля.',
        icon: Download,
    },
    {
        title: 'Связь со сканированием',
        description:
            'Статусы посадки могут синхронизироваться с driver-контуром и QR-сканированием.',
        icon: ScanLine,
    },
];

export default function AdminTripPassengersPage({ params }: Props) {
    return (
        <div className="mt-6 flex flex-col gap-5">
            <div className="rounded-[20px] bg-white px-8 py-10">
                <div className="flex items-start justify-between gap-6">
                    <div className="max-w-3xl">
                        <h1 className="text-[42px] font-semibold text-[#4A4A4A]">
                            Пассажиры рейса #{params.tripId}
                        </h1>
                        <p className="mt-3 text-base font-medium text-[#A0A0A0]">
                            Экран подготовлен под список пассажиров, статусы
                            посадки и выгрузку manifest-а по конкретному рейсу.
                            Сейчас это безопасная верстка без фейковых данных.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button asChild size="lg" variant="outline">
                            <Link href="/admin/main/trips">К рейсам</Link>
                        </Button>
                        <Button size="lg" disabled>
                            Экспорт подключится после ticket API
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-5">
                {manifestBlocks.map(({ title, description, icon: Icon }) => (
                    <div
                        key={title}
                        className="rounded-[20px] bg-white px-6 py-6"
                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FEE2E2]">
                            <Icon className="h-6 w-6 text-[#E74949]" />
                        </div>
                        <p className="mt-4 text-xl font-semibold text-[#4A4A4A]">
                            {title}
                        </p>
                        <p className="mt-2 text-sm font-medium text-[#A0A0A0]">
                            {description}
                        </p>
                    </div>
                ))}
            </div>

            <AdminSectionCard
                title="Пассажирский манифест"
                description="Таблица готова под будущие реальные билеты и пассажиров без имитации проданных мест."
            >
                <div className="overflow-hidden rounded-[18px] border border-[#E2E8F0]">
                    <table className="w-full border-separate border-spacing-0">
                        <thead>
                            <tr className="bg-[#F8FAFC]">
                                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-[#A0A0A0]">
                                    Пассажир
                                </th>
                                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-[#A0A0A0]">
                                    Документ
                                </th>
                                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-[#A0A0A0]">
                                    Место
                                </th>
                                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-[#A0A0A0]">
                                    Билет
                                </th>
                                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-[#A0A0A0]">
                                    Посадка
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td
                                    colSpan={5}
                                    className="px-5 py-16 text-center text-base font-medium text-[#94A3B8]"
                                >
                                    Для этого рейса еще не подключен passenger
                                    manifest из backend.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </AdminSectionCard>

            <AdminSectionCard
                title="Что должно появиться после интеграции"
                description="Эти блоки покрывают продуктовые требования ADM-22 и ADM-23."
            >
                <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-[18px] border border-[#E2E8F0] bg-[#F8FAFC] px-5 py-5">
                        <Ticket className="h-5 w-5 text-[#E74949]" />
                        <p className="mt-3 text-lg font-semibold text-[#4A4A4A]">
                            Статусы билетов
                        </p>
                        <p className="mt-2 text-sm font-medium text-[#A0A0A0]">
                            booked, paid, used, refunded, cancelled, expired.
                        </p>
                    </div>
                    <div className="rounded-[18px] border border-[#E2E8F0] bg-[#F8FAFC] px-5 py-5">
                        <ScanLine className="h-5 w-5 text-[#E74949]" />
                        <p className="mt-3 text-lg font-semibold text-[#4A4A4A]">
                            Статусы посадки
                        </p>
                        <p className="mt-2 text-sm font-medium text-[#A0A0A0]">
                            waiting, boarded, missed с привязкой к driver flow.
                        </p>
                    </div>
                </div>
            </AdminSectionCard>
        </div>
    );
}
