export type OperationsQuery = {
    date?: string | string[];
    q?: string | string[];
    status?: string | string[];
};

const first = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] : value;

export function normalizeOperationsQuery(query: OperationsQuery) {
    const status = first(query.status);
    return {
        date: first(query.date),
        q: first(query.q)?.trim() || '',
        status: status === 'open' || status === 'closed' ? status : 'all',
    };
}
