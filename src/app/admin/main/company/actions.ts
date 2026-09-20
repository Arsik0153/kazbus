'use server';

import { revalidatePath } from 'next/cache';
import {
    CompanyProfileApiError,
    updateCompanyProfile,
} from '@/lib/admin-company';
import {
    companyProfilePatchSchema,
    type CompanyProfileFieldErrors,
    type CompanyProfilePatch,
} from '@/lib/admin-company-schema';
import { getAdminSession, logoutAdmin } from '@/lib/admin-auth';

export type SaveCompanyProfileResult =
    | { ok: true; profile: Awaited<ReturnType<typeof updateCompanyProfile>> }
    | {
          ok: false;
          message: string;
          fieldErrors?: CompanyProfileFieldErrors;
          reauthenticate?: 'expired' | 'forbidden';
      };

export async function saveCompanyProfile(
    input: CompanyProfilePatch
): Promise<SaveCompanyProfileResult> {
    if (!(await getAdminSession())) {
        return {
            ok: false,
            message: 'Сессия истекла. Войдите снова.',
            reauthenticate: 'expired',
        };
    }

    const parsed = companyProfilePatchSchema.safeParse(input);
    if (!parsed.success) {
        const fieldErrors: CompanyProfileFieldErrors = {};
        for (const issue of parsed.error.issues) {
            const field = issue.path[0];
            if (typeof field === 'string' && !(field in fieldErrors)) {
                fieldErrors[field as keyof CompanyProfileFieldErrors] =
                    issue.message;
            }
        }
        return {
            ok: false,
            message: 'Проверьте заполненные поля.',
            fieldErrors,
        };
    }

    try {
        const profile = await updateCompanyProfile(parsed.data);
        revalidatePath('/admin/main/company');
        return { ok: true, profile };
    } catch (error) {
        if (
            error instanceof CompanyProfileApiError &&
            (error.status === 401 || error.status === 403)
        ) {
            await logoutAdmin();
            return {
                ok: false,
                message:
                    error.status === 401
                        ? 'Сессия истекла. Войдите снова.'
                        : 'Доступ администратора отозван. Войдите под другой учётной записью.',
                reauthenticate: error.status === 401 ? 'expired' : 'forbidden',
            };
        }
        if (error instanceof CompanyProfileApiError) {
            return {
                ok: false,
                message: error.message,
                fieldErrors: error.fieldErrors,
            };
        }
        return {
            ok: false,
            message: 'Не удалось сохранить профиль. Попробуйте ещё раз.',
        };
    }
}
