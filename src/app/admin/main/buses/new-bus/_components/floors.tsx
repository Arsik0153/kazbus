import React from 'react';

type FloorsProps = {
    selected: 1 | 2 | 3 | null;
    onSelect: (floor: 1 | 2 | 3) => void;
};

const Floors: React.FC<FloorsProps> = ({ selected, onSelect }) => {
    return (
        <div className="flex flex-row gap-2">
            <button
                type="button"
                className={`w-full px-[26px] flex flex-row justify-center text-base font-medium gap-[10px] items-center py-3 border rounded-[10px] ${
                    selected === 1
                        ? 'bg-[#E74949] border-none text-white'
                        : 'bg-white text-[#4A4A4A] border border-[#A0A0A0] hover:bg-[#F16363] hover:border-[#F16363] hover:text-white'
                }`}
                onClick={() => onSelect(1)}
            >
                1
            </button>
            <button
                type="button"
                className={`w-full px-[26px] flex flex-row justify-center text-base font-medium gap-[10px] items-center py-3 border rounded-[10px] ${
                    selected === 2
                        ? 'bg-[#E74949] border-none text-white'
                        : 'bg-white text-[#4A4A4A] border border-[#A0A0A0] hover:bg-[#F16363] hover:border-[#F16363] hover:text-white'
                }`}
                onClick={() => onSelect(2)}
            >
                2
            </button>
            <button
                type="button"
                className={`w-full px-[26px] flex flex-row justify-center text-base font-medium gap-[10px] items-center py-3 border rounded-[10px] ${
                    selected === 3
                        ? 'bg-[#E74949] border-none text-white'
                        : 'bg-white text-[#4A4A4A] border border-[#A0A0A0] hover:bg-[#F16363] hover:border-[#F16363] hover:text-white'
                }`}
                onClick={() => onSelect(3)}
            >
                3
            </button>
        </div>
    );
};

export default Floors;
