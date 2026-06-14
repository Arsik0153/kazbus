import Link from 'next/link';

import { Button } from '@/components/ui/button';

const NewTripPage = () => {
    return (
        <div className="mt-6 flex flex-col gap-4">
            <h1 className="text-[42px] font-semibold text-[#4A4A4A]">
                Создать рейс
            </h1>
            <div className="rounded-[20px] bg-white px-8 py-12">
                <div className="max-w-3xl">
                    <p className="text-3xl font-semibold text-[#4A4A4A]">
                        Создание рейса будет включено после стабилизации
                        backend-контракта
                    </p>
                    <p className="mt-4 text-base font-medium text-[#A0A0A0]">
                        В текущем API список рейсов доступен, но контракт на
                        создание еще не гарантирует корректную привязку всех
                        обязательных продуктовых полей, прежде всего маршрута и
                        полного сценария публикации.
                    </p>
                    <p className="mt-4 text-base font-medium text-[#A0A0A0]">
                        Поэтому кабинет пока не показывает псевдо-рабочую форму.
                        После согласования backend полей здесь будет подключена
                        стабильная форма с реальными маршрутами, автобусами и
                        водителями.
                    </p>
                    <div className="mt-8 flex gap-3">
                        <Button asChild size="lg">
                            <Link href="/admin/main/trips">
                                Вернуться к списку рейсов
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

export default NewTripPage;
