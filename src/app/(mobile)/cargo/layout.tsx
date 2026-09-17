import NavBar from '@/components/nav-bar';
import '../../shipper/shipper.css';

export default function CargoLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <div className="shipper-app xs:mb-22.5 flex-1">{children}</div>
            <NavBar section="cargo" />
        </>
    );
}
