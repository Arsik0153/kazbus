import React from 'react'
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
                'rounded-[10px] flex font-semibold w-full text-[18px] leading-[19.8px] items-center justify-center',
                className,
                {
                    'bg-white text-[#FF2525] px-[118px] py-[30px] max-w-[351px] max-h-[80px] active:opacity-70':  
                        variant === 'primary',
                    'bg-[#DD1919] text-white px-[120px] py-[26px] max-w-[353px] max-h-[72px] active:bg-[#F45A5A]':
                        variant === 'secondary',
                    'bg-inherit border border-[#D21F1F] text-[#D21F1F] px-[120px] py-[26px] max-w-[353px] max-h-[70px]':
                        variant === 'ghost',
                }
            )}
            style={disabled ? { opacity: 0.5 } : {}}
        >
            емеля
        </button>
    )
}

export default Button;