'use client';
import { cargoFormSchemas } from '@/lib/cargo-validation';

import { Button } from '@/components/ui/button';
import {
    CargoInput,
    CargoTextarea,
    CargoForm,
    Panel,
    type CargoPageProps,
} from './ui';
import { useCargoMutation } from './use-cargo-mutation';
import { updateCargoCompanyAction } from '@/actions/cargo';

export default function CompanyPage({ state }: CargoPageProps) {
    const { busy, run, errorsFor } = useCargoMutation();

    return (
        <>
            <Panel title="Профиль и публикация компании">
                <CargoForm
                    serverErrors={errorsFor('company-profile')}
                    schema={cargoFormSchemas.company}
                    className="mt-4 flex flex-col gap-3"
                    onSubmit={async (event) => {
                        event.preventDefault();
                        const form = new FormData(event.currentTarget);
                        await run('company-profile', () =>
                            updateCargoCompanyAction({
                                name: String(form.get('name') ?? ''),
                                city: String(form.get('city') ?? ''),
                                contactPhone: String(
                                    form.get('contact_phone') ?? ''
                                ),
                                email: String(form.get('email') ?? ''),
                                description: String(
                                    form.get('description') ?? ''
                                ),
                                isSearchable:
                                    form.get('is_searchable') === 'on',
                            })
                        );
                    }}
                >
                    <CargoInput
                        name="name"
                        aria-label="Название компании"
                        defaultValue={state.company.name}
                        placeholder="Название"
                        required
                    />
                    <CargoInput
                        name="city"
                        aria-label="Город компании"
                        defaultValue={state.company.city}
                        placeholder="Город"
                        required
                    />
                    <CargoInput
                        name="contact_phone"
                        aria-label="Контактный телефон компании"
                        type="tel"
                        defaultValue={state.company.contactPhone}
                        placeholder="Контактный телефон"
                        required
                    />
                    <CargoInput
                        name="email"
                        aria-label="Email компании"
                        type="email"
                        defaultValue={state.company.email}
                        placeholder="Email"
                    />
                    <CargoTextarea
                        name="description"
                        aria-label="Описание услуг компании"
                        defaultValue={state.company.description}
                        placeholder="Описание услуг"
                        rows={3}
                    />
                    <label className="flex items-center gap-3 text-sm">
                        <CargoInput
                            name="is_searchable"
                            aria-label="Показывать компанию грузоотправителям"
                            type="checkbox"
                            defaultChecked={state.company.isSearchable}
                        />
                        Показывать компанию грузоотправителям
                    </label>
                    <p className="text-muted-foreground text-sm">
                        Пока профиль скрыт, новые клиенты не смогут отправить
                        запрос на сотрудничество.
                    </p>
                    <Button size="lg" disabled={!!busy}>
                        {busy === 'company-profile'
                            ? 'Сохраняем…'
                            : 'Сохранить профиль'}
                    </Button>
                </CargoForm>
            </Panel>
        </>
    );
}
