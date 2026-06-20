'use client';

import { useRouter } from 'next/navigation';
import MenuArrow from '@/assets/menu-arrow';
import { logoutBusDriverAction } from '../logout-action';

export default function BusDriverLogoutMenu() {
    const router = useRouter();
    return (
        <button
            type="button"
            className="flex w-full flex-row items-center justify-between py-4"
            onClick={async () => {
                await logoutBusDriverAction();
                router.replace('/busdriver/login');
                router.refresh();
            }}
        >
            <span className="text-[16px] font-normal leading-[17.6px]">
                Сменить аккаунт
            </span>
            <MenuArrow color="#E74949" />
        </button>
    );
}
