import User from '@/assets/user';
import type { DriverState } from '@/lib/cargo-contract';

export default function DriverProfile({ state }: { state: DriverState }) {
    const vehicles = [
        ...new Map(
            state.trips
                .filter((trip) => trip.status !== 'completed')
                .map((trip) => [trip.vehicle.id, trip.vehicle])
        ).values(),
    ];
    return (
        <>
            <div className="rounded-[0.625rem] border border-[#D1D1D1] bg-white p-5">
                <div className="flex items-center gap-2">
                    <User color="#E74949" width={18} height={18} />
                    <h2 className="text-xl leading-5.5 font-bold">
                        {state.profile.fullName}
                    </h2>
                </div>
                <p className="mt-2 text-sm font-medium text-[#E74949]">
                    {state.profile.phone}
                </p>
                <dl className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-[0.625rem] bg-[#F8F8F8] p-3">
                        <dt className="text-xs font-medium text-[#A0A0A0]">
                            Автопарк
                        </dt>
                        <dd className="mt-1 text-sm font-semibold">
                            {state.profile.company.name}
                        </dd>
                    </div>
                    <div className="rounded-[0.625rem] bg-[#F8F8F8] p-3">
                        <dt className="text-xs font-medium text-[#A0A0A0]">
                            Машина
                        </dt>
                        <dd className="mt-1 text-sm font-semibold">
                            {vehicles
                                .map(
                                    (vehicle) =>
                                        `${vehicle.model} • ${vehicle.plateNumber}`
                                )
                                .join(', ') || 'Нет назначенной машины'}
                        </dd>
                    </div>
                </dl>
            </div>
            {vehicles.map((vehicle) => (
                <div
                    key={vehicle.id}
                    className="mt-4 rounded-[0.625rem] border border-[#D1D1D1] bg-white p-5"
                >
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <p className="text-sm font-medium text-[#A0A0A0]">
                                Закрепленная машина
                            </p>
                            <h2 className="mt-1 text-xl font-bold">
                                {vehicle.model}
                            </h2>
                        </div>
                        <span className="rounded-full border border-[#F3CDCD] bg-[#FFF2F2] px-3 py-1.5 text-xs font-semibold text-[#E74949]">
                            {vehicle.kind}
                        </span>
                    </div>
                    <dl className="mt-4 grid grid-cols-2 gap-3">
                        {[
                            ['Госномер', vehicle.plateNumber],
                            ['Прицеп', vehicle.trailerNumber || 'Не указан'],
                            ['Автопарк', state.profile.company.name],
                        ].map(([label, value]) => (
                            <div
                                key={label}
                                className="rounded-[0.625rem] bg-[#F8F8F8] p-3"
                            >
                                <dt className="text-xs font-medium text-[#A0A0A0]">
                                    {label}
                                </dt>
                                <dd className="mt-1 text-sm font-semibold">
                                    {value}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            ))}
        </>
    );
}
