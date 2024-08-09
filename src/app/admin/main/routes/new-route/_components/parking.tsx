import React from 'react'
import ComboBox from '../../../trips/_components/inputCombo'
import InputMini from '@/components/admin/inputMini'
import Clock from '@/assets/red-clock'

const parking = () => {
    return (
        <div className="flex flex-row p-4 pr-12 rounded-[5px] bg-white justify-between">
            <ComboBox name="stop" />
            <div className="flex flex-col gap-3 w-3/5">
                <div className="w-full flex flex-row items-center justify-between ">
                    <p className="text-base font-semibold text-[#4A4A4A]">Время в пути до конечной точки</p>
                    <div className="flex flex-row items-center gap-3">
                        <InputMini
                            id="AdminPassword"
                            placeholder=''
                            className='max-w-20'
                            iconLeft={<Clock color="#E74949" />}
                        />
                        <p className="text-base font-medium text-[#4A4A4A]">часов</p>
                        <InputMini
                            id="AdminPassword"
                            placeholder=''
                            className='max-w-20'
                            iconLeft={<Clock color="#E74949" />}
                        />
                        <p className="text-base font-medium text-[#4A4A4A]">Минут</p>
                    </div>
                </div>

                <div className="w-full h-0 border"></div>
                <div className="w-full flex flex-row items-center justify-between ">
                    <p className="text-base font-semibold text-[#4A4A4A]">Время на остановку</p>
                    <div className="flex flex-row items-center gap-3">
                        <InputMini
                            id="AdminPassword"
                            placeholder=''
                            className='max-w-20'
                            iconLeft={<Clock color="#E74949" />}
                        />
                        <p className="text-base font-medium text-[#4A4A4A]">часов</p>
                        <InputMini
                            id="AdminPassword"
                            placeholder=''
                            className='max-w-20'
                            iconLeft={<Clock color="#E74949" />}
                        />
                        <p className="text-base font-medium text-[#4A4A4A]">Минут</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default parking