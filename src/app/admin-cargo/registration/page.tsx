import CargoAuthForm from '@/components/cargo-auth-form';

export default function AdminCargoRegistrationPage() {
    return (
        <main className="mx-auto min-h-screen max-w-lg px-5 py-16">
            <CargoAuthForm
                role="admin_cargo"
                mode="register"
                title="Регистрация логистической компании"
                destination="/admin-cargo"
                alternateHref="/admin-cargo/login"
            />
        </main>
    );
}
