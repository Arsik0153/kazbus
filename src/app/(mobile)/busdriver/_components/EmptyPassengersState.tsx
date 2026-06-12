import Link from 'next/link';
import type { ReactNode } from 'react';

type Props = {
    title: string;
    description: string;
    actionHref?: string;
    actionLabel?: string;
    icon?: ReactNode;
};

const EmptyPassengersState = ({
    title,
    description,
    actionHref,
    actionLabel,
    icon,
}: Props) => {
    return (
        <div className="rounded-[0.625rem] border border-[#D1D1D1] bg-white p-5 text-center">
            {icon && <div className="mb-4 flex justify-center">{icon}</div>}
            <h2 className="leading-5.5 text-xl font-bold text-[#4A4A4A]">
                {title}
            </h2>
            <p className="leading-4.4 mt-2 text-sm text-[#A0A0A0]">
                {description}
            </p>
            {actionHref && actionLabel && (
                <Link
                    href={actionHref}
                    className="mt-4 inline-flex text-sm font-semibold text-[#E23333]"
                >
                    {actionLabel}
                </Link>
            )}
        </div>
    );
};

export default EmptyPassengersState;
