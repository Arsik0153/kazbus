import React from 'react';
import clsx from 'clsx';
import { useMask } from '@react-input/mask';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    label: React.ReactNode;
    iconLeft?: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'ghost';
    loading?: boolean;
    mask?: string;
    placeholder?: string;
};

const Input: React.FC<InputProps> = ({
    id,
    label,
    iconLeft,
    className,
    placeholder = '+7 (___) ___ - __ - __',
    variant = 'primary', // Дефолтное значение
    loading,
    mask = '+7 (___) ___ - __ - __', // Дефолтное значение
    ...rest
}) => {
    const inputRef = useMask({
        mask: mask,
        replacement: { _: /\d/ },
    });

    return (
        <div
            className={clsx(
                'relative w-full rounded-[10px] border border-solid pb-[27px] pt-[27px]',
                {
                    'bg-[#ffffff]': variant === 'primary',
                    'bg-none': variant === 'secondary',
                    'border-[#AAAAAA] bg-[#FFFFFF29]': variant === 'ghost',
                }
            )}
        >
            {iconLeft && (
                <div className="absolute left-5 top-1/2 origin-top-left -translate-y-1/2 transform">
                    {iconLeft}
                </div>
            )}
            <input
                id={id}
                ref={inputRef} // Применяем реф для маски
                className={clsx(
                    'hide-tabbar w-full pr-8 font-medium text-[var(--black)] outline-none',
                    {
                        'pl-14': iconLeft,
                        'pl-8': !iconLeft,
                        'opacity-50': loading,
                    },
                    {
                        'text-[var(--black)]': variant === 'primary',
                        'bg-none': variant === 'secondary',
                        'text-white': variant === 'ghost',
                    }
                )}
                placeholder={placeholder || ''}
                disabled={loading}
                {...rest}
            />
        </div>
    );
};
// how to use:
{
    /* 
    
    <InputPhone
    id="phone"
    label="None label here"
    placeholder="+7 (___) ___ - __ - __"
    mask="+7 (___) ___-__-__"
    iconLeft={<Image
        src={'/assets/main/kz.png'}
        width={24}
        height={26}
        alt="KZ"
    />}
/> 

*/
}
export default Input;
