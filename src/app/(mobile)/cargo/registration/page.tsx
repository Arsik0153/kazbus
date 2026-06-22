'use client';

import { format } from 'date-fns';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
    Calendar as CalendarIcon,
    Check,
    ChevronDown,
    User,
    Upload,
} from 'lucide-react';
import { ru } from 'react-day-picker/locale';
import { useEffect, useState, type ChangeEvent, type ReactNode } from 'react';
import Button from '@/components/button';
import ErrorMessage from '@/components/error-message';
import Input from '@/components/input';
import InputPhone from '@/components/inputPhone';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { dayjsExt } from '@/lib/dayjs';
import type { VehicleType } from '../_types/cargo';

type RegistrationStep = 1 | 2 | 3 | 4 | 5 | 6;

type VehicleOwnership = 'personal' | 'company' | '';

type RegistrationFormData = {
    fullName: string;
    phone: string;
    city: string;
    birthDate: string;
    password: string;
    confirmPassword: string;
    experienceYears: string;
    photoFileName: string;
    licenseNumber: string;
    licenseIssuedAt: string;
    vehicleOwnership: VehicleOwnership;
    truckMake: string;
    truckModel: string;
    vinNumber: string;
    plateNumber: string;
    year: string;
    capacityTons: string;
    cargoVolumeM3: string;
    type: VehicleType | '';
    trailerVin: string;
    trailerNumber: string;
};

type FormErrors = Partial<Record<keyof RegistrationFormData, string>>;

const STEP_COUNT = 6;

const VEHICLE_TYPES: Array<{ label: string; value: VehicleType }> = [
    { label: 'Тент', value: 'tent' },
    { label: 'Рефрижератор', value: 'refrigerator' },
    { label: 'Фургон', value: 'van' },
];

const STEP_COPY: Record<
    RegistrationStep,
    { title: string; buttonLabel: string }
> = {
    1: {
        title: 'Личные данные',
        buttonLabel: 'Дальше',
    },
    2: {
        title: 'Водительское удостоверение',
        buttonLabel: 'Дальше',
    },
    3: {
        title: 'Машина',
        buttonLabel: 'Дальше',
    },
    4: {
        title: 'Тягач',
        buttonLabel: 'Дальше',
    },
    5: {
        title: 'Кузов и прицеп',
        buttonLabel: 'Проверить данные',
    },
    6: {
        title: 'Проверка',
        buttonLabel: 'Завершить регистрацию',
    },
};

const EMPTY_FORM: RegistrationFormData = {
    fullName: '',
    phone: '',
    city: '',
    birthDate: '',
    password: '',
    confirmPassword: '',
    experienceYears: '',
    photoFileName: '',
    licenseNumber: '',
    licenseIssuedAt: '',
    vehicleOwnership: '',
    truckMake: '',
    truckModel: '',
    vinNumber: '',
    plateNumber: '',
    year: '',
    capacityTons: '',
    cargoVolumeM3: '',
    type: '',
    trailerVin: '',
    trailerNumber: '',
};

const getInputValue = (event: ChangeEvent<HTMLInputElement>) =>
    event.target.value;

const parseDateValue = (value?: string) => {
    if (!value) return null;

    const parsedDate = dayjsExt(value, 'DD.MM.YYYY', true);

    return parsedDate.isValid() ? parsedDate.toDate() : null;
};

const isPositiveNumber = (value: string) => {
    const numericValue = Number(value);

    return !Number.isNaN(numericValue) && numericValue > 0;
};

