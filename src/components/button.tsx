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
                'xs:py-6 xs:text-[18px] flex w-full items-center justify-center rounded-[10px] px-2 py-5 text-[14px] leading-[19.8px]',
                className,
                {
                    'max-h-[80px] w-full border bg-white font-bold text-[#FF2525] active:opacity-70':
                        variant === 'primary',
                    'max-h-[72px] w-full bg-[#E23333] font-semibold text-white hover:bg-[#F16363] active:bg-[#F45A5A]':
                        variant === 'secondary',
                    'max-h-[70px] w-full border border-[#D21F1F] bg-inherit font-semibold text-[#E23333]':
                        variant === 'ghost',
                    'max-h-[40px] border bg-[#E32B2B] px-[46px] py-3 text-white hover:bg-[#F16363]':
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
