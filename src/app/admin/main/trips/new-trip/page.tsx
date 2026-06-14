'use client';
import React, { useState } from 'react';
import ComboBox from '@/app/admin/main/trips/_components/inputCombo';
import PhaseA from './_components/phaseA';
import PhaseB from './_components/phaseB';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { BaseCombobox } from '@/components/base/combobox';
import { Input } from '@/components/ui/input';

const NewTrips = () => {
    const [selections, setSelections] = useState<Record<string, any | null>>({
        route: null,
        driver: null,
        bus: null,
    });

    const handleSelectionChange = (name: string, selected: any | null) => {
        setSelections((prevSelections) => ({
            ...prevSelections,
            [name]: selected,
        }));
    };

    // Проверяем, все ли значения выбраны
    const allSelected = Object.values(selections).every(
        (value) => value !== null
    );

    return (
        <div className="my-6 flex flex-col gap-4">
            <p className="text-2xl font-semibold text-[#4A4A4A]">
                Добавить рейс
            </p>
            <div className="flex flex-col rounded-[20px] border bg-white px-8 py-10">
                {/* Комбобоксы старт */}
                <div className="flex flex-row items-start gap-8">
                    <div className="flex flex-col items-start gap-1">
                        <p className="text-lg font-semibold text-[#4A4A4A]">
                            Выберите маршрут
                        </p>
                        <BaseCombobox
                            options={[
                                { value: '1', label: 'Кокшетау - Астана' },
                                { value: '2', label: 'Кокшетау - Алматы' },
                            ]}
                        />
                    </div>
                    <div className="flex flex-col items-start gap-1">
                        <p className="text-lg font-semibold text-[#4A4A4A]">
                            Выберите водителя
                        </p>
                        <BaseCombobox
                            options={[
                                { value: '1', label: 'Кокшетау - Астана' },
                                { value: '2', label: 'Кокшетау - Алматы' },
                            ]}
                        />
                    </div>
                </div>
                <div className="mt-6 flex flex-col items-start gap-1">
                    <p className="text-lg font-semibold text-[#4A4A4A]">
                        Выберите автобус
                    </p>
                    <BaseCombobox
                        className="w-fit"
                        options={[
                            { value: '1', label: 'Кокшетау - Астана' },
                            { value: '2', label: 'Кокшетау - Алматы' },
                        ]}
                    />
                </div>
                <Button
                    size="xl"
                    variant="default"
                    className="mt-4 w-fit px-12"
                >
                    Сохранить водителя
                </Button>

                {/* Отображение PhaseA и PhaseB в зависимости от выбора */}
                {allSelected && <PhaseA />}
                {allSelected && <PhaseB />}
            </div>
        </div>
    );
};

export default NewTrips;
