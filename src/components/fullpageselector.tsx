'use client';
import React from 'react';

type Props = {
    icon: React.ReactNode;
    text: string;
};

const FullPageSelector: React.FC<Props> = ({ icon, text }) => {
    return (
        <button className="flex max-h-[80px] w-full max-w-[353px] flex-row items-center gap-4 rounded-[10px] border border-[#AAAAAA] bg-[#FFFFFF29] px-[20px] py-[30px]">
            <div className="">{icon}</div>
            <div className="text-left text-[16px] font-medium leading-[17.6px] text-white">
                {text}
            </div>
        </button>
    );
};

export default FullPageSelector;
