import { OrderStatus } from './model';

export type OrderFilters = {
    q: string;
    companyId: string;
    status: OrderStatus | '';
    attentionOnly: boolean;
};

type SearchParamsReader = {
    get(name: string): string | null;
};

export const emptyOrderFilters: OrderFilters = {
    q: '',
    companyId: '',
    status: '',
    attentionOnly: false,
};

function parseStatus(value: string | null): OrderStatus | '' {
    switch (value) {
        case 'waiting':
        case 'offer':
        case 'planned':
        case 'transit':
        case 'delivered':
        case 'cancelled':
        case 'rejected':
            return value;
        default:
            return '';
    }
}

export function parseOrderFilters(
    params: SearchParamsReader,
    knownCompanyIds: readonly string[]
): OrderFilters {
    const requestedCompany = params.get('company') ?? '';
    return {
        q: (params.get('q') ?? '').trim(),
        companyId: knownCompanyIds.includes(requestedCompany)
            ? requestedCompany
            : '',
        status: parseStatus(params.get('status')),
        attentionOnly: params.get('attention') === '1',
    };
}

export function serializeOrderFilters(filters: OrderFilters): URLSearchParams {
    const params = new URLSearchParams();
    const q = filters.q.trim();
    if (q) params.set('q', q);
    if (filters.companyId) params.set('company', filters.companyId);
    if (filters.status) params.set('status', filters.status);
    if (filters.attentionOnly) params.set('attention', '1');
    return params;
}

export function orderFiltersQuery(filters: OrderFilters): string {
    return serializeOrderFilters(filters).toString();
}
