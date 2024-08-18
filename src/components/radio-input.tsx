import React, { forwardRef, useState } from 'react';
import Image from 'next/image';

type Props = React.HTMLProps<HTMLInputElement> & {
    label: React.ReactNode;
};

const RadioInput = forwardRef<HTMLInputElement, Props>((props, ref) => {
    const { name, checked, label, ...rest } = props;

    return (
        <div className="flex w-full flex-col items-center gap-2">
            <label className="flex w-full flex-row items-center gap-4 rounded-xl border border-solid border-[#D1D1D1] bg-white p-5 text-base font-medium text-[var(--black)]">
                {checked ? (
                    <Image
                        src="/radio-pointed.svg"
                        width={20}
                        height={20}
                        alt="Avatar"
                        className="h-5 w-5 rounded-full object-cover"
                    />
                ) : (
                    <Image
                        src="/radio-empty.svg"
                        width={20}
                        height={20}
                        alt="Avatar"
                        className="h-5 w-5 rounded-full object-cover"
                    />
                )}
                <input
                    type="radio"
                    className="hidden"
                    name={name}
                    ref={ref}
                    {...rest}
                />
                {label}
            </label>
        </div>
    );
});

RadioInput.displayName = 'Radio';

export default RadioInput;
