import Logo from '../images/reddit.svg'
import Link from 'next/link'
import { useAuthDispatch, useAuthState } from '../contexts/authContext'
import axios from 'axios'
import { FormEvent, useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/dist/client/router'

export default function Navbar() {
    const router = useRouter()

    let [timer,setTimer ] = useState<any>()
    let [ searchSub, setSearchSub ] = useState('')
    let { authenticated, loading } = useAuthState()
    let [ availibleSub, setAvailibleSub ] = useState([])


    let dispatch = useAuthDispatch()
    const logout = (e) => {
        localStorage.removeItem('token')
        dispatch('LOGOUT')
        window.location.reload()
    }

    useEffect(() => {
        if(searchSub.trim() === ''){
            setAvailibleSub([])
        }
        handleSearch()
    },[searchSub])

    const handleSearch = async () => {
        if(searchSub.trim() !== ''){
            clearTimeout(timer)
            setTimer(setTimeout(async   () => {
                try {
                    if(searchSub.trim() !== ''){
                        let res = await axios.get(`/sub/search/${searchSub}`)
                        setAvailibleSub(res.data)
                    }else{
                        return
                    }
                    
                } catch (error) {
                    setAvailibleSub([])
                    console.log({...error})
                }
            },400))
        }else{
            return
        }
    }
    const handleRedirect = (link:string) => {
        setSearchSub('')
        router.push(link)
    }
    return (
        <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-between h-12 px-6 bg-white">
            <Link href="/">
                <div className="flex items-center cursor-pointer">
                    <Logo className="w-8 h-8 mr-2"></Logo>
                    <p className="hidden text-lg font-semibold lg:block">Reddit</p>
                </div>
            </Link>
            
            <form className="max-w-full px-4 w-160">
                <div className="relative flex items-center w-full p-1 mx-auto transition duration-200 bg-gray-100 border border-transparent rounded hover:border-blue-900 hover:bg-white lg:w-160">
                    <i className="pl-4 pr-3 text-gray-500 fas fa-search"></i>
                    <input type="text" className="w-full font-medium text-gray-700 bg-transparent outline-none" placeholder="Search" value={searchSub} onChange={e => setSearchSub(e.target.value)} />
                    {
                        availibleSub.length !== 0 && 
                        <div className="absolute left-0 right-0 bg-white border border-gray-200 top-9">
                            { availibleSub.map(sub => {
                                return (
                                        <div className="p-3 cursor-pointer hover:bg-gray-100" onClick={e => handleRedirect(`/r/${sub.name}`)} key={sub._id}>
                                                <div className="flex items-center">
                                                    <Image src={sub.imageUrl} width={20} height={20} className="rounded-full "/>
                                                    <div className="ml-2">
                                                        <p className="text-sm font-medium">{sub.name}</p>
                                                        <p className="text-xs font-light text-gray-400">{sub.posts.length} posts</p>
                                                    </div>
                                                </div>
                                        </div>
                                )
                            })}
                        </div>
                    }
                    
                </div>
            </form>
            <div className="flex items-center">
                {
                !loading &&( authenticated ? 
                        <a className="button blue" onClick={logout}>Log out</a>
                    :
                    <>
                        <Link href="/login">
                            <a className="w-20 mr-4 button blue hollow md:w-36">Log in</a>
                        </Link>
                        <Link href="/register">    
                            <a className="w-20 button blue md:w-36">Sign up</a>
                        </Link>
                    </>)
                }
            </div>
        </div>
    )
}
