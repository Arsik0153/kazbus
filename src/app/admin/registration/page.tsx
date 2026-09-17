import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/admin-auth';
import CompanyRegistrationForm from './form';

export default async function AdminRegistrationPage() {
    if (await getAdminSession()) redirect('/admin/main/company');
    return (
        <main className="min-h-screen bg-[#E32B2B] px-4 py-10">
            <div className="mx-auto max-w-3xl rounded-3xl bg-white p-6 shadow-lg sm:p-10">
                <h1 className="text-3xl font-bold text-[#E32B2B]">
                    Регистрация автобусной компании
                </h1>
                <p className="mt-4 text-[#666]">
                    Создайте кабинет перевозчика и подтвердите телефон
                    владельца. После регистрации можно добавить автобусы,
                    водителей и маршруты.
                </p>
                <CompanyRegistrationForm />
                <Link
                    href="/admin"
                    className="mt-6 block text-center font-semibold text-[#E32B2B] underline"
                >
                    У меня уже есть кабинет
                </Link>
            </div>
        </main>
    );
}
