'use client';
import { cargoFormSchemas, formatCargoPhone } from '@/lib/cargo-validation';

import { Button } from '@/components/ui/button';
import { CargoInput, CargoForm, Panel, type CargoPageProps } from './ui';
import { useCargoMutation } from './use-cargo-mutation';
import {
    createCargoDriverAction,
    createDriverInviteAction,
} from '@/actions/cargo';
import { type FormEvent, useState } from 'react';
import CargoFileList from '@/components/cargo/cargo-file-list';

const driverAccountStatusNames: Record<string, string> = {
    active: 'Аккаунт активен',
    pending: 'Ожидает регистрации',
};

export default function DriversPage({ state, currentUserId }: CargoPageProps) {
    const { busy, run, errorsFor } = useCargoMutation();
    const [invite, setInvite] = useState('');
    const [documentsDriver, setDocumentsDriver] = useState<number | null>(null);
    async function addDriver(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formElement = event.currentTarget;
        const form = new FormData(formElement);
        const ok = await run('driver-new', () =>
            createCargoDriverAction({
                full_name: String(form.get('full_name') ?? ''),
                phone_number: String(form.get('phone_number') ?? ''),
                license_number: String(form.get('license_number') ?? ''),
                status: 'active',
            })
        );
        if (ok) formElement.reset();
    }

    return (
        <div className="grid items-start gap-5 xl:grid-cols-[1.4fr_1fr]">
            <Panel title={`Водители · ${state.drivers.length}`}>
                {!state.drivers.length && (
                    <p className="text-muted-foreground">
                        Водители ещё не добавлены.
                    </p>
                )}
                {state.drivers.map((driver) => (
                    <div
                        className="mb-4 flex flex-col gap-3 rounded-2xl border border-[#EEF2F6] bg-[#F8FAFC] p-4"
                        key={driver.id}
                    >
                        <strong>{driver.full_name}</strong>
                        <p className="text-muted-foreground text-sm">
                            {formatCargoPhone(driver.phone_number)} ·{' '}
                            {driver.license_number} ·{' '}
                            {driverAccountStatusNames[driver.account_status]}
                        </p>
                        {driver.account_status === 'pending' && (
                            <Button
                                variant="link"
                                disabled={!!busy}
                                onClick={async () => {
                                    await run(
                                        `invite-${driver.id}`,
                                        async () => {
                                            const response =
                                                await createDriverInviteAction(
                                                    driver.id
                                                );
                                            if (response.ok)
                                                setInvite(
                                                    response.data.invite_token
                                                );
                                            return response;
                                        },
                                        `Приглашение для ${driver.full_name} создано.`
                                    );
                                }}
                            >
                                Создать приглашение
                            </Button>
                        )}
                        {driver.account_status === 'active' &&
                            driver.status === 'active' && (
                                <>
                                    <Button
                                        variant="link"
                                        type="button"
                                        onClick={() =>
                                            setDocumentsDriver((current) =>
                                                current === driver.id
                                                    ? null
                                                    : driver.id
                                            )
                                        }
                                    >
                                        {documentsDriver === driver.id
                                            ? 'Скрыть документы'
                                            : 'Документы водителя'}
                                    </Button>
                                    {documentsDriver === driver.id && (
                                        <CargoFileList
                                            feedback="toast"
                                            title="Личные документы"
                                            endpoint={`/api/cargo/admin/drivers/${driver.id}/documents`}
                                            fileScope="driver"
                                            initialFiles={[]}
                                            currentUserId={currentUserId}
                                            loadOnMount
                                            uploadKinds={[
                                                {
                                                    value: 'license',
                                                    label: 'Водительское удостоверение',
                                                },
                                                {
                                                    value: 'identity',
                                                    label: 'Удостоверение личности',
                                                },
                                                {
                                                    value: 'medical',
                                                    label: 'Медицинская справка',
                                                },
                                                {
                                                    value: 'other',
                                                    label: 'Другой документ',
                                                },
                                            ]}
                                        />
                                    )}
                                </>
                            )}
                    </div>
                ))}
            </Panel>
            <Panel title="Добавить водителя">
                {invite && (
                    <p className="bg-muted rounded-xl p-4 text-sm wrap-anywhere">
                        Передайте водителю один раз: <strong>{invite}</strong>
                    </p>
                )}
                <CargoForm
                    serverErrors={errorsFor('driver-new')}
                    schema={cargoFormSchemas.driver}
                    className="flex flex-col gap-3"
                    onSubmit={addDriver}
                >
                    <CargoInput
                        name="full_name"
                        aria-label="ФИО водителя"
                        placeholder="ФИО"
                        required
                    />
                    <CargoInput
                        name="phone_number"
                        aria-label="Телефон водителя"
                        placeholder="77010000000"
                        required
                    />
                    <CargoInput
                        name="license_number"
                        aria-label="Номер удостоверения водителя"
                        placeholder="Номер удостоверения"
                        required
                    />
                    <Button size="lg" disabled={!!busy}>
                        Добавить
                    </Button>
                </CargoForm>
            </Panel>
        </div>
    );
}
