import React from 'react';

type InputProps = React.HTMLProps<HTMLInputElement> & {
    iconLeft?: React.ReactNode;
    label: string;
};

const StyledInput: React.FC<InputProps> = (props) => {
    const { iconLeft, label, className, ...rest } = props;

    return (
        <div className="relative flex max-h-[80px] w-full flex-row items-center gap-4 rounded-[10px] border border-[#AAAAAA] bg-[#FFFFFF29] px-[20px] py-[30px]">
            {iconLeft && (
                <div className="absolute left-5 top-1/2 transform -translate-y-1/2">
                    {iconLeft}
                </div>
            )}
            <input
                type="text"
                placeholder={label}
                className={`flex-grow pl-10 bg-transparent text-left text-[18px] font-medium leading-[17.6px] text-white outline-none placeholder-white ${className}`}
                {...rest}
            />
        </div>
    );
};

export default StyledInput;
