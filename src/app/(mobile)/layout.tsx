import NavBar from '@/components/nav-bar';

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-100vh flex items-stretch">
            <div className="mb-[90px] flex-1">{children}</div>
            <NavBar />
        </div>
    );
}
