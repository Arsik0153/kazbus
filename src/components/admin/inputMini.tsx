import React, { forwardRef } from 'react';
import clsx from 'clsx';

type Props = React.HTMLProps<HTMLInputElement> & {
    iconLeft?: React.ReactNode;
    loading?: boolean;
};

const InputMini = forwardRef<HTMLInputElement, Props>((props, ref) => {
    const {
        id,
        iconLeft,
        className,
        placeholder,
        loading,
        ...rest
    } = props;

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        // Проверяем, является ли введенный символ цифрой
        if (!/[0-9]/.test(event.key)) {
            event.preventDefault();
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value.replace(/[₸\s]/g, ''); // Убираем предыдущие символы "₸" и пробелы
        event.target.value = ` ${value}`;
    };
    // ₸
    return (
        <div className='relative max-w-none items-center'>
            {iconLeft && (
                <div className="absolute left-2 top-1/2 origin-top-left -translate-y-1/2 transform">
                    {iconLeft}
                </div>
            )}
            <input
                id={id}
                ref={ref}
                className={clsx('focus:outline-none border border-[#A0A0A0] rounded-[10px] p-2 text-base font-medium text-[#4A4A4A]',
                    {
                        'pl-8': iconLeft,
                        'pl-5': !iconLeft,
                    },
                    className)}
                placeholder={placeholder || ' '}
                disabled={loading}
                autoComplete="off"
                onKeyPress={handleKeyPress}
                onChange={handleChange}
                {...rest}
            />
        </div>
    );
});

InputMini.displayName = 'InputMini';

export default InputMini;

// <InputMini
//     id="AdminPassword"
//     placeholder='Цена'
//     className=' max-w-40 bg-[#EEF2F6]'
//     iconLeft={< Ticket color="#000000" />}
// />