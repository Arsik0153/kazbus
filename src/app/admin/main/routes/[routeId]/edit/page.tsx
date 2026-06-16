import RouteForm from '../../_components/route-form';

type Props = {
    params: {
        routeId: string;
    };
};

export default function EditRoutePage({ params }: Props) {
    return <RouteForm routeId={Number(params.routeId)} />;
}
