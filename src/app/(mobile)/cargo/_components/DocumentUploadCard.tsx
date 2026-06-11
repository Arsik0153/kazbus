import Upload from '@/assets/admin/Upload';
import Input from '@/components/input';
import { cn } from '@/utils/cn';
import { documentStatusMeta } from '../_utils/document-utils';
import type { DocumentFormMode, DocumentStatus } from '../_types/cargo';

type Props = {
    id: string;
    title: string;
    description: string;
    ownerLabel: string;
    numberLabel: string;
    expiryLabel: string;
    helperText: string;
    mode: DocumentFormMode;
    status: DocumentStatus;
    defaultNumber?: string;
    defaultExpiry?: string;
    isSelected?: boolean;
};

const DocumentUploadCard = ({
    id,
    title,
    description,
    ownerLabel,
    numberLabel,
    expiryLabel,
    helperText,
    mode,
    status,
    defaultNumber,
    defaultExpiry,
    isSelected = false,
}: Props) => {
    const statusBadge = documentStatusMeta[status];
    const isEditMode = mode === 'edit';

    return (
        <div
            id={`document-${id}`}
            className={cn(
                'scroll-mt-28 rounded-[0.625rem] border border-[#D1D1D1] bg-white p-5',
                {
                    'border-[#E74949] ring-1 ring-[#F3CDCD]': isSelected,
                }
            )}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[0.625rem] bg-[#FFF2F2]">
                        <Upload color="#E74949" />
                    </div>
                    <div className="min-w-0">
                        <p className="leading-4.4 text-base font-semibold text-[#4A4A4A]">
                            {title}
                        </p>
                        <p className="leading-4.4 mt-1 text-sm text-[#A0A0A0]">
                            {description}
                        </p>
                    </div>
                </div>
                <div
                    className={cn(
                        'shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold',
                        statusBadge.className
                    )}
                >
                    {statusBadge.label}
                </div>
            </div>

            <div className="mt-4 rounded-[0.625rem] bg-[#F8F8F8] p-3">
                <p className="text-xs font-medium text-[#A0A0A0]">Для кого</p>
                <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                    {ownerLabel}
                </p>
            </div>

            <div className="mt-4 rounded-[0.625rem] bg-[#FFF7F7] p-3">
                <p className="text-sm font-semibold text-[#E74949]">
                    {isEditMode
                        ? 'Редактирование документа'
                        : 'Заполнение документа'}
                </p>
                <p className="leading-4.4 mt-1 text-sm text-[#A0A0A0]">
                    {isEditMode
                        ? 'Проверьте текущие реквизиты и обновите их, если данные изменились.'
                        : 'Добавьте реквизиты документа, чтобы профиль прошел проверку.'}
                </p>
            </div>

            <div className="mt-4 flex flex-col gap-2">
                <Input
                    id={`${id}-number`}
                    label={numberLabel}
                    placeholder={numberLabel}
                    defaultValue={defaultNumber}
                />
                <Input
                    id={`${id}-expiry`}
                    label={expiryLabel}
                    placeholder={expiryLabel}
                    defaultValue={defaultExpiry}
                />
            </div>

            <div className="bg-linear-[180deg,#FFF7F7_0%,#FFFFFF_100%] mt-4 rounded-[0.625rem] border border-dashed border-[#E7B0B0] p-4">
                <p className="text-sm font-semibold text-[#E74949]">
                    {isEditMode ? 'Обновление файла' : 'Загрузка файла'}
                </p>
                <p className="leading-4.4 mt-1 text-sm text-[#A0A0A0]">
                    {isEditMode
                        ? `Если документ обновился, загрузите свежую версию. ${helperText}`
                        : helperText}
                </p>
            </div>
        </div>
    );
};

export default DocumentUploadCard;
