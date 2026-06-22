'use client';
import React, { forwardRef } from 'react';
import clsx from 'clsx';
import { useMask } from '@react-input/mask';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    label: React.ReactNode;
    iconLeft?: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'ghost' | 'ghostOTP';
    loading?: boolean;
    mask?: string;
    placeholder?: string;
};

const InputPhone = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            id,
            label,
            iconLeft,
            className,
            placeholder = '+7 (___) ___ - __ - __',
            variant = 'primary',
            loading,
            mask = '+7 (___) ___ - __ - __',
            ...rest
        },
        ref
    ) => {
        const inputRef = useMask({
            mask: mask,
            replacement: { _: /\d/ },
        });

        // Combine the refs
        const combinedRef = (node: HTMLInputElement) => {
            if (typeof ref === 'function') {
                ref(node);
            } else if (ref) {
                ref.current = node;
            }
            inputRef.current = node;
        };

        return (
            <div
                className={clsx(
                    'relative w-full rounded-[10px] border border-solid border-black/60',
                    {
                        'bg-[#ffffff] py-5': variant === 'primary',
                        'bg-none py-5': variant === 'secondary',
                        'py-6.75 border-[#D1D1D1] bg-white/15':
                            variant === 'ghost',
                        'border-[#D1D1D1] bg-white/15 py-5':
                            variant === 'ghostOTP',
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
                    ref={combinedRef}
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
                            'bg-transparent text-white placeholder:text-white':
                                variant === 'ghost',
                            'bg-transparent text-center text-7xl font-semibold text-white placeholder:text-white':
                                variant === 'ghostOTP',
                        }
                    )}
                    placeholder={placeholder || ''}
                    disabled={loading}
                    {...rest}
                />
            </div>
        );
    }
);

InputPhone.displayName = 'InputPhone';

export default InputPhone;
