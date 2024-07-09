import React from 'react';

type InputProps = React.HTMLProps<HTMLInputElement> & {
    label: string;
    iconLeft?: React.ReactNode;
};

const Input: React.FC<InputProps> = (props) => {
    const { id, label, iconLeft, className, placeholder, ...rest } = props;

    return (
        <div className="relative w-full rounded-[10px] border border-solid border-[#D1D1D1] bg-white pb-[19px] pt-[35px]">
            {iconLeft && (
                <div className="absolute left-4 top-1/2 origin-top-left -translate-y-1/2 transform">
                    {iconLeft}
                </div>
            )}
            <input
                id={id}
                className={`peer w-full bg-transparent pr-8 font-medium text-[var(--black)] placeholder-transparent outline-none transition-all duration-200 ${iconLeft ? 'pl-12' : 'pl-8'} ${className}`}
                placeholder={placeholder || label}
                {...rest}
            />
            <label
                htmlFor={id}
                className={`absolute top-1/2 origin-top-left -translate-y-1/2 transform font-medium text-[var(--black)] transition-all duration-200 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-bold peer-focus:text-[#A0A0A0] peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:scale-75 peer-[:not(:placeholder-shown)]:font-bold peer-[:not(:placeholder-shown)]:text-[#A0A0A0] ${iconLeft ? 'left-12' : 'left-8'}`}
            >
                {label}
            </label>
        </div>
    );
};

export default Input;
