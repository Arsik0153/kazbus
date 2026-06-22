import React from 'react'
import Building from '@/assets/building';

const CargoMap = () => {
  return (
    <div className="rounded-[0.625rem] border border-[#D1D1D1] bg-white p-4">
                        <div className="h-70 bg-linear-[180deg,#FFF7F7_0%,#FFFFFF_100%] flex items-center justify-center rounded-[0.625rem] border border-dashed border-[#E7B0B0] p-6 text-center">
                            <div>
                                <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#E23333]">
                                    <Building color="#FFFFFF" />
                                </div>
                                <p className="leading-5.5 mt-4 text-xl font-bold text-[#4A4A4A]">
                                    Карта маршрута
                                </p>
                                <p className="leading-4.4 mt-2 text-sm text-[#A0A0A0]">
                                    Здесь будет отображаться маршрут и позиция
                                    транспорта
                                </p>
                            </div>
                        </div>
                    </div>
  )
}

export default CargoMap