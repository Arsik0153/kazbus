'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import Button from '@/components/button';
import ErrorMessage from '@/components/error-message';
import Input from '@/components/input';
import InputPhone from '@/components/inputPhone';
import Topbar from '@/components/topbar';
import type { VehicleType } from '../_types/cargo';

type RegistrationStep = 1 | 2 | 3 | 4 | 5;

type RegistrationFormData = {
    fullName: string;
    phone: string;
    city: string;
    fleet: string;
    experienceYears: string;
    licenseNumber: string;
    model: string;
    plateNumber: string;
    trailerNumber: string;
    type: VehicleType | '';
    capacityTons: string;
    year: string;
};

type FormErrors = Partial<Record<keyof RegistrationFormData, string>>;

const STEP_COUNT = 5;

const VEHICLE_TYPES: Array<{ label: string; value: VehicleType }> = [
    { label: 'Рефрижератор', value: 'refrigerator' },
    { label: 'Тент', value: 'tent' },
    { label: 'Фургон', value: 'van' },
    { label: 'Платформа', value: 'flatbed' },
];

const STEP_COPY: Record<
    RegistrationStep,
    { title: string; description: string; buttonLabel: string }
> = {
    1: {
        title: 'Личные данные',
        description:
            'Сначала укажем контакты и город, чтобы оформить профиль водителя.',
        buttonLabel: 'Дальше',
    },
    2: {
        title: 'Данные водителя',
        description:
            'Добавьте стаж, автопарк и номер водительского удостоверения.',
        buttonLabel: 'Дальше',
    },
    3: {
        title: 'Транспорт',
        description: 'Теперь заполним основные данные по тягачу и прицепу.',
        buttonLabel: 'Дальше',
    },
    4: {
        title: 'Параметры машины',
        description: 'Выберите тип кузова и укажите грузовые характеристики.',
        buttonLabel: 'Проверить данные',
    },
    5: {
        title: 'Проверка профиля',
        description:
            'Посмотрите, все ли верно. После этого профиль уйдет на проверку.',
        buttonLabel: 'Завершить регистрацию',
    },
};

const EMPTY_FORM: RegistrationFormData = {
    fullName: '',
    phone: '',
    city: '',
    fleet: '',
    experienceYears: '',
    licenseNumber: '',
    model: '',
    plateNumber: '',
    trailerNumber: '',
    type: '',
    capacityTons: '',
    year: '',
};

const getInputValue = (event: ChangeEvent<HTMLInputElement>) =>
    event.target.value;

const validateStep = (
    step: RegistrationStep,
    form: RegistrationFormData
): FormErrors => {
    const errors: FormErrors = {};

    if (step === 1) {
        if (!form.fullName.trim()) {
            errors.fullName = 'Введите ФИО водителя';
        }
        if (form.phone.trim().length < 18) {
            errors.phone = 'Введите корректный номер телефона';
        }
        if (!form.city.trim()) {
            errors.city = 'Укажите город';
        }
    }

    if (step === 2) {
        if (!form.fleet.trim()) {
            errors.fleet = 'Укажите автопарк';
        }
        if (!form.experienceYears.trim()) {
            errors.experienceYears = 'Укажите стаж';
        } else if (
            Number.isNaN(Number(form.experienceYears)) ||
            Number(form.experienceYears) < 0
        ) {
            errors.experienceYears = 'Стаж должен быть числом';
        }
        if (!form.licenseNumber.trim()) {
            errors.licenseNumber = 'Укажите номер удостоверения';
        }
    }

    if (step === 3) {
        if (!form.model.trim()) {
            errors.model = 'Укажите модель машины';
        }
        if (!form.plateNumber.trim()) {
            errors.plateNumber = 'Укажите госномер';
        }
        if (!form.trailerNumber.trim()) {
            errors.trailerNumber = 'Укажите номер прицепа';
        }
    }

    if (step === 4) {
        if (!form.type) {
            errors.type = 'Выберите тип кузова';
        }
        if (!form.capacityTons.trim()) {
            errors.capacityTons = 'Укажите грузоподъемность';
        } else if (
            Number.isNaN(Number(form.capacityTons)) ||
            Number(form.capacityTons) <= 0
        ) {
            errors.capacityTons = 'Введите корректную грузоподъемность';
        }
        if (!form.year.trim()) {
            errors.year = 'Укажите год выпуска';
        } else if (
            Number.isNaN(Number(form.year)) ||
            form.year.trim().length !== 4
        ) {
            errors.year = 'Введите корректный год';
        }
    }

    return errors;
};

