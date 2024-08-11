import Image from 'next/image';
import React from 'react';

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

const BusLayout = () => {
    const isSeatTaken = (seatNumber: number) => {
        return MOCK.busy_tickets.some(
            (ticket) => ticket.place_num === seatNumber
        );
    };

    return (
        <>
            <h1>Этаж 1</h1>

            <div className="flex flex-col gap-9 overflow-y-auto rounded-[10px] border border-[#A0A0A0] p-4">
                <div className="flex w-full gap-3">
                    <div className="grid w-fit grid-flow-col grid-cols-[repeat(auto-fill,48px)] grid-rows-2 gap-3">
                        <button className="flex h-12 w-12 items-center justify-center rounded-[10px] border border-[#E74949] p-3 text-[20px] font-bold text-[#E74949]">
                            01
                        </button>
                        <button className="flex h-12 w-12 items-center justify-center rounded-[10px] border border-[#E74949] p-3 text-[20px] font-bold text-[#E74949]">
                            02
                        </button>
                        <button className="flex h-12 w-12 items-center justify-center rounded-[10px] border border-[#E74949] p-3 text-[20px] font-bold text-[#E74949]">
                            03
                        </button>
                        <button className="flex h-12 w-12 items-center justify-center rounded-[10px] border border-[#E74949] p-3 text-[20px] font-bold text-[#E74949]">
                            04
                        </button>
                        <button className="flex h-12 w-12 items-center justify-center rounded-[10px] border border-[#E74949] p-3 text-[20px] font-bold text-[#E74949]">
                            05
                        </button>
                        <button className="flex h-12 w-12 items-center justify-center rounded-[10px] border border-[#E74949] p-3 text-[20px] font-bold text-[#E74949]">
                            06
                        </button>
                        <button className="flex h-12 w-12 items-center justify-center rounded-[10px] border border-[#E74949] p-3 text-[20px] font-bold text-[#E74949]">
                            07
                        </button>
                        <button className="flex h-12 w-12 items-center justify-center rounded-[10px] border border-[#E74949] p-3 text-[20px] font-bold text-[#E74949]">
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
                        <button className="flex h-12 w-12 items-center justify-center rounded-[10px] border border-[#E74949] p-3 text-[20px] font-bold text-[#E74949]">
                            09
                        </button>
                        <button className="flex h-12 w-12 items-center justify-center rounded-[10px] border border-[#E74949] p-3 text-[20px] font-bold text-[#E74949]">
                            10
                        </button>
                        <button className="flex h-12 w-12 items-center justify-center rounded-[10px] border border-[#E74949] p-3 text-[20px] font-bold text-[#E74949]">
                            11
                        </button>
                        <button className="flex h-12 w-12 items-center justify-center rounded-[10px] border border-[#E74949] p-3 text-[20px] font-bold text-[#E74949]">
                            12
                        </button>
                        <button className="flex h-12 w-12 items-center justify-center rounded-[10px] border border-[#E74949] p-3 text-[20px] font-bold text-[#E74949]">
                            13
                        </button>
                        <button className="flex h-12 w-12 items-center justify-center rounded-[10px] border border-[#E74949] p-3 text-[20px] font-bold text-[#E74949]">
                            14
                        </button>
                        <button className="flex h-12 w-12 items-center justify-center rounded-[10px] border border-[#E74949] p-3 text-[20px] font-bold text-[#E74949]">
                            15
                        </button>
                        <button className="flex h-12 w-12 items-center justify-center rounded-[10px] border border-[#E74949] p-3 text-[20px] font-bold text-[#E74949]">
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
                        <button className="flex h-12 w-12 items-center justify-center rounded-[10px] border border-[#E74949] p-3 text-[20px] font-bold text-[#E74949]">
                            17
                        </button>
                        <button className="flex h-12 w-12 items-center justify-center rounded-[10px] border border-[#E74949] p-3 text-[20px] font-bold text-[#E74949]">
                            18
                        </button>
                        <button className="flex h-12 w-12 items-center justify-center rounded-[10px] border border-[#E74949] p-3 text-[20px] font-bold text-[#E74949]">
                            19
                        </button>
                        <button className="flex h-12 w-12 items-center justify-center rounded-[10px] border border-[#E74949] p-3 text-[20px] font-bold text-[#E74949]">
                            20
                        </button>
                        <button className="flex h-12 w-12 items-center justify-center rounded-[10px] border border-[#E74949] p-3 text-[20px] font-bold text-[#E74949]">
                            21
                        </button>
                        <button className="flex h-12 w-12 items-center justify-center rounded-[10px] border border-[#E74949] p-3 text-[20px] font-bold text-[#E74949]">
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
                        <button className="flex h-12 w-12 items-center justify-center rounded-[10px] border border-[#E74949] p-3 text-[20px] font-bold text-[#E74949]">
                            23
                        </button>
                        <button className="flex h-12 w-12 items-center justify-center rounded-[10px] border border-[#E74949] p-3 text-[20px] font-bold text-[#E74949]">
                            24
                        </button>
                        <button className="flex h-12 w-12 items-center justify-center rounded-[10px] border border-[#E74949] p-3 text-[20px] font-bold text-[#E74949]">
                            25
                        </button>
                        <button className="flex h-12 w-12 items-center justify-center rounded-[10px] border border-[#E74949] p-3 text-[20px] font-bold text-[#E74949]">
                            26
                        </button>
                        <button className="flex h-12 w-12 items-center justify-center rounded-[10px] border border-[#E74949] p-3 text-[20px] font-bold text-[#E74949]">
                            27
                        </button>
                        <button className="flex h-12 w-12 items-center justify-center rounded-[10px] border border-[#E74949] p-3 text-[20px] font-bold text-[#E74949]">
                            28
                        </button>
                        <button className="flex h-12 w-12 items-center justify-center rounded-[10px] border border-[#E74949] p-3 text-[20px] font-bold text-[#E74949]">
                            29
                        </button>
                        <button className="flex h-12 w-12 items-center justify-center rounded-[10px] border border-[#E74949] p-3 text-[20px] font-bold text-[#E74949]">
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
        </>
    );
};

export default BusLayout;
