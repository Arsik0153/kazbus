import Link from 'next/link';
import { Building2, RefreshCw, UserRound } from 'lucide-react';
import { redirect } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { CompanyProfileApiError, getCompanyProfile } from '@/lib/admin-company';
import { getAdminSession } from '@/lib/admin-auth';
import CompanyForm from './company-form';

export default async function AdminCompanyPage() {
    const session = await getAdminSession();
    if (!session) redirect('/admin?session=expired');

    let profile;
    try {
        profile = await getCompanyProfile();
    } catch (error) {
        if (
            error instanceof CompanyProfileApiError &&
            (error.status === 401 || error.status === 403)
        ) {
            redirect(
                error.status === 401
                    ? '/admin/session?reason=expired'
                    : '/admin/session?reason=forbidden'
            );
        }

        return (
            <div className="mt-6 rounded-[20px] bg-white px-8 py-10">
                <h1 className="text-3xl font-semibold text-[#4A4A4A]">
                    Профиль автобусной компании
                </h1>
                <p role="alert" className="mt-4 text-base text-[#B42318]">
                    {error instanceof Error
                        ? error.message
                        : 'Не удалось загрузить профиль компании.'}
                </p>
                <Button asChild className="mt-6 bg-[#E74949] text-white">
                    <Link href="/admin/main/company">
                        <RefreshCw className="h-4 w-4" />
                        Повторить
                    </Link>
                </Button>
            </div>
        );
    }

    const ownerName =
        session.user.full_name || session.user.username || 'Администратор';

    return (
        <div className="mt-6 flex flex-col gap-5 pb-10">
            <div className="rounded-[20px] bg-white px-8 py-8">
                <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FEE2E2]">
                        <Building2 className="h-6 w-6 text-[#E74949]" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-semibold text-[#4A4A4A]">
                            Профиль автобусной компании
                        </h1>
                        <p className="mt-2 max-w-3xl text-base font-medium text-[#7C8799]">
                            Обновляйте юридические данные и контакты компании.
                            Статус профиля меняется только администратором
                            платформы.
                        </p>
                    </div>
                </div>
            </div>

            <div className="rounded-[20px] bg-white px-8 py-5">
                <div className="flex items-center gap-3">
                    <UserRound className="h-5 w-5 text-[#E74949]" />
                    <div>
                        <p className="text-sm font-medium text-[#7C8799]">
                            Владелец кабинета
                        </p>
                        <p className="font-semibold text-[#4A4A4A]">
                            {ownerName}
                        </p>
                    </div>
                </div>
            </div>

            <CompanyForm initialProfile={profile} />
        </div>
    );
}
