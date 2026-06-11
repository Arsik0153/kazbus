import { cn } from '@/utils/cn';
import type { BusDriverTripStep } from '../_types/bus-driver';

type Props = {
    steps: BusDriverTripStep[];
};

const BusDriverTripStatusStepper = ({ steps }: Props) => {
    return (
        <div className="rounded-[0.625rem] border border-[#D1D1D1] bg-white p-5">
            <h2 className="leading-5.5 text-xl font-bold text-[#4A4A4A]">
                Ход рейса
            </h2>
            <div className="mt-5 flex flex-col gap-4">
                {steps.map((step, index) => (
                    <div key={step.id} className="flex gap-3">
                        <div className="flex flex-col items-center">
                            <div
                                className={cn('h-4 w-4 rounded-full border-2', {
                                    'border-[#E23333] bg-[#E23333]':
                                        step.state === 'done',
                                    'border-[#E23333] bg-white':
                                        step.state === 'current',
                                    'border-[#D1D1D1] bg-white':
                                        step.state === 'upcoming',
                                })}
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
                            <p className="text-sm font-semibold text-[#4A4A4A]">
                                {step.title}
                            </p>
                            <p className="mt-1 text-sm text-[#A0A0A0]">
                                {step.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BusDriverTripStatusStepper;
