import axios from "axios";
import { useRouter } from "next/dist/client/router";
import { useEffect, useState } from "react";
import useSWR from "swr";
import PostCard from "../../../components/PostCard";
import SideBar from "../../../components/SideBar";
import { useAuthState } from "../../../contexts/authContext";

export default function Submit() {
    let router = useRouter()
    let { sub:subName } = router.query
    let { data: sub } = useSWR(subName ? `/sub/${ subName }` : null)
    let [ newPost, setNewPost ] = useState()
    let [ title, setTitle ] = useState('')
    let [ body, setBody ] = useState('')
    let { authenticated } = useAuthState()
    let createPost = async (e) => {
        e.preventDefault()
        try {
            let res = await axios.post('/post',{ body, title, subId:sub._id})
            console.log(res)
            setNewPost(res.data)
            setTitle('')
            setBody('')
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        if(!authenticated){
            router.push('/login')
        }
    },[])
    return (
        <div className="flex items-start pt-10 mx-auto container-l">
            {sub && 
            <>
                <div className="w-8/12 mr-5">
                    <p className="pb-3 text-lg font-medium text-gray-800 border-b border-gray-100 ">Create a post</p>
                    <div className="p-3 mt-4 bg-white border border-gray-200 rounded">
                        {newPost && 
                            <div>
                                <div className="w-8/12 mb-6">
                                    <PostCard post={newPost}/>
                                </div>
                                {/* <hr className="my-5 border-t-2"/> */}
                            </div>
                        }
                        <form onSubmit={createPost}>
                            <div className="relative mt-2">
                                <input type="text" maxLength={300} className="w-full px-2 py-1 border-2 border-gray-300 rounded outline-none" placeholder="Title" value={ title} onChange={e => setTitle(e.target.value)}/>
                                <label className="absolute text-sm text-gray-400" style={{top:8, right:10}}>{ title.trim().length }/300</label>
                            </div>
                            <textarea cols={20} rows={5} className="w-full px-2 py-1 mt-3 border-2 border-gray-300 rounded outline-none" placeholder="Body" value={body}onChange={e => setBody(e.target.value   )}></textarea>
                            <button className="block mt-1 ml-auto button blue" disabled={title.trim() === ''}>Create Post</button>
                        </form>
                    </div>
                </div>
                <SideBar createdAt={sub?.createdAt} description={sub.description} name={sub.name} imageUrl={sub.imageUrl} marginTop='mt-1'/>
            </>
            }
            
        </div>
    )
}
