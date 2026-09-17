import Link from 'next/link';
import { Heading, Section } from '../../_prototype/ui';

export default function SuppliesPage() {
    return (
        <>
            <Heading title="Регулярные поставки" />
            <Section title="Раздел готовится">
                <p className="sp-muted">
                    Расписания поставок пока недоступны. Создайте разовый заказ.
                </p>
                <Link className="sp-button" href="/shipper/create-order">
                    Создать разовый заказ
                </Link>
            </Section>
        </>
    );
}
