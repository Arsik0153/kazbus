import CargoAuthForm from '@/components/cargo-auth-form';

export default function CargoDriverRegistrationPage() {
    return (
        <main className="min-h-full px-5 pt-20 pb-28">
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
