import Clock from '@/assets/red-clock';
import RouteFill from '@/assets/route-fill';
import type { CargoTrip } from '../_types/cargo';

type Props = {
    trip: CargoTrip;
};

const RouteCard = ({ trip }: Props) => {
    return (
        <div className="rounded-[0.625rem] border border-[#D1D1D1] bg-white p-5">
            <div className="flex items-center gap-2">
                <RouteFill />
                <p className="leading-4.4 text-base font-semibold text-[#4A4A4A]">
                    {trip.routeLabel}
                </p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-[0.625rem] bg-[#F8F8F8] p-3">
                    <p className="text-xs font-medium text-[#A0A0A0]">
                        Текущая точка
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                        {trip.currentPoint}
                    </p>
                </div>
                <div className="rounded-[0.625rem] bg-[#F8F8F8] p-3">
                    <p className="text-xs font-medium text-[#A0A0A0]">
                        Осталось
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                        {trip.distanceKm} км
                    </p>
                </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm font-medium text-[#4A4A4A]">
                <Clock color="#E74949" />
                <span>Ориентировочное прибытие: {trip.eta}</span>
            </div>
        </div>
    );
};

export default RouteCard;
