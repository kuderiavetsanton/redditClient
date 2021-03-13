import Link from "next/link";
import { Post } from "../interfaces";

import dayjs from 'dayjs'

import relativeTime from 'dayjs/plugin/relativeTime'
import axios from "axios";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { useAuthState } from "../contexts/authContext";
import { useRouter } from "next/dist/client/router";
import ActionButton from "./ActionButton";

interface PostCardProps{
    post:Post,
    subPage?:boolean
}

dayjs.extend(relativeTime)

export default function PostCard({ post: postS, subPage } : PostCardProps) {
  const { authenticated } = useAuthState()
  const [post, setPost] = useState(postS)

  useEffect(() => {
    setPost(postS)
  }, [postS])

  const router = useRouter()
  let votePost = async (value: number) => {
    if(value === post.userVote){
      value = 0
    }
    if(authenticated){
      try {
        let res = await axios.post('/misc/vote',{ postId:post._id, value })
        setPost(res.data)
      } catch (error) {
        console.log(error)
      }
    }else{
      router.push('/login')
    }
    
  }
    return (
        <div className="flex mb-3 bg-white border border-gray-300 rounded" id={post._id}>
        <section className="flex flex-col items-center justify-center w-1/12 p-4 pt-1 text-center bg-gray-100 rounded-l upvote ">
          <i className={classNames("p-1 font-bold text-gray-400 rounded cursor-pointer fas fa-arrow-up fa-sm hover:text-red-500 hover:bg-gray-200",{'text-red-500':post.userVote === 1})} onClick={e => votePost(1)}></i>
            <span className="block text-xs font-bold">{ post.voteScore ? post.voteScore : 0 }</span>
          <i className={classNames("p-1 font-bold text-gray-400 rounded cursor-pointer fas fa-arrow-down fa-sm hover:text-blue-700 hover:bg-gray-200",{'text-blue-700':post.userVote === -1})} onClick={e => votePost(-1)}></i>
        </section>
        <section className="flex flex-col px-2 py-1 post-data ">
          <div className="mb-1 post-info">
            <small className="flex pl-1">
              { !subPage &&
                <Link href={`/r/${ post.sub.name }`}>
                  <div className="flex cursor-pointer">
                    <img src={post.sub.imageUrl || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"} alt="sub" className="w-5 h-5 rounded-full"/>
                    <span className="mx-1 font-bold hover:underline">{`r/${ post.sub.name }`}</span>
                  </div>
                </Link>
              }
              
              <span className="mr-1 text-gray-400 cursor-pointer">Posted by</span>
              <Link href={`/u/${post.author.username}`}>
                <span className="text-gray-400 cursor-pointer hover:underline">u/{ post.author.username }  </span>
              </Link>
              <Link href={`/r/${ post.sub.name }/${post.url}`}>
                <span className="mx-1 text-gray-400 cursor-pointer hover:underline"> { ` ${dayjs(post.createdAt).fromNow()}`}</span>
              </Link>
              
            </small>
          </div>
          <div className="pl-1 mb-2 post-main">
              <Link href={`/r/${ post.sub.name }/${post.url}`}>
                <p className="text-lg font-medium cursor-pointer">{post.title}</p>
              </Link>
              <p className="text-sm font-normal text-gray-500 font-noto">{post.body}</p>
          </div>
          <div className="flex post-other">
            <ActionButton value={`${ post.commentsAmount } Comments`} href={`/r/${ post.sub.name }/${post.url}`} icon="text-gray-400 fas fa-comment-alt fa-xs"/>
            <ActionButton value="Share" href='/share' icon="text-gray-400 fas fa-share-alt fa-xs"/>
            <ActionButton value="Save" href='/save' icon="text-gray-400 fas fa-bookmark fa-xs"/>
            <div className="flex items-center p-1 px-2 ml-1 rounded cursor-pointer w-max hover:bg-gray-200">
              <i className="text-gray-400 fas fa-ellipsis-h fa-xs"></i>
            </div>
          </div>
        </section>
      </div>
    )
}
