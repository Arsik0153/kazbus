import React, { useRef, ChangeEvent, KeyboardEvent } from 'react';

interface OTPInputProps {
    length?: number;
    onChange: (otp: string[]) => void;
}

const OTPInput: React.FC<OTPInputProps> = ({ length = 4, onChange }) => {
    const inputs = useRef<(HTMLInputElement | null)[]>(
        Array(length).fill(null)
    );
    const [otp, setOtp] = React.useState<string[]>(Array(length).fill(''));

    const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value;
        if (/^\d$/.test(value) || value === '') {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            onChange(newOtp);
            if (value && index < length - 1) {
                inputs.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyDown = (
        e: KeyboardEvent<HTMLInputElement>,
        index: number
    ) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };

    return (
        <div className="flex justify-center gap-2">
            {Array.from({ length }).map((_, index) => (
                <input
                    key={index}
                    ref={(el) => {
                        // Установка рефа без возврата значения
                        inputs.current[index] = el;
                    }}
                    type="text"
                    maxLength={1}
                    className="hide-tabbar w-full rounded-[10px] border border-[#C8C8C8] py-8 text-center text-4xl font-semibold text-[#4A4A4A] focus:border-[#E74949]"
                    value={otp[index]}
                    placeholder="X"
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                />
            ))}
        </div>
    );
};

export default OTPInput;
