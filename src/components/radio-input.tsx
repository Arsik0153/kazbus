import React, { useState } from 'react';
import Image from 'next/image';

type RadioProps = {
    name: string;
    items: { value: string; label: string }[];
    value: string | null;
    onChange: (value: string) => void;
};

export default function Radio({ name, items, value, onChange }: RadioProps) {
    return (
        <div className="flex w-full flex-col items-center gap-2">
            {items.map((item) => (
                <label
                    key={item.value}
                    className="flex w-full flex-row items-center gap-4 rounded-xl border border-solid border-[#D1D1D1] bg-white p-5 text-base font-medium text-[var(--black)]"
                    htmlFor={name + item.value}
                >
                    {value === item.value ? (
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
                        value={item.value}
                        id={name + item.value}
                        checked={value === item.value}
                        onChange={(e) => onChange(e.target.value)}
                    />{' '}
                    {item.label}
                </label>
            ))}
        </div>
    );
}

// how to use
//'use client';

// import React, { useState } from 'react';
// import RadioInput from '@/components/radio-input';

// export default function Home() {
//     const items: { value: string, label: string }[] = [
//         { value: 'udo', label: 'Удостоверение личности' },
//         { value: 'pasport', label: 'Пасспорт' },
//         { value: 'svid', label: 'Свидетельство о рождении' },

//     ]
//     const [value, setValue] = useState<string | null>(null);

//     return (
//         <main className="flex min-h-screen flex-col items-center bg-sky-500/100 p-10">
//             <div className="flex flex-col gap-2 ">
//                 <RadioInput
//                     name='gender'
//                     items={items}
//                     value={value}
//                     onChange={setValue}
//                 />
//             </div>
//         </main>
//     );
// }
