import BusForm from '../../_components/bus-form';

type Props = {
    params: {
        busId: string;
    };
};

export default function EditBusPage({ params }: Props) {
    return <BusForm busId={params.busId} />;
}
