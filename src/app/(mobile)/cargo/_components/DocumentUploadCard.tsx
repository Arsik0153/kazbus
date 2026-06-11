import Upload from '@/assets/admin/Upload';
import Input from '@/components/input';

type Props = {
    id: string;
    title: string;
    description: string;
    ownerLabel: string;
    numberLabel: string;
    expiryLabel: string;
    helperText: string;
};

const DocumentUploadCard = ({
    id,
    title,
    description,
    ownerLabel,
    numberLabel,
    expiryLabel,
    helperText,
}: Props) => {
    return (
        <div className="rounded-[0.625rem] border border-[#D1D1D1] bg-white p-5">
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
                <div className="shrink-0 rounded-full border border-[#F3CDCD] bg-[#FFF2F2] px-3 py-1.5 text-xs font-semibold text-[#E74949]">
                    Обязательный
                </div>
            </div>

            <div className="mt-4 rounded-[0.625rem] bg-[#F8F8F8] p-3">
                <p className="text-xs font-medium text-[#A0A0A0]">Для кого</p>
                <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                    {ownerLabel}
                </p>
            </div>

            <div className="mt-4 flex flex-col gap-2">
                <Input
                    id={`${id}-number`}
                    label={numberLabel}
                    placeholder={numberLabel}
                />
                <Input
                    id={`${id}-expiry`}
                    label={expiryLabel}
                    placeholder={expiryLabel}
                />
            </div>

            <div className="bg-linear-[180deg,#FFF7F7_0%,#FFFFFF_100%] mt-4 rounded-[0.625rem] border border-dashed border-[#E7B0B0] p-4">
                <p className="text-sm font-semibold text-[#E74949]">
                    Загрузка файла
                </p>
                <p className="leading-4.4 mt-1 text-sm text-[#A0A0A0]">
                    {helperText}
                </p>
            </div>
        </div>
    );
};

export default DocumentUploadCard;
