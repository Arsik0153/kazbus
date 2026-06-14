'use client';

import { Bus } from '@/data/types';
import { Button } from '@/components/ui/button';

type Props = {
    buses: Bus[];
};

const BusesTable = ({ buses }: Props) => {
    return (
        <div className="mb-28 mt-[17px] overflow-hidden rounded-[20px] bg-white px-5 pb-3">
            <table className="w-full border-separate border-spacing-y-2">
                <thead>
                    <tr>
                        <th className="py-5 text-left text-sm font-bold uppercase text-[#A0A0A0]">
                            Модель
                        </th>
                        <th className="py-5 text-left text-sm font-bold uppercase text-[#A0A0A0]">
                            Гос. номер
                        </th>
                        <th className="py-5 text-left text-sm font-bold uppercase text-[#A0A0A0]">
                            Мест
                        </th>
                        <th className="py-5 text-left text-sm font-bold uppercase text-[#A0A0A0]">
                            ID
                        </th>
                        <th aria-label="Действия" />
                    </tr>
                </thead>
                <tbody>
                    {buses.map((bus) => (
                        <tr className="bg-[#F1F5F9]" key={bus.id ?? bus.model_stamp}>
                            <td className="rounded-l-[10px] py-4 pl-6">
                                <p className="font-semibold text-[#4A4A4A]">
                                    {bus.name || bus.model_stamp}
                                </p>
                                <p className="text-sm text-[#A0A0A0]">
                                    {bus.model_stamp}
                                </p>
                            </td>
                            <td>
                                <p className="font-semibold text-[#4A4A4A]">
                                    {bus.state_number}
                                </p>
                            </td>
                            <td>
                                <p className="font-semibold text-[#4A4A4A]">
                                    {bus.count_of_seats}
                                </p>
                            </td>
                            <td>
                                <p className="font-semibold text-[#A0A0A0]">
                                    {bus.id || '—'}
                                </p>
                            </td>
                            <td className="rounded-r-[10px] py-4 pr-6 text-right">
                                <Button variant="outline" disabled>
                                    Редактирование скоро
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BusesTable;
