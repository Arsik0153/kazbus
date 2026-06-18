type Props = {
    latitude?: string;
    longitude?: string;
    title: string;
};

const RoutePointMap = ({ latitude, longitude, title }: Props) => {
    if (!latitude || !longitude) {
        return null;
    }

    const lat = Number(latitude);
    const lon = Number(longitude);

    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
        return null;
    }

    const offset = 0.01;
    const params = new URLSearchParams({
        bbox: `${lon - offset},${lat - offset},${lon + offset},${lat + offset}`,
        layer: 'mapnik',
        marker: `${lat},${lon}`,
    });

    return (
        <div className="mt-3 flex flex-col gap-2">
            <iframe
                title={title}
                src={`https://www.openstreetmap.org/export/embed.html?${params}`}
                className="h-48 w-full rounded-lg border"
                loading="lazy"
            />
            <a
                href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=16/${lat}/${lon}`}
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground text-xs underline underline-offset-4"
            >
                © OpenStreetMap contributors
            </a>
        </div>
    );
};

export default RoutePointMap;
