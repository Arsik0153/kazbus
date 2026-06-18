import type { AdminTripSummary } from '../_data/trip-details';

type Props = {
    summary: AdminTripSummary;
};

function formatCurrency(value: number) {
    return new Intl.NumberFormat('ru-KZ', {
        style: 'currency',
        currency: 'KZT',
        maximumFractionDigits: 0,
    }).format(value);
}

const TripHistorySummary = ({ summary }: Props) => {
    const metrics = [
        {
            label: 'Общее число пассажиров',
            value: String(summary.total_passengers),
            hint: 'по всем поездкам рейса',
        },
        {
            label: 'Средняя загруженность автобуса',
            value: `${summary.average_occupancy}%`,
            hint: 'по истории этого рейса',
        },
        {
            label: 'Общий доход',
            value: formatCurrency(Number(summary.revenue) || 0),
            hint: 'по завершенным поездкам',
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {metrics.map((metric) => (
                <div
                    key={metric.label}
                    className="rounded-[20px] bg-white px-6 py-6"
                >
                    <p className="text-sm font-bold uppercase text-[#A0A0A0]">
                        {metric.label}
                    </p>
                    <p className="mt-3 text-3xl font-semibold text-[#E74949]">
                        {metric.value}
                    </p>
                    <p className="mt-2 text-sm font-medium text-[#A0A0A0]">
                        {metric.hint}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default TripHistorySummary;
