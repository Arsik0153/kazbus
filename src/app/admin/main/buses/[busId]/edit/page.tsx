import Link from 'next/link';
import { BusFront, FileText, Sofa } from 'lucide-react';

import AdminInfoField from '@/components/admin/info-field';
import AdminSectionCard from '@/components/admin/section-card';
import { Button } from '@/components/ui/button';

type Props = {
    params: {
        busId: string;
    };
};

export default function EditBusPage({ params }: Props) {
    return (
        <div className="mt-6 flex flex-col gap-5">
            <div className="rounded-[20px] bg-white px-8 py-10">
                <div className="flex items-start justify-between gap-6">
                    <div className="max-w-3xl">
                        <h1 className="text-[42px] font-semibold text-[#4A4A4A]">
                            Карточка автобуса #{params.busId}
                        </h1>
                        <p className="mt-3 text-base font-medium text-[#A0A0A0]">
                            Страница добавлена как верстка будущего сценария
                            редактирования автобуса. Она покрывает обязательные
                            поля из PRD и готова к последующему подключению API.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button asChild size="lg" variant="outline">
                            <Link href="/admin/main/buses">К списку автобусов</Link>
                        </Button>
                        <Button size="lg" disabled>
                            Сохранение автобуса подключится позже
                        </Button>
                    </div>
                </div>
            </div>

            <AdminSectionCard
                title="Основные данные автобуса"
                description="Карточка повторяет обязательные поля автобусной сущности из PRD."
            >
                <div className="grid grid-cols-2 gap-4">
                    <AdminInfoField
                        label="Внутреннее название"
                        value="Будет подставляться из bus.name"
                    />
                    <AdminInfoField
                        label="Марка / модель"
                        value="Будет подставляться из brand и model_stamp"
                    />
                    <AdminInfoField
                        label="VIN"
                        value="Хранится в карточке автобуса"
                    />
                    <AdminInfoField
                        label="Государственный номер"
                        value="Используется в операционном контуре"
                    />
                    <AdminInfoField
                        label="Количество мест"
                        value="Нужно для схемы мест и продаж"
                    />
                    <AdminInfoField
                        label="Количество этажей"
                        value="Используется для схемы мест"
                    />
                </div>
            </AdminSectionCard>

            <div className="grid grid-cols-[1.1fr_1fr] gap-5">
                <AdminSectionCard
                    title="Удобства и компоновка"
                    description="Отдельная зона под признаки автобуса и схему мест."
                >
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            'Wi-Fi',
                            'Туалет',
                            'Лежачие места',
                        ].map((feature) => (
                            <div
                                key={feature}
                                className="rounded-[18px] border border-[#E2E8F0] bg-[#F8FAFC] px-5 py-5"
                            >
                                <Sofa className="h-5 w-5 text-[#E74949]" />
                                <p className="mt-3 text-lg font-semibold text-[#4A4A4A]">
                                    {feature}
                                </p>
                                <p className="mt-2 text-sm font-medium text-[#A0A0A0]">
                                    Значение подтянется из backend-карточки
                                    автобуса.
                                </p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 flex min-h-[240px] items-center justify-center rounded-[18px] border border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-8 text-center">
                        <div className="max-w-lg">
                            <BusFront className="mx-auto h-8 w-8 text-[#E74949]" />
                            <p className="mt-4 text-2xl font-semibold text-[#4A4A4A]">
                                Здесь будет схема мест автобуса
                            </p>
                            <p className="mt-2 text-base font-medium text-[#94A3B8]">
                                После подключения реальных данных экран сможет
                                показывать этажность, сиденья, служебные места и
                                общую конфигурацию салона.
                            </p>
                        </div>
                    </div>
                </AdminSectionCard>

                <AdminSectionCard
                    title="Документы и эксплуатация"
                    description="Карточка автобуса должна связываться с отдельным документным контуром."
                >
                    <div className="grid gap-4">
                        <AdminInfoField
                            label="Техосмотр"
                            value="Будет связан с реестром документов"
                        />
                        <AdminInfoField
                            label="Страховка"
                            value="Статус и срок будут выводиться здесь"
                        />
                        <AdminInfoField
                            label="Регистрационные документы"
                            value="Загрузка и обновление пойдут через documents"
                        />
                    </div>
                    <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="mt-6"
                    >
                        <Link href="/admin/main/documents">
                            <FileText />
                            Открыть раздел документов
                        </Link>
                    </Button>
                </AdminSectionCard>
            </div>
        </div>
    );
}
