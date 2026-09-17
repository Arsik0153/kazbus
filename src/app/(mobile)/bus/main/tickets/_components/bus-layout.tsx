import { useServerActionQuery } from '@/lib/server-action-hooks';
import { cn } from '@/utils/cn';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getBusSeatsAction } from '../actions';
import Spinner from '@/components/spinner';
import { BusSeat, SeatSelection } from '@/data/types';
import Skeleton from '@/components/skeleton';

type Props = {
    onSeatsSelect: (seats: SeatSelection[]) => void;
    trip_id: number;
    serviceDate: string;
};

const BusLayout = (props: Props) => {
    const { onSeatsSelect, serviceDate, trip_id } = props;
    const [selectedSeats, setSelectedSeats] = useState<SeatSelection[]>([]);
    const searchParams = useSearchParams();
    const {
        data: seats,
        isPending,
        isError,
    } = useServerActionQuery(getBusSeatsAction, {
        input: {
            trip_id,
            service_date: serviceDate,
        },
        queryKey: ['bus-seats', trip_id, serviceDate],
    });
    const passengerCountParam =
        Number(searchParams.get('passenger_count')) || 0;

    const sameSeat = (left: SeatSelection, right: SeatSelection) =>
        left.seat_id === right.seat_id && left.seat_floor === right.seat_floor;

    const isSeatTaken = (seat: BusSeat) => {
        return seat.status === 'booked' || seat.status === 'paid';
    };

    const handleSeatClick = (seat: BusSeat) => {
        if (isSeatTaken(seat)) {
            return;
        }

        const selection = {
            seat_id: seat.seat_id,
            seat_floor: seat.seat_floor,
        };

        let result;
        if (selectedSeats.some((selected) => sameSeat(selected, selection))) {
            result = selectedSeats.filter(
                (selected) => !sameSeat(selected, selection)
            );
        } else if (selectedSeats.length < passengerCountParam) {
            result = [...selectedSeats, selection];
        } else {
            toast.error('Вы уже выбрали желаемое количество мест');
            result = selectedSeats;
        }

        setSelectedSeats(result);
    };

    const isSeatSelected = (seat: BusSeat) => {
        return selectedSeats.some((selected) => sameSeat(selected, seat));
    };

    useEffect(() => {
        onSeatsSelect(selectedSeats);
    }, [selectedSeats, onSeatsSelect]);

    if (isPending) {
        return <BusLayoutSkeleton />;
    }

    if (isError || !seats) {
        return (
            <div className="rounded-[10px] bg-red-50 p-4 text-[#E23333]">
                Не удалось загрузить места. Вернитесь к списку рейсов и
                попробуйте снова.
            </div>
        );
    }

    const floors = Array.from(
        new Set(seats.seats.map((seat) => seat.seat_floor))
    ).sort((a, b) => a - b);

    const renderSeat = (seat: BusSeat) => {
        if (seat.seat_type === 'aisle') {
            return <div className="h-5 w-12 shrink-0" />;
        }

        if (seat.seat_type === 'driver') {
            return (
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] border border-[#A0A0A0]">
                    <Image
                        src="/assets/tickets/driver.svg"
                        alt="Водительское место"
                        width={24}
                        height={24}
                    />
                </div>
            );
        }

        return (
            <button
                type="button"
                onClick={() => handleSeatClick(seat)}
                className={cn(
                    'flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] border border-[#E74949] p-3 text-[20px] font-bold text-[#E74949]',
                    {
                        'bg-[#E74949] text-white': isSeatSelected(seat),
                        'border-[#A0A0A0] text-[#A0A0A0]': isSeatTaken(seat),
                    }
                )}
            >
                {seat.seat_id.toString().padStart(2, '0')}
            </button>
        );
    };

    const renderRow = (floor: number, rowNum: number) => {
        return (
            <div key={rowNum} className="flex flex-row flex-nowrap gap-3">
                {seats.seats
                    .filter(
                        (seat) =>
                            seat.seat_floor === floor &&
                            seat.seat_row === rowNum
                    )
                    .sort((a, b) => a.seat_col - b.seat_col)
                    .map((seat) => (
                        <React.Fragment
                            key={`${seat.seat_floor}-${seat.seat_id}`}
                        >
                            {renderSeat(seat)}
                        </React.Fragment>
                    ))}
            </div>
        );
    };

    return (
        <div className="flex flex-col gap-6">
            {floors.map((floor) => {
                const rows = Array.from(
                    new Set(
                        seats.seats
                            .filter((seat) => seat.seat_floor === floor)
                            .map((seat) => seat.seat_row)
                    )
                ).sort((a, b) => a - b);

                return (
                    <div key={floor}>
                        <p className="text-2xl font-medium text-[#4A4A4A]">
                            {floor} этаж
                        </p>
                        <div className="fade-in w-[calc(100vw-32px)] overflow-x-auto">
                            <div className="w-fit">
                                <div className="mt-3 flex w-full flex-col gap-3 rounded-[10px] border border-[#A0A0A0] p-4">
                                    {rows.map((row) => renderRow(floor, row))}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const BusLayoutSkeleton = () => {
    return (
        <>
            <Skeleton className="mb-3 h-8 w-24" /> {/* "1 этаж" text */}
            <div className="w-[calc(100vw-32px)] overflow-x-auto">
                <div className="w-fit">
                    <div className="mt-3 flex w-full flex-col gap-3 rounded-[10px] border border-[#A0A0A0] p-4">
                        {[...Array(2)].map((_, rowIndex) => (
                            <div key={rowIndex} className="flex gap-3">
                                {[...Array(10)].map((_, seatIndex) => (
                                    <Skeleton
                                        key={seatIndex}
                                        className="h-12 w-12 rounded-[10px]"
                                    />
                                ))}
                            </div>
                        ))}
                        <div className="flex gap-3">
                            {[...Array(10)].map((_, seatIndex) => (
                                <div
                                    key={seatIndex}
                                    className="h-[20px] w-[48px]"
                                ></div>
                            ))}
                        </div>
                        {[...Array(2)].map((_, rowIndex) => (
                            <div key={rowIndex} className="flex gap-3">
                                {[...Array(10)].map((_, seatIndex) => (
                                    <Skeleton
                                        key={seatIndex}
                                        className="h-12 w-12 rounded-[10px]"
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default BusLayout;
