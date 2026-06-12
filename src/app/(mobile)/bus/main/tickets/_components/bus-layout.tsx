import { useServerActionQuery } from '@/lib/server-action-hooks';
import { cn } from '@/utils/cn';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getBusSeatsAction } from '../actions';
import Spinner from '@/components/spinner';
import { BusSeat, BusSeats } from '@/data/types';
import Skeleton from '@/components/skeleton';

type Props = {
    onSeatsSelect: (seats: number[]) => void;
    trip_id: number;
};

const BusLayout = (props: Props) => {
    const { onSeatsSelect, trip_id } = props;
    const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
    const searchParams = useSearchParams();
    const {
        data: seats,
        isPending,
        isError,
    } = useServerActionQuery(getBusSeatsAction, {
        input: {
            trip_id,
        },
        queryKey: ['bus-seats', trip_id],
    });
    const passengerCountParam =
        Number(searchParams.get('passenger_count')) || 0;

    const isSeatTaken = (seatId: number) => {
        const seat = seats?.seats.find((s) => s.seat_id === seatId);
        return seat?.status === 'booked' || seat?.status === 'paid';
    };

    const handleSeatClick = (seatId: number) => {
        if (isSeatTaken(seatId)) {
            return;
        }

        let result;
        if (selectedSeats.includes(seatId)) {
            result = selectedSeats.filter((seat) => seat !== seatId);
        } else if (selectedSeats.length < passengerCountParam) {
            result = [...selectedSeats, seatId];
        } else {
            toast.error('Вы уже выбрали желаемое количество мест');
            result = selectedSeats;
        }

        setSelectedSeats(result);
    };

    const isSeatSelected = (seatId: number) => {
        return selectedSeats.includes(seatId);
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

    const rows = Array.from(
        new Set(seats.seats.map((seat) => seat.seat_row))
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
                onClick={() => handleSeatClick(seat.seat_id)}
                className={cn(
                    'flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] border border-[#E74949] p-3 text-[20px] font-bold text-[#E74949]',
                    {
                        'bg-[#E74949] text-white': isSeatSelected(seat.seat_id),
                        'border-[#A0A0A0] text-[#A0A0A0]': isSeatTaken(
                            seat.seat_id
                        ),
                    }
                )}
            >
                {seat.seat_id.toString().padStart(2, '0')}
            </button>
        );
    };

    const renderRow = (rowNum: number) => {
        return (
            <div key={rowNum} className="flex flex-row flex-nowrap gap-3">
                {seats.seats
                    .filter((seat) => seat.seat_row === rowNum)
                    .sort((a, b) => a.seat_col - b.seat_col)
                    .map((seat) => (
                        <React.Fragment key={seat.seat_id}>
                            {renderSeat(seat)}
                        </React.Fragment>
                    ))}
            </div>
        );
    };

    return (
        <>
            <p className="text-2xl font-medium text-[#4A4A4A]">1 этаж</p>

            <div className="fade-in w-[calc(100vw-32px)] overflow-x-auto">
                <div className="w-fit">
                    <div className="mt-3 flex w-full flex-col gap-3 rounded-[10px] border border-[#A0A0A0] p-4">
                        {rows.map(renderRow)}
                    </div>
                </div>
            </div>
        </>
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
