import React from 'react'
import User from '../../public/assets/user';
import TrashCan from '../../public/assets/trash-can';

type Props = {
    name: string;
    document_number: number;
    birth_date: number;
}

const PassengerDataCard = ({name, document_number, birth_date}: { name?: string, document_number?: string, birth_date?: string }) => {
    return (
        <div className='py-2'>
            <div className='border-[#c38b8b] border rounded-[10px] p-5 flex flex-col'>
                <div className=''>
                    <div className='font-semibold text-[20px] leading-[24px] flex flex-row gap-3 items-center'>
                        <div><User color='#4A4A4A' width={13.33} height={13.33} /></div>
                        <div>{name}</div>
                    </div>
                    <div className='font-medium text-[14px] leading-[15.4px]'>
                        Удостоверение личности
                    </div>
                </div>
                <div className='flex flex-row justify-between pt-6'>
                    <div className='flex flex-col'>
                        <div className='font-bold text-[12px] leading-[13.2px] text-[#A0A0A0]'>НОМЕР ДОКУМЕНТА ИЛИ ИИН</div>
                        <div className='font-medium text-[16px] leading-[17.6px] pt-2'>{document_number}</div>
                    </div>
                    <div className='flex flex-col'>
                        <div className='font-bold text-[12px] leading-[13.2px] text-[#A0A0A0]'>ДАТА РОЖДЕНИЯ</div>
                        <div className='font-medium text-[16px] leading-[17.6px] pt-2'>{birth_date}</div>
                    </div>
                </div>
                <div className='flex flex-row gap-2 pt-6 items-center'>
                    <div><TrashCan color='#E74949'/></div>
                    <div className='text-[#E74949] underline'>Удалить пассажира</div>
                </div>
            </div>
        </div>
    )
}

export default PassengerDataCard;