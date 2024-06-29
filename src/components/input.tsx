import clsx from 'clsx';
import React, { forwardRef } from 'react';
import Calendar from '../../public/assets/calendar';

type Props = React.HTMLProps<HTMLInputElement> & {
    label?: string;
    iconRight?: React.ReactNode;
};

const Input = forwardRef<HTMLInputElement, Props>((props, ref) => {
    const { id, label, className, iconRight, ...rest } = props;

    return (
        <div className="flex flex-col gap-1">
            {label && (
                <label
                    htmlFor={id}
                >
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    ref={ref}
                    id={id}
                    {...rest}
                    className={clsx(
                        'placeholder:focus:block placeholder:focus:translate-y-[-1.30rem] placeholder:focus:text-xs placeholder:focus:font-bold placeholder:focus:uppercase placeholder:focus:duration-75 placeholder:focus:ease-in-out ',
                        'w-full flex flex-row items-center px-5 py-6 gap-4 text-base font-medium border border-solid focus:border-solid focus:border-[#AAAAAA] focus:outline-none border-[#AAAAAA] rounded-xl bg-white',
                    )}
                />
                

                {iconRight && (
                    <>
                        {iconRight}
                    </>
                )}
            </div>
        </div>
    );
});

Input.displayName = 'Input';
export default Input;

<style jsx>{`
    input::placeholder {
        font-size: 1rem; // Размер placeholder по умолчанию
        transition: font-size 0.2s, transform 0.2s;
    }

    input:focus::placeholder {
        font-size: 0.75rem; // Уменьшаем размер placeholder при фокусировке
        transform: translateY(-1.30rem); // Поднимаем placeholder при фокусировке
    }
`}</style>

// absolute  top-6 left-5 focus:ease-in-out focus:translate-y-[-1.30rem] focus:duration-75