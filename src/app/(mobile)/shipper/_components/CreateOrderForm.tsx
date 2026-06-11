'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Button from '@/components/button';
import Input from '@/components/input';
import VehicleTypeCard from './VehicleTypeCard';
import { shipperVehicleTypesMock } from '../_data/shipper.mock';
import { formatPrice, getVehicleTypeLabel } from '../_utils/shipper-utils';
import type { ShipperVehicleType } from '../_types/shipper';

type CreateOrderFormState = {
    fromCity: string;
    toCity: string;
    pickupAddress: string;
    dropoffAddress: string;
    pickupDate: string;
    cargoTitle: string;
    cargoWeightTons: string;
    cargoVolumeM3: string;
    vehicleType: ShipperVehicleType;
    comment: string;
};

const BASE_PRICE: Record<ShipperVehicleType, number> = {
    tent: 125000,
    refrigerator: 148000,
    van: 119000,
    flatbed: 138000,
    manipulator: 162000,
};

const INITIAL_FORM: CreateOrderFormState = {
    fromCity: '',
    toCity: '',
    pickupAddress: '',
    dropoffAddress: '',
    pickupDate: '',
    cargoTitle: '',
    cargoWeightTons: '',
    cargoVolumeM3: '',
    vehicleType: 'tent',
    comment: '',
};

