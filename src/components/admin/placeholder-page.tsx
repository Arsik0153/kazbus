import Link from 'next/link';

import { Button } from '@/components/ui/button';

type Props = {
    title: string;
    description: string;
};

const AdminPlaceholderPage = ({ title, description }: Props) => {
    return (
        <div className="mt-6 flex flex-col gap-4">
            <h1 className="text-[42px] font-semibold text-[#4A4A4A]">
                {title}
            </h1>
            <div className="rounded-[20px] bg-white px-8 py-16">
                <div className="max-w-2xl">
                    <p className="text-3xl font-semibold text-[#4A4A4A]">
                        Раздел в разработке
                    </p>
                    <p className="mt-3 text-base font-medium text-[#A0A0A0]">
                        {description}
                    </p>
                    <Button asChild size="lg" variant="outline" className="mt-8">
                        <Link href="/admin/main">Вернуться на дашборд</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AdminPlaceholderPage;
