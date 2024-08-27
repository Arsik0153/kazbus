import React from 'react';
import UnauthorizedProfilePage from './unauthorized';
import AuthorizedProfilePage from './authorized';
import { getSession } from '@/lib/auth';

const ProfilePage = async () => {
    const session = await getSession();
    console.log(session);

    if (!session || !session.user.full_name) {
        return <UnauthorizedProfilePage />;
    }
    return <AuthorizedProfilePage />;
};

export default ProfilePage;
