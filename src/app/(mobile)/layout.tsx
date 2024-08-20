import NavBar from '@/components/nav-bar';

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex min-h-screen items-stretch">
            <div className="mb-[90px] flex-1" vaul-drawer-wrapper="">
                {children}
            </div>
            <NavBar />
        </div>
    );
}
