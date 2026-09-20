'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Save } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    companyProfileInputSchema,
    hasValidCompanyPhoneCharacters,
    normalizeCompanyPhone,
    type CompanyProfile,
    type CompanyProfileField,
    type CompanyProfileFieldErrors,
    type CompanyProfileInput,
    type CompanyProfilePatch,
} from '@/lib/admin-company-schema';
import { saveCompanyProfile } from './actions';

type CompanyFormProps = { initialProfile: CompanyProfile };

const fields: Array<{
    name: CompanyProfileField;
    label: string;
    autoComplete: string;
    maxLength: number;
    placeholder: string;
    inputMode?: 'text' | 'numeric' | 'tel' | 'email';
    className?: string;
}> = [
    {
        name: 'legal_name',
        label: 'Юридическое название',
        autoComplete: 'organization',
        maxLength: 255,
        placeholder: 'ТОО «Название компании»',
    },
    {
        name: 'bin_iin',
        label: 'БИН / ИИН',
        autoComplete: 'off',
        maxLength: 12,
        inputMode: 'numeric',
        placeholder: '12 цифр',
    },
    {
        name: 'city',
        label: 'Город',
        autoComplete: 'address-level2',
        maxLength: 120,
        placeholder: 'Алматы',
    },
    {
        name: 'contact_phone',
        label: 'Контактный телефон',
        autoComplete: 'tel',
        maxLength: 24,
        inputMode: 'tel',
        placeholder: '+7 700 000 00 00',
    },
    {
        name: 'email',
        label: 'Email',
        autoComplete: 'email',
        maxLength: 254,
        inputMode: 'email',
        placeholder: 'office@example.kz',
    },
    {
        name: 'address',
        label: 'Юридический или фактический адрес',
        autoComplete: 'street-address',
        maxLength: 500,
        placeholder: 'Улица, дом, офис',
        className: 'md:col-span-2',
    },
];

function editableValues(profile: CompanyProfile): CompanyProfileInput {
    const { status: _status, ...values } = profile;
    return values;
}

