import dayjs from 'dayjs'
import Link from 'next/link'
import React from 'react'
import { useAuthState } from '../contexts/authContext'

interface SideBarProps {
    createAt:Date,
    margitTop:string | number,
    description:string,
    name:string,
    imageUrl:string
}

export default function SideBar({ createdAt, description ,marginTop, name, imageUrl }) {
    const { authenticated } = useAuthState()
    return (
    <div className={`mt-${marginTop} ml-auto overflow-hidden bg-white rounded w-80 hidden lg:block`}>
        <div className="p-3 bg-blue-900">
        <p className="font-semibold text-white">
            About Comunity
        </p>
        </div>
        <div className="py-3 bg-white">
            <Link href={`/r/${ name }`}>
                <div className="flex items-center mx-4 mb-2 cursor-pointer">
                    <img src={imageUrl ? imageUrl : 'https://cdn.pixabay.com/photo/2019/06/25/04/40/light-4297386_1280.jpg'} className="w-10 h-10 rounded-full"/>
                    <p className="pl-3 font-medium">r/{name}</p>
                </div>
            </Link>
            <p className="mx-4">
                { description }
            </p>
            <div className="flex pt-2 pb-3 mx-4 border-b border-gray-200">
                <div className="pr-14">
                <p className="font-semibold ">1.5m</p>
                <p className="text-xs font-semibold">Members</p>
                </div>
                <div className="">
                <p className="font-semibold ">10.3k</p>
                <p className="text-xs font-semibold">Online</p>
                </div>
            </div>
            <div className="flex items-center pt-3 pb-2 mx-4">
                <i className="mr-3 fas fa-birthday-cake"></i>
                <p>Created {dayjs(createdAt).format('D MMM YYYY')}</p>
            </div>
            {authenticated && 
            <div className="flex justify-center pt-3 pb-1">
                <Link href={`/r/${ name }/submit`}>
                    <a className="mx-auto w-44 button blue">Create Post</a>
                </Link>
            </div>
            }
        </div>
    </div>
    )
}
