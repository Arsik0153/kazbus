import React from 'react'
import Topbar from '@/components/topbar'
import PassangerSelector from '@/components/passangerSelector'
import Button from '@/components/button'
import Link from 'next/link'

const page = () => {
    return (
        <>
            <Topbar backHref='/main/tickets'>
                <div className="flex flex-col items-center">
                    Покупка билета
                </div>
            </Topbar>
            <div className="flex flex-col mt-[42px] px-5">
                <p className="text-[30px] font-medium text-[#4A4A4A] mb-4">Данные 2-го пассажира</p>
                <PassangerSelector />
                <Link href='/main/tickets/passengers/second-passanger'>
                    <div className="mt-6">
                        <Button variant='secondary'>Добавить другого пассажира</Button>

                    </div>
                </Link>

            </div>
        </>
    )
}

export default page