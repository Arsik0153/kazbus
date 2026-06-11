'use client';

import { cn } from '@/utils/cn';
import type { ShipperVehicleTypeOption } from '../_types/shipper';

type Props = {
    option: ShipperVehicleTypeOption;
    isSelected: boolean;
    onSelect: (value: ShipperVehicleTypeOption['type']) => void;
};

const VehicleTypeCard = ({ option, isSelected, onSelect }: Props) => {
    return (
        <button
            type="button"
            className={cn(
                'rounded-[0.625rem] border p-4 text-left transition-colors',
                {
                    'border-[#E74949] bg-[#FFF2F2]': isSelected,
                    'border-[#D1D1D1] bg-white active:bg-[#F8F8F8]':
                        !isSelected,
                }
            )}
            onClick={() => onSelect(option.type)}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="leading-4.4 text-base font-semibold text-[#4A4A4A]">
                        {option.label}
                    </p>
                    <p className="leading-4.4 mt-1 text-sm text-[#A0A0A0]">
                        {option.description}
                    </p>
                </div>
                <span
                    className={cn(
                        'shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold',
                        {
                            'bg-[#E23333] text-white': isSelected,
                            'border border-[#D1D1D1] bg-[#F8F8F8] text-[#A0A0A0]':
                                !isSelected,
                        }
                    )}
                >
                    {option.highlight}
                </span>
            </div>
        </button>
    );
};

export default VehicleTypeCard;
