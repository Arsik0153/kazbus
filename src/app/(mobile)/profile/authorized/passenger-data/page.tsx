import React from 'react';
import PassengerDataCard from '@/components/passenger-data-card';
import Topbar from '@/components/topbar';

const PassengerDataPage = () => {
    return (
        <>
            <Topbar backHref="/profile/authorized">
                Данные моих пассажиров
            </Topbar>
            <div className="my-6 grid gap-4 px-5">
                <PassengerDataCard
                    name="Купертино Стив Джобсович"
                    birth_date="12.12.2012"
                    document_number="04040595289782932"
                />
                <PassengerDataCard
                    name="Купертино Стив Джобсович"
                    birth_date="12.12.2012"
                    document_number="04040595289782932"
                />
                <PassengerDataCard
                    name="Купертино Стив Джобсович"
                    birth_date="12.12.2012"
                    document_number="04040595289782932"
                />
                <PassengerDataCard
                    name="Купертино Стив Джобсович"
                    birth_date="12.12.2012"
                    document_number="04040595289782932"
                />
            </div>
        </>
    );
};

export default PassengerDataPage;
