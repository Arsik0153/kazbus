import Link from 'next/link';

import { Button } from '@/components/ui/button';

const StartTripPage = () => {
    return (
        <div className="mt-6 flex flex-col gap-4">
            <h1 className="text-[42px] font-semibold text-[#4A4A4A]">
                Запуск рейса
            </h1>
            <div className="rounded-[20px] bg-white px-8 py-12">
                <div className="max-w-3xl">
                    <p className="text-3xl font-semibold text-[#4A4A4A]">
                        Checklist публикации будет подключен после расширения API
                    </p>
                    <p className="mt-4 text-base font-medium text-[#A0A0A0]">
                        Текущий экран запуска рейса раньше был чисто демо и не
                        выполнял реального действия. Чтобы не вводить
                        пользователя в заблуждение, экран временно переведен в
                        честное состояние ожидания backend-поддержки.
                    </p>
                    <p className="mt-4 text-base font-medium text-[#A0A0A0]">
                        После готовности API здесь появится проверка готовности
                        рейса: наличие автобуса, водителя, цены, конфликтов по
                        времени и итоговая публикация рейса.
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

export default StartTripPage;
