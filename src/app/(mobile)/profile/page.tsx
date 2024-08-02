import React from 'react';
import UnauthorizedProfilePage from './unauthorized';
import AuthorizedProfilePage from './authorized';
import { getSession } from '@/lib/auth';

const ProfilePage = async () => {
    const session = await getSession();

    if (!session) {
        return <UnauthorizedProfilePage />;
    }
    return <AuthorizedProfilePage />;
};

export default ProfilePage;
