import { useRouter } from 'next/dist/client/router'
import React, { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react'
import useSWR, { useSWRInfinite } from 'swr'
import PostCard from '../../components/PostCard'
import Image from 'next/image'
import classNames from 'classnames'
import { useAuthState } from '../../contexts/authContext'
import axios from 'axios'
import SideBar from '../../components/SideBar'
import { Post } from '../../interfaces'

export default function Sub() {
    const router = useRouter()
    //name of a sub 
    const name = router.query.sub

    // function that return Url based on page we currently are needed for infinite scrolling
    const getKey = (pageIndex, previousPageData) => {
      if (previousPageData && !previousPageData.length) return null
      return `/sub/${name}/posts?page=${pageIndex}`                   
    } 

    //fetch sub and posts from server
    const { data: sub, revalidate: revalidateSub } = useSWR(`/sub/${name}`)
    const { data, size: page, setSize: setPage, revalidate } = useSWRInfinite<Post[][]>(getKey)
    let posts: Post[] = data ? [].concat(...data) : null
    // Context state variables
    const { user, authenticated } = useAuthState()

    // state that show if user own current sub
    const [userOwn, setUserOwn] = useState(authenticated && sub?.author.username === user?.username)
    const inputRef = useRef(null)
    let PostMarkUp;
    if(!posts){
      PostMarkUp = <div>
        <h1 className="text-lg">Loading...</h1>
      </div>
    }else if(posts.length === 0){
      PostMarkUp = <div>
        <h1 className="text-lg">Sub is currently empty</h1>
      </div>
    }else{
      PostMarkUp = <div className="posts">
          { posts?.map(post => {
            return ( <PostCard post={ post } key={post?._id} subPage/>)
          })}
        </div>
    }


    useEffect(() => {
      setUserOwn(authenticated && sub?.author.username === user?.username)
    }, [sub])

    useEffect(() => {
      revalidate()
    },[authenticated])
    
    const openInput = (type) => {
      if(!userOwn) return 
      inputRef.current.name = type
      inputRef.current.click()
    }
    const uploadImage = async (e:ChangeEvent<HTMLInputElement>) => {
      const file = (event.target as HTMLInputElement).files[0]
      const formData = new FormData()
      formData.append('file',file)
      formData.append('type',inputRef.current.name)
      try {
        await axios.post(`/sub/${sub?.name}/image`,formData,{
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        revalidateSub()
      } catch (error) {
        console.log(error)
      }
    }
  //Id of the last post in array
  let [ observedPost, setObservedPost ] = useState(posts && posts[posts.length - 1]?._id)
    useEffect(() => {
      if(!posts || posts.length === 0) return 
      let id = posts[posts.length - 1]?._id
      console.log(id)
      if(id !== observedPost){
        setObservedPost(id)
        observeElement(document.getElementById(id))
      }
    },[ posts ])
  
    // function that observe post
    const observeElement = ( element: HTMLElement ) => {
      if(!element) return
      console.log(element)
      let observer = new IntersectionObserver((entries, observer) => {
        
        if(entries[0].isIntersecting){
          setPage(page + 1)
          observer.unobserve(element)
        }
      },{ threshold: 1})
      observer.observe(element)
    }
    return (
      <>
        <div className="flex flex-col">
          <input type="file" ref={inputRef} className="hidden" onChange={uploadImage}/>
          {
            sub?.bannerUrl ? 
            <div className={classNames("h-40 bg-blue-500",{ 'cursor-pointer':userOwn })} style={{ backgroundImage:`url(${sub?.bannerUrl})`, backgroundSize:'cover', backgroundPosition:'center center'}} onClick={(e) => openInput('banner')}>
            
            </div> :
            <div className={classNames("h-20 bg-blue-500",{ 'cursor-pointer':userOwn })} onClick={(e) => openInput('banner')}>
            
            </div>
          }
          
          <div className="h-24 bg-white">
            <div className="relative flex container-l">
              <div className={classNames("absolute",{'cursor-pointer':userOwn})} style={ {top: '-15px'} } onClick={(e) => openInput('image')}>
                <img
                  src={sub?.imageUrl || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}
                  alt="image"
                  className="w-20 h-20 rounded-full"
                />
              </div>
              <div className="flex flex-col pt-2 pl-24">
                <div className="flex items-start align-center">
                  <h1 className="pr-5 text-3xl font-bold capitalize">
                    { sub?.name } 
                  </h1>
                  <a className="button blue">Join</a>
                </div>
                <div className="pt-1 text-sm font-medium text-gray-500">
                  r/{sub?.name}
                </div>
              </div>
            </div>
            
          </div>
        </div>
        <div className="flex pt-4 container-l">
          <div className="w-full ml-4 mr-6 lg:w-8/12">
              <p className="mt-3 text-sm ">Newest Posts of {name} sub</p>
              { PostMarkUp }
          </div>
          <div className="">
            <SideBar createdAt={sub?.createAt} description={sub?.description} marginTop="8" imageUrl={sub?.imageUrl} name={sub?.name}></SideBar>
          </div>
          
        </div>
    </>
    )
}
