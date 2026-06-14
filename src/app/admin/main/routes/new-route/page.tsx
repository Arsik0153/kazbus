import Link from 'next/link';

import { Button } from '@/components/ui/button';

const NewRoutePage = () => {
    return (
        <div className="mt-6 flex flex-col gap-4">
            <h1 className="text-[42px] font-semibold text-[#4A4A4A]">
                Добавить маршрут
            </h1>
            <div className="rounded-[20px] bg-white px-8 py-12">
                <div className="max-w-3xl">
                    <p className="text-3xl font-semibold text-[#4A4A4A]">
                        Сохранение маршрута временно ограничено backend-контрактом
                    </p>
                    <p className="mt-4 text-base font-medium text-[#A0A0A0]">
                        Текущий endpoint `/trip_v2/routes/` не подтверждает
                        полноценный прием продуктовых полей маршрута: стартового
                        города, конечного города, станций и полного списка
                        остановок. Поэтому интерфейс не имитирует успешное
                        сохранение и не показывает фальшивую рабочую кнопку.
                    </p>
                    <p className="mt-4 text-base font-medium text-[#A0A0A0]">
                        После расширения backend-контракта здесь будет
                        восстановлена полная форма создания маршрута без смены
                        общей структуры кабинета.
                    </p>
                    <div className="mt-8 flex gap-3">
                        <Button asChild size="lg">
                            <Link href="/admin/main/routes">
                                Вернуться к списку маршрутов
                            </Link>
                        </Button>
                        <Button asChild size="lg" variant="outline">
                            <Link href="/admin/main">На дашборд</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewRoutePage;
