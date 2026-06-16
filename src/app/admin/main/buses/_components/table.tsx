'use client';

import Link from 'next/link';

import HotelBed from '@/assets/hotel-bed';
import ToiletPaper from '@/assets/toilet-paper';
import Wifi from '@/assets/wifi';
import { Bus } from '@/data/types';
import { Button } from '@/components/ui/button';

type Props = {
    buses: Bus[];
};

const getBusAmenities = (bus: Bus) =>
    [
        bus.have_wifi
            ? {
                  label: 'Wi-Fi',
                  icon: <Wifi />,
              }
            : null,
        bus.have_toilet
            ? {
                  label: 'Туалет',
                  icon: <ToiletPaper />,
              }
            : null,
        bus.is_recumbent
            ? {
                  label: 'Лежачие места',
                  icon: <HotelBed />,
              }
            : null,
    ].filter(Boolean) as Array<{ label: string; icon: React.ReactNode }>;

const BusesTable = ({ buses }: Props) => {
    return (
        <div className="mb-28 mt-[17px] overflow-hidden rounded-[20px] bg-white px-5 pb-3">
            <table className="w-full border-separate border-spacing-y-2">
                <thead>
                    <tr>
                        <th className="py-5 text-left text-sm font-bold uppercase text-[#A0A0A0]">
                            Внутреннее название
                        </th>
                        <th className="py-5 text-left text-sm font-bold uppercase text-[#A0A0A0]">
                            Гос. номер
                        </th>
                        <th className="py-5 text-left text-sm font-bold uppercase text-[#A0A0A0]">
                            Мест
                        </th>
                        <th className="py-5 text-left text-sm font-bold uppercase text-[#A0A0A0]">
                            Удобства
                        </th>
                        <th className="py-5 text-left text-sm font-bold uppercase text-[#A0A0A0]">
                            ID
                        </th>
                        <th aria-label="Действия" />
                    </tr>
                </thead>
                <tbody>
                    {buses.map((bus) => {
                        const amenities = getBusAmenities(bus);

                        return (
                            <tr
                                className="bg-[#F1F5F9]"
                                key={bus.id ?? bus.model_stamp}
                            >
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
                                    {amenities.length > 0 ? (
                                        <div className="flex items-center gap-2">
                                            {amenities.map((amenity) => (
                                                <span
                                                    key={amenity.label}
                                                    className="flex size-9 items-center justify-center rounded-[10px] bg-white"
                                                    title={amenity.label}
                                                    aria-label={amenity.label}
                                                >
                                                    {amenity.icon}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="text-sm font-medium text-[#A0A0A0]">
                                            —
                                        </span>
                                    )}
                                </td>
                                <td>
                                    <p className="font-semibold text-[#A0A0A0]">
                                        {bus.id || '—'}
                                    </p>
                                </td>
                                <td className="rounded-r-[10px] py-4 pr-6 text-right">
                                    {bus.id ? (
                                        <Button asChild variant="outline">
                                            <Link
                                                href={`/admin/main/buses/${bus.id}/edit`}
                                            >
                                                Открыть карточку
                                            </Link>
                                        </Button>
                                    ) : (
                                        <Button variant="outline" disabled>
                                            Нет ID для редактирования
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default BusesTable;
