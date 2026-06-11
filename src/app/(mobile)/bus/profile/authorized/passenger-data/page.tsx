'use client';
import React from 'react';
import PassengerDataCard from '@/components/passenger-data-card';
import Topbar from '@/components/topbar';
import { useServerActionQuery } from '@/lib/server-action-hooks';
import { getMyPassengersAction } from '@/app/(mobile)/bus/main/tickets/actions';
import PassengerCard from '@/components/passenger-card';
import Spinner from '@/components/spinner';

const PassengerDataPage = () => {
    const { data: passengers, isPending: isPassengersPending } =
        useServerActionQuery(getMyPassengersAction, {
            input: undefined,
            queryKey: ['passengers'],
        });

    if (isPassengersPending) {
        return (
            <>
                <Topbar backHref="/bus/profile">
                    <div className="flex flex-col items-center">
                        Данные моих пассажиров
                    </div>
                </Topbar>
                <div className="mt-[42px] flex flex-col px-5">
                    <div className="flex justify-center gap-3 py-5">
                        <Spinner size="md" />
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Topbar backHref="/bus/profile">Данные моих пассажиров</Topbar>
            <div className="my-6 grid gap-4 px-5">
                {passengers?.length !== 0 &&
                    passengers?.map((selectedUser) => (
                        <PassengerCard
                            key={selectedUser.user_id}
                            user={selectedUser}
                        />
                    ))}
            </div>
        </>
    );
};

export default PassengerDataPage;
