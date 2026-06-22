import React from 'react'
import Link from 'next/link'

const page = () => {
  return (
    <div>
        <div className="container mx-auto py-10">
            <h1>Welcome to the JOL</h1>
            <p></p>
            <div className="flex flex-row items-center gap-5">
            <Link href="/main">
Main
            </Link><Link  href="/admin">
Admin
            </Link><Link href="/busdriver">
Bus Driver
            </Link><Link href="/cargo">
Cargo
            </Link><Link href="/shipper">
Shipper
            </Link>
            </div>
        </div>
    </div>
  )
}

export default page