const CargoRegistrationPage = () => {
    const router = useRouter();
    const [step, setStep] = useState<RegistrationStep>(1);
    const [form, setForm] = useState<RegistrationFormData>(EMPTY_FORM);
    const [errors, setErrors] = useState<FormErrors>({});
    const [isVehicleTypeSelectorOpen, setIsVehicleTypeSelectorOpen] =
        useState(false);

    const stepCopy = STEP_COPY[step];
    const selectedVehicleType = VEHICLE_TYPES.find(
        (item) => item.value === form.type
    );

    const updateField = <K extends keyof RegistrationFormData>(
        key: K,
        value: RegistrationFormData[K]
    ) => {
        setForm((current) => ({
            ...current,
            [key]: value,
        }));
        setErrors((current) => ({
            ...current,
            [key]: undefined,
        }));
    };

    const handleNext = () => {
        if (step === 5) {
            router.push('/cargo');
            return;
        }

        const validationErrors = validateStep(step, form);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        setStep((current) => (current + 1) as RegistrationStep);
    };

    const handleBack = () => {
        if (step === 1) {
            router.push('/cargo/login');
            return;
        }

        setErrors({});
        setStep((current) => (current - 1) as RegistrationStep);
    };

    const handleVehicleTypeSelect = (value: VehicleType) => {
        updateField('type', value);
        setIsVehicleTypeSelectorOpen(false);
    };

    return (
        <>
            <Topbar backHref="/cargo/login">Joool Cargo</Topbar>
            <div className="bg-(--gray) min-h-full px-5 pb-28 pt-5">
                <div className="rounded-[0.625rem] border border-[#D1D1D1] bg-white p-5">
                    <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-bold text-[#E74949]">
                            Joool Cargo
                        </p>
                        <p className="text-sm font-medium text-[#A0A0A0]">
                            Шаг {step} из {STEP_COUNT}
                        </p>
                    </div>

                    <div className="mt-4 flex gap-2">
                        {Array.from({ length: STEP_COUNT }).map((_, index) => {
                            const progressStep = index + 1;

                            return (
                                <div
                                    key={progressStep}
                                    className={`h-2 flex-1 rounded-full ${
                                        progressStep <= step
                                            ? 'bg-[#E23333]'
                                            : 'bg-[#E9E9E9]'
                                    }`}
                                />
                            );
                        })}
                    </div>

                    <h1 className="mt-5 text-[2rem] font-bold leading-[2.4rem] text-[#4A4A4A]">
                        Регистрация водителя
                    </h1>
                    <p className="leading-5.5 mt-2 text-xl font-bold text-[#4A4A4A]">
                        {stepCopy.title}
                    </p>
                    <p className="leading-4.4 mt-3 text-sm text-[#A0A0A0]">
                        {stepCopy.description}
                    </p>

                    {step === 1 && (
                        <div className="mt-6 flex flex-col gap-2">
                            <Input
                                id="cargoFullName"
                                label="ФИО"
                                placeholder="ФИО"
                                value={form.fullName}
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>
                                ) =>
                                    updateField(
                                        'fullName',
                                        getInputValue(event)
                                    )
                                }
                            />
                            <ErrorMessage message={errors.fullName} />

                            <InputPhone
                                id="cargoRegistrationPhone"
                                label="Телефон"
                                placeholder="+7 (___) ___ - __ - __"
                                mask="+7 (___) ___-__-__"
                                type="tel"
                                iconLeft={
                                    <Image
                                        src="/assets/main/kz.png"
                                        width={24}
                                        height={26}
                                        alt="KZ"
                                        quality={100}
                                    />
                                }
                                value={form.phone}
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>
                                ) => updateField('phone', getInputValue(event))}
                            />
                            <ErrorMessage message={errors.phone} />

                            <Input
                                id="cargoCity"
                                label="Город"
                                placeholder="Город"
                                value={form.city}
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>
                                ) => updateField('city', getInputValue(event))}
                            />
                            <ErrorMessage message={errors.city} />
                        </div>
                    )}

                    {step === 2 && (
                        <div className="mt-6 flex flex-col gap-2">
                            <Input
                                id="cargoFleet"
                                label="Автопарк"
                                placeholder="Название автопарка"
                                value={form.fleet}
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>
                                ) => updateField('fleet', getInputValue(event))}
                            />
                            <ErrorMessage message={errors.fleet} />

                            <Input
                                id="cargoExperience"
                                label="Стаж вождения"
                                placeholder="Количество лет"
                                type="number"
                                value={form.experienceYears}
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>
                                ) =>
                                    updateField(
                                        'experienceYears',
                                        getInputValue(event)
                                    )
                                }
                            />
                            <ErrorMessage message={errors.experienceYears} />

                            <Input
                                id="cargoLicenseNumber"
                                label="Номер водительского удостоверения"
                                placeholder="Номер водительского удостоверения"
                                value={form.licenseNumber}
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>
                                ) =>
                                    updateField(
                                        'licenseNumber',
                                        getInputValue(event)
                                    )
                                }
                            />
                            <ErrorMessage message={errors.licenseNumber} />
                        </div>
                    )}

                    {step === 3 && (
                        <div className="mt-6 flex flex-col gap-2">
                            <Input
                                id="cargoModel"
                                label="Модель тягача"
                                placeholder="Например, Volvo FH 500"
                                value={form.model}
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>
                                ) => updateField('model', getInputValue(event))}
                            />
                            <ErrorMessage message={errors.model} />

                            <Input
                                id="cargoPlateNumber"
                                label="Госномер"
                                placeholder="777 ABA 02"
                                value={form.plateNumber}
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>
                                ) =>
                                    updateField(
                                        'plateNumber',
                                        getInputValue(event)
                                    )
                                }
                            />
                            <ErrorMessage message={errors.plateNumber} />

                            <Input
                                id="cargoTrailerNumber"
                                label="Номер прицепа"
                                placeholder="TR 438 AK"
                                value={form.trailerNumber}
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>
                                ) =>
                                    updateField(
                                        'trailerNumber',
                                        getInputValue(event)
                                    )
                                }
                            />
                            <ErrorMessage message={errors.trailerNumber} />
                        </div>
                    )}

                    {step === 4 && (
                        <div className="mt-6">
                            <p className="mb-3 text-sm font-medium text-[#A0A0A0]">
                                Выберите тип машины
                            </p>
                            <div className="relative">
                                <button
                                    type="button"
                                    aria-haspopup="listbox"
                                    aria-expanded={isVehicleTypeSelectorOpen}
                                    onClick={() =>
                                        setIsVehicleTypeSelectorOpen(
                                            (current) => !current
                                        )
                                    }
                                    className={`flex min-h-[4.5rem] w-full items-center justify-between rounded-[0.625rem] border bg-white px-5 text-left transition-colors ${
                                        errors.type
                                            ? 'border-[#E23333]'
                                            : 'border-[#D1D1D1]'
                                    }`}
                                >
                                    <span className="flex flex-col">
                                        <span className="text-xs font-medium text-[#A0A0A0]">
                                            Тип машины
                                        </span>
                                        <span
                                            className={`mt-1 text-base font-semibold ${
                                                selectedVehicleType
                                                    ? 'text-[#4A4A4A]'
                                                    : 'text-[#A0A0A0]'
                                            }`}
                                        >
                                            {selectedVehicleType?.label ??
                                                'Выберите из списка'}
                                        </span>
                                    </span>
                                    <ChevronDown
                                        className={`size-5 shrink-0 text-[#A0A0A0] transition-transform ${
                                            isVehicleTypeSelectorOpen
                                                ? 'rotate-180'
                                                : ''
                                        }`}
                                    />
                                </button>

                                {isVehicleTypeSelectorOpen && (
                                    <div
                                        role="listbox"
                                        className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-20 overflow-hidden rounded-[0.625rem] border border-[#D1D1D1] bg-white shadow-[0_1rem_2rem_rgba(0,0,0,0.12)]"
                                    >
                                        {VEHICLE_TYPES.map((item) => {
                                            const isSelected =
                                                form.type === item.value;

                                            return (
                                                <button
                                                    key={item.value}
                                                    type="button"
                                                    role="option"
                                                    aria-selected={isSelected}
                                                    onClick={() =>
                                                        handleVehicleTypeSelect(
                                                            item.value
                                                        )
                                                    }
                                                    className={`flex w-full items-center justify-between border-b border-[#EFEFEF] px-5 py-4 text-left text-base font-semibold last:border-b-0 ${
                                                        isSelected
                                                            ? 'bg-[#FFF2F2] text-[#E23333]'
                                                            : 'bg-white text-[#4A4A4A]'
                                                    }`}
                                                >
                                                    {item.label}
                                                    {isSelected && (
                                                        <Check className="size-5" />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                            <ErrorMessage message={errors.type} />

                            <div className="mt-4 flex flex-col gap-2">
                                <Input
                                    id="cargoCapacity"
                                    label="Грузоподъемность"
                                    placeholder="Тонны"
                                    type="number"
                                    value={form.capacityTons}
                                    onChange={(
                                        event: ChangeEvent<HTMLInputElement>
                                    ) =>
                                        updateField(
                                            'capacityTons',
                                            getInputValue(event)
                                        )
                                    }
                                />
                                <ErrorMessage message={errors.capacityTons} />

                                <Input
                                    id="cargoYear"
                                    label="Год выпуска"
                                    placeholder="2021"
                                    type="number"
                                    value={form.year}
                                    onChange={(
                                        event: ChangeEvent<HTMLInputElement>
                                    ) =>
                                        updateField(
                                            'year',
                                            getInputValue(event)
                                        )
                                    }
                                />
                                <ErrorMessage message={errors.year} />
                            </div>
                        </div>
                    )}

                    {step === 5 && (
                        <div className="mt-6 flex flex-col gap-4">
                            <div className="rounded-[0.625rem] bg-[#F8F8F8] p-4">
                                <p className="text-sm font-bold text-[#E74949]">
                                    Водитель
                                </p>
                                <div className="mt-3 grid grid-cols-2 gap-3">
                                    <div>
                                        <p className="text-xs font-medium text-[#A0A0A0]">
                                            ФИО
                                        </p>
                                        <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                                            {form.fullName}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-[#A0A0A0]">
                                            Телефон
                                        </p>
                                        <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                                            {form.phone}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-[#A0A0A0]">
                                            Город
                                        </p>
                                        <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                                            {form.city}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-[#A0A0A0]">
                                            Автопарк
                                        </p>
                                        <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                                            {form.fleet}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-[#A0A0A0]">
                                            Стаж
                                        </p>
                                        <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                                            {form.experienceYears} лет
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-[#A0A0A0]">
                                            Удостоверение
                                        </p>
                                        <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                                            {form.licenseNumber}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-[0.625rem] bg-[#F8F8F8] p-4">
                                <p className="text-sm font-bold text-[#E74949]">
                                    Машина
                                </p>
                                <div className="mt-3 grid grid-cols-2 gap-3">
                                    <div>
                                        <p className="text-xs font-medium text-[#A0A0A0]">
                                            Модель
                                        </p>
                                        <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                                            {form.model}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-[#A0A0A0]">
                                            Госномер
                                        </p>
                                        <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                                            {form.plateNumber}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-[#A0A0A0]">
                                            Прицеп
                                        </p>
                                        <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                                            {form.trailerNumber}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-[#A0A0A0]">
                                            Тип
                                        </p>
                                        <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                                            {
                                                VEHICLE_TYPES.find(
                                                    (item) =>
                                                        item.value === form.type
                                                )?.label
                                            }
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-[#A0A0A0]">
                                            Грузоподъемность
                                        </p>
                                        <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                                            {form.capacityTons} т
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-[#A0A0A0]">
                                            Год выпуска
                                        </p>
                                        <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                                            {form.year}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="leading-4.4 rounded-[0.625rem] border border-[#F3CDCD] bg-[#FFF2F2] p-4 text-sm text-[#E74949]">
                                После завершения регистрации проверьте данные
                                водителя и машины перед продолжением работы.
                            </div>
                        </div>
                    )}

                    <div className="mt-5 flex flex-col gap-2">
                        {step > 1 && (
                            <Button
                                variant="ghost"
                                type="button"
                                onClick={handleBack}
                            >
                                Назад
                            </Button>
                        )}
                        <Button
                            variant="secondary"
                            type="button"
                            onClick={handleNext}
                        >
                            {stepCopy.buttonLabel}
                        </Button>
                    </div>

                    <button
                        type="button"
                        className="mt-4 w-full text-center text-base font-medium text-[#E23333] underline"
                        onClick={() => router.push('/cargo/login')}
                    >
                        Уже есть аккаунт
                    </button>
                </div>
            </div>
        </>
    );
};

export default CargoRegistrationPage;
