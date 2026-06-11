import { redirect } from 'next/navigation';

const BusPage = () => {
    redirect('/bus/main?passenger_count=1');
};

export default BusPage;
