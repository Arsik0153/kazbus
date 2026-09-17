import DriverForm from '../../_components/driver-form';
import { notFound } from 'next/navigation';

type Props = {
    params: Promise<{
        driverId: string;
    }>;
};

const EditDriverPage = async ({ params }: Props) => {
    const { driverId: driverIdParam } = await params;
    const driverId = Number(driverIdParam);

    if (!Number.isInteger(driverId) || driverId <= 0) {
        notFound();
    }

    return <DriverForm driverId={driverId} />;
};

export default EditDriverPage;
