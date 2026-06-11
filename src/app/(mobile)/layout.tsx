import BadgeLogo from '@/components/badge-logo';

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex min-h-screen items-stretch">
            <BadgeLogo />
            {children}
        </div>
    );
}
