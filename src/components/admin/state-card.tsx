'use client';

import { ReactNode } from 'react';

type Props = {
    title: string;
    description?: string;
    action?: ReactNode;
};

const AdminStateCard = ({ title, description, action }: Props) => {
    return (
        <div className="mt-4 flex flex-col items-center gap-4 rounded-[20px] bg-white px-8 py-24 text-center">
            <p className="max-w-2xl text-[32px] font-semibold leading-tight text-[#4A4A4A]">
                {title}
            </p>
            {description ? (
                <p className="max-w-2xl text-base font-medium text-[#A0A0A0]">
                    {description}
                </p>
            ) : null}
            {action}
        </div>
    );
};

export default AdminStateCard;
