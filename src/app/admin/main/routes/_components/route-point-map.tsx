'use client';

import { ExternalLink, MapPin } from 'lucide-react';
import type { StyleSpecification } from 'maplibre-gl';

import {
    Map,
    MapControls,
    MapMarker,
    MarkerContent,
    MarkerPopup,
} from '@/components/ui/map';

type Props = {
    latitude?: string;
    longitude?: string;
    title: string;
};

const coordinateFormatter = new Intl.NumberFormat('ru-RU', {
    maximumFractionDigits: 6,
});

const detailedStreetMapStyle: StyleSpecification = {
    version: 8,
    sources: {
        osm: {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
        },
    },
    layers: [
        {
            id: 'osm',
            type: 'raster',
            source: 'osm',
        },
    ],
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

    const osmUrl = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=16/${lat}/${lon}`;

    return (
        <div className="mt-3 flex flex-col gap-2">
            <div className="border-border bg-muted relative h-56 overflow-hidden rounded-lg border">
                <Map
                    key={`${lat}:${lon}`}
                    center={[lon, lat]}
                    zoom={17}
                    theme="light"
                    styles={{
                        light: detailedStreetMapStyle,
                        dark: detailedStreetMapStyle,
                    }}
                    minZoom={4}
                    maxZoom={19}
                    className="h-full"
                >
                    <MapControls
                        position="top-right"
                        showZoom
                        showCompass
                        showFullscreen
                    />
                    <MapMarker longitude={lon} latitude={lat} anchor="bottom">
                        <MarkerContent>
                            <div className="bg-primary text-primary-foreground ring-background flex size-9 items-center justify-center rounded-full shadow-lg ring-2">
                                <MapPin data-icon="inline-start" />
                            </div>
                        </MarkerContent>
                        <MarkerPopup>
                            <div className="flex flex-col gap-1 text-sm">
                                <p className="font-medium">{title}</p>
                                <p className="text-muted-foreground text-xs">
                                    {coordinateFormatter.format(lat)},{' '}
                                    {coordinateFormatter.format(lon)}
                                </p>
                            </div>
                        </MarkerPopup>
                    </MapMarker>
                </Map>
            </div>
        </div>
    );
};

export default RoutePointMap;
