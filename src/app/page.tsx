'use client';

import React, { useState } from 'react';

import FullPageSelector from '@/components/fullpageselector';
import ArrowRightIcon from '../../public/assets/arrow-right-icon';
import Counter from '@/components/counter';
import Trip from '@/components/trip';
export default function Home() {
    const items: { value: string, label: string }[] = [
        { value: 'udo', label: 'Удостоверение личности' },
        { value: 'pasport', label: 'Пасспорт' },
        { value: 'svid', label: 'Свидетельство о рождении' },

    ]
    const [value, setValue] = useState<string | null>(null);

    return (
        <main className="flex min-h-screen flex-col items-center bg-sky-500/100 p-10">
            <FullPageSelector
                icon={<ArrowRightIcon />}
                text={'Откуда вы направляетесь?'}
            />
            <Counter/>
            <Trip/>
        </main>
    );
}

// // pages/index.js
// "use Client";
// import React, { useState } from 'react';
// import DynamicRadioButtons from '@/components/radio-input';

// const options = [
//   { label: 'Option 1', value: 'option1' },
//   { label: 'Option 2', value: 'option2' },
//   { label: 'Option 3', value: 'option3' },
// ];

// const Home = () => {
//   const [selectedOption, setSelectedOption] = useState(null);

//   const handleOptionSelect = (value) => {
//     setSelectedOption(value);
//   };

//   return (
//     <div>
//       <h1>Dynamic Radio Buttons Example</h1>
//       <DynamicRadioButtons options={options} onSelect={handleOptionSelect} />
//       <p>Selected option: {selectedOption}</p>
//     </div>
//   );
// };

// export default Home;