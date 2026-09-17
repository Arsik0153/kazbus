import AdminLoginPage from '@/components/admin/login-page';

export default function AdminPage({
    searchParams,
}: {
    searchParams?: { session?: string };
}) {
    return (
        <AdminLoginPage
            sessionIssue={
                searchParams?.session === 'expired' ||
                searchParams?.session === 'forbidden'
                    ? searchParams.session
                    : undefined
            }
        />
    );
}
