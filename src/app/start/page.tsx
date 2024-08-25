import React from 'react';
import Image from 'next/image';
import Button from '@/components/button';
import EllipsStart from '@/assets/EllipsStart';
import Link from 'next/link';

const Start = () => {
    return (
        <div className="relative flex h-full h-screen w-screen flex-col items-center justify-center bg-gradient-to-t from-[#E32828] to-[#E13535]">
            <div className="absolute left-0 top-0 w-full">
                <EllipsStart />
            </div>
            <Image
                src="/assets/main/startPic.png"
                alt="Откуда и куда угодно"
                width={280}
                height={280}
            />
            <div className="my-11 flex flex-col items-center gap-3 px-8">
                <p className="text-center text-4xl font-bold text-white">
                    Путешествовать можно дешево
                </p>
                <p className="text-center text-lg font-medium text-white">
                    Самые дешевые билеты на автобусы в другие города и страны
                </p>
            </div>
            <Link href="/start/registration" className="w-full px-8">
                <Button> Начать поиски</Button>
            </Link>
        </div>
    );
};

export default Start;
