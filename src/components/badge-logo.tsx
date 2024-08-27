'use client';
import React, { useEffect, useState } from 'react';

const BadgeLogo = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const hideGap = !!localStorage.getItem('hideGap');
        setVisible(!hideGap);
    }, []);

    if (!visible) {
        return null;
    }

    return (
        <div className="absolute left-1/2 top-[14px] z-[1000] flex h-[18px] w-[102px] -translate-x-1/2 transform items-center justify-center rounded-full border border-[#E23333] bg-white text-[14px] font-semibold tracking-[-3%] text-[#E23333]">
            joool
        </div>
    );
};

export default BadgeLogo;
