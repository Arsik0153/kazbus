import Image from 'next/image';
import Link from 'next/link';
import { Building2 } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function AdminRegistrationPage() {
    return (
        <div className="flex min-h-screen items-start justify-center overflow-hidden bg-[#E32B2B]">
            <Image
                src="/Ellipse.svg"
                width={622}
                height={750}
                className="pointer-events-none absolute top-0 left-0"
                alt=""
            />
            <Image
                src="/Ellipse.svg"
                width={622}
                height={750}
                className="pointer-events-none absolute top-0 right-0"
                alt=""
            />

            <main className="relative z-10 mt-12 flex w-full max-w-[620px] flex-col items-center px-6 pb-12">
                <Image src="/logo.svg" width={80} height={80} alt="Jol" />
                <div className="mt-8 w-full rounded-[28px] bg-white px-8 py-10 text-center shadow-md">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#FEE2E2]">
                        <Building2 className="h-7 w-7 text-[#E32B2B]" />
                    </div>
                    <h1 className="mt-5 text-3xl font-bold text-[#E32B2B]">
                        Регистрация автобусной компании
                    </h1>
                    <p className="mt-4 text-base leading-7 font-medium text-[#666666]">
                        Самостоятельная регистрация пока недоступна. Кабинет
                        компании создаёт администратор платформы и передаёт
                        владельцу данные для входа.
                    </p>
                    <Button
                        asChild
                        size="lg"
                        className="mt-8 w-full bg-[#E32B2B] text-white hover:bg-[#C92323]"
                    >
                        <Link href="/admin">Перейти ко входу</Link>
                    </Button>
                </div>
            </main>
        </div>
    );
}
