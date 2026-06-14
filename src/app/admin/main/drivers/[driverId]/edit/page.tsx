import DriverForm from '../../_components/driver-form';
import { notFound } from 'next/navigation';

type Props = {
    params: {
        driverId: string;
    };
};

const EditDriverPage = ({ params }: Props) => {
    const driverId = Number(params.driverId);

    if (!Number.isInteger(driverId) || driverId <= 0) {
        notFound();
    }

    return <DriverForm driverId={driverId} />;
};

export default EditDriverPage;
