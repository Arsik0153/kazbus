import { cn } from '@/utils/cn';
import type { CargoDocument, DocumentStatus } from '../_types/cargo';

const documentStatusMeta: Record<
    DocumentStatus,
    { label: string; className: string }
> = {
    valid: {
        label: 'Действует',
        className: 'bg-[#7CC71C] text-white',
    },
    expiring: {
        label: 'Скоро истекает',
        className: 'border border-[#F3CDCD] bg-[#FFF2F2] text-[#E74949]',
    },
    expired: {
        label: 'Истек',
        className: 'bg-[#AEAEAE] text-white',
    },
};

type Props = {
    document: CargoDocument;
};

const DocumentCard = ({ document }: Props) => {
    const status = documentStatusMeta[document.status];

    return (
        <div className="rounded-[10px] border border-[#D1D1D1] bg-white p-4">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-[16px] font-semibold leading-[17.6px] text-[#4A4A4A]">
                        {document.title}
                    </p>
                    <p className="mt-1 text-sm font-medium text-[#A0A0A0]">
                        {document.ownerLabel}
                    </p>
                </div>
                <div
                    className={cn(
                        'shrink-0 rounded-full px-3 py-[6px] text-xs font-semibold leading-[13.2px]',
                        status.className
                    )}
                >
                    {status.label}
                </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#4A4A4A]">
                <span>№ {document.number}</span>
                <span className="text-[#A0A0A0]">
                    Действителен до {document.expiresAt}
                </span>
            </div>
        </div>
    );
};

export default DocumentCard;
