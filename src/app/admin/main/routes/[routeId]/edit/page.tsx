import RouteForm from '../../_components/route-form';

type Props = {
    params: Promise<{
        routeId: string;
    }>;
};

export default async function EditRoutePage({ params }: Props) {
    const { routeId } = await params;

    return <RouteForm routeId={Number(routeId)} />;
}
