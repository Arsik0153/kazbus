import React from 'react'
import Image from 'next/image'
import Anal from '@/assets/admin/anal'
import BusFront from '@/assets/admin/BusFront'
import Coin from '@/assets/admin/Coin'
import Direction from '@/assets/admin/Direction'
import Route from '@/assets/admin/Route'
import Support from '@/assets/admin/Support'
import User from '@/assets/admin/User'
import Link from 'next/link'

const menu = () => {
    return (
        <div className="flex flex-col fixed">
            <Link href="/admin/main"> <Image
                src={'/logo.svg'}
                width={160}
                height={160}
                alt={'Logo'}
                className='pl-3'

            /></Link>

            <div className="flex flex-col pl-7 pr-7">
                <nav className='flex flex-col gap-5'>
                    <ul>
                        <p className="font-bold text-base text-[#FFFFFF] opacity-40">Управление</p>

                        <li><a href="/admin/main/trips" className='flex flex-row gap-3 py-2 text-white text-center items-center' ><Route color="#fff" width={20} height={20} />
                            Рейсы
                        </a></li>
                        <li><a href="" className='flex flex-row gap-3 py-2 text-white text-center items-center' ><BusFront color="#fff" width={20} height={20} />
                            Автобусы
                        </a></li>
                        <li><a href="" className='flex flex-row gap-3 py-2 text-white text-center items-center' ><User color="#fff" width={20} height={20} />
                            Водители
                        </a></li>
                        <li><a href="/admin/main/routes" className='flex flex-row gap-3 py-2 text-white text-center items-center' ><Direction color="#fff" width={20} height={20} />
                            Маршруты
                        </a></li>
                    </ul>
                    <ul>
                        <p className="font-bold text-base text-[#FFFFFF] opacity-40">Информация</p>

                        <li><a href="" className='flex flex-row gap-3 py-2 text-white text-center items-center' ><Anal color="#fff" width={20} height={20} />
                            Аналитика
                        </a></li>
                        <li><a href="" className='flex flex-row gap-3 py-2 text-white text-center items-center' ><Coin color="#fff" width={20} height={20} />
                            Выплаты
                        </a></li>

                    </ul>
                    <ul className='mt-8'>
                        <li><a href="" className='flex flex-row gap-3 py-2 text-white text-center items-center' ><Support color="#fff" width={20} height={20} />
                            Служба поддержки
                        </a></li>

                    </ul>
                </nav>
            </div>
        </div>
    )
}

export default menu