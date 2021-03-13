import dayjs from 'dayjs'
import { useRouter } from 'next/dist/client/router'
import Link from 'next/link'
import React from 'react'
import useSWR from 'swr'
import PostCard from '../../components/PostCard'

export default function User() {
    let router = useRouter()
    let { username } = router.query
    let { data,error } = useSWR(username ? `/user/${username}` : null)
    console.log(error)
    if(data) console.log(data)
    return (
        
        <div className="flex items-start mx-auto mt-5 container-l">
            <div className="flex items-start mx-auto mt-5 container-l">
            {data && <>
                { data.submitions.length === 0 ? <p className="text-xl">User doesn't submit anything yet</p> : <>
                <div className="w-full p-3 mr-6 bg-white border border-gray-300 rounded lg:w-8/12">
                        {data.submitions.map(elem => {
                            if(elem.type === 'Comment'){
                                return (
                                    <div className="flex my-3 overflow-hidden bg-white border border-gray-300 rounded">
                                        <div className="flex items-center justify-center w-1/12 p-3 bg-gray-100">
                                            <i className="text-gray-400 fas fa-comment-alt"></i>
                                        </div>
                                        <div className="flex flex-col w-11/12 p-2">
                                            <div className="flex items-center">
                                                <a className="text-xs font-medium text-blue-900">{data.username}</a>
                                                <p className="mx-1 text-xs text-gray-400"> Commented on</p>
                                                <Link href={`/r/${elem.post.sub.name}/${elem.post.url}}`}>
                                                    <a className="text-xs font-medium text-gray-700 cursor-pointer hover:underline">{elem.post.title}</a>
                                                </Link>
                                                <div className="flex items-center ml-1">
                                                    <span>•</span>
                                                    <Link href={`/r/${elem.post.sub.name}}`}>
                                                        <a className="ml-1 text-xs font-semibold hover:underline"> r/{elem.post.sub.name}</a>
                                                    </Link>
                                                </div>
                                            </div>
                                            <hr className="w-full"/>
                                            <p>{elem.body}</p>
                                        </div>
                                    </div>
                                    )
                            }else{
                                return <PostCard post={elem} />
                            }
                        })}
                    </div>
                    <div className="hidden w-4/12 overflow-hidden bg-white rounded lg:block">
                        <div className="flex items-center justify-center p-3 bg-blue-700">
                            <img src="https://cdn.pixabay.com/photo/2019/06/25/04/40/light-4297386_1280.jpg" alt="user" className="w-12 h-12 rounded-full"/>
                        </div>
                        <div className="flex flex-col items-center justify-center m-2">
                            <p className="my-1">{data.username}</p>
                            <hr className="w-full"/>
                            <p className="my-2">{dayjs(data.createdAt).format('MMM YYYY')}</p>
                        </div>
                    </div> 
                </>}
            </>}
            </div>
        </div>
    )
}
