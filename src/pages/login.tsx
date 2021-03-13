import axios from 'axios'
import { useRouter } from 'next/dist/client/router'
import Head from 'next/head'
import Link from 'next/link'
import { FormEvent, useState } from 'react'
import InputGroup from '../components/InputGroup'
import { useAuthDispatch, useAuthState } from '../contexts/authContext'


export default function Login() {
    //State variavles
    const [ username,setUsername ] = useState('')
    const [ password,setPassword ] = useState('')
    const [ err, setErr ] = useState('')

    // Context state and dispatch 
    const dispatch = useAuthDispatch()
    const { authenticated } = useAuthState()

    const router = useRouter()
    //You cant be logged in and be on a login page so that why we push you back
    if(authenticated) router.push('/')

    const submitLogin = async ( e: FormEvent ) => {
        e.preventDefault()
        //trying to submit data to the server if success log in you and redirect to login page else show validation error
        try {
            let {data} = await axios.post('/auth/login',{
                password,
                username,
            })
            console.log(data)
            dispatch('LOGIN',{username:data.username,email:data.email})
            localStorage.setItem('token',data.token)
            axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
            window.location.href ='/'
        } catch (error) {
            console.log(error)
            if(error.response){
                setErr(error.response.data)
            }else{
                setErr('Network problem please visit our site later')
            }
        }
    }
    return (
        <div className="flex bg-white">
            <Head>
                <title>Login</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="hidden h-screen bg-cover md:block w-36" style={ { backgroundImage:"url('/images/wall.jpg')"}}>
            </div>
            <div className="flex flex-col justify-center ml-5 w-72">
                <div className="mb-10">
                    <h1 className="mb-1 text-lg">Login</h1>
                    <p className="text-xs">
                        By continuing, you agree to our User Agreement and Privacy Policy.
                    </p>
                </div>
                <form onSubmit={submitLogin}>
                    <InputGroup name="username" type="text" value={ username } setValue={setUsername} error=''/>
                    <InputGroup name="password" type="password" value={ password } setValue={setPassword} error=''/>
                    <small className="text-red-500">{ err }</small>
                    <div className="mt-4">
                        <button  className="w-full p-1 font-bold text-white uppercase bg-blue-500 border border-blue-700 rounded">
                            Login
                        </button>
                    </div>
                    <div>
                        <p className="text-xs mt-7">
                            Don't have acount ?
                            <Link href="/register">
                                <a className="font-bold text-blue-500 uppercase hover:text-blue-400"> Sign up</a>
                            </Link>
                        </p>
                        </div>
                </form>
            </div>
        </div>
    )
}
