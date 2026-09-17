import CargoAuthForm from '@/components/cargo-auth-form';

export default function ShipperLoginPage() {
    return (
        <main className="mx-auto min-h-screen max-w-lg px-5 py-16">
            <CargoAuthForm
                role="shipper"
                mode="login"
                title="Вход для грузоотправителя"
                destination="/shipper/orders"
                alternateHref="/shipper/registration"
            />
        </main>
    );
}
