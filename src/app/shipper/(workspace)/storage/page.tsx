import Link from 'next/link';
import { Heading, Section } from '../../_prototype/ui';

export default function StoragePage() {
    return (
        <>
            <Heading title="Складские остатки" />
            <Section title="Раздел готовится">
                <p className="sp-muted">Складской учет пока недоступен.</p>
                <Link className="sp-link" href="/shipper/orders">
                    Вернуться к заказам
                </Link>
            </Section>
        </>
    );
}
