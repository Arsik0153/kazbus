'use client';
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
        <div className="flex h-full max-h-[52px] w-full max-w-[171px] flex-row items-center justify-between rounded-[10px] border border-[#A0A0A0] p-3">
            <button onClick={increment}>
                <Plus color="#E74949" width={28} height={28} />
            </button>
            <span className="text-2xl">{value}</span>
            <button onClick={decrement}>
                <Minus />
            </button>
        </div>
    );
};

export default Counter;
