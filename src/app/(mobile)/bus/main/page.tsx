import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import React, { Suspense } from 'react';
import MainPage from './main';

const Main = async () => {
    const session = await getSession();
    if (!session) {
        redirect('/start');
    }
    return (
        <Suspense>
            <MainPage />
        </Suspense>
    );
};

export default Main;
