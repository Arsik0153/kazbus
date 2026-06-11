import Link from 'next/link';
import { cn } from '@/utils/cn';
import { documentStatusMeta } from '../_utils/document-utils';
import type { CargoDocument } from '../_types/cargo';

type Props = {
    document: CargoDocument;
    href?: string;
};

const DocumentCard = ({ document, href }: Props) => {
    const status = documentStatusMeta[document.status];
    const isMissing = document.status === 'missing';

    const content = (
        <div className="rounded-[0.625rem] border border-[#D1D1D1] bg-white p-4">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="leading-4.4 text-base font-semibold text-[#4A4A4A]">
                        {document.title}
                    </p>
                    <p className="mt-1 text-sm font-medium text-[#A0A0A0]">
                        {document.ownerLabel}
                    </p>
                </div>
                <div
                    className={cn(
                        'leading-3.3 shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold',
                        status.className
                    )}
                >
                    {status.label}
                </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#4A4A4A]">
                {isMissing ? (
                    <>
                        <span>Документ еще не добавлен</span>
                        <span className="text-[#A0A0A0]">
                            Заполните реквизиты документа
                        </span>
                    </>
                ) : (
                    <>
                        <span>№ {document.number}</span>
                        <span className="text-[#A0A0A0]">
                            Действителен до {document.expiresAt}
                        </span>
                    </>
                )}
            </div>
        </div>
    );

    if (!href) {
        return content;
    }

    return (
        <Link
            href={href}
            className="block rounded-[0.625rem] transition-opacity active:opacity-80"
        >
            {content}
        </Link>
    );
};

export default DocumentCard;
