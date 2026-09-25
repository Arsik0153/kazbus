import CargoAuthForm from '@/components/cargo-auth-form';

export default function AdminCargoRegistrationPage() {
    return (
        <>
            <CargoAuthForm
                role="admin_cargo"
                mode="register"
                title="Регистрация логистической компании"
                destination="/admin-cargo"
                alternateHref="/admin-cargo/login"
            />
        </>
    );
}
