import CargoAuthForm from '@/components/cargo-auth-form';

export default async function AdminCargoLoginPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string }>;
}) {
    const { error } = await searchParams;
    return (
        <>
            {error === 'session' && (
                <p
                    role="alert"
                    className="bg-muted mb-5 rounded-lg p-4 text-sm"
                >
                    Сессия истекла или доступ изменился. Войдите снова.
                </p>
            )}
            <CargoAuthForm
                role="admin_cargo"
                mode="login"
                title="Вход логистической компании"
                destination="/admin-cargo"
                alternateHref="/admin-cargo/registration"
            />
        </>
    );
}
