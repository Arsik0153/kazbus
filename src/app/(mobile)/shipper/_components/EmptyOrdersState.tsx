import Link from 'next/link';

type Props = {
    title?: string;
    description?: string;
    actionHref?: string;
    actionLabel?: string;
};

const EmptyOrdersState = ({
    title = 'Заявок пока нет',
    description = 'Создайте первую заявку, чтобы начать работу с перевозками в Joool Shipper.',
    actionHref = '/shipper/create-order',
    actionLabel = 'Создать заявку',
}: Props) => {
    return (
        <div className="rounded-[0.625rem] border border-[#D1D1D1] bg-white p-5 text-center">
            <p className="leading-5.5 text-xl font-bold text-[#4A4A4A]">
                {title}
            </p>
            <p className="leading-4.4 mt-2 text-sm text-[#A0A0A0]">
                {description}
            </p>
            <Link
                href={actionHref}
                className="mt-4 block rounded-[0.625rem] bg-[#E23333] px-4 py-4 text-sm font-semibold text-white"
            >
                {actionLabel}
            </Link>
        </div>
    );
};

export default EmptyOrdersState;
