import Link from 'next/link';
import { FileBadge, FileCheck2, Shield, TriangleAlert } from 'lucide-react';

import AdminSectionCard from '@/components/admin/section-card';
import { Button } from '@/components/ui/button';

const documentTypes = [
    {
        title: 'Техосмотр',
        description:
            'Контроль даты следующего осмотра и сигнализация по истечению срока действия.',
        icon: FileCheck2,
    },
    {
        title: 'Страховка',
        description:
            'Отдельный слот под полис, сроки действия и предупреждения об окончании.',
        icon: Shield,
    },
    {
        title: 'Регистрационные документы',
        description:
            'Хранение обязательных файлов по автобусу и прозрачный audit trail обновлений.',
        icon: FileBadge,
    },
];

const statuses = [
    {
        title: 'valid',
        text: 'Документ актуален и не мешает эксплуатации автобуса.',
        tone: 'bg-[#DCFCE7] text-[#166534]',
    },
    {
        title: 'expiring',
        text: 'Срок скоро закончится, нужен proactive контроль диспетчера.',
        tone: 'bg-[#FEF3C7] text-[#92400E]',
    },
    {
        title: 'expired',
        text: 'Документ просрочен и требует ручного обновления.',
        tone: 'bg-[#FEE2E2] text-[#B91C1C]',
    },
    {
        title: 'missing',
        text: 'Документ еще не загружен в контур автопарка.',
        tone: 'bg-[#E2E8F0] text-[#475569]',
    },
];

export default function AdminDocumentsPage() {
    return (
        <div className="mt-6 flex flex-col gap-5">
            <div className="rounded-[20px] bg-white px-8 py-10">
                <div className="flex items-start justify-between gap-6">
                    <div className="max-w-3xl">
                        <h1 className="text-[42px] font-semibold text-[#4A4A4A]">
                            Документы автобусов
                        </h1>
                        <p className="mt-3 text-base font-medium text-[#A0A0A0]">
                            Раздел закрывает требования по техосмотру,
                            страховке и регистрационным документам автобусов.
                            Сейчас это статическая верстка будущего реестра и
                            рабочих состояний.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button asChild size="lg" variant="outline">
                            <Link href="/admin/main/buses">К автобусам</Link>
                        </Button>
                        <Button size="lg" disabled>
                            Загрузка файлов подключится позже
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-5">
                {documentTypes.map(({ title, description, icon: Icon }) => (
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
                title="Реестр документов по автобусам"
                description="После подключения API здесь будет список автобусов, обязательные типы документов, сроки действия и действия по обновлению."
            >
                <div className="overflow-hidden rounded-[18px] border border-[#E2E8F0]">
                    <table className="w-full border-separate border-spacing-0">
                        <thead>
                            <tr className="bg-[#F8FAFC]">
                                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-[#A0A0A0]">
                                    Автобус
                                </th>
                                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-[#A0A0A0]">
                                    Тип документа
                                </th>
                                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-[#A0A0A0]">
                                    Срок действия
                                </th>
                                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-[#A0A0A0]">
                                    Статус
                                </th>
                                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-[#A0A0A0]">
                                    Действие
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td
                                    colSpan={5}
                                    className="px-5 py-16 text-center text-base font-medium text-[#94A3B8]"
                                >
                                    Реестр появится после того, как backend
                                    начнет отдавать документы автобусов и их
                                    статусы.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </AdminSectionCard>

            <AdminSectionCard
                title="Состояния документов"
                description="PRD требует поддерживать понятные статусы по срокам действия и отсутствию документов."
            >
                <div className="grid grid-cols-2 gap-4">
                    {statuses.map((status) => (
                        <div
                            key={status.title}
                            className="rounded-[18px] border border-[#E2E8F0] bg-[#F8FAFC] px-5 py-5"
                        >
                            <span
                                className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${status.tone}`}
                            >
                                {status.title}
                            </span>
                            <p className="mt-3 text-sm font-medium text-[#4A4A4A]">
                                {status.text}
                            </p>
                        </div>
                    ))}
                </div>
            </AdminSectionCard>

            <div className="rounded-[20px] border border-[#FECACA] bg-[#FFF7F7] px-6 py-5">
                <div className="flex items-start gap-3">
                    <TriangleAlert className="mt-0.5 h-5 w-5 text-[#DC2626]" />
                    <div>
                        <p className="text-base font-semibold text-[#7F1D1D]">
                            Ограничение текущей frontend-итерации
                        </p>
                        <p className="mt-2 text-sm font-medium text-[#B45309]">
                            Раздел пока не загружает документы и не выполняет
                            upload. Он добавлен как готовый интерфейсный контур,
                            чтобы после появления API не пришлось перестраивать
                            сам маршрут и навигацию.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
