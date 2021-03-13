import Head from 'next/head'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import PostCard from '../components/PostCard'
import useSWR, { useSWRInfinite } from 'swr'
import classNames from 'classnames'
import { useAuthState } from '../contexts/authContext'
import { Post, Sub } from '../interfaces'

export default function Home() {
  // function that return Url based on page we currently are needed for infinite scrolling
  const getKey = (pageIndex, previousPageData) => {
    if (previousPageData && !previousPageData.length) return null
    return `/post?page=${pageIndex}`                   
  } 
  // Posts data 
  const { data, size: page, setSize: setPage, mutate } = useSWRInfinite<Post[][]>(getKey)
  let posts: Post[] = data ? [].concat(...data) : null
  console.log(posts)
  //Top sub data
  let { data:topSubs} = useSWR<Sub[]>('/misc/top')
  
  //Context state variables
  let { authenticated } = useAuthState()
  let [oldAuthenticated, setOldAuthenticated ] = useState<boolean>(authenticated)
  //Id of the last post in array
  let [ observedPost, setObservedPost ] = useState(posts && posts[posts.length - 1]?._id)


  //after we log in revalidate data
  useEffect(() => {
    if(authenticated){
      mutate()
      setOldAuthenticated(!authenticated)
    }
    
  },[authenticated])
  useEffect(() => {
    posts = data ? [].concat(...data) : null
  },[data])

  // set last post in body to be observed
  useEffect(() => {
    if(!posts || posts.length === 0) return 
    let id = posts[posts.length - 1]._id
    if(id !== observedPost || oldAuthenticated !== authenticated){
      setOldAuthenticated(authenticated)
      setObservedPost(id)
      observeElement(document.getElementById(id))
    }
  },[ posts ])
  useEffect(() => {
    console.log('component is mounted in page')
  },[])

  // function that observe post
  const observeElement = ( element: HTMLElement ) => {
    if(!element) return
    let observer = new IntersectionObserver((entries, observer) => {
      
      if(entries[0].isIntersecting){
        setPage(page + 1)
        observer.unobserve(element)
      }
    },{ threshold: 1})
    observer.observe(element)
  }
  return (
    <div>
      <Head>
        <title>Reddit: the front page of the internet</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <div className="flex container-l">
          <div className="w-full ml-4 mr-6 lg:w-8/12">
            <p className="mt-3 text-sm ">Newest Posts !</p>
            <div className="posts">
              { posts && posts.length !== 0 ? posts?.map(post => {
                return ( <PostCard post={ post } key={post._id}/>)
              }) : null}
            </div>
          </div>
          <div className="flex-col hidden pt-8 ml-auto mr-5 lg:flex">
            <div className="overflow-hidden bg-white border border-gray-300 rounded w-80">
              <div className="p-3 bg-blue-900">
                <p className="pt-5 font-semibold text-white">
                  Top Communities Of The Year
                </p>
              </div>
              <div className="flex flex-col px-3 bg-white">
                {topSubs?.map((sub:any,index:number,array:any) => {
                  return (
                  <Link href={`/r/${sub.name}`} key={sub._id}>
                    <div className={classNames("flex items-center py-3 pl-6 cursor-pointer",{'border-b border-gray-300':index+1 !== array.length})}>
                      <span className="pr-2 ">{index + 1}</span>
                      <i className="pr-2 text-green-400 fas fa-caret-up fa-md"></i>
                      <img
                        src={sub.imageUrl}
                        alt="image"
                        className="w-12 h-12 rounded-full"
                      />
                      <p className="pl-2 font-semibold">r/{ sub.name}</p>
                    </div>
                  </Link>
                )})}
                <Link href="/subs/create">
                  <a className="w-auto mx-3 my-2 button blue">Create Community</a>
                </Link>
                
                <div className="flex justify-between p-3 pb-4">
                  <a className="p-1 text-sm font-semibold text-blue-900 bg-gray-200 border border-gray-200 rounded-full cursor-pointer hover:bg-blue-200">Sport</a>
                  <a className="p-1 text-sm font-semibold text-blue-900 bg-gray-200 border border-gray-200 rounded-full cursor-pointer hover:bg-blue-200">New Year</a>
                  <a className="p-1 text-sm font-semibold text-blue-900 bg-gray-200 border border-gray-200 rounded-full cursor-pointer hover:bg-blue-200">Friends</a>
                  <a className="p-1 text-sm font-semibold text-blue-900 bg-gray-200 border border-gray-200 rounded-full cursor-pointer hover:bg-blue-200">Work</a>
                </div>
              </div>
            </div>
          </div>
      </div>
      
    </div>
  )
}
