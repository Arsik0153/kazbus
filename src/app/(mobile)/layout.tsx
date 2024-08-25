import BadgeLogo from '@/components/badge-logo';
import NavBar from '@/components/nav-bar';

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex min-h-screen items-stretch">
            <BadgeLogo />
            <div className="mb-[90px] flex-1">{children}</div>
            <NavBar />
        </div>
    );
}
