import { redirect } from 'next/navigation';

const LegacyQrTicketPage = () => {
    redirect('/bus/my-tickets');
};

export default LegacyQrTicketPage;
