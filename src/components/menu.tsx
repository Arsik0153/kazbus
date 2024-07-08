import React from 'react'
import MenuArrow from '../../public/assets/menu-arrow';

const Menu = ({ text }: { text?: string }) => {
    return (
        <div className='flex flex-row items-center justify-between'>
            <div className='font-normal text-[16px] leading-[17.6px]'>{text}</div>
            <div><MenuArrow color='#E74949'/></div>
        </div>
    )
}

export default Menu;