const isNonNegativeNumber = (value: string) => {
    const numericValue = Number(value);

    return !Number.isNaN(numericValue) && numericValue >= 0;
};

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
        if (!form.birthDate.trim()) {
            errors.birthDate = 'Укажите дату рождения';
        }
        if (!form.password.trim()) {
            errors.password = 'Введите пароль';
        }
        if (!form.confirmPassword.trim()) {
            errors.confirmPassword = 'Повторите пароль';
        } else if (form.password !== form.confirmPassword) {
            errors.confirmPassword = 'Пароли не совпадают';
        }
    }

    if (step === 2) {
        if (!form.experienceYears.trim()) {
            errors.experienceYears = 'Укажите стаж';
        } else if (!isNonNegativeNumber(form.experienceYears)) {
            errors.experienceYears = 'Стаж должен быть числом от 0';
        }
        if (!form.licenseNumber.trim()) {
            errors.licenseNumber = 'Укажите номер удостоверения';
        }
        if (!form.licenseIssuedAt.trim()) {
            errors.licenseIssuedAt = 'Укажите дату выдачи удостоверения';
        }
    }

    if (step === 3) {
        if (!form.vehicleOwnership) {
            errors.vehicleOwnership = 'Выберите собственность машины';
        }
    }

    if (step === 4 && form.vehicleOwnership === 'personal') {
        if (!form.truckMake.trim()) {
            errors.truckMake = 'Укажите марку машины';
        }
        if (!form.truckModel.trim()) {
            errors.truckModel = 'Укажите модель машины';
        }
        if (!form.vinNumber.trim()) {
            errors.vinNumber = 'Укажите VIN номер';
        }
        if (!form.plateNumber.trim()) {
            errors.plateNumber = 'Укажите номер машины';
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

    if (step === 5 && form.vehicleOwnership === 'personal') {
        if (!form.capacityTons.trim()) {
            errors.capacityTons = 'Укажите грузоподъемность';
        } else if (!isPositiveNumber(form.capacityTons)) {
            errors.capacityTons = 'Введите корректную грузоподъемность';
        }
        if (!form.cargoVolumeM3.trim()) {
            errors.cargoVolumeM3 = 'Укажите объем грузового отсека';
        } else if (!isPositiveNumber(form.cargoVolumeM3)) {
            errors.cargoVolumeM3 = 'Введите корректный объем';
        }
        if (!form.type) {
            errors.type = 'Выберите тип машины';
        }
    }

    return errors;
};

const formatValue = (value: string, fallback = 'Не указано') =>
    value.trim() || fallback;

const SummaryItem = ({ label, value }: { label: string; value: ReactNode }) => (
    <div className="min-w-0">
        <p className="text-xs font-medium text-[#A0A0A0]">{label}</p>
        <p className="wrap-break-word mt-1 text-sm font-semibold text-[#4A4A4A]">
            {value}
        </p>
    </div>
);

const currentYear = new Date().getFullYear();

const CompactDatePicker = ({
    id,
    label,
    value,
    onChange,
    invalid,
}: {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    invalid?: boolean;
}) => {
    const selectedDate = parseDateValue(value);
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <button
                    id={id}
                    type="button"
                    aria-invalid={invalid}
                    className={`flex w-full items-center rounded-[10px] border bg-white px-6 py-4 text-left transition-colors ${
                        invalid ? 'border-[#E23333]' : 'border-black/60'
                    }`}
                >
                    <CalendarIcon className="size-5 shrink-0 text-[#4A4A4A]" />
                    <span className="ml-2 flex min-w-0 flex-col">
                        {value ? (
                            <>
                                <span className="mt-1 text-base font-semibold text-[#4A4A4A]">
                                    {value}
                                </span>
                            </>
                        ) : (
                            <span className="text-base font-medium">
                                {label}
                            </span>
                        )}
                    </span>
                </button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-0">
                <Calendar
                    locale={ru}
                    mode="single"
                    captionLayout="dropdown"
                    selected={selectedDate ?? undefined}
                    onSelect={(date) => {
                        onChange(date ? format(date, 'dd.MM.yyyy') : '');
                        setIsOpen(false);
                    }}
                    startMonth={new Date(1900, 0)}
                    endMonth={new Date(currentYear, 11)}
                    disabled={{ after: new Date() }}
                />
            </PopoverContent>
        </Popover>
    );
};

