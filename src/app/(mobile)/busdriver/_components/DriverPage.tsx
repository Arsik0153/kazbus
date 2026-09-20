import { loadWorkspace } from '../_api/client';
import type { DriverMode } from '../_api/schema';
import DriverWorkspaceView from './DriverWorkspaceView';

export function operationalDate() {
    return new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Almaty',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(new Date());
}

export default async function DriverPage({
    mode,
    searchParams,
}: {
    mode: DriverMode;
    searchParams: Promise<{ date?: string; tripId?: string; runId?: string }>;
}) {
    const params = await searchParams;
    const date = params.date || operationalDate();
    const workspace = await loadWorkspace(date, mode === 'history');
    return (
        <DriverWorkspaceView
            mode={mode}
            workspace={workspace}
            date={date}
            tripId={params.tripId}
            runId={params.runId}
        />
    );
}
