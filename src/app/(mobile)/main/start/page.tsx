import React from 'react'
import Image from 'next/image';
import Button from '@/components/button';
import EllipsStart from '@/assets/EllipsStart';
import Link from 'next/link';

const Start = () => {
    return (
        <div className='flex flex-col relative items-center  justify-center bg-gradient-to-t from-[#E32828] to-[#E13535] w-screen h-full'>
            <div className="absolute w-full top-0 left-0">
                <EllipsStart/>
            </div>
            <Image
                src="/assets/main/startPic.png"
                alt="Откуда и куда угодно"
                width={280}
                height={280}
            />
            <div className="flex flex-col items-center gap-3 my-11 px-8">
                <p className=" font-bold text-4xl text-white text-center">Путешествовать можно дешево</p>
                <p className="font-medium text-lg text-white text-center">Самые дешевые билеты на автобусы в другие города и страны</p>
            </div>
            <Link href='/main/start/login' className="w-full px-8">
                <Button> Начать поиски</Button>
            </Link>
        </div>
    )
}

export default Start;