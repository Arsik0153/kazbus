import React from 'react';
import QRTrip from '@/components/qr-trip';
import Button from '@/components/button';
import Download from '../../../../assets/download';
import Topbar from '@/components/topbar';

const QRTripPage = () => {
    return (
        <>
            <Topbar backHref="/my-tickets">Билет №129319031</Topbar>
            <div className="p-5">
                <div>
                    <QRTrip
                        status="paid"
                        town_one="Алматы"
                        town_two="Кокшетау"
                        departure="12:00"
                        arrive="16:40"
                        departure_date="8 мая"
                        tickets={112}
                        arriving_date={'9 мая'}
                        passenger_amount={1}
                        ticket_amount={12450}
                    />
                </div>
                <div className="pt-5">
                    <Button variant="secondary" className="flex flex-row gap-2">
                        <Download color="white" />
                        Скачать билет
                    </Button>
                </div>
            </div>
        </>
    );
};

export default QRTripPage;
