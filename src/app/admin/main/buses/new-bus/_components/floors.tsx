import React from 'react';

interface FloorsProps {
    selected: 'first' | 'second' | 'third' | null;
    onSelect: (floor: 'first' | 'second' | 'third') => void;
}

const Floors: React.FC<FloorsProps> = ({ selected, onSelect }) => {
    return (
        <div className="flex flex-row gap-2">
            <button
                type='button'
                className={`w-full px-[26px] flex flex-row justify-center text-base font-medium gap-[10px] items-center py-3 border rounded-[10px] ${
                    selected === 'first'
                        ? 'bg-[#E74949] border-none text-white'
                        : 'bg-white text-[#4A4A4A] border border-[#A0A0A0] hover:bg-[#F16363] hover:border-[#F16363] hover:text-white'
                }`}
                onClick={() => onSelect('first')}
            >
                1
            </button>
            <button
                type='button'
                className={`w-full px-[26px] flex flex-row justify-center text-base font-medium gap-[10px] items-center py-3 border rounded-[10px] ${
                    selected === 'second'
                        ? 'bg-[#E74949] border-none text-white'
                        : 'bg-white text-[#4A4A4A] border border-[#A0A0A0] hover:bg-[#F16363] hover:border-[#F16363] hover:text-white'
                }`}
                onClick={() => onSelect('second')}
            >
                2
            </button>
            <button
                type='button'
                className={`w-full px-[26px] flex flex-row justify-center text-base font-medium gap-[10px] items-center py-3 border rounded-[10px] ${
                    selected === 'third'
                        ? 'bg-[#E74949] border-none text-white'
                        : 'bg-white text-[#4A4A4A] border border-[#A0A0A0] hover:bg-[#F16363] hover:border-[#F16363] hover:text-white'
                }`}
                onClick={() => onSelect('third')}
            >
                3
            </button>
        </div>
    );
};

export default Floors;
