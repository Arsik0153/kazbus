'use client';
import React, { useState } from 'react';
import clsx from 'clsx';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary' | 'ghost' | 'choise';
    loading?: boolean;
};

const Button = (props: Props) => {
    const {
        variant = 'primary',
        loading,
        className,
        disabled,
        ...rest
    } = props;

    const [isActive, setIsActive] = useState(false);

    const handleClick = () => {
        if (variant === 'choise') {
            setIsActive(!isActive);
        }
    };

    return (
        <button
            disabled={disabled || loading}
            {...rest}
            onClick={handleClick}
            className={clsx(
                'flex items-center justify-center rounded-[10px] px-2 py-6 text-[18px] font-semibold leading-[19.8px]',
                className,
                {
                    'max-h-[80px] w-full bg-white text-[#FF2525] active:opacity-70':
                        variant === 'primary',
                    'max-h-[72px] w-full bg-[#E74949] text-white active:bg-[#F45A5A]':
                        variant === 'secondary',
                    'max-h-[70px] w-full border border-[#D21F1F] bg-inherit text-[#E74949]':
                        variant === 'ghost',
                    'rounded-full border px-5 py-[5px] text-sm font-semibold': 
                        variant === 'choise',
                    'border-[#A0A0A0] text-[#A0A0A0]': 
                        variant === 'choise' && !isActive,
                    'border-[#E74949] text-[#E74949]': 
                        variant === 'choise' && isActive,
                }
            )}
            style={disabled ? { opacity: 0.5 } : {}}
        ></button>
    );
};

export default Button;
