import { cn } from '@/utils/cn';
import type { TripStep } from '../_types/cargo';

type Props = {
    steps: TripStep[];
    isTripCompleted?: boolean;
    onStepChange?: (stepIndex: number) => void;
    onCompleteTrip?: () => void;
};

const TripStatusStepper = ({
    steps,
    isTripCompleted = false,
    onStepChange,
    onCompleteTrip,
}: Props) => {
    const currentStepIndex = steps.findIndex(
        (step) => step.state === 'current'
    );
    const previousStepIndex = isTripCompleted
        ? steps.length - 2
        : currentStepIndex > 0
          ? currentStepIndex - 1
          : null;
    const nextStepIndex =
        currentStepIndex >= 0 && currentStepIndex < steps.length - 1
            ? currentStepIndex + 1
            : null;
    const previousStep =
        previousStepIndex !== null ? steps[previousStepIndex] : null;
    const nextStep = nextStepIndex !== null ? steps[nextStepIndex] : null;

    return (
        <div className="rounded-[0.625rem] border border-[#D1D1D1] bg-white p-5">
            <h2 className="leading-5.5 text-xl font-bold text-[#4A4A4A]">
                Этапы рейса
            </h2>
            {onStepChange && (
                <p className="mt-2 text-sm text-[#A0A0A0]">
                    Нажмите на этап, чтобы вручную изменить статус рейса или
                    откатить его назад.
                </p>
            )}
            <div className="mt-5 flex flex-col gap-4">
                {steps.map((step, index) => {
                    const shouldShowDetails = step.state !== 'done';
                    const hasPlaceDetails =
                        shouldShowDetails &&
                        (step.shipperName || step.address || step.timeLabel);
                    const contactLabel =
                        step.contactName && step.contactPhone
                            ? `${step.contactName} · ${step.contactPhone}`
                            : null;

                    return (
                        <button
                            key={step.id}
                            type="button"
                            onClick={() => onStepChange?.(index)}
                            className={cn(
                                'w-full rounded-[0.875rem] text-left transition-colors',
                                {
                                    'cursor-pointer active:bg-[#FCFCFC]':
                                        !!onStepChange,
                                    'bg-[#FFF8F8]': step.state === 'current',
                                }
                            )}
                        >
                            <div className="flex gap-3 px-1 py-1.5">
                                <div className="flex flex-col items-center">
                                    <div
                                        className={cn(
                                            'size-4 min-h-4 min-w-4 rounded-full border-2',
                                            {
                                                'border-[#E23333] bg-[#E23333]':
                                                    step.state === 'done',
                                                'border-[#E23333] bg-white':
                                                    step.state === 'current',
                                                'border-[#D1D1D1] bg-white':
                                                    step.state === 'upcoming',
                                            }
                                        )}
                                    >
                                        {step.state === 'current' && (
                                            <div className="m-0.75 h-1.5 w-1.5 rounded-full bg-[#E23333]" />
                                        )}
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div
                                            className={cn('mt-1 h-full w-0.5', {
                                                'bg-[#E23333]':
                                                    step.state === 'done' ||
                                                    step.state === 'current',
                                                'bg-[#E9E9E9]':
                                                    step.state === 'upcoming',
                                            })}
                                        />
                                    )}
                                </div>
                                <div className="pb-3">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <p className="text-sm font-semibold text-[#4A4A4A]">
                                            {step.title}
                                        </p>
                                        {step.state === 'done' && (
                                            <span className="rounded-full bg-[#F8F8F8] px-2 py-0.5 text-[0.6875rem] font-semibold text-[#A0A0A0]">
                                                Завершено
                                            </span>
                                        )}
                                        {shouldShowDetails &&
                                            step.orderNumber && (
                                                <span className="rounded-full bg-[#F8F8F8] px-2 py-0.5 text-[0.6875rem] font-semibold text-[#A0A0A0]">
                                                    {step.orderNumber}
                                                </span>
                                            )}
                                        {step.state === 'current' && (
                                            <span className="rounded-full bg-[#FFF0F0] px-2 py-0.5 text-[0.6875rem] font-semibold text-[#E23333]">
                                                Текущий этап
                                            </span>
                                        )}
                                    </div>
                                    {shouldShowDetails && (
                                        <>
                                            <p className="mt-1 text-sm text-[#A0A0A0]">
                                                {step.description}
                                            </p>
                                            {hasPlaceDetails && (
                                                <div className="mt-3 rounded-[0.625rem] bg-[#F8F8F8] p-3">
                                                    {step.shipperName && (
                                                        <p className="text-sm font-semibold text-[#4A4A4A]">
                                                            {step.shipperName}
                                                        </p>
                                                    )}
                                                    {step.address && (
                                                        <p className="mt-1 text-xs leading-4 text-[#7A7A7A]">
                                                            {step.address}
                                                        </p>
                                                    )}
                                                    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs font-medium text-[#A0A0A0]">
                                                        {step.timeLabel && (
                                                            <span>
                                                                {step.timeLabel}
                                                            </span>
                                                        )}
                                                        {contactLabel && (
                                                            <span>
                                                                {contactLabel}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            {onStepChange && (
                <div className="mt-5 rounded-[0.875rem] bg-[#F8F8F8] p-4">
                    {isTripCompleted ? (
                        <>
                            <p className="text-sm font-semibold text-[#4A4A4A]">
                                Рейс завершен
                            </p>
                            <p className="mt-1 text-sm text-[#A0A0A0]">
                                Если статус нужно исправить, выберите этап выше
                                или откатите рейс на предыдущий этап.
                            </p>
                        </>
                    ) : (
                        <>
                            <p className="text-sm font-semibold text-[#4A4A4A]">
                                Управление статусом
                            </p>
                            <p className="mt-1 text-sm text-[#A0A0A0]">
                                Можно выбрать этап вручную, перейти вперед или
                                откатить статус назад.
                            </p>
                        </>
                    )}

                    <div className="mt-4 flex flex-col gap-3">
                        {previousStep && previousStepIndex !== null && (
                            <button
                                type="button"
                                onClick={() => onStepChange(previousStepIndex)}
                                className="w-full rounded-xl border border-[#E23333] px-4 py-3 text-sm font-semibold text-[#E23333] active:bg-[#FFF0F0]"
                            >
                                Вернуть в «{previousStep.title}»
                            </button>
                        )}

                        {!isTripCompleted &&
                            nextStep &&
                            nextStepIndex !== null && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        nextStep.status === 'completed' &&
                                        onCompleteTrip
                                            ? onCompleteTrip()
                                            : onStepChange(nextStepIndex)
                                    }
                                    className="w-full rounded-xl bg-[#E23333] px-4 py-3 text-sm font-semibold text-white active:bg-[#D92727]"
                                >
                                    {nextStep.status === 'completed'
                                        ? 'Завершить рейс'
                                        : `Перевести в «${nextStep.title}»`}
                                </button>
                            )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TripStatusStepper;
