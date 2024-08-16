import React, { forwardRef } from 'react';
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
                            'text-white': variant === 'ghost',
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
