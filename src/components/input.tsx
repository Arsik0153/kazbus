import React, { forwardRef } from 'react';
import clsx from 'clsx';
import { cn } from '@/utils/cn';

type Props = React.HTMLProps<HTMLInputElement> & {
    label: React.ReactNode;
    iconLeft?: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'ghost' | 'nonPlaceholder';
    loading?: boolean;
    hideKeyboardOnFocus?: boolean;
    containerClassName?: string;
};

const Input = forwardRef<HTMLInputElement, Props>((props, ref) => {
    const {
        id,
        label,
        iconLeft,
        className,
        containerClassName,
        placeholder,
        variant = 'primary',
        loading,
        hideKeyboardOnFocus = true,
        ...rest
    } = props;

    return (
        <div
            className={cn(
                ' relative w-full rounded-[10px] border border-black/60 border-solid ',
                {
                    'bg-[#ffffff]': variant === 'primary',
                    'bg-none': variant === 'secondary',
                    'border-[#D1D1D1] bg-white/15': variant === 'ghost',
                },
                containerClassName
            )}
        >
            {iconLeft && (
                <div className="absolute left-5 top-1/2 origin-top-left -translate-y-1/2 transform">
                    {iconLeft}
                </div>
            )}
            <input
                id={id}
                className={cn(
                    `${hideKeyboardOnFocus ? 'hide-tabbar' : ''} peer xs:pb-4 xs:pt-5 pb-2.5 pt-6 w-full bg-transparent pr-8 font-medium text-[var(--black)] placeholder-transparent outline-none transition-all duration-200`,
                    {
                        'pl-14': iconLeft,
                        'pl-8': !iconLeft,
                        'opacity-50': loading,
                    },
                    {
                        'text-[var(--black)]': variant === 'primary',
                        'bg-none': variant === 'secondary',
                        'text-white peer-focus:text-white peer-[:not(:placeholder-shown)]:text-white':
                            variant === 'ghost',
                        'text-xl text-white peer-focus:text-white peer-[:not(:placeholder-shown)]:text-white':
                            variant === 'nonPlaceholder',
                    }
                )}
                placeholder={placeholder || ' '}
                disabled={loading}
                autoComplete="off"
                ref={ref}
                {...rest}
            />
            <label
                htmlFor={id}
                className={clsx(
                    'xs:text-base pointer-events-none absolute top-1/2 origin-top-left -translate-y-1/2 transform text-[14px] font-medium transition-all duration-200 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-bold peer-focus:text-[#A0A0A0] peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:scale-75 peer-[:not(:placeholder-shown)]:font-bold peer-[:not(:placeholder-shown)]:text-[#A0A0A0]',
                    {
                        'left-14': iconLeft,
                        'left-8': !iconLeft,
                    },
                    {
                        'text-[var(--black)]': variant === 'primary',
                        'bg-none': variant === 'secondary',
                        'text-white peer-focus:text-[rgba(255,255,255,0.8)] peer-[:not(:placeholder-shown)]:text-[rgba(255,255,255,0.8)]':
                            variant === 'ghost',
                        'opacity-1 text-white peer-focus:text-[rgba(255,255,255,0.8)] peer-[:not(:placeholder-shown)]:text-[rgba(255,255,255,0.8)]':
                            variant === 'nonPlaceholder',
                    }
                )}
            >
                {label}
            </label>
        </div>
    );
});

Input.displayName = 'Input';

export default Input;

// <Input
//     label='Введите ваш пароль'
//     id="AdminPassword"
//     iconLeft = {< Calendar color = "#E74949" />}
//     {...register('birth_date') }
// />
