import Image from 'next/image';
import Link from 'next/link';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative isolate flex min-h-screen flex-col items-center overflow-hidden bg-[#E32B2B] px-4 py-12">
            <Image
                src="/Ellipse.svg"
                width={622}
                height={750}
                alt=""
                className="pointer-events-none absolute top-0 left-0 -z-10"
            />
            <Image
                src="/Ellipse.svg"
                width={622}
                height={750}
                alt=""
                className="pointer-events-none absolute top-0 right-0 -z-10"
            />
            <Link href="/admin-cargo/login" aria-label="Jol Cargo, вход">
                <Image
                    src="/logo.svg"
                    width={80}
                    height={80}
                    alt="Jol"
                    priority
                />
            </Link>
            <main className="w-full max-w-[420px] rounded-[20px] bg-white px-6 pt-10 pb-8 shadow-md">
                {children}
            </main>
        </div>
    );
}
