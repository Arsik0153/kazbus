import CargoAuthForm from '@/components/cargo-auth-form';

export default function CargoDriverLoginPage() {
    return (
        <main className="flex min-h-full items-center px-5 pt-20 pb-28">
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
