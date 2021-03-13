import axios from 'axios'
import { useRouter } from 'next/dist/client/router'
import Head from 'next/head'
import Link from 'next/link'
import { FormEvent, useState } from 'react'
import InputGroup from '../components/InputGroup'
import { useAuthState } from '../contexts/authContext'


//errors that can ocur while submiting register
interface Errors{
    agreement?:string,
    email?:string,
    password?:string,
    username?:string,
}

export default function Register() {
    //State variables
    const [ email,setEmail ] = useState('')
    const [ username,setUsername ] = useState('')
    const [ password,setPassword ] = useState('')
    const [ agreement, setAgreement ] = useState(false)
    const [ err, setErr ] = useState<Errors>({agreement:'',email:'',password:'',username:''})

    //Context state variables
    const { authenticated } = useAuthState()

    const router = useRouter()
    //You cant be logged in and be on a reggister page so that why we push you back
    if(authenticated) router.back()

    const submitSignUp = async ( e: FormEvent ) => {
        e.preventDefault()
        // if checkbox not true submit will return false
        if(!agreement){
            setErr({...err,agreement:'You should agree before submiting'})
            return
        }
        //trying to submit data to the server if success redirect to login page else show validation error
        try {
            await axios.post('/auth',{
                email,
                password,
                username,
            })
            router.push('/login')
        } catch (error) {
            setErr({...err, ...error.response.data})
            console.log('errors',{...error})
            console.log('err',err)
        }
    }
    return (
        <div className="flex bg-white">
            <Head>
                <title>Register</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="hidden h-screen bg-cover md:block w-36" style={ { backgroundImage:"url('/images/wall.jpg')"}}>
            </div>
            <div className="flex flex-col justify-center ml-5 w-72">
                <div className="mb-10">
                    <h1 className="mb-1 text-lg">Sign up</h1>
                    <p className="text-xs">
                        By continuing, you agree to our User Agreement and Privacy Policy.
                    </p>
                </div>
                <form onSubmit={submitSignUp}>
                    <div className="mb-3 ">
                        <input type="checkbox" name="agreement" id="agreement" className="cursor-pointer" checked={agreement} onChange={e => setAgreement(!agreement)}/>
                        <label htmlFor="agreement" className="ml-2 text-xs cursor-pointer">I agree to recieve mails from Reddit</label><br/>
                        <small className="text-red-500">{err.agreement}</small>
                    </div>
                    <InputGroup name="email" type="email" value={ email } setValue={setEmail} error={err.email}/>
                    <InputGroup name="username" type="text" value={ username } setValue={setUsername} error={err.username}/>
                    <InputGroup name="password" type="password" value={ password } setValue={setPassword} error={err.password}/>
                    <div className="mt-4">
                        <button  className="w-full p-1 font-bold text-white uppercase bg-blue-500 border border-blue-700 rounded">
                            Sign up
                        </button>
                    </div>
                    <div>
                        <p className="text-xs mt-7">
                            Already a redditor?
                            <Link href="/login">
                                <a className="font-bold text-blue-500 uppercase hover:text-blue-400"> LOG IN</a>
                            </Link>
                        </p>
                        </div>
                </form>
            </div>
        </div>
    )
}
