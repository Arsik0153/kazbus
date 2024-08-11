import React, { useState } from 'react';
import Yes from '@/assets/admin/Yes';
import No from '@/assets/admin/No';

const YesOrNo = () => {
    const [selected, setSelected] = useState<'yes' | 'no' | null>(null);
    const [hovered, setHovered] = useState<'yes' | 'no' | null>(null);

    return (
        <div className="flex flex-row gap-2">
            <button
                type='button'
                className={`px-[26px] flex flex-row text-base font-medium gap-[10px] items-center py-4 border rounded-[10px] ${
                    selected === 'yes'
                        ? 'bg-[#E74949] border-none text-white'
                        : 'bg-white text-[#4A4A4A] border border-[#A0A0A0] hover:bg-[#F16363] hover:border-[#F16363] hover:text-white'
                }`}
                onClick={() => setSelected('yes')}
                onMouseEnter={() => setHovered('yes')}
                onMouseLeave={() => setHovered(null)}
            >
                <Yes color={hovered === 'yes' || selected === 'yes' ? '#FFFFFF' : '#4A4A4A'} /> Да
            </button>
            <button
                type='button'
                className={`px-[26px] flex flex-row text-base font-medium gap-[10px] items-center py-4 border rounded-[10px] ${
                    selected === 'no'
                        ? 'bg-[#E74949] border-none text-white'
                        : 'bg-white text-[#4A4A4A] border border-[#A0A0A0] hover:bg-[#F16363] hover:border-[#F16363] hover:text-white'
                }`}
                onClick={() => setSelected('no')}
                onMouseEnter={() => setHovered('no')}
                onMouseLeave={() => setHovered(null)}
            >
                <No color={hovered === 'no' || selected === 'no' ? '#FFFFFF' : '#4A4A4A'} /> Нет
            </button>
        </div>
    );
};

export default YesOrNo;
