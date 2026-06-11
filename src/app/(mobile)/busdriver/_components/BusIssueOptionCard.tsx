import { cn } from '@/utils/cn';
import type { BusIssueOption } from '../_types/bus-driver';
import { IssueIcon } from './BusDriverIcons';

const severityMeta: Record<
    BusIssueOption['severity'],
    { label: string; className: string }
> = {
    normal: {
        label: 'Рабочая',
        className: 'border border-[#E9E9E9] bg-[#F8F8F8] text-[#4A4A4A]',
    },
    warning: {
        label: 'Важно',
        className: 'border border-[#F3CDCD] bg-[#FFF2F2] text-[#E74949]',
    },
    urgent: {
        label: 'Срочно',
        className: 'bg-[#E23333] text-white',
    },
};

type Props = {
    option: BusIssueOption;
};

const BusIssueOptionCard = ({ option }: Props) => {
    const severity = severityMeta[option.severity];

    return (
        <div className="rounded-[0.625rem] border border-[#D1D1D1] bg-white p-5">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <IssueIcon color="#E74949" />
                        <p className="leading-4.4 text-base font-semibold text-[#4A4A4A]">
                            {option.title}
                        </p>
                    </div>
                    <p className="mt-3 text-sm text-[#A0A0A0]">
                        {option.description}
                    </p>
                </div>
                <span
                    className={cn(
                        'leading-3.3 shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold',
                        severity.className
                    )}
                >
                    {severity.label}
                </span>
            </div>

            <div className="mt-4 rounded-[0.625rem] bg-[#F8F8F8] px-4 py-3 text-sm font-medium text-[#4A4A4A]">
                {option.helperText}
            </div>
        </div>
    );
};

export default BusIssueOptionCard;
