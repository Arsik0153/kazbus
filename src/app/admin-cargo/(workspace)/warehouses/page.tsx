import Content from '../../_components/warehouses';
import { loadCargoWorkspace } from '../../_components/load-workspace';
export default async function Page() {
    const { state, session } = await loadCargoWorkspace();
    return <Content state={state} currentUserId={session.user.id} />;
}
