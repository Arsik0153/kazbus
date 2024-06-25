import React, { forwardRef, useState } from 'react';
import clsx from 'clsx';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    iconRight?: React.ReactNode;
};

const Input = forwardRef<HTMLInputElement, Props>((props, ref) => {
    const { id, label, className, iconRight, ...rest } = props;
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    return (
        <div className="flex flex-col gap-1 relative">
            {label && (
                <label
                    htmlFor={id}
                    className={clsx(
                        'absolute left-0 transition-all duration-300 ease-in-out',
                        isFocused ? 'top-0 text-blue-500 text-sm' : 'top-2 text-gray-500 text-base'
                    )}
                >
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    ref={ref}
                    id={id}
                    {...rest}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    className={clsx(
                        'w-full flex flex-row items-center p-5 gap-4 text-base font-medium border border-solid focus:border-none focus:outline-none border-[#AAAAAA] rounded-xl bg-white',
                        iconRight && 'pr-16',
                        className
                    )}
                />
                {iconRight && <div className="absolute right-4 top-1/2 transform -translate-y-1/2">{iconRight}</div>}
            </div>
        </div>
    );
});

Input.displayName = 'Input';
export default Input;
