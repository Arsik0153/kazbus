import NavBar from '@/components/nav-bar';

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex min-h-screen items-stretch" vaul-drawer-wrapper="">
            <div className="mb-[85px] flex-1">{children}</div>
            <NavBar />
        </div>
    );
}
