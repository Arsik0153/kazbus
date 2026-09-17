import CargoAuthForm from '@/components/cargo-auth-form';

export default function AdminCargoLoginPage() {
    return (
        <main className="mx-auto min-h-screen max-w-lg px-5 py-16">
            <CargoAuthForm
                role="admin_cargo"
                mode="login"
                title="Вход логистической компании"
                destination="/admin-cargo"
                alternateHref="/admin-cargo/registration"
            />
        </main>
    );
}
