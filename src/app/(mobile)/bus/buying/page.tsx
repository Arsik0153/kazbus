import { redirect } from 'next/navigation';

const LegacyBuyingPage = () => {
    redirect('/bus/main?passenger_count=1');
};

export default LegacyBuyingPage;
