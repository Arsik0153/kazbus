import { adminFetch, AdminSessionError } from '@/lib/admin-api';
import {
    companyProfileSchema,
    parseCompanyProfileErrors,
    type CompanyProfileFieldErrors,
    type CompanyProfilePatch,
} from '@/lib/admin-company-schema';

export class CompanyProfileApiError extends Error {
    constructor(
        message: string,
        readonly status?: number,
        readonly fieldErrors: CompanyProfileFieldErrors = {}
    ) {
        super(message);
        this.name = 'CompanyProfileApiError';
    }
}

async function readJson(response: Response) {
    try {
        return await response.json();
    } catch {
        return null;
    }
}

async function requestCompanyProfile(
    options?: Pick<RequestInit, 'method' | 'body' | 'headers'>
) {
    let response: Response;
    try {
        response = await adminFetch('/accounts/company-profile/', options);
    } catch (error) {
        if (error instanceof AdminSessionError) {
            throw new CompanyProfileApiError(error.message, 401);
        }
        throw new CompanyProfileApiError(
            'Сервис профиля временно недоступен. Попробуйте ещё раз.'
        );
    }

    if (!response.ok) {
        const { fieldErrors, message } = parseCompanyProfileErrors(
            await readJson(response)
        );
        throw new CompanyProfileApiError(message, response.status, fieldErrors);
    }

    const result = companyProfileSchema.safeParse(await readJson(response));
    if (!result.success) {
        throw new CompanyProfileApiError(
            'Сервис профиля вернул некорректные данные.'
        );
    }
    return result.data;
}

export function getCompanyProfile() {
    return requestCompanyProfile();
}

export function updateCompanyProfile(input: CompanyProfilePatch) {
    return requestCompanyProfile({
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
    });
}
