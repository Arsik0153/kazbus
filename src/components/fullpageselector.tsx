'use client'
import React from 'react';

type Props = {
  icon: React.ReactNode;
  text: string;
};

const FullPageSelector: React.FC<Props> = ({ icon, text }) => {
  return (
    <button className="bg-[#FFFFFF29] rounded-[10px] px-[20px] py-[30px] max-w-[353px] max-h-[80px] flex flex-row items-center w-full gap-4 border border-[#AAAAAA]">
      <div className=''>
        {icon}
      </div>
      <div className='text-left text-[16px] leading-[17.6px] font-medium text-white'>
        {text}
      </div>
    </button>
  );
};

export default FullPageSelector;
