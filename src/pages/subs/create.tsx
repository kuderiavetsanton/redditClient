import axios from 'axios'
import classNames from 'classnames'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/dist/client/router'
import Head from 'next/head'
import React, { FormEvent, useEffect, useState } from 'react'
import { useAuthState } from '../../contexts/authContext'

export default function Create() {
    const router = useRouter()
    const {authenticated} = useAuthState()

    useEffect(() => {
        if(!authenticated){
            router.push('/login')
        }
    }, [])
    //State variables
    const [ name, setName ] = useState('')
    const [ title, setTitle ] = useState('')
    const [ description, setDescription ] = useState('')
    const [ errors, setErrors ] = useState<any>({})

    const handleSubmit = async (e:FormEvent) => {
        e.preventDefault()
        // submit to the server if success else show validation errors
        try {   
            let res = await axios.post('/sub',{ name, description, title })
            router.push(`/r/${res.data.name}`)
        } catch (error) {
            setErrors(error.response.data)
        }
    }
    return (
        <div className="flex bg-white">
        <Head>
            <title>Create Community</title>
        </Head>
        <div className="hidden h-screen bg-cover md:block w-36" style={ { backgroundImage:"url('/images/wall.jpg')"}}>
        </div>
        <div className="flex flex-col justify-center ml-5 w-96">
            <div className="mb-1">
                <h1 className="text-lg">Create Community</h1>
            </div>
            <hr className="mb-7"/>
            <form onSubmit={handleSubmit}>
                <div className="mb-2">
                    <p className="font-medium">Name</p>
                    <p className="text-xs font-light text-gray-400">Community names including capitalization cannot be changed.</p>
                    <input type="text" className={classNames("w-full p-2 mt-2 border border-gray-500 rounded",{"border-red-500" : errors.name})} value={name} onChange={e => setName(e.target.value) }/>
                    { errors.name && 
                        <small className="text-red-500">{ errors.name }</small>
                    }
                </div>
                <div className="mb-2">
                    <p className="font-medium">Title</p>
                    <p className="text-xs font-light text-gray-400">Community title represent the topic and you change it at any
                time.</p>
                    <input type="text" className={classNames("w-full p-2 mt-2 border border-gray-500 rounded",{"border-red-500" : errors.name})} value={title} onChange={e => setTitle(e.target.value) }/>
                    { errors.title && 
                        <small className="text-red-500">{ errors.title }</small>
                    }
                </div>
                <div className="mb-2">
                    <p className="font-medium">Description</p>
                    <p className="text-xs font-light text-gray-400">This is how new members come to understand your community..</p>
                    <textarea className="w-full p-2 mt-2 border border-gray-500 rounded" value={description} onChange={e => setDescription(e.target.value) }/>
                </div>
                <div className="flex justify-end">
                    <button className="button blue">Submit</button>
                </div>
            </form>
        </div>
    </div>
    )
}