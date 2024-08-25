export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex min-h-screen items-stretch">
            <div className="flex-1">{children}</div>
        </div>
    );
}
