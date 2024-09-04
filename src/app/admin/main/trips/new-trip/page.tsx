'use client';
import React, { useState, useMemo } from 'react';
import ComboBox from '@/app/admin/main/trips/_components/inputCombo';
import PhaseB from './_components/phaseB';
import { getTripsAction } from '../action';
import { useServerActionQuery } from '@/lib/server-action-hooks';
import { Trips } from '@/data/types';
import Spinner from '@/components/spinner';
import { NewTripSchema } from '@/data/schemas';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ErrorMessage from '@/components/error-message';
import { z } from 'zod';

const NewTrips: React.FC = () => {
    const { data, isPending } = useServerActionQuery(getTripsAction, {
        input: undefined,
        queryKey: ['getTrips'],
    });

    const [route, setRoute] = useState<{ id: number; name: string } | null>(null);
    const [driver, setDriver] = useState<{ id: number; name: string } | null>(null);
    const [bus, setBus] = useState<{ id: number; name: string } | null>(null);

    const {
        control,
        formState: { errors },
        handleSubmit
    } = useForm<z.output<typeof NewTripSchema>>({
        resolver: zodResolver(NewTripSchema),
    });

    const onSubmit = handleSubmit((data) => {
        console.log('Выбранный маршрут:', data);

    });

    const routes = useMemo(() => {
        return data?.map((trip: Trips) => ({
            id: trip.route.id,
            name: `${trip.from_city} - ${trip.to_city}`,
        })) || [];
    }, [data]);

    const drivers = useMemo(() => {
        return data?.map((trip: Trips) => ({
            id: trip.driver.id,
            name: `${trip.driver.full_name}`,
        })) || [];
    }, [data]);

    const buses = useMemo(() => {
        return data?.map((trip: Trips) => ({
            id: trip.bus.id,
            name: `${trip.bus.model_stamp} (${trip.bus.state_number})`,
        })) || [];
    }, [data]);

    const handleOptionSelect = (name: string, selectedItem: { id: number; name: string } | null) => {
        if (name === 'route') {
            setRoute(selectedItem);
        } else if (name === 'driver') {
            setDriver(selectedItem);
        } else if (name === 'bus') {
            setBus(selectedItem);
        }
    };

    const handleNewItem = (newItem: string) => {
        console.log('Добавить новый элемент:', newItem);
    };

    const selectedTrip = useMemo(() => {
        return data?.find(
            (trip: Trips) =>
                trip.route.id === route?.id 
                // &&
                // trip.bus.id === bus?.id &&
                // trip.driver.id === driver?.id &&
        );
    }, [route, driver, bus, data]);

    if (isPending) {
        return (
            <div className="flex justify-center py-11">
                <Spinner />
            </div>
        );
    }

    return (
        <form onSubmit={onSubmit} className="flex flex-col my-6 mb-96 gap-4">
            <p className="text-[42px] font-semibold text-[#4A4A4A]">Добавить рейс</p>
            <div className="flex flex-col border bg-white rounded-[20px] px-8 py-10">
                <div className="flex flex-row gap-8 items-start">
                    <div className="flex flex-col gap-4 items-start">
                        <p className="text-2xl font-semibold text-[#4A4A4A]">Выберите маршрут</p>
                        <Controller
                            name="route"
                            control={control}
                            render={({ field }) => (
                                <>
                                    <ComboBox
                                        name="route"
                                        options={routes}
                                        placeholder="Маршрут"
                                        onNewItem={handleNewItem}
                                        onOptionSelect={(name, selected) => field.onChange(selected?.id || null)}

                                        onSelectionChange={(name, selected) => {
                                            handleOptionSelect(name, selected);
                                            field.onChange(selected?.id || null);
                                        }}
                                    />
                                    <ErrorMessage message={errors.route?.message} />
                                </>
                            )}
                        />
                    </div>
                    <div className="flex flex-col gap-4 items-start">
                        <p className="text-2xl font-semibold text-[#4A4A4A]">Выберите водителя</p>
                        <Controller
                            name="driver"
                            control={control}
                            render={({ field }) => (
                                <>
                                    <ComboBox
                                        name="driver"
                                        options={drivers}
                                        placeholder="Водители"
                                        onNewItem={handleNewItem}
                                        onOptionSelect={(name, selected) => field.onChange(selected?.id || null)}

                                        onSelectionChange={(name, selected) => {
                                            handleOptionSelect(name, selected);
                                            field.onChange(selected?.id || null);
                                        }}
                                    />
                                    <ErrorMessage message={errors.driver?.message} />
                                </>
                            )}
                        />
                    </div>
                </div>
                <div className="flex flex-col mt-6 gap-4 items-start">
                    <p className="text-2xl font-semibold text-[#4A4A4A]">Выберите автобус</p>
                    <Controller
                        name="bus"
                        control={control}
                        render={({ field }) => (
                            <>
                                <ComboBox
                                    name="bus"
                                    options={buses}
                                    placeholder="Автобусы"
                                    onNewItem={handleNewItem}
                                    onOptionSelect={(name, selected) => field.onChange(selected?.id || null)}
                                    onSelectionChange={(name, selected) => {
                                        handleOptionSelect(name, selected);
                                        field.onChange(selected?.id || null);
                                    }}
                                />
                                <ErrorMessage message={errors.bus?.message} />
                            </>
                        )}
                    />
                </div>

                {selectedTrip && (
                    <PhaseB key={`${route?.id}-${driver?.id}-${bus?.id}`} selectedTrip={selectedTrip} />
                )}
            </div>
        </form>
    );
};

export default NewTrips;