const CreateOrderForm = () => {
    const router = useRouter();
    const [form, setForm] = useState<CreateOrderFormState>(INITIAL_FORM);

    const updateField = <K extends keyof CreateOrderFormState>(
        field: K,
        value: CreateOrderFormState[K]
    ) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const estimatedPrice =
        BASE_PRICE[form.vehicleType] +
        Number(form.cargoWeightTons || 0) * 3500 +
        Number(form.cargoVolumeM3 || 0) * 1200;

    const isReady =
        form.fromCity.trim() &&
        form.toCity.trim() &&
        form.pickupAddress.trim() &&
        form.dropoffAddress.trim() &&
        form.pickupDate.trim() &&
        form.cargoTitle.trim();

    return (
        <form
            className="flex flex-col gap-5"
            onSubmit={(event) => {
                event.preventDefault();
                router.push('/shipper/orders');
            }}
        >
            <div className="rounded-[0.625rem] border border-[#D1D1D1] bg-white p-5">
                <p className="text-sm font-bold text-[#E74949]">Новая заявка</p>
                <h1 className="mt-2 text-[2rem] font-bold leading-[2.4rem] text-[#4A4A4A]">
                    Создание перевозки
                </h1>
                <p className="leading-4.4 mt-3 text-sm text-[#A0A0A0]">
                    Укажите маршрут, груз и тип машины. Предварительную
                    стоимость покажем сразу на экране.
                </p>
            </div>

            <div className="rounded-[0.625rem] border border-[#D1D1D1] bg-white p-5">
                <h2 className="leading-5.5 text-xl font-bold text-[#4A4A4A]">
                    Маршрут
                </h2>
                <div className="mt-4 flex flex-col gap-2">
                    <Input
                        id="shipperFromCity"
                        label="Откуда забрать"
                        placeholder="Откуда забрать"
                        value={form.fromCity}
                        onChange={(event) =>
                            updateField('fromCity', event.currentTarget.value)
                        }
                    />
                    <Input
                        id="shipperToCity"
                        label="Куда доставить"
                        placeholder="Куда доставить"
                        value={form.toCity}
                        onChange={(event) =>
                            updateField('toCity', event.currentTarget.value)
                        }
                    />
                    <Input
                        id="shipperPickupAddress"
                        label="Адрес погрузки"
                        placeholder="Адрес погрузки"
                        value={form.pickupAddress}
                        onChange={(event) =>
                            updateField(
                                'pickupAddress',
                                event.currentTarget.value
                            )
                        }
                    />
                    <Input
                        id="shipperDropoffAddress"
                        label="Адрес разгрузки"
                        placeholder="Адрес разгрузки"
                        value={form.dropoffAddress}
                        onChange={(event) =>
                            updateField(
                                'dropoffAddress',
                                event.currentTarget.value
                            )
                        }
                    />
                    <Input
                        id="shipperPickupDate"
                        label="Дата и время подачи"
                        placeholder="Например, 12 июня, 09:00"
                        value={form.pickupDate}
                        onChange={(event) =>
                            updateField('pickupDate', event.currentTarget.value)
                        }
                    />
                </div>
            </div>

            <div className="rounded-[0.625rem] border border-[#D1D1D1] bg-white p-5">
                <h2 className="leading-5.5 text-xl font-bold text-[#4A4A4A]">
                    Груз
                </h2>
                <div className="mt-4 flex flex-col gap-2">
                    <Input
                        id="shipperCargoTitle"
                        label="Название груза"
                        placeholder="Название груза"
                        value={form.cargoTitle}
                        onChange={(event) =>
                            updateField('cargoTitle', event.currentTarget.value)
                        }
                    />
                    <div className="grid grid-cols-2 gap-2">
                        <Input
                            id="shipperCargoWeight"
                            label="Вес, т"
                            placeholder="Вес, т"
                            value={form.cargoWeightTons}
                            onChange={(event) =>
                                updateField(
                                    'cargoWeightTons',
                                    event.currentTarget.value
                                )
                            }
                        />
                        <Input
                            id="shipperCargoVolume"
                            label="Объем, м3"
                            placeholder="Объем, м3"
                            value={form.cargoVolumeM3}
                            onChange={(event) =>
                                updateField(
                                    'cargoVolumeM3',
                                    event.currentTarget.value
                                )
                            }
                        />
                    </div>
                </div>
            </div>

            <div className="rounded-[0.625rem] border border-[#D1D1D1] bg-white p-5">
                <h2 className="leading-5.5 text-xl font-bold text-[#4A4A4A]">
                    Тип машины
                </h2>
                <div className="mt-4 flex flex-col gap-3">
                    {shipperVehicleTypesMock.map((vehicleOption) => (
                        <VehicleTypeCard
                            key={vehicleOption.type}
                            option={vehicleOption}
                            isSelected={form.vehicleType === vehicleOption.type}
                            onSelect={(value) =>
                                updateField('vehicleType', value)
                            }
                        />
                    ))}
                </div>
            </div>

            <div className="rounded-[0.625rem] border border-[#D1D1D1] bg-white p-5">
                <label
                    htmlFor="shipperComment"
                    className="leading-5.5 text-xl font-bold text-[#4A4A4A]"
                >
                    Комментарий
                </label>
                <p className="leading-4.4 mt-2 text-sm text-[#A0A0A0]">
                    Можно указать детали подачи, температурный режим или
                    контакты на погрузке.
                </p>
                <textarea
                    id="shipperComment"
                    value={form.comment}
                    onChange={(event) =>
                        updateField('comment', event.currentTarget.value)
                    }
                    rows={4}
                    placeholder="Комментарий для логиста и водителя"
                    className="hide-tabbar mt-4 w-full rounded-[0.625rem] border border-[#D1D1D1] bg-white px-4 py-4 text-sm text-[#4A4A4A] outline-none placeholder:text-[#A0A0A0]"
                />
            </div>

            <div className="rounded-[0.625rem] border border-[#D1D1D1] bg-white p-5">
                <p className="text-sm font-medium text-[#A0A0A0]">
                    Предварительная стоимость
                </p>
                <p className="mt-2 text-[2rem] font-bold leading-[2.4rem] text-[#4A4A4A]">
                    {formatPrice(estimatedPrice)}
                </p>
                <p className="leading-4.4 mt-2 text-sm text-[#A0A0A0]">
                    Тип машины: {getVehicleTypeLabel(form.vehicleType)}
                </p>
                <Button
                    variant="secondary"
                    type="submit"
                    className="mt-4"
                    disabled={!Boolean(isReady)}
                >
                    Создать заявку
                </Button>
            </div>
        </form>
    );
};

export default CreateOrderForm;
