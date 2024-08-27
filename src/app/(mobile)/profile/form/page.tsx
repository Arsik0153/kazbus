import Topbar from '@/components/topbar';
import React from 'react';
import NewUser from '../registration/_components/new-user';

const FormPage = () => {
    return (
        <>
            <Topbar backHref="/profile">Регистрация</Topbar>

            <div className="h-full px-5">
                <div className="flex flex-col gap-1">
                    <NewUser />
                </div>
            </div>
        </>
    );
};

export default FormPage;
