'use client';
import React, { InputHTMLAttributes, forwardRef } from 'react';

type CheckboxProps = Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'type' | 'onChange'
> & {
    label: React.ReactNode;
    onChange: (checked: boolean) => void;
};

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    ({ label, onChange, className, ...props }, ref) => {
        const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            onChange(event.target.checked);
        };

        return (
            <label
                className={`flex cursor-pointer gap-3 rounded-lg p-4 text-white ${className || ''}`}
            >
                <div className="relative h-8 w-8">
                    <input
                        type="checkbox"
                        ref={ref}
                        className="absolute h-full w-full cursor-pointer opacity-0"
                        onChange={handleChange}
                        {...props}
                    />
                    <div
                        className={`mt-1 flex h-8 w-8 items-center justify-center rounded-lg border-2 border-white ${
                            props.checked ? 'bg-white' : ''
                        }`}
                    >
                        {props.checked && (
                            <svg
                                className="h-6 w-6 text-red-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        )}
                    </div>
                </div>
                <span className="text-sm">{label}</span>
            </label>
        );
    }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
