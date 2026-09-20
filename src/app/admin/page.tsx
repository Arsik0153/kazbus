import AdminLoginPage from '@/components/admin/login-page';

export default async function AdminPage({
    searchParams,
}: {
    searchParams?: Promise<{ session?: string | string[] }>;
}) {
    const params = await searchParams;
    return (
        <AdminLoginPage
            sessionIssue={
                params?.session === 'expired' || params?.session === 'forbidden'
                    ? params.session
                    : undefined
            }
        />
    );
}
