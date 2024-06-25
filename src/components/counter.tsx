'use client'
import { useState } from 'react';
import Plus from '../../public/assets/plus';
import Minus from '../../public/assets/minus';

const Counter = () => {
    const [count, setCount] = useState(0);

    const increment = () => {
        setCount(count + 1);
    };

    const decrement = () => {
        if (count > 0) {
            setCount(count - 1);
        }
    };

    return (
        <div className="flex flex-row items-center border border-[#A0A0A0] 
            rounded-[10px] max-w-[171px] max-h-[52px] justify-between h-full w-full p-3 
            ">
            <button
                onClick={increment}
            >
                <Plus />
            </button>
            <span className="text-2xl">{count}</span>

            <button
                onClick={decrement}
            >   
                <Minus />
            </button>


        </div>
    );
};

export default Counter;
