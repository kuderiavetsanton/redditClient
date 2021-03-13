import Link from 'next/link'
import React from 'react'

export default function ActionButton({ value, href, icon}) {
    return (
        <Link href={href}>
            <div className="flex items-center p-1 rounded cursor-pointer w-max hover:bg-gray-200">
                <i className={icon}></i> 
                <small className="ml-1 font-bold text-gray-400">{value}</small>
            </div>
        </Link>
    )
}
