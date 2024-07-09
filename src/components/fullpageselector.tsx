'use client';
import React, { useState } from 'react';

type Props = {
    icon: React.ReactNode;
    text: string;
};

const FullPageSelector: React.FC<Props> = ({ icon, text }) => {
    return (
        <div className="flex max-h-[80px] w-full flex-row items-center gap-4 rounded-[10px] border border-[#AAAAAA] bg-[#FFFFFF29] px-[20px] py-[30px]">
            <div className="">{icon}</div>
            <div className="text-left text-[16px] font-medium leading-[17.6px] text-white">
                {text}
            </div>
        </div>
    );
};

export default FullPageSelector;
