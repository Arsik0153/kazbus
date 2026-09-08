import Link from 'next/link';
export default function Login() {
    return (
        <section className="sp-panel">
            <h1 style={{ fontSize: 28, marginBottom: 16 }}>
                Кабинет заказчика
            </h1>
            <p>
                В первом прототипе вход не требуется. Можно проверить оформление
                и отслеживание заказов на демонстрационных данных.
            </p>
            <Link
                className="sp-button"
                style={{ marginTop: 24 }}
                href="/shipper/orders"
            >
                Открыть демокабинет
            </Link>
        </section>
    );
}