export default function CompanyForm({ initialProfile }: CompanyFormProps) {
    const router = useRouter();
    const [profile, setProfile] = useState(initialProfile);
    const [values, setValues] = useState(() => editableValues(initialProfile));
    const [fieldErrors, setFieldErrors] = useState<CompanyProfileFieldErrors>(
        {}
    );
    const [message, setMessage] = useState<string>();
    const [saved, setSaved] = useState(false);
    const [dirtyFields, setDirtyFields] = useState<Set<CompanyProfileField>>(
        new Set()
    );
    const [isSaving, setIsSaving] = useState(false);
    const requestSequence = useRef(0);

    const updateField = (field: CompanyProfileField, value: string) => {
        setValues((current) => ({ ...current, [field]: value }));
        setDirtyFields((current) => new Set(current).add(field));
        setFieldErrors((current) => ({ ...current, [field]: undefined }));
        setMessage(undefined);
        setSaved(false);
    };

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (isSaving) return;
        if (dirtyFields.size === 0) {
            setMessage('Изменений для сохранения нет.');
            return;
        }
        const phoneCharactersAreValid = hasValidCompanyPhoneCharacters(
            values.contact_phone
        );
        const parsed = companyProfileInputSchema.safeParse({
            ...values,
            contact_phone: normalizeCompanyPhone(values.contact_phone),
        });

        if (!parsed.success || !phoneCharactersAreValid) {
            const errors: CompanyProfileFieldErrors = {};
            if (!parsed.success) {
                for (const issue of parsed.error.issues) {
                    const field = issue.path[0] as CompanyProfileField;
                    errors[field] ??= issue.message;
                }
            }
            if (!phoneCharactersAreValid) {
                errors.contact_phone =
                    'Используйте только цифры и символы + ( ) -';
            }
            setFieldErrors(errors);
            setMessage('Проверьте заполненные поля.');
            setSaved(false);
            return;
        }

        setFieldErrors({});
        setMessage(undefined);
        setSaved(false);
        const patch = Object.fromEntries(
            Array.from(dirtyFields, (field) => [field, parsed.data[field]])
        ) as CompanyProfilePatch;
        const requestId = ++requestSequence.current;
        setIsSaving(true);

        void (async () => {
            let result;
            try {
                result = await saveCompanyProfile(patch);
            } catch {
                if (requestId === requestSequence.current) {
                    setMessage(
                        'Не удалось сохранить профиль. Попробуйте ещё раз.'
                    );
                }
                return;
            } finally {
                if (requestId === requestSequence.current) {
                    setIsSaving(false);
                }
            }

            if (requestId !== requestSequence.current) return;
            if (!result.ok) {
                if (result.reauthenticate) {
                    router.replace(`/admin?session=${result.reauthenticate}`);
                    router.refresh();
                    return;
                }
                setFieldErrors(result.fieldErrors ?? {});
                setMessage(result.message);
                return;
            }

            setProfile(result.profile);
            setValues(editableValues(result.profile));
            setDirtyFields(new Set());
            setSaved(true);
        })();
    };

    const statusLabel =
        profile.status === 'active' ? 'Активен' : 'Приостановлен';

    return (
        <form
            method="post"
            onSubmit={submit}
            noValidate
            className="flex flex-col gap-5"
        >
            <div className="rounded-[20px] bg-white px-8 py-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-semibold text-[#4A4A4A]">
                            Реквизиты и контакты
                        </h2>
                        <p className="mt-2 text-sm font-medium text-[#7C8799]">
                            Эти данные используются в рабочем кабинете
                            перевозчика.
                        </p>
                    </div>
                    <div
                        className={`rounded-full px-4 py-2 text-sm font-semibold ${profile.status === 'active' ? 'bg-[#E8F8E8] text-[#218838]' : 'bg-[#FEE2E2] text-[#B42318]'}`}
                    >
                        Статус профиля: {statusLabel}
                    </div>
                </div>

                <div className="mt-8 grid gap-6 md:grid-cols-2">
                    {fields.map((field) => {
                        const error = fieldErrors[field.name];
                        return (
                            <div key={field.name} className={field.className}>
                                <label
                                    htmlFor={field.name}
                                    className="mb-2 block text-sm font-semibold text-[#4A4A4A]"
                                >
                                    {field.label}
                                </label>
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    value={values[field.name]}
                                    onChange={(event) =>
                                        updateField(
                                            field.name,
                                            event.target.value
                                        )
                                    }
                                    autoComplete={field.autoComplete}
                                    maxLength={field.maxLength}
                                    inputMode={field.inputMode}
                                    placeholder={field.placeholder}
                                    disabled={isSaving}
                                    aria-invalid={Boolean(error)}
                                    aria-describedby={
                                        error
                                            ? `${field.name}-error`
                                            : undefined
                                    }
                                    className="h-14 px-4 text-base"
                                />
                                {error && (
                                    <p
                                        id={`${field.name}-error`}
                                        role="alert"
                                        className="mt-2 text-sm font-medium text-[#B42318]"
                                    >
                                        {error}
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 rounded-[20px] bg-white px-8 py-5">
                <div aria-live="polite">
                    {saved && (
                        <p className="flex items-center gap-2 text-sm font-semibold text-[#218838]">
                            <CheckCircle2 className="h-5 w-5" />
                            Изменения сохранены
                        </p>
                    )}
                    {message && (
                        <p
                            role="alert"
                            className="text-sm font-semibold text-[#B42318]"
                        >
                            {message}
                        </p>
                    )}
                </div>
                <Button
                    type="submit"
                    size="lg"
                    disabled={isSaving}
                    className="min-w-48 bg-[#E74949] px-6 text-white hover:bg-[#CF3C3C]"
                >
                    <Save className="h-4 w-4" />
                    {isSaving ? 'Сохраняем…' : 'Сохранить изменения'}
                </Button>
            </div>
        </form>
    );
}
