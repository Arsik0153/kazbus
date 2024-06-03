

import React, { useState } from 'react'
import clsx from 'clsx';
import Image from 'next/image';

type RadioProps = {
    name: string,
    items: { value: string, label: string }[],
    value: string | null,
    onChange: (value: string) => void,
}

export default function Radio({ name, items, value, onChange }: RadioProps) {

    return (
        <div className='w-full flex flex-col items-center gap-4'>
            {items.map(item => (
                <label key={item.value} className='w-full flex flex-row items-center p-5 gap-4 text-base font-medium border border-solid border-[#AAAAAA] rounded-xl bg-white'
                    htmlFor={name + item.value}>
                    {value === item.value ? (
                        <Image
                            src="/radio-pointed.svg"
                            width={20}
                            height={20}
                            alt="Avatar"
                            className="rounded-full w-5 h-5 object-cover"
                        />
                    ) : (
                        <Image
                            src="/radio-empty.svg"
                            width={20}
                            height={20}
                            alt="Avatar"
                            className="rounded-full w-5 h-5 object-cover"
                        />
                    )}
                    <input
                        type="radio"
                        className="hidden"
                        name={name}
                        value={item.value}
                        id={name + item.value}
                        checked={value === item.value}
                        onChange={e => onChange(e.target.value)}
                    /> {item.label}</label>
            ))}
        </div>
    )
}


// how to use \/'use client';

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