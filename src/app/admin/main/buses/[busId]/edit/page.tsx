import BusForm from '../../_components/bus-form';

type Props = {
    params: Promise<{
        busId: string;
    }>;
};

export default async function EditBusPage({ params }: Props) {
    const { busId } = await params;

    return <BusForm busId={busId} />;
}
