import React from 'react';
import clsx from 'clsx';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary' | 'ghost';
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

    return (
        <button
            disabled={disabled || loading}
            {...rest}
            className={clsx(
                'flex w-full items-center justify-center rounded-[10px] text-[18px] font-semibold leading-[19.8px]',
                className,
                {
                    'max-h-[80px] w-full bg-white px-[118px] py-[30px] text-[#FF2525] active:opacity-70':
                        variant === 'primary',
                    'max-h-[72px] w-full bg-[#E74949] px-[120px] py-[26px] text-white active:bg-[#F45A5A]':
                        variant === 'secondary',
                    'max-h-[70px] w-full border border-[#D21F1F] bg-inherit px-[120px] py-[26px] text-[#D21F1F]':
                        variant === 'ghost',
                }
            )}
            style={disabled ? { opacity: 0.5 } : {}}
        >
        </button>
    );
};

export default Button;
