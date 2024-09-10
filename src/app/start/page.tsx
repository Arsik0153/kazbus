import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import React, { Suspense } from 'react';
import Start from './start';

const StartPage = async () => {
    const session = await getSession();
    if (session) {
        redirect('/main?passenger_count=1');
    }

    return (
        <Suspense>
            <Start />
        </Suspense>
    );
};

export default StartPage;
