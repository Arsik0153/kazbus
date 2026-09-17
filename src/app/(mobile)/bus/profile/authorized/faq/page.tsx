import Link from 'next/link';
import Topbar from '@/components/topbar';

const answers = [
    {
        question: 'Как найти рейс и забронировать место?',
        answer: 'В поиске укажите города и дату, выберите рейс и свободные места. Затем выберите пассажиров и проверьте их данные. Созданная бронь появится в разделе «Мои билеты». Обратите внимание на срок брони: после его истечения неоплаченные места снова становятся доступными.',
        href: '/bus/main',
        link: 'Найти рейс',
    },
    {
        question: 'Где посмотреть билет и историю поездок?',
        answer: 'Откройте «Мои билеты» под тем же аккаунтом, с которого оформляли бронь. В карточке показаны маршрут, пассажиры и актуальный статус. Бронирование само по себе не означает, что билет оплачен.',
        href: '/bus/my-tickets',
        link: 'Мои билеты',
    },
    {
        question: 'Как изменить данные пассажира?',
        answer: 'Добавить или изменить сохранённого пассажира можно в профиле. Если пассажир уже указан в истории билетов, его данные защищены от изменения. Для будущих поездок можно добавить новую запись. Собственные данные редактируются в разделе «Личные данные», с тем же ограничением для истории билетов.',
        href: '/bus/profile/authorized/passenger-data',
        link: 'Данные пассажиров',
    },
    {
        question: 'Почему я не могу оплатить билет?',
        answer: 'Онлайн-оплата в этой версии ещё не подключена. Не переводите деньги по случайным ссылкам и не считайте бронь подтверждением оплаты. Статус своего билета можно проверить в разделе «Мои билеты».',
        href: '/bus/my-tickets',
        link: 'Проверить статус билета',
    },
    {
        question: 'Что проверить перед поездкой?',
        answer: 'Проверьте дату, время, пункт отправления и данные пассажира в билете. Подготовьте документ, указанный при оформлении. Уточните у перевозчика время прибытия на посадку и условия провоза багажа; в поездке следуйте указаниям водителя.',
        href: '/bus/my-tickets',
        link: 'Открыть поездку',
    },
];

export default function FAQPage() {
    return (
        <>
            <Topbar backHref="/bus/profile">Помощь</Topbar>
            <main className="space-y-5 px-5 py-8">
                <h1 className="text-2xl font-semibold">Частые вопросы</h1>
                <div className="divide-y rounded-xl border px-4">
                    {answers.map((item) => (
                        <details key={item.question} className="py-4">
                            <summary className="cursor-pointer font-semibold">
                                {item.question}
                            </summary>
                            <p className="mt-3 text-sm leading-6 text-[#555]">
                                {item.answer}
                            </p>
                            <Link
                                href={item.href}
                                className="mt-3 inline-block text-sm text-[#E23333] underline"
                            >
                                {item.link}
                            </Link>
                        </details>
                    ))}
                </div>
                <Link
                    href="/bus/profile/authorized/faq/return-policy"
                    className="block text-sm text-[#E23333] underline"
                >
                    Условия возврата средств
                </Link>
            </main>
        </>
    );
}
