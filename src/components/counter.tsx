'use client'
import { useState } from 'react';
import Plus from '../assets/plus';
import Minus from '../assets/minus';

interface CounterProps {
    value: number;
    setValue: (value: number) => void;
}

const Counter: React.FC<CounterProps> = ({ value, setValue }) => {
    const increment = () => {
        setValue(value + 1);
    };

    const decrement = () => {
        if (value > 0) {
            setValue(value - 1);
        }
    };

    return (
        <div className="flex flex-row items-center border border-[#A0A0A0] 
            rounded-[10px] max-w-[171px] max-h-[52px] justify-between h-full w-full p-3 
            ">
            <button
                onClick={decrement}
            >
                <Minus />
            </button>
            <span className="text-2xl">{value}</span>
            <button
                onClick={increment}
            >   
                <Plus color="#E74949" width={28} height={28} />
            </button>
        </div>
    );
};

export default Counter;
