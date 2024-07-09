import Topbar from '@/components/topbar';
import React, { useState } from 'react';
import ArrowLeftIcon from '../../../../../public/assets/arrow-left-icon';
import { cities } from '@/static/city';
import ArrowRightIcon from '../../../../../public/assets/arrow-right-icon';

const SelectDeparture = () => {
    const [isOpen, setIsOpen] = useState(false);

    if (isOpen)
        return (
            <>
                <div className="fixed inset-0 z-30 h-full min-h-screen w-full overflow-auto bg-[var(--bg)]">
                    <Topbar className="mx-0 w-full">
                        <div className="flex max-h-[80px] w-full flex-row items-center gap-4 rounded-[10px] border border-[#AAAAAA] bg-[#FFFFFF29] px-[20px] py-[30px]">
                            <div className="">
                                <ArrowRightIcon color="white" />
                            </div>
                            <div className="text-left text-[16px] font-medium leading-[17.6px] text-white">
                                Куда вы направляетесь?
                            </div>
                        </div>
                    </Topbar>
                    <ul className="mx-5 mb-10">
                        {cities.map((city) => (
                            <li
                                key={city.id}
                                className="flex items-center justify-between border-b-[1px] border-b-[#CDCDCD] px-[10px] py-5"
                                onClick={() => setIsOpen(false)}
                            >
                                <p className="font-medium tracking-[-3%] text-[var(--black)]">
                                    {city.name}
                                </p>
                                <span className="text-sm font-medium text-[#A0A0A0]">
                                    Город
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </>
        );

    return (
        <div
            onClick={() => setIsOpen(true)}
            className="flex max-h-[80px] w-full flex-row items-center gap-4 rounded-[10px] border border-[#AAAAAA] bg-[#FFFFFF29] px-[20px] py-[30px]"
        >
            <div className="">
                <ArrowRightIcon color="white" />
            </div>
            <div className="text-left text-[16px] font-medium leading-[17.6px] text-white">
                Куда вы направляетесь?
            </div>
        </div>
    );
};

export default SelectDeparture;
