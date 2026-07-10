'use client';

import { Drawer } from 'vaul';
import Button from '@/components/button';
import { cn } from '@/utils/cn';
import type { BusPassenger, PassengerBoardingStatus } from '../_types/bus-driver';

const boardingStatusOptions: Array<{
    value: PassengerBoardingStatus;
    label: string;
    description: string;
    activeClassName: string;
    badgeClassName: string;
}> = [
    {
        value: 'boarded',
        label: 'На борту',
        description: 'Пассажир прошел проверку и сел в автобус.',
        activeClassName: 'border-[#B9E27F] bg-[#F4FBEA]',
        badgeClassName: 'bg-[#F3F8EB] text-[#6A9F32]',
    },
    {
        value: 'waiting',
        label: 'Ждет посадки',
        description: 'Пассажир еще не прошел проверку перед рейсом.',
        activeClassName: 'border-[#F4C1C1] bg-[#FFF6F6]',
        badgeClassName: 'bg-[#FFF3F3] text-[#E23333]',
    },
    {
        value: 'missed',
        label: 'Не подошел',
        description: 'Пассажир не появился на посадке к отправлению.',
        activeClassName: 'border-[#D7D7D7] bg-[#F6F6F6]',
        badgeClassName: 'bg-[#F1F1F1] text-[#7E7E7E]',
    },
];

type Props = {
    passenger: BusPassenger | null;
    draftStatus: PassengerBoardingStatus;
    onOpenChange: (open: boolean) => void;
    onDraftStatusChange: (status: PassengerBoardingStatus) => void;
    onSave: () => void;
};

const BusPassengerStatusDrawer = ({
    passenger,
    draftStatus,
    onOpenChange,
    onDraftStatusChange,
    onSave,
}: Props) => (
    <Drawer.Root open={!!passenger} onOpenChange={onOpenChange}>
        <Drawer.Portal>
            <Drawer.Overlay className="fixed inset-0 z-40 bg-black/40" />
            <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 mt-24 flex max-h-[85vh] flex-col rounded-t-2xl bg-white">
                {passenger && (
                    <div className="overflow-y-auto px-5 pb-8 pt-4">
                        <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-[#D6D6D6]" />
                        <Drawer.Title className="text-center text-xl font-bold text-[#4A4A4A]">
                            Статус посадки
                        </Drawer.Title>
                        <Drawer.Description className="sr-only">
                            Изменение статуса посадки выбранного пассажира
                        </Drawer.Description>

                        <div className="mt-5 rounded-[0.875rem] border border-[#E8E8E8] bg-[#FBFBFB] p-4">
                            <p className="text-lg font-bold text-[#4A4A4A]">
                                {passenger.fullName}
                            </p>
                            <p className="mt-1 text-sm font-medium text-[#A0A0A0]">
                                Билет {passenger.ticketNumber}
                            </p>
                            <div className="mt-3 flex flex-wrap gap-2">
                                <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[#7F7F7F]">
                                    Место {passenger.seatNumber}
                                </span>
                                <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[#7F7F7F]">
                                    {passenger.fareLabel}
                                </span>
                            </div>
                        </div>

                        <div className="mt-5 space-y-3">
                            {boardingStatusOptions.map((option) => {
                                const isSelected = draftStatus === option.value;

                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() =>
                                            onDraftStatusChange(option.value)
                                        }
                                        className={cn(
                                            'w-full rounded-[0.875rem] border p-4 text-left transition-colors',
                                            isSelected
                                                ? option.activeClassName
                                                : 'border-[#E6E6E6] bg-white'
                                        )}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <div
                                                    className={cn(
                                                        'inline-flex rounded-full px-3 py-1 text-xs font-semibold',
                                                        option.badgeClassName
                                                    )}
                                                >
                                                    {option.label}
                                                </div>
                                                <p className="mt-2 text-sm leading-[1.225rem] text-[#8E8E8E]">
                                                    {option.description}
                                                </p>
                                            </div>
                                            <div
                                                className={cn(
                                                    'mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border',
                                                    isSelected
                                                        ? 'border-[#E23333]'
                                                        : 'border-[#D1D1D1]'
                                                )}
                                            >
                                                {isSelected && (
                                                    <div className="h-2.5 w-2.5 rounded-full bg-[#E23333]" />
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="mt-6 flex gap-3">
                            <button
                                type="button"
                                onClick={() => onOpenChange(false)}
                                className="flex-1 rounded-[0.875rem] border border-[#D9D9D9] px-4 py-4 text-sm font-semibold text-[#7E7E7E]"
                            >
                                Отмена
                            </button>
                            <Button
                                variant="secondary"
                                onClick={onSave}
                                className="max-h-none flex-1 rounded-[0.875rem] px-4 py-4 text-sm"
                            >
                                Сохранить
                            </Button>
                        </div>
                    </div>
                )}
            </Drawer.Content>
        </Drawer.Portal>
    </Drawer.Root>
);

export default BusPassengerStatusDrawer;
