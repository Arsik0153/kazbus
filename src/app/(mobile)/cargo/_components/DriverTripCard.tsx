import Clock from '@/assets/red-clock';
import RouteFill from '@/assets/route-fill';
import { cn } from '@/utils/cn';
import { MapPin } from 'lucide-react';
import type { CargoTrip, TripStep } from '../_types/cargo';

const tripStatusMeta: Record<
    CargoTrip['currentStatus'],
    { label: string; className: string }
> = {
    planned: {
        label: 'Назначен',
        className: 'border border-[#F3CDCD] bg-[#FFF2F2] text-[#E74949]',
    },
    loading: {
        label: 'Погрузка',
        className: 'border border-[#F3CDCD] bg-[#FFF2F2] text-[#E74949]',
    },
    inTransit: {
        label: 'В пути',
        className: 'bg-[#E23333] text-white',
    },
    unloading: {
        label: 'Разгрузка',
        className: 'border border-[#F3CDCD] bg-[#FFF2F2] text-[#E74949]',
    },
    completed: {
        label: 'Завершен',
        className: 'bg-[#7CC71C] text-white',
    },
};

type Props = {
    trip: CargoTrip;
    steps: TripStep[];
    isTripCompleted?: boolean;
    onSelectNextPoint?: (step: TripStep) => void;
};

const getNextPointStep = (steps: TripStep[], isTripCompleted: boolean) => {
    if (isTripCompleted) return null;

    const currentStepIndex = steps.findIndex(
        (step) => step.state === 'current'
    );
    const currentStep = currentStepIndex >= 0 ? steps[currentStepIndex] : null;

    if (currentStep?.address) {
        return currentStep;
    }

    const nextSteps =
        currentStepIndex >= 0 ? steps.slice(currentStepIndex + 1) : steps;

    return (
        nextSteps.find((step) => step.address) ??
        steps.find((step) => step.state === 'upcoming' && step.address) ??
        null
    );
};

const getNextPointActionLabel = (step: TripStep | null) => {
    if (!step) return 'Следующих точек нет';
    if (step.status === 'loading') return 'Забрать груз';
    if (step.status === 'unloading') return 'Доставить груз';

    return 'Ехать к точке';
};

const DriverTripCard = ({
    trip,
    steps,
    isTripCompleted = false,
    onSelectNextPoint,
}: Props) => {
    const status = tripStatusMeta[trip.currentStatus];
    const nextPoint = getNextPointStep(steps, isTripCompleted);
    const actionLabel = getNextPointActionLabel(nextPoint);
    const pointBadgeLabel = nextPoint
        ? (nextPoint.orderNumber ??
          (nextPoint.state === 'current' ? 'Текущая задача' : 'Далее'))
        : 'Завершено';
    const canOpenDetails = !!nextPoint && !!onSelectNextPoint;
    const cardClassName = cn(
        'rounded-[0.625rem] border border-[#D1D1D1] bg-white p-5',
        canOpenDetails && 'w-full text-left transition-colors active:bg-white'
    );

    const content = (
        <>
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <RouteFill />
                        <p className="leading-4.4 text-base font-semibold text-[#4A4A4A]">
                            Следующая точка
                        </p>
                    </div>
                    <p className="mt-2 text-sm font-medium text-[#A0A0A0]">
                        {trip.routeLabel} · Рейс {trip.referenceNumber}
                    </p>
                </div>
                <div
                    className={cn(
                        'leading-3.3 shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold',
                        status.className
                    )}
                >
                    {status.label}
                </div>
            </div>

            <div className="mt-5 rounded-[0.875rem] bg-[#F8F8F8] p-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <p className="text-xs font-semibold text-[#E23333]">
                            {actionLabel}
                        </p>
                        <p className="mt-2 text-lg font-bold leading-6 text-[#4A4A4A]">
                            {nextPoint?.shipperName ??
                                nextPoint?.title ??
                                'Рейс завершен'}
                        </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-[0.6875rem] font-semibold text-[#A0A0A0]">
                        {pointBadgeLabel}
                    </span>
                </div>

                <div className="mt-4 flex gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#E23333]" />
                    <div className="min-w-0">
                        <p className="text-sm font-semibold leading-5 text-[#4A4A4A]">
                            {nextPoint?.title ?? 'Все точки пройдены'}
                        </p>
                        <p className="mt-1 text-sm font-medium leading-5 text-[#4A4A4A]">
                            {nextPoint?.address ??
                                'Следующих адресов по этому рейсу нет'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-[0.625rem] bg-[#F8F8F8] p-3">
                    <p className="text-xs font-medium text-[#A0A0A0]">Время</p>
                    <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-[#4A4A4A]">
                        <Clock color="#E74949" />
                        <span>{nextPoint?.timeLabel ?? trip.eta}</span>
                    </div>
                </div>
                <div className="rounded-[0.625rem] bg-[#F8F8F8] p-3">
                    <p className="text-xs font-medium text-[#A0A0A0]">
                        Контакт
                    </p>
                    <p className="mt-2 text-sm font-semibold leading-5 text-[#4A4A4A]">
                        {nextPoint?.contactName ?? 'Joool Cargo'}
                    </p>
                </div>
            </div>
        </>
    );

    if (canOpenDetails) {
        return (
            <button
                type="button"
                onClick={() => nextPoint && onSelectNextPoint?.(nextPoint)}
                className={cardClassName}
                aria-label={`Открыть детали заказа ${pointBadgeLabel}`}
            >
                {content}
            </button>
        );
    }

    return <div className={cardClassName}>{content}</div>;
};

export default DriverTripCard;
