import React from 'react';
import clsx from 'clsx';
import Spinner from './spinner';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary' | 'ghost' | 'ultrared';
    loading?: boolean;
    childrent?: React.ReactNode;
};

const Button = (props: Props) => {
    const {
        variant = 'primary',
        loading,
        className,
        disabled,
        children,
        ...rest
    } = props;

    return (
        <button
            disabled={disabled || loading}
            {...rest}
            className={clsx(
                'flex w-full items-center justify-center rounded-[0.625rem] px-2 py-5 text-sm leading-[1.2375rem] xs:py-4 xs:text-lg',
                className,
                {
                    'max-h-20 w-full border bg-white font-bold text-[#FF2525] active:opacity-70':
                        variant === 'primary',
                    'max-h-18 w-full border border-white bg-[#E23333] font-semibold text-white hover:bg-[#F16363] active:bg-[#F45A5A]':
                        variant === 'secondary',
                    'max-h-17.5 w-full border border-[#D21F1F] bg-inherit font-semibold text-[#E23333]':
                        variant === 'ghost',
                    'px-11.5 max-h-10 border bg-[#E32B2B] py-3 text-white hover:bg-[#F16363]':
                        variant === 'ultrared',
                }
            )}
            style={disabled ? { opacity: 0.5 } : {}}
        >
            {loading ? (
                <Spinner
                    size="md"
                    color={variant === 'secondary' ? '#FFF' : '#dd1919'}
                />
            ) : (
                children
            )}
        </button>
    );
};

export default Button;