const CargoRegistrationPage = () => {
    const router = useRouter();
    const [step, setStep] = useState<RegistrationStep>(1);
    const [form, setForm] = useState<RegistrationFormData>(EMPTY_FORM);
    const [errors, setErrors] = useState<FormErrors>({});
    const [photoPreviewUrl, setPhotoPreviewUrl] = useState('');
    const [isVehicleTypeSelectorOpen, setIsVehicleTypeSelectorOpen] =
        useState(false);

    const isCompanyVehicle = form.vehicleOwnership === 'company';
    const activeStepCount = isCompanyVehicle ? 4 : STEP_COUNT;
    const activeStep = isCompanyVehicle && step === 6 ? 4 : step;
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
        if (step === 6) {
            router.push('/cargo');
            return;
        }

        const validationErrors = validateStep(step, form);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        if (step === 3 && form.vehicleOwnership === 'company') {
            setStep(6);
            return;
        }

        setStep((current) => (current + 1) as RegistrationStep);
    };

    const handleBack = () => {
        if (step === 1) {
            router.push('/cargo/login');
            return;
        }

        setErrors({});
        if (step === 6 && form.vehicleOwnership === 'company') {
            setStep(3);
            return;
        }

        setStep((current) => (current - 1) as RegistrationStep);
    };

    const handleVehicleTypeSelect = (value: VehicleType) => {
        updateField('type', value);
        setIsVehicleTypeSelectorOpen(false);
    };

    const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        updateField('photoFileName', file?.name ?? '');
        setPhotoPreviewUrl((currentUrl) => {
            if (currentUrl) {
                URL.revokeObjectURL(currentUrl);
            }

            return file ? URL.createObjectURL(file) : '';
        });
    };

    useEffect(() => {
        return () => {
            if (photoPreviewUrl) {
                URL.revokeObjectURL(photoPreviewUrl);
            }
        };
    }, [photoPreviewUrl]);

    return (
        <div className="min-h-full px-5 pt-20">
            <div className="flex items-center justify-between gap-3">
                <h1 className="text-[1.75rem] font-bold leading-8 text-[#4A4A4A]">
                    Регистрация
                </h1>
                <p className="text-sm font-medium text-[#A0A0A0]">
                    Шаг {activeStep} из {activeStepCount}
                </p>
            </div>

            <div className="mt-4 flex gap-2">
                {Array.from({ length: activeStepCount }).map((_, index) => {
                    const progressStep = index + 1;

                    return (
                        <div
                            key={progressStep}
                            className={`h-1.5 flex-1 rounded-full ${
                                progressStep <= activeStep
                                    ? 'bg-[#E23333]'
                                    : 'bg-[#E0E0E0]'
                            }`}
                        />
                    );
                })}
            </div>

            <p className="mt-6 text-lg font-bold leading-5 text-[#4A4A4A]">
                {stepCopy.title}
            </p>

            {step === 1 && (
                <div className="mt-4 flex flex-col gap-2">
                    <Input
                        id="cargoFullName"
                        label="ФИО"
                        placeholder="ФИО"
                        value={form.fullName}
                        onChange={(event: ChangeEvent<HTMLInputElement>) =>
                            updateField('fullName', getInputValue(event))
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
                        onChange={(event: ChangeEvent<HTMLInputElement>) =>
                            updateField('phone', getInputValue(event))
                        }
                    />
                    <ErrorMessage message={errors.phone} />

                    <Input
                        id="cargoCity"
                        label="Город"
                        placeholder="Город"
                        value={form.city}
                        onChange={(event: ChangeEvent<HTMLInputElement>) =>
                            updateField('city', getInputValue(event))
                        }
                    />
                    <ErrorMessage message={errors.city} />

                    <CompactDatePicker
                        id="cargoBirthDate"
                        label="Дата рождения"
                        value={form.birthDate}
                        onChange={(value) => updateField('birthDate', value)}
                        invalid={Boolean(errors.birthDate)}
                    />
                    <ErrorMessage message={errors.birthDate} />

                    <Input
                        id="cargoPassword"
                        label="Пароль"
                        placeholder="Пароль"
                        type="password"
                        value={form.password}
                        onChange={(event: ChangeEvent<HTMLInputElement>) =>
                            updateField('password', getInputValue(event))
                        }
                    />
                    <ErrorMessage message={errors.password} />

                    <Input
                        id="cargoConfirmPassword"
                        label="Повторите пароль"
                        placeholder="Повторите пароль"
                        type="password"
                        value={form.confirmPassword}
                        onChange={(event: ChangeEvent<HTMLInputElement>) =>
                            updateField('confirmPassword', getInputValue(event))
                        }
                    />
                    <ErrorMessage message={errors.confirmPassword} />

                    <div>
                        <input
                            id="cargoPhoto"
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={handlePhotoChange}
                        />
                        <label
                            htmlFor="cargoPhoto"
                            className="min-h-18 flex w-full items-center gap-3 rounded-[0.625rem] border border-dashed border-[#D1D1D1] bg-white px-5 text-left"
                        >
                            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#FFF2F2] text-[#E74949]">
                                <Upload className="size-5" />
                            </span>
                            <span className="min-w-0">
                                <span className="block text-sm font-semibold text-[#4A4A4A]">
                                    Фото профиля
                                </span>
                                <span className="mt-1 block truncate text-sm font-medium text-[#A0A0A0]">
                                    {form.photoFileName || 'Не обязательно'}
                                </span>
                            </span>
                        </label>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="mt-4 flex flex-col gap-2">
                    <Input
                        id="cargoExperience"
                        label="Стаж вождения"
                        placeholder="Количество лет"
                        type="number"
                        min={0}
                        value={form.experienceYears}
                        onChange={(event: ChangeEvent<HTMLInputElement>) =>
                            updateField('experienceYears', getInputValue(event))
                        }
                    />
                    <ErrorMessage message={errors.experienceYears} />

                    <Input
                        id="cargoLicenseNumber"
                        label="Номер водительского удостоверения"
                        placeholder="Номер водительского удостоверения"
                        value={form.licenseNumber}
                        onChange={(event: ChangeEvent<HTMLInputElement>) =>
                            updateField('licenseNumber', getInputValue(event))
                        }
                    />
                    <ErrorMessage message={errors.licenseNumber} />

                    <CompactDatePicker
                        id="cargoLicenseIssuedAt"
                        label="Дата выдачи"
                        value={form.licenseIssuedAt}
                        onChange={(value) =>
                            updateField('licenseIssuedAt', value)
                        }
                        invalid={Boolean(errors.licenseIssuedAt)}
                    />
                    <ErrorMessage message={errors.licenseIssuedAt} />
                </div>
            )}

            {step === 3 && (
                <div className="mt-4 flex flex-col gap-3">
                    <button
                        type="button"
                        onClick={() =>
                            updateField('vehicleOwnership', 'personal')
                        }
                        className={`flex w-full items-center justify-between rounded-[0.625rem] border px-5 py-4 text-left transition-colors ${
                            form.vehicleOwnership === 'personal'
                                ? 'border-[#E74949] bg-[#FFF2F2]'
                                : 'border-[#D1D1D1] bg-white'
                        }`}
                    >
                        <span>
                            <span className="block text-base font-bold text-[#4A4A4A]">
                                Личная машина
                            </span>
                        </span>
                        {form.vehicleOwnership === 'personal' && (
                            <Check className="size-5 shrink-0 text-[#E74949]" />
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            updateField('vehicleOwnership', 'company')
                        }
                        className={`flex w-full items-center justify-between rounded-[0.625rem] border px-5 py-4 text-left transition-colors ${
                            form.vehicleOwnership === 'company'
                                ? 'border-[#E74949] bg-[#FFF2F2]'
                                : 'border-[#D1D1D1] bg-white'
                        }`}
                    >
                        <span>
                            <span className="block text-base font-bold text-[#4A4A4A]">
                                Не личная машина
                            </span>
                        </span>
                        {form.vehicleOwnership === 'company' && (
                            <Check className="size-5 shrink-0 text-[#E74949]" />
                        )}
                    </button>
                    <ErrorMessage message={errors.vehicleOwnership} />
                </div>
            )}

            {step === 4 && (
                <div className="mt-4 flex flex-col gap-2">
                    <Input
                        id="cargoTruckMake"
                        label="Марка машины"
                        placeholder="Например, Volvo"
                        value={form.truckMake}
                        onChange={(event: ChangeEvent<HTMLInputElement>) =>
                            updateField('truckMake', getInputValue(event))
                        }
                    />
                    <ErrorMessage message={errors.truckMake} />

                    <Input
                        id="cargoTruckModel"
                        label="Модель машины"
                        placeholder="Например, FH 500"
                        value={form.truckModel}
                        onChange={(event: ChangeEvent<HTMLInputElement>) =>
                            updateField('truckModel', getInputValue(event))
                        }
                    />
                    <ErrorMessage message={errors.truckModel} />

                    <Input
                        id="cargoVinNumber"
                        label="VIN номер"
                        placeholder="VIN номер"
                        value={form.vinNumber}
                        onChange={(event: ChangeEvent<HTMLInputElement>) =>
                            updateField('vinNumber', getInputValue(event))
                        }
                    />
                    <ErrorMessage message={errors.vinNumber} />

                    <Input
                        id="cargoPlateNumber"
                        label="Номер машины"
                        placeholder="777 ABA 02"
                        value={form.plateNumber}
                        onChange={(event: ChangeEvent<HTMLInputElement>) =>
                            updateField('plateNumber', getInputValue(event))
                        }
                    />
                    <ErrorMessage message={errors.plateNumber} />

                    <Input
                        id="cargoYear"
                        label="Год выпуска"
                        placeholder="2021"
                        type="number"
                        value={form.year}
                        onChange={(event: ChangeEvent<HTMLInputElement>) =>
                            updateField('year', getInputValue(event))
                        }
                    />
                    <ErrorMessage message={errors.year} />
                </div>
            )}

            {step === 5 && (
                <div className="mt-4">
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
                            className={`min-h-18 flex w-full items-center justify-between rounded-[0.625rem] border bg-white px-5 text-left transition-colors ${
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
                                    const isSelected = form.type === item.value;

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
                            min={0}
                            value={form.capacityTons}
                            onChange={(event: ChangeEvent<HTMLInputElement>) =>
                                updateField(
                                    'capacityTons',
                                    getInputValue(event)
                                )
                            }
                        />
                        <ErrorMessage message={errors.capacityTons} />

                        <Input
                            id="cargoVolume"
                            label="Объем грузового отсека, м³"
                            placeholder="Например, 86"
                            type="number"
                            min={0}
                            value={form.cargoVolumeM3}
                            onChange={(event: ChangeEvent<HTMLInputElement>) =>
                                updateField(
                                    'cargoVolumeM3',
                                    getInputValue(event)
                                )
                            }
                        />
                        <ErrorMessage message={errors.cargoVolumeM3} />

                        <Input
                            id="cargoTrailerVin"
                            label="VIN номер прицепа, не обязательно"
                            placeholder="Не обязательно"
                            value={form.trailerVin}
                            onChange={(event: ChangeEvent<HTMLInputElement>) =>
                                updateField('trailerVin', getInputValue(event))
                            }
                        />

                        <Input
                            id="cargoTrailerNumber"
                            label="Номер прицепа"
                            placeholder="Если есть"
                            value={form.trailerNumber}
                            onChange={(event: ChangeEvent<HTMLInputElement>) =>
                                updateField(
                                    'trailerNumber',
                                    getInputValue(event)
                                )
                            }
                        />
                    </div>
                </div>
            )}

            {step === 6 && (
                <div className="mt-4 flex flex-col gap-5">
                    <div className="flex justify-center">
                        <div className="flex size-24 items-center justify-center overflow-hidden rounded-full border border-[#E9E9E9] bg-white">
                            {photoPreviewUrl ? (
                                <Image
                                    src={photoPreviewUrl}
                                    alt="Фото профиля"
                                    width={96}
                                    height={96}
                                    unoptimized
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <User className="size-10 text-[#A0A0A0]" />
                            )}
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-bold text-[#E74949]">
                            Водитель
                        </p>
                        <div className="mt-3 grid grid-cols-2 gap-3">
                            <SummaryItem
                                label="ФИО"
                                value={formatValue(form.fullName)}
                            />
                            <SummaryItem
                                label="Телефон"
                                value={formatValue(form.phone)}
                            />
                            <SummaryItem
                                label="Город"
                                value={formatValue(form.city)}
                            />
                            <SummaryItem
                                label="Дата рождения"
                                value={formatValue(form.birthDate)}
                            />
                            <SummaryItem
                                label="Стаж"
                                value={`${formatValue(
                                    form.experienceYears
                                )} лет`}
                            />
                        </div>
                    </div>

                    <div className="border-t border-[#E9E9E9] pt-4">
                        <p className="text-sm font-bold text-[#E74949]">
                            Удостоверение
                        </p>
                        <div className="mt-3 grid grid-cols-2 gap-3">
                            <SummaryItem
                                label="Номер"
                                value={formatValue(form.licenseNumber)}
                            />
                            <SummaryItem
                                label="Дата выдачи"
                                value={formatValue(form.licenseIssuedAt)}
                            />
                        </div>
                    </div>

                    <div className="border-t border-[#E9E9E9] pt-4">
                        <p className="text-sm font-bold text-[#E74949]">
                            Машина
                        </p>
                        {form.vehicleOwnership === 'personal' ? (
                            <div className="mt-3 grid grid-cols-2 gap-3">
                                <SummaryItem
                                    label="Марка"
                                    value={formatValue(form.truckMake)}
                                />
                                <SummaryItem
                                    label="Модель"
                                    value={formatValue(form.truckModel)}
                                />
                                <SummaryItem
                                    label="VIN"
                                    value={formatValue(form.vinNumber)}
                                />
                                <SummaryItem
                                    label="Номер машины"
                                    value={formatValue(form.plateNumber)}
                                />
                                <SummaryItem
                                    label="Год выпуска"
                                    value={formatValue(form.year)}
                                />
                                <SummaryItem
                                    label="Тип"
                                    value={
                                        selectedVehicleType?.label ??
                                        'Не указан'
                                    }
                                />
                                <SummaryItem
                                    label="Грузоподъемность, Т"
                                    value={`${formatValue(
                                        form.capacityTons
                                    )} т`}
                                />
                                <SummaryItem
                                    label="Объем"
                                    value={`${formatValue(
                                        form.cargoVolumeM3
                                    )} м³`}
                                />
                                <SummaryItem
                                    label="VIN прицепа"
                                    value={formatValue(form.trailerVin, 'Нет')}
                                />
                                <SummaryItem
                                    label="Номер прицепа"
                                    value={formatValue(
                                        form.trailerNumber,
                                        'Нет'
                                    )}
                                />
                            </div>
                        ) : (
                            <div className="leading-4.4 mt-3 rounded-[0.625rem] border border-[#F3CDCD] bg-[#FFF2F2] p-4 text-sm font-medium text-[#E74949]">
                                Данные машины заполнит логистическая компания в
                                админ-панели.
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="mt-5 flex flex-col gap-2">
                {step > 1 && (
                    <Button variant="ghost" type="button" onClick={handleBack}>
                        Назад
                    </Button>
                )}
                <Button variant="secondary" type="button" onClick={handleNext}>
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
    );
};

export default CargoRegistrationPage;
