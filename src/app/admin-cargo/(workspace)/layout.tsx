import CargoShell from '../_components/shell';
import { loadCargoWorkspace } from '../_components/load-workspace';

export const dynamic = 'force-dynamic';

export default async function WorkspaceLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { state, session } = await loadCargoWorkspace();
    return (
        <CargoShell name={session.user.full_name} company={state.company.name}>
            {children}
        </CargoShell>
    );
}
