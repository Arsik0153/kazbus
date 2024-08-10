import React from 'react';
import User from '../assets/user';
import TrashCan from '../assets/trash-can';

type Props = {
    name: string;
    document_number: number;
    birth_date: number;
};

const PassengerDataCard = ({
    name,
    document_number,
    birth_date,
}: {
    name?: string;
    document_number?: string;
    birth_date?: string;
}) => {
    return (
        <div className="flex flex-col rounded-[10px] border border-[#D1D1D1] p-5">
            <div className="">
                <div className="flex flex-row items-center gap-3 text-[20px] font-semibold leading-[24px]">
                    <div>
                        <User color="#4A4A4A" width={16} height={16} />
                    </div>
                    <div>{name}</div>
                </div>
                <div className="mt-1 text-[14px] font-medium leading-[15.4px]">
                    Удостоверение личности
                </div>
            </div>
            <div className="flex flex-row justify-between pt-6">
                <div className="flex flex-col">
                    <div className="text-[12px] font-bold leading-[13.2px] text-[#A0A0A0]">
                        НОМЕР ДОКУМЕНТА ИЛИ ИИН
                    </div>
                    <div className="pt-2 text-[16px] font-medium leading-[17.6px]">
                        {document_number}
                    </div>
                </div>
                <div className="flex flex-col">
                    <div className="text-[12px] font-bold leading-[13.2px] text-[#A0A0A0]">
                        ДАТА РОЖДЕНИЯ
                    </div>
                    <div className="pt-2 text-[16px] font-medium leading-[17.6px]">
                        {birth_date}
                    </div>
                </div>
            </div>
            <div className="flex flex-row items-center gap-2 pt-6">
                <div>
                    <TrashCan color="#E74949" />
                </div>
                <div className="text-sm font-semibold text-[#E74949] underline underline-offset-2">
                    Удалить пассажира
                </div>
            </div>
        </div>
    );
};

export default PassengerDataCard;
