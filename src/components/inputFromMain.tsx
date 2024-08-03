import React from 'react';

type InputProps = React.HTMLProps<HTMLInputElement> & {
    iconLeft?: React.ReactNode;
    label: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value?: string;
};

const StyledInput: React.FC<InputProps> = (props) => {
    const { iconLeft, label, className, onChange, value, ...rest } = props;

    return (
        <div className="relative flex max-h-[80px] w-full flex-row items-center gap-4 rounded-[10px] border border-[#AAAAAA] bg-[#FFFFFF29] px-[20px] py-[30px]">
            {iconLeft && (
                <div className="absolute left-5 top-1/2 -translate-y-1/2 transform">
                    {iconLeft}
                </div>
            )}
            <input
                type="text"
                placeholder={label}
                className={`flex-grow bg-transparent pl-10 text-left text-base font-medium leading-[17.6px] text-white placeholder-white outline-none ${className}`}
                onChange={onChange}
                value={value}
                autoComplete="off"
                {...rest}
            />
        </div>
    );
};

export default StyledInput;
