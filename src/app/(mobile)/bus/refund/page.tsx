import { redirect } from 'next/navigation';

const LegacyRefundPage = () => {
    redirect('/bus/my-tickets');
};

export default LegacyRefundPage;
