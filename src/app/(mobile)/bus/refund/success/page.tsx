import { redirect } from 'next/navigation';

const LegacyRefundSuccessPage = () => {
    redirect('/bus/my-tickets');
};

export default LegacyRefundSuccessPage;
