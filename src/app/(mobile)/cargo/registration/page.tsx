import CargoAuthForm from '@/components/cargo-auth-form';

export default function CargoDriverRegistrationPage() {
    return (
        <main className="mx-auto min-h-screen max-w-lg px-5 py-16">
            <CargoAuthForm
                role="cargo_driver"
                mode="register"
                title="Активация профиля водителя"
                destination="/cargo"
                alternateHref="/cargo/login"
            />
        </main>
    );
}
