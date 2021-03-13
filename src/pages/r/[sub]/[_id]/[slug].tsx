import axios from 'axios'
import classNames from 'classnames'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useRouter } from 'next/dist/client/router'
import Head from 'next/head'
import Link from 'next/link'
import React, { FormEvent, useState } from 'react'
import useSWR from 'swr'
import ActionButton from '../../../../components/ActionButton'
import SideBar from '../../../../components/SideBar'
import { useAuthState } from '../../../../contexts/authContext'
import Image from 'next/image'

dayjs.extend(relativeTime)

export default function SinglePost() {
    let [ newComment, setNewComment ] = useState('')
    let router = useRouter()
    let { _id,slug, sub} = router.query
    let { data: post, error, revalidate } = useSWR(_id ? `/post/${_id}/${slug}` : null)
    let { data:comments, error: commentsError, revalidate: revalidateComments } = useSWR(post ? `/post/${_id}/${slug}/comment` : null)
    if(error) console.log(error)

    const title = post?.title
    const desc = post?.body || post?.title

    let { authenticated, user } = useAuthState()
    let votePost = async (value: number, commentId?:string) => {
        let comment
        let element
        if(commentId){
            comment = comments.find((comment ) => comment._id === commentId)
            if(value === comment.userVote){
                value = 0
            }
            element = { commentId:commentId}
        }else{
            if(value === post.userVote){
                value = 0
            }
            element = { postId:post._id }
        }
        
        if(authenticated){
          try {
            await axios.post('/misc/vote',{ ...element, value })
            if(commentId){
                revalidateComments()
            }else{
                revalidate()
            }
          } catch (error) {
            console.log(error)
          }
        }else{
            router.push('/login')
        }
      }
      let createComment = async ( e: FormEvent ) => {
        e.preventDefault()
        if(newComment.trim() === ''){
            return
        }
        try {
            await axios.post(`/post/${_id}/${slug}/comment`,{ body: newComment.trim()})
            setNewComment('')
            revalidateComments()
            revalidate()
        } catch (error) {
            console.log(error)
        }
      }
    return (
        <>
            <Head>
                <title>{post?.title}</title>
                <meta name="description" content={desc}></meta>
                <meta name="title" content={title}></meta>
            </Head>
            <div className="flex flex-col bg-gray-800" style={{height:'fit-content'} }>
                {post && 
                    <div className="container mx-auto overflow-hidden">
                        <div className="h-auto bg-black ">
                            <div className="flex items-center h-12 container-l">
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex items-cnter">
                                        <div className="flex items-center h-4 px-2 border-l border-r border-gray-700">
                                                <i className={classNames("p-1 font-bold text-gray-400 rounded cursor-pointer fas fa-arrow-up hover:text-red-500",{'text-red-500':post.userVote === 1})} onClick={e => votePost(1)}></i>
                                                    <span className="block px-2 text-sm font-bold text-gray-300">{ post.voteScore ? post.voteScore : 0 }</span>
                                                <i className={classNames("p-1 font-bold text-gray-400 rounded cursor-pointer fas fa-arrow-down hover:text-blue-700 ",{'text-blue-700':post.userVote === -1})} onClick={e => votePost(-1)}></i>
                                        </div>
                                        <div className="flex items-center h-4">
                                            <i className="px-3 text-gray-400 fas fa-book"></i>
                                            <div className="text-sm text-gray-300">{post.title}</div>
                                        </div>
                                    </div>
                                    <Link href="/">
                                            <a className="h-4 text-sm text-blue-700 hover:text-blue-900">
                                                <i className="pr-1 fas fa-times"></i>
                                                Close
                                            </a>
                                    </Link>
                                </div>
                            </div>
                            <div className="min-h-screen pt-6 bg-gray-200">
                                <div className="flex items-start container-l">
                                    <div className="w-8/12 py-3 mr-6 overflow-hidden bg-white rounded">
                                        <div className="flex w-full">
                                            <section className="flex flex-col items-center justify-center flex-shrink-0 w-12 h-8 pt-8 text-center rounded-l upvote">
                                                <i className={classNames("p-1 font-bold text-gray-400 rounded cursor-pointer fas fa-arrow-up fa-sm hover:text-red-500 hover:bg-gray-200",{'text-red-500':post.userVote === 1})} onClick={e => votePost(1)}></i>
                                                    <span className="block text-xs font-bold">{ post.voteScore ? post.voteScore : 0 }</span>
                                                <i className={classNames("p-1 font-bold text-gray-400 rounded cursor-pointer fas fa-arrow-down fa-sm hover:text-blue-700 hover:bg-gray-200",{'text-blue-700':post.userVote === -1})} onClick={e => votePost(-1)}></i>
                                            </section>
                                            <div className="w-full pb-2 pr-7">
                                                <div className="mb-1 post-info">
                                                    <small className="flex pl-1">
                                                    <Link href={`/r/${ post.sub.name }`}>
                                                        <div className="flex cursor-pointer">
                                                        <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" alt="sub" className="w-5 h-5 rounded-full"/>
                                                        <span className="mx-1 font-bold hover:underline">{`r/${ post.sub.name }`}</span>
                                                        </div>
                                                    </Link>
                                                    <span className="text-gray-400 cursor-pointer">Posted by</span>
                                                    <Link href={`/user/${post.author._id}`}>
                                                        <span className="text-gray-400 cursor-pointer hover:underline">u/{ post.author.username }  </span>
                                                    </Link>
                                                    <Link href={`/r/${ post.sub.name }/${post.url}`}>
                                                        <span className="mx-1 text-gray-400 cursor-pointer hover:underline"> { ` ${dayjs(post.createdAt).fromNow()}`}</span>
                                                    </Link>
                                                    
                                                    </small>
                                                </div>
                                                <div className="">
                                                    <p className="py-1 text-lg font-medium">{ post.title }</p>
                                                    <p className="pb-1">{ post.body }</p>
                                                    <div className="flex">
                                                        <ActionButton value={`${ post.commentsAmount } Comments`} href={`/r/${ post.sub.name }/${post.url}`} icon="text-gray-400 fas fa-comment-alt fa-xs"/>
                                                        <ActionButton value="Share" href='/share' icon="text-gray-400 fas fa-share-alt fa-xs"/>
                                                        <ActionButton value="Save" href='/save' icon="text-gray-400 fas fa-bookmark fa-xs"/>
                                                    </div>
                                                    
                                                        {
                                                            authenticated ? 
                                                            <div className="pt-5 ">
                                                                <p className="mb-1 text-xs font-medium text-gray-800">
                                                                    Comment as
                                                                    <span className="pl-1 text-xs font-medium text-yellow-400">
                                                                        { user.username }
                                                                    </span>
                                                                </p>
                                                                <form className="flex flex-col items-end" onSubmit={createComment}>
                                                                    <textarea cols={30} rows={5} className="w-full p-2 border border-gray-200 rounded outline-none" value={newComment} onChange={(e:any) => setNewComment(e.target.value)}></textarea>
                                                                    <button className="mt-2 ml-auto button blue">Comment</button>
                                                                </form>
                                                            </div> : 
                                                            <div className="flex items-center justify-between w-full p-3 pl-2 mt-4 border border-gray-200 rounded">
                                                                <p className="font-medium text-gray-500 ">Log in or sign up to leave a comment</p>
                                                                <div className="flex">
                                                                    <Link href="/login">
                                                                        <a className="button blue lg:w-28">Log In</a>
                                                                    </Link>
                                                                    <Link href="/register">
                                                                        <a className="ml-3 button blue hollow lg:w-28">Register</a>
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        }
                                                    
                                                    <p className="pb-2 mt-4 text-xs font-semibold text-gray-400 uppercase border-b border-gray-200">Comments section</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col mt-6 bg-white">
                                            { comments && comments.length !== 0 ? comments.map(( comment: any ) => {
                                                return (
                                                    <div className="flex mb-5 ">
                                                        <div className="flex flex-col items-center flex-shrink-0 ml-2 mr-2 overflow-hidden">
                                                            <Image src="https://cdn.pixabay.com/photo/2016/06/16/04/20/reddit-1460603__340.png" width="40" height="40" className="rounded"></Image>
                                                            <div className="w-0 my-2 border-l border-gray-200" style={{height:`calc(100% - 56px)`}}></div>
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center">
                                                                <Link href="/">
                                                                    <p className="pr-1 text-sm text-gray-600 cursor-pointer hover:underline">{ comment.username }</p>
                                                                </Link>
                                                                <p className="text-xs font-light text-gray-400">{dayjs(comment.createdAt).fromNow()}</p>
                                                            </div>
                                                            <p className="text-gray-800">{ comment.body }</p>
                                                            <div className="flex mt-1">
                                                                <div className="flex items-center mr-1">
                                                                    <i className={classNames("p-1 font-bold text-gray-400 rounded cursor-pointer fas fa-arrow-up fa-sm hover:text-red-500 hover:bg-gray-200",{'text-red-500':comment.userVote === 1})} onClick={e => votePost(1,comment._id)}></i>
                                                                        <span className="block text-xs font-bold">{ comment.voteScore ? comment.voteScore : 0 }</span>
                                                                    <i className={classNames("p-1 font-bold text-gray-400 rounded cursor-pointer fas fa-arrow-down fa-sm hover:text-blue-700 hover:bg-gray-200",{'text-blue-700':comment.userVote === -1})} onClick={e => votePost(-1,comment._id)}></i>
                                                                </div>
                                                                <ActionButton value="Reply" href={`/r/${ post.sub.name }/${post.url}`} icon="text-gray-400 fas fa-comment-alt fa-xs"/>
                                                                <ActionButton value="Share" href='/share' icon="text-gray-400 fas fa-share-alt fa-xs"/>
                                                        </div>
                                                    </div> 
                                                 </div>
                                                )
                                            }) : null}
                                            
                                            
                                        </div>
                                    </div> 
                                        <SideBar description={post.sub.description} createdAt={post.sub.createAt} marginTop="0" imageUrl={ post.sub.imageUrl } name={ post.sub.name }/>
                                    </div>
                                </div>
                            </div>  
                    </div> 
                }
            </div>
        </>
    )
}
