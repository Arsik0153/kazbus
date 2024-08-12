import { cn } from '@/utils/cn';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const MOCK = {
    places_count: 50,
    floors_count: 1,
    busy_tickets: [
        {
            place_num: 1,
            place_floor: 1,
        },
        {
            place_num: 3,
            place_floor: 1,
        },
        {
            place_num: 2,
            place_floor: 1,
        },
        {
            place_num: 4,
            place_floor: 1,
        },
    ],
};

type Props = {
    onSeatsSelect: (seats: number[]) => void;
};

const BusLayout = (props: Props) => {
    const { onSeatsSelect } = props;
    const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
    const searchParams = useSearchParams();

    const passengerCountParam =
        Number(searchParams.get('passenger_count')) || 0;

    const isSeatTaken = (seatNumber: number) => {
        return MOCK.busy_tickets.some(
            (ticket) => ticket.place_num === seatNumber
        );
    };

    const handleSeatClick = (seatNumber: number) => {
        if (isSeatTaken(seatNumber)) {
            return;
        }

        let result;
        if (selectedSeats.includes(seatNumber)) {
            result = selectedSeats.filter((seat) => seat !== seatNumber);
        } else if (selectedSeats.length < passengerCountParam) {
            result = [...selectedSeats, seatNumber];
        } else {
            toast.error('Вы уже выбрали желаемое количество мест');
            result = selectedSeats;
        }

        setSelectedSeats(result);
    };

    const isSeatSelected = (seatNumber: number) => {
        return selectedSeats.includes(seatNumber);
    };

    useEffect(() => {
        onSeatsSelect(selectedSeats);
    }, [selectedSeats, onSeatsSelect]);

    return (
        <>
            <p className="text-2xl font-medium text-[#4A4A4A]">1 этаж</p>

            <div className="w-[calc(100vw-32px)] overflow-x-auto">
                <div className="w-fit">
                    <div className="mt-3 flex w-full flex-col gap-9 rounded-[10px] border border-[#A0A0A0] p-4">
                        <div className="flex gap-3">
                            <div className="grid w-fit grid-flow-col grid-cols-[repeat(auto-fill,48px)] grid-rows-2 gap-3">
                                <button
                                    onClick={() => handleSeatClick(1)}
                                    className={cn(
                                        'flex h-12 w-12 items-center justify-center rounded-[10px] border border-[#E74949] p-3 text-[20px] font-bold text-[#E74949]',
                                        {
                                            'bg-[#E74949] text-white':
                                                isSeatSelected(1),
                                            'border-[#A0A0A0] text-[#A0A0A0]':
                                                isSeatTaken(1),
                                        }
                                    )}
                                >
                                    01
                                </button>
                                <button
                                    onClick={() => handleSeatClick(2)}
                                    className={cn(
                                        'flex h-12 w-12 items-center justify-center rounded-[10px] border border-[#E74949] p-3 text-[20px] font-bold text-[#E74949]',
                                        {
                                            'bg-[#E74949] text-white':
                                                isSeatSelected(2),
                                            'border-[#A0A0A0] text-[#A0A0A0]':
                                                isSeatTaken(2),
                                        }
                                    )}
                                >
                                    02
                                </button>
                                <button
                                    onClick={() => handleSeatClick(3)}
                                    className={cn(
                                        'flex h-12 w-12 items-center justify-center rounded-[10px] border border-[#E74949] p-3 text-[20px] font-bold text-[#E74949]',
                                        {
                                            'bg-[#E74949] text-white':
                                                isSeatSelected(3),
                                            'border-[#A0A0A0] text-[#A0A0A0]':
                                                isSeatTaken(3),
                                        }
                                    )}
                                >
                                    03
                                </button>
                                <button
                                    onClick={() => handleSeatClick(4)}
                                    className={cn(
                                        'flex h-12 w-12 items-center justify-center rounded-[10px] border border-[#E74949] p-3 text-[20px] font-bold text-[#E74949]',
                                        {
                                            'bg-[#E74949] text-white':
                                                isSeatSelected(4),
                                            'border-[#A0A0A0] text-[#A0A0A0]':
                                                isSeatTaken(4),
                                        }
                                    )}
                                >
                                    04
                                </button>
                                <button
                                    onClick={() => handleSeatClick(5)}
                                    className={cn(
                                        'flex h-12 w-12 items-center justify-center rounded-[10px] border border-[#E74949] p-3 text-[20px] font-bold text-[#E74949]',
                                        {
                                            'bg-[#E74949] text-white':
                                                isSeatSelected(5),
                                            'border-[#A0A0A0] text-[#A0A0A0]':
                                                isSeatTaken(5),
                                        }
                                    )}
                                >
                                    05
                                </button>
                                <button
                                    onClick={() => handleSeatClick(6)}
                                    className={cn(
                                        'flex h-12 w-12 items-center justify-center rounded-[10px] border border-[#E74949] p-3 text-[20px] font-bold text-[#E74949]',
                                        {
                                            'bg-[#E74949] text-white':
                                                isSeatSelected(6),
                                            'border-[#A0A0A0] text-[#A0A0A0]':
                                                isSeatTaken(6),
                                        }
                                    )}
                                >
                                    06
                                </button>
                                <button
                                    onClick={() => handleSeatClick(7)}
                                    className={cn(
                                        'flex h-12 w-12 items-center justify-center rounded-[10px] border border-[#E74949] p-3 text-[20px] font-bold text-[#E74949]',
                                        {
                                            'bg-[#E74949] text-white':
                                                isSeatSelected(7),
                                            'border-[#A0A0A0] text-[#A0A0A0]':
                                                isSeatTaken(7),
                                        }
                                    )}
                                >
                                    07
                                </button>
                                <button
                                    onClick={() => handleSeatClick(8)}
                                    className={cn(
                                        'flex h-12 w-12 items-center justify-center rounded-[10px] border border-[#E74949] p-3 text-[20px] font-bold text-[#E74949]',
                                        {
                                            'bg-[#E74949] text-white':
                                                isSeatSelected(8),
                                            'border-[#A0A0A0] text-[#A0A0A0]':
                                                isSeatTaken(8),
                                        }
                                    )}
                                >
                                    08
                                </button>
                            </div>

                            <div className="-mt-4 w-[60px] border-l border-r border-[#A0A0A0] px-2 pt-4">
                                <Image
                                    src="/assets/tickets/floor.svg"
                                    alt="Лестница"
                                    width={42}
                                    height={108}
                                />
                            </div>

                            <div className="grid w-fit grid-flow-col grid-cols-[repeat(auto-fill,48px)] grid-rows-2 gap-3">
                                <button
                                    onClick={() => handleSeatClick(9)}
                                    className={cn(
                                        'flex h-12 w-12 items-center justify-center rounded-[10px] border border-[#E74949] p-3 text-[20px] font-bold text-[#E74949]',
                                        {
                                            'bg-[#E74949] text-white':
                                                isSeatSelected(9),
                                            'border-[#A0A0A0] text-[#A0A0A0]':
                                                isSeatTaken(9),
                                        }
                                    )}
                                >
                                    09
                                </button>
                                <button
                                    onClick={() => handleSeatClick(10)}
                                    className={cn(
                                        'flex h-12 w-12 items-center justify-center rounded-[10px] border border-[#E74949] p-3 text-[20px] font-bold text-[#E74949]',
                                        {
                                            'bg-[#E74949] text-white':
                                                isSeatSelected(10),
                                            'border-[#A0A0A0] text-[#A0A0A0]':
                                                isSeatTaken(10),
                                        }
                                    )}
                                >
                                    10
                                </button>
                                <button
                                    onClick={() => handleSeatClick(11)}
                                    className={cn(
                                        'flex h-12 w-12 items-center justify-center rounded-[10px] border border-[#E74949] p-3 text-[20px] font-bold text-[#E74949]',
                                        {
                                            'bg-[#E74949] text-white':
                                                isSeatSelected(11),
                                            'border-[#A0A0A0] text-[#A0A0A0]':
                                                isSeatTaken(11),
                                        }
                                    )}
                                >
                                    11
                                </button>
                                <button
                                    onClick={() => handleSeatClick(12)}
                                    className={cn(
                                        'flex h-12 w-12 items-center justify-center rounded-[10px] border border-[#E74949] p-3 text-[20px] font-bold text-[#E74949]',
                                        {
                                            'bg-[#E74949] text-white':
                                                isSeatSelected(12),
                                            'border-[#A0A0A0] text-[#A0A0A0]':
                                                isSeatTaken(12),
                                        }
                                    )}
                                >
                                    12
                                </button>
                                <button
                                    onClick={() => handleSeatClick(13)}
                                    className={cn(
                                        'flex h-12 w-12 items-center justify-center rounded-[10px] border border-[#E74949] p-3 text-[20px] font-bold text-[#E74949]',
                                        {
                                            'bg-[#E74949] text-white':
                                                isSeatSelected(13),
                                            'border-[#A0A0A0] text-[#A0A0A0]':
                                                isSeatTaken(13),
                                        }
                                    )}
                                >
                                    13
                                </button>
                                <button
                                    onClick={() => handleSeatClick(14)}
                                    className={cn(
                                        'flex h-12 w-12 items-center justify-center rounded-[10px] border border-[#E74949] p-3 text-[20px] font-bold text-[#E74949]',
                                        {
                                            'bg-[#E74949] text-white':
                                                isSeatSelected(14),
                                            'border-[#A0A0A0] text-[#A0A0A0]':
                                                isSeatTaken(14),
                                        }
                                    )}
                                >
                                    14
                                </button>
                                <button
                                    onClick={() => handleSeatClick(15)}
                                    className={cn(
                                        'flex h-12 w-12 items-center justify-center rounded-[10px] border border-[#E74949] p-3 text-[20px] font-bold text-[#E74949]',
                                        {
                                            'bg-[#E74949] text-white':
                                                isSeatSelected(15),
                                            'border-[#A0A0A0] text-[#A0A0A0]':
                                                isSeatTaken(15),
                                        }
                                    )}
                                >
                                    15
                                </button>
                                <button
                                    onClick={() => handleSeatClick(16)}
                                    className={cn(
                                        'flex h-12 w-12 items-center justify-center rounded-[10px] border border-[#E74949] p-3 text-[20px] font-bold text-[#E74949]',
                                        {
                                            'bg-[#E74949] text-white':
                                                isSeatSelected(16),
                                            'border-[#A0A0A0] text-[#A0A0A0]':
                                                isSeatTaken(16),
                                        }
                                    )}
                                >
                                    16
                                </button>
                            </div>

                            <div className="-mt-4 w-[60px] border-l border-r border-[#A0A0A0] px-2 pt-4">
                                <Image
                                    src="/assets/tickets/floor.svg"
                                    alt="Лестница"
                                    width={42}
                                    height={108}
                                />
                            </div>
                        </div>

                        <div className="flex w-full gap-3">
                            <div className="flex w-[48px] items-center justify-center rounded-[10px] border border-[#A0A0A0]">
                                <Image
                                    src="/assets/tickets/driver.svg"
                                    alt="Водительское место"
                                    width={24}
                                    height={24}
                                />
                            </div>
                            <div className="grid w-fit grid-flow-col grid-cols-[repeat(auto-fill,48px)] grid-rows-2 gap-3">
                                <button
                                    onClick={() => handleSeatClick(17)}
                                    className={cn(
                                        'flex h-12 w-12 items-center justify-center rounded-[10px] border border-[#E74949] p-3 text-[20px] font-bold text-[#E74949]',
                                        {
                                            'bg-[#E74949] text-white':
                                                isSeatSelected(17),
                                            'border-[#A0A0A0] text-[#A0A0A0]':
                                                isSeatTaken(17),
                                        }
                                    )}
                                >
                                    17
                                </button>
                                <button
                                    onClick={() => handleSeatClick(18)}
                                    className={cn(
                                        'flex h-12 w-12 items-center justify-center rounded-[10px] border border-[#E74949] p-3 text-[20px] font-bold text-[#E74949]',
                                        {
                                            'bg-[#E74949] text-white':
                                                isSeatSelected(18),
                                            'border-[#A0A0A0] text-[#A0A0A0]':
                                                isSeatTaken(18),
                                        }
                                    )}
                                >
                                    18
                                </button>
                                <button
                                    onClick={() => handleSeatClick(19)}
                                    className={cn(
                                        'flex h-12 w-12 items-center justify-center rounded-[10px] border border-[#E74949] p-3 text-[20px] font-bold text-[#E74949]',
                                        {
                                            'bg-[#E74949] text-white':
                                                isSeatSelected(19),
                                            'border-[#A0A0A0] text-[#A0A0A0]':
                                                isSeatTaken(19),
                                        }
                                    )}
                                >
                                    19
                                </button>
                                <button
                                    onClick={() => handleSeatClick(20)}
                                    className={cn(
                                        'flex h-12 w-12 items-center justify-center rounded-[10px] border border-[#E74949] p-3 text-[20px] font-bold text-[#E74949]',
                                        {
                                            'bg-[#E74949] text-white':
                                                isSeatSelected(20),
                                            'border-[#A0A0A0] text-[#A0A0A0]':
                                                isSeatTaken(20),
                                        }
                                    )}
                                >
                                    20
                                </button>
                                <button
                                    onClick={() => handleSeatClick(21)}
                                    className={cn(
                                        'flex h-12 w-12 items-center justify-center rounded-[10px] border border-[#E74949] p-3 text-[20px] font-bold text-[#E74949]',
                                        {
                                            'bg-[#E74949] text-white':
                                                isSeatSelected(21),
                                            'border-[#A0A0A0] text-[#A0A0A0]':
                                                isSeatTaken(21),
                                        }
                                    )}
                                >
                                    21
                                </button>
                                <button
                                    onClick={() => handleSeatClick(22)}
                                    className={cn(
                                        'flex h-12 w-12 items-center justify-center rounded-[10px] border border-[#E74949] p-3 text-[20px] font-bold text-[#E74949]',
                                        {
                                            'bg-[#E74949] text-white':
                                                isSeatSelected(22),
                                            'border-[#A0A0A0] text-[#A0A0A0]':
                                                isSeatTaken(22),
                                        }
                                    )}
                                >
                                    22
                                </button>
                            </div>

                            <div className="-mb-4 w-[60px] border-l border-r border-[#A0A0A0] px-2 pb-4">
                                <Image
                                    src="/assets/tickets/floor.svg"
                                    alt="Лестница"
                                    width={42}
                                    height={108}
                                />
                            </div>

                            <div className="grid w-fit grid-flow-col grid-cols-[repeat(auto-fill,48px)] grid-rows-2 gap-3">
                                <button
                                    onClick={() => handleSeatClick(23)}
                                    className={cn(
                                        'flex h-12 w-12 items-center justify-center rounded-[10px] border border-[#E74949] p-3 text-[20px] font-bold text-[#E74949]',
                                        {
                                            'bg-[#E74949] text-white':
                                                isSeatSelected(23),
                                            'border-[#A0A0A0] text-[#A0A0A0]':
                                                isSeatTaken(23),
                                        }
                                    )}
                                >
                                    23
                                </button>
                                <button
                                    onClick={() => handleSeatClick(24)}
                                    className={cn(
                                        'flex h-12 w-12 items-center justify-center rounded-[10px] border border-[#E74949] p-3 text-[20px] font-bold text-[#E74949]',
                                        {
                                            'bg-[#E74949] text-white':
                                                isSeatSelected(24),
                                            'border-[#A0A0A0] text-[#A0A0A0]':
                                                isSeatTaken(24),
                                        }
                                    )}
                                >
                                    24
                                </button>
                                <button
                                    onClick={() => handleSeatClick(25)}
                                    className={cn(
                                        'flex h-12 w-12 items-center justify-center rounded-[10px] border border-[#E74949] p-3 text-[20px] font-bold text-[#E74949]',
                                        {
                                            'bg-[#E74949] text-white':
                                                isSeatSelected(25),
                                            'border-[#A0A0A0] text-[#A0A0A0]':
                                                isSeatTaken(25),
                                        }
                                    )}
                                >
                                    25
                                </button>
                                <button
                                    onClick={() => handleSeatClick(26)}
                                    className={cn(
                                        'flex h-12 w-12 items-center justify-center rounded-[10px] border border-[#E74949] p-3 text-[20px] font-bold text-[#E74949]',
                                        {
                                            'bg-[#E74949] text-white':
                                                isSeatSelected(26),
                                            'border-[#A0A0A0] text-[#A0A0A0]':
                                                isSeatTaken(26),
                                        }
                                    )}
                                >
                                    26
                                </button>
                                <button
                                    onClick={() => handleSeatClick(27)}
                                    className={cn(
                                        'flex h-12 w-12 items-center justify-center rounded-[10px] border border-[#E74949] p-3 text-[20px] font-bold text-[#E74949]',
                                        {
                                            'bg-[#E74949] text-white':
                                                isSeatSelected(27),
                                            'border-[#A0A0A0] text-[#A0A0A0]':
                                                isSeatTaken(27),
                                        }
                                    )}
                                >
                                    27
                                </button>
                                <button
                                    onClick={() => handleSeatClick(28)}
                                    className={cn(
                                        'flex h-12 w-12 items-center justify-center rounded-[10px] border border-[#E74949] p-3 text-[20px] font-bold text-[#E74949]',
                                        {
                                            'bg-[#E74949] text-white':
                                                isSeatSelected(28),
                                            'border-[#A0A0A0] text-[#A0A0A0]':
                                                isSeatTaken(28),
                                        }
                                    )}
                                >
                                    28
                                </button>
                                <button
                                    onClick={() => handleSeatClick(29)}
                                    className={cn(
                                        'flex h-12 w-12 items-center justify-center rounded-[10px] border border-[#E74949] p-3 text-[20px] font-bold text-[#E74949]',
                                        {
                                            'bg-[#E74949] text-white':
                                                isSeatSelected(29),
                                            'border-[#A0A0A0] text-[#A0A0A0]':
                                                isSeatTaken(29),
                                        }
                                    )}
                                >
                                    29
                                </button>
                                <button
                                    onClick={() => handleSeatClick(30)}
                                    className={cn(
                                        'flex h-12 w-12 items-center justify-center rounded-[10px] border border-[#E74949] p-3 text-[20px] font-bold text-[#E74949]',
                                        {
                                            'bg-[#E74949] text-white':
                                                isSeatSelected(30),
                                            'border-[#A0A0A0] text-[#A0A0A0]':
                                                isSeatTaken(30),
                                        }
                                    )}
                                >
                                    30
                                </button>
                            </div>

                            <div className="-mb-4 w-[60px] border-l border-r border-[#A0A0A0] px-2 pb-4">
                                <Image
                                    src="/assets/tickets/floor.svg"
                                    alt="Лестница"
                                    width={42}
                                    height={108}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BusLayout;
