import '../styles/globals.css'
import { AppProps } from 'next/app'
import axios from 'axios'
import Navbar from '../components/Navbar'
import { useRouter } from 'next/dist/client/router'
import AuthProvider from '../contexts/authContext'

import { SWRConfig } from 'swr'
import { data } from 'autoprefixer'
import classNames from 'classnames'


axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_URL
axios.defaults.withCredentials = true




const fetcher = async(url:string) => {
  try {
    const res = await axios.get(url)
    return res.data
  } catch (error) {
    throw error.response.data
  }
}

function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter()
  //paths that dont need navbar
  const authPath: string[] = ['/register','/login']
  let isAuthPage = authPath.includes(pathname)
  return (
    <SWRConfig 
        value={{
          fetcher,
          dedupingInterval: 10000
        }}
    >
      <AuthProvider>  
        <div className={classNames('',{'pt-12': !isAuthPage })}>
          {isAuthPage ? null :  <Navbar/>}
          <Component {...pageProps} /> 
        </div>
          
      </AuthProvider>
    </SWRConfig>
  )
}

export default App
