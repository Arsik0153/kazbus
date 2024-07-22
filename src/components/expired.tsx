import React from 'react';
import Clock from '../../public/assets/red-clock';

const Expired = () => {
    

    return (
        <div className="flex flex-col bg-[#E74949] w-full rounded-[10px] pt-5 px-5 pb-8">
            <Clock color='white'/>
            <p className="mt-3 text-2xl font-semibold text-[#FFFFFF]">Ваш билет просрочен</p>
            <p className="mt-1 text-sm font-normal text-[#FFFFFF]">Сделайте повторную бронь билета</p>

        </div>
    );
};

export default Expired;
