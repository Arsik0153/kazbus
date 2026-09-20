import CargoAuthForm from '@/components/cargo-auth-form';

export default function ShipperLoginPage() {
    return (
        <main className="shipper-app min-h-screen px-5 py-16">
            <div className="mx-auto max-w-lg">
                <CargoAuthForm
                    role="shipper"
                    mode="login"
                    title="Вход для грузоотправителя"
                    destination="/shipper/orders"
                    alternateHref="/shipper/registration"
                />
            </div>
        </main>
    );
}
