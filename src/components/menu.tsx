import React from 'react';
import MenuArrow from '../assets/menu-arrow';
import Link from 'next/link';

const Menu = ({ text, link = '/' }: { text?: string; link?: string }) => {
    return (
        <Link
            href={link}
            className="flex flex-row items-center justify-between py-4"
        >
            <div className="text-[16px] font-normal leading-[17.6px]">
                {text}
            </div>
            <div>
                <MenuArrow color="#E74949" />
            </div>
        </Link>
    );
};

export default Menu;
