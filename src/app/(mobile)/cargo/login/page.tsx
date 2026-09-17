import CargoAuthForm from '@/components/cargo-auth-form';

export default function CargoDriverLoginPage() {
    return (
        <main className="mx-auto min-h-screen max-w-lg px-5 py-16">
            <CargoAuthForm
                role="cargo_driver"
                mode="login"
                title="Вход водителя Jol Cargo"
                destination="/cargo"
                alternateHref="/cargo/registration"
            />
        </main>
    );
}
