import React from 'react';
import Link from 'next/link';

type InputProps = React.HTMLProps<HTMLInputElement> & {
    iconLeft?: React.ReactNode;
    label: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value?: string;
};

const StyledInput: React.FC<InputProps> = (props) => {
    const { iconLeft, label, className, onChange, value, ...rest } = props;

    return (
        <div className="xs:py-[30px] relative flex max-h-[72px] w-full flex-row items-center gap-4 rounded-[10px] border border-[#D1D1D1] bg-[#FFFFFF29] px-[20px] py-[21px]">
            {iconLeft && (
                <div className="absolute left-5 z-10 top-1/2 -translate-y-1/2 transform">
                    {iconLeft}
                </div>
            )}
            <input
                type="text"
                placeholder={label}
                className={`xs:text-base flex-grow bg-transparent pl-10 text-left text-[14px] font-medium leading-[17.6px] text-white placeholder-white outline-none ${className}`}
                onChange={onChange}
                value={value}
                autoComplete="off"
                {...rest}
            />
        </div>
    );
};

export default StyledInput;
