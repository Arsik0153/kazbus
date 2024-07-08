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
                'flex w-full items-center justify-center rounded-[10px] px-2 py-6 text-[18px] font-semibold leading-[19.8px]',
                className,
                {
                    'max-h-[80px] w-full bg-white text-[#FF2525] active:opacity-70':
                        variant === 'primary',
                    'max-h-[72px] w-full bg-[#E74949] text-white active:bg-[#F45A5A]':
                        variant === 'secondary',
                    'max-h-[70px] w-full border border-[#D21F1F] bg-inherit text-[#D21F1F]':
                        variant === 'ghost',
                }
            )}
            style={disabled ? { opacity: 0.5 } : {}}
        ></button>
    );
};

export default Button;
