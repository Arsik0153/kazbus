import { cn } from '@/utils/cn';
import type { BusDriverTripStep } from '../_types/bus-driver';

type Props = {
    steps: BusDriverTripStep[];
    isTripCompleted?: boolean;
    onStepChange?: (stepIndex: number) => void;
    onCompleteTrip?: () => void;
};

const BusDriverTripStatusStepper = ({
    steps,
    isTripCompleted = false,
    onStepChange,
    onCompleteTrip,
}: Props) => {
    const currentStepIndex = steps.findIndex((step) => step.state === 'current');
    const nextStep =
        currentStepIndex >= 0 && currentStepIndex < steps.length - 1
            ? steps[currentStepIndex + 1]
            : null;

    return (
        <div className="rounded-[0.625rem] border border-[#D1D1D1] bg-white p-5">
            <h2 className="leading-5.5 text-xl font-bold text-[#4A4A4A]">
                Ход рейса
            </h2>
            {onStepChange && (
                <p className="mt-2 text-sm text-[#A0A0A0]">
                    Нажмите на этап, чтобы водитель мог вручную изменить статус
                    рейса.
                </p>
            )}
            <div className="mt-5 flex flex-col gap-4">
                {steps.map((step, index) => (
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
                                    {step.state === 'current' && (
                                        <span className="rounded-full bg-[#FFF0F0] px-2 py-0.5 text-[0.6875rem] font-semibold text-[#E23333]">
                                            Текущий этап
                                        </span>
                                    )}
                                </div>
                                <p className="mt-1 text-sm text-[#A0A0A0]">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            {onStepChange && (
                <div className="mt-5 rounded-[0.875rem] bg-[#F8F8F8] p-4">
                    {isTripCompleted ? (
                        <>
                            <p className="text-sm font-semibold text-[#4A4A4A]">
                                Рейс завершен
                            </p>
                            <p className="mt-1 text-sm text-[#A0A0A0]">
                                Если нужно скорректировать статус, выберите
                                любой этап выше.
                            </p>
                        </>
                    ) : (
                        <>
                            <p className="text-sm font-semibold text-[#4A4A4A]">
                                Управление статусом
                            </p>
                            <p className="mt-1 text-sm text-[#A0A0A0]">
                                Можно выбрать этап вручную или перейти к
                                следующему шагу одной кнопкой.
                            </p>

                            {currentStepIndex >= 0 && nextStep && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        onStepChange(currentStepIndex + 1)
                                    }
                                    className="mt-4 w-full rounded-[0.75rem] bg-[#E23333] px-4 py-3 text-sm font-semibold text-white active:bg-[#D92727]"
                                >
                                    Перевести в «{nextStep.title}»
                                </button>
                            )}

                            {currentStepIndex === steps.length - 1 &&
                                onCompleteTrip && (
                                    <button
                                        type="button"
                                        onClick={onCompleteTrip}
                                        className="mt-4 w-full rounded-[0.75rem] bg-[#E23333] px-4 py-3 text-sm font-semibold text-white active:bg-[#D92727]"
                                    >
                                        Завершить рейс
                                    </button>
                                )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default BusDriverTripStatusStepper;
