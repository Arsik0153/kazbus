import { ReactNode } from 'react';

type Props = {
    title: string;
    description?: string;
    action?: ReactNode;
    children: ReactNode;
    className?: string;
    contentClassName?: string;
};

const AdminSectionCard = ({
    title,
    description,
    action,
    children,
    className,
    contentClassName,
}: Props) => {
    return (
        <section className={`rounded-[20px] bg-white px-8 py-8 ${className || ''}`}>
            <div className="flex items-start justify-between gap-5">
                <div className="max-w-3xl">
                    <h2 className="text-2xl font-semibold text-[#4A4A4A]">
                        {title}
                    </h2>
                    {description ? (
                        <p className="mt-2 text-sm font-medium text-[#A0A0A0]">
                            {description}
                        </p>
                    ) : null}
                </div>
                {action}
            </div>
            <div className={contentClassName ? `mt-6 ${contentClassName}` : 'mt-6'}>
                {children}
            </div>
        </section>
    );
};

export default AdminSectionCard;
