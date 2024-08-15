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
                'flex w-full items-center justify-center rounded-[10px] px-2 py-6 text-[18px] font-semibold leading-[19.8px]',
                className,
                {
                    'max-h-[80px] w-full border bg-white text-[#FF2525] active:opacity-70':
                        variant === 'primary',
                    'max-h-[72px] w-full bg-[#E74949] hover:bg-[#F16363] text-white active:bg-[#F45A5A]':
                        variant === 'secondary',
                    'max-h-[70px] w-full border border-[#D21F1F] bg-inherit text-[#E74949]':
                        variant === 'ghost',
                    'max-h-[40px] border py-3 px-[46px] hover:bg-[#F16363] bg-[#E32B2B] text-white':
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
