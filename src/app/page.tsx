import React from 'react';
import FullPageSelector from '@/components/fullpageselector';
import ArrowRightIcon from '../../public/assets/arrow-right-icon';
import Counter from '@/components/counter';
import Trip from '@/components/trip';
export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between bg-sky-500/100 p-10">
            <FullPageSelector
                icon={<ArrowRightIcon />}
                text={'Откуда вы направляетесь?'}
            />
            <Counter/>
            <Trip/>
        </main>
    );
}
