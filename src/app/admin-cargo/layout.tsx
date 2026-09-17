import '../shipper/shipper.css';

export default function AdminCargoLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <div className="shipper-app">{children}</div>;
}
