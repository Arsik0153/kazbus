import Link from 'next/link';
import MenuArrow from '@/assets/menu-arrow';
import { cn } from '@/utils/cn';

type ItemStatus = 'ready' | 'attention' | 'expired' | 'missing';

const statusMeta: Record<
    ItemStatus,
    { label: string; className: string; arrowColor: string }
> = {
    ready: {
        label: 'Заполнено',
        className: 'bg-[#7CC71C] text-white',
        arrowColor: '#7CC71C',
    },
    attention: {
        label: 'Скоро истекают',
        className: 'border border-[#F3CDCD] bg-[#FFF2F2] text-[#E74949]',
        arrowColor: '#E74949',
    },
    expired: {
        label: 'Есть просроченные',
        className: 'bg-[#E23333] text-white',
        arrowColor: '#E23333',
    },
    missing: {
        label: 'Нужно заполнить',
        className: 'border border-[#D1D1D1] bg-[#F8F8F8] text-[#A0A0A0]',
        arrowColor: '#E74949',
    },
};

type Props = {
    link: string;
    text: string;
    status: ItemStatus;
};

const ProfileDocumentMenuItem = ({ link, text, status }: Props) => {
    const meta = statusMeta[status];

    return (
        <Link
            href={link}
            className="flex items-center justify-between gap-3 py-4"
        >
            <div className="text-[16px] font-normal leading-[17.6px] text-[#4A4A4A]">
                {text}
            </div>
            <div className="flex shrink-0 items-center gap-3">
                <div
                    className={cn(
                        'rounded-full px-3 py-[6px] text-xs font-semibold leading-[13.2px]',
                        meta.className
                    )}
                >
                    {meta.label}
                </div>
                <MenuArrow color={meta.arrowColor} />
            </div>
        </Link>
    );
};

export default ProfileDocumentMenuItem;
