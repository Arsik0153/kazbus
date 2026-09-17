import CargoAuthForm from '@/components/cargo-auth-form';

export default function ShipperRegistrationPage() {
    return (
        <main className="mx-auto min-h-screen max-w-lg px-5 py-16">
            <CargoAuthForm
                role="shipper"
                mode="register"
                title="Регистрация грузоотправителя"
                destination="/shipper/orders"
                alternateHref="/shipper/login"
            />
        </main>
    );
}
