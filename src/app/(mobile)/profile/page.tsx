import React from 'react';
import UnauthorizedProfilePage from './unauthorized';
import AuthorizedProfilePage from './authorized';

const AUTHORIZED = false;

const ProfilePage = () => {
    if (!AUTHORIZED) {
        return <UnauthorizedProfilePage />;
    }
    return <AuthorizedProfilePage />;
};

export default ProfilePage;
