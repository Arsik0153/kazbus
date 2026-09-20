import CargoAuthForm from '@/components/cargo-auth-form';

export default function ShipperRegistrationPage() {
    return (
        <main className="shipper-app min-h-screen px-5 py-16">
            <div className="mx-auto max-w-lg">
                <CargoAuthForm
                    role="shipper"
                    mode="register"
                    title="Регистрация грузоотправителя"
                    destination="/shipper/orders"
                    alternateHref="/shipper/login"
                />
            </div>
        </main>
    );
